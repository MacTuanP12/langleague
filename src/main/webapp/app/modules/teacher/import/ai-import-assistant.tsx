import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import {
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Spinner,
  Alert,
  Card,
  CardBody,
  Row,
  Col,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot,
  faMagic,
  faTrash,
  faPlus,
  faSave,
  faTimes,
  faFileUpload,
  faPaste,
  faKey,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { extractTextFromFile, getAcceptAttributeWithImages, extractTextFromImage, isImageFile } from 'app/shared/util/file-text-extractor';
import { ExerciseType } from 'app/shared/model/enumerations/exercise-type.model';
import type { IExercise } from 'app/shared/model';
import { toast } from 'react-toastify';
import classnames from 'classnames';
import { useAppDispatch } from 'app/config/store';
import { bulkCreateExercises } from 'app/shared/reducers/exercise.reducer';
import { bulkCreateVocabularies } from 'app/shared/reducers/vocabulary.reducer';
import { bulkCreateGrammars } from 'app/shared/reducers/grammar.reducer';
import { USER_GEMINI_KEY_STORAGE } from 'app/shared/util/ai-utils';
import './ai-import-assistant.scss';

interface AIImportAssistantProps {
  unitId: string;
  onSuccess?: () => void;
  initialContentType?: ContentType;
  isOpen?: boolean;
  onToggle?: () => void;
  showFloatingButton?: boolean;
}

interface ExerciseOption {
  optionText: string;
  isCorrect: boolean;
}

interface Exercise {
  exerciseText: string;
  options: ExerciseOption[];
}

interface Vocabulary {
  word: string;
  definition: string;
  example: string;
}

interface Grammar {
  title: string;
  description: string;
  example: string;
}

// DTO Interfaces for Backend Mapping
interface IVocabularyDTO {
  word: string;
  meaning: string;
  example: string;
  orderIndex: number;
  unit: { id: number };
}

interface IGrammarDTO {
  title: string;
  contentMarkdown: string;
  exampleUsage: string;
  orderIndex: number;
  unit: { id: number };
}

interface IExerciseDTO {
  exerciseText: string;
  exerciseType: string;
  orderIndex: number;
  unit: { id: number };
  options: {
    optionText: string;
    isCorrect: boolean;
    orderIndex: number;
  }[];
}

type ContentType = 'EXERCISE' | 'VOCABULARY' | 'GRAMMAR';

const AIImportAssistant: React.FC<AIImportAssistantProps> = ({
  unitId,
  onSuccess,
  initialContentType = 'EXERCISE',
  isOpen: externalIsOpen,
  onToggle: externalOnToggle,
  showFloatingButton = true,
}) => {
  const dispatch = useAppDispatch();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  // BYOK State Management
  const [userApiKey, setUserApiKey] = useState('');
  const [isKeyVerified, setIsKeyVerified] = useState(false);
  const [rememberKey, setRememberKey] = useState(false);
  const [keyInputValue, setKeyInputValue] = useState('');

  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [contentType, setContentType] = useState<ContentType>(initialContentType);
  const [inputText, setInputText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [languageSettings, setLanguageSettings] = useState({
    target: 'English',
    native: 'Vietnamese',
  });

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [grammars, setGrammars] = useState<Grammar[]>([]);

  const [step, setStep] = useState(1); // 1: Input, 2: Processing, 3: Review
  const [isSaving, setIsSaving] = useState(false);

  // Check for existing API key on component mount
  useEffect(() => {
    const localKey = localStorage.getItem(USER_GEMINI_KEY_STORAGE);
    const sessionKey = sessionStorage.getItem(USER_GEMINI_KEY_STORAGE);

    if (localKey) {
      setUserApiKey(localKey);
      setIsKeyVerified(true);
      setRememberKey(true);
    } else if (sessionKey) {
      setUserApiKey(sessionKey);
      setIsKeyVerified(true);
      setRememberKey(false);
    }
  }, []);

  // Update contentType when initialContentType changes
  useEffect(() => {
    if (isOpen && initialContentType) {
      setContentType(initialContentType);
    }
  }, [isOpen, initialContentType]);

  const toggle = () => {
    if (externalOnToggle) {
      externalOnToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  // Handle API Key Verification
  const handleStartSession = () => {
    const trimmedKey = keyInputValue.trim();
    if (!trimmedKey) {
      toast.error('Please enter your API key.');
      return;
    }

    // Save to appropriate storage
    if (rememberKey) {
      localStorage.setItem(USER_GEMINI_KEY_STORAGE, trimmedKey);
      sessionStorage.removeItem(USER_GEMINI_KEY_STORAGE);
    } else {
      sessionStorage.setItem(USER_GEMINI_KEY_STORAGE, trimmedKey);
      localStorage.removeItem(USER_GEMINI_KEY_STORAGE);
    }

    setUserApiKey(trimmedKey);
    setIsKeyVerified(true);
    setKeyInputValue('');
    toast.success('API key configured successfully!');
  };

  // Handle Logout / Remove Key
  const handleRemoveKey = () => {
    localStorage.removeItem(USER_GEMINI_KEY_STORAGE);
    sessionStorage.removeItem(USER_GEMINI_KEY_STORAGE);
    setUserApiKey('');
    setIsKeyVerified(false);
    setRememberKey(false);
    setKeyInputValue('');
    setStep(1);
    toast.info('API key removed. You will need to configure it again.');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      setIsExtracting(true);
      try {
        let text = '';

        // Check if file is an image and use OCR
        if (isImageFile(selectedFile.name)) {
          toast.info('Processing image with OCR... This may take a moment.');
          text = await extractTextFromImage(selectedFile, languageSettings.target === 'English' ? 'eng' : 'eng+vie');
          toast.success('Image text extracted successfully using OCR!');
        } else {
          // Use regular text extraction for documents
          text = await extractTextFromFile(selectedFile);
          toast.success('File text extracted successfully!');
        }

        setInputText(text);
      } catch (error) {
        toast.error(`Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error(error);
      } finally {
        setIsExtracting(false);
      }
    }
  };

  const getSystemPrompt = (type: ContentType, rawText: string, targetLang: string, nativeLang: string): string => {
    if (type === 'VOCABULARY') {
      return `
        Role: You are a dictionary editor. Extract vocabulary from the text.
        Rules:
        - 'word': MUST be in **${targetLang}**.
        - 'definition': MUST be in **${nativeLang}** (translate if necessary).
        - 'example': A sentence in **${targetLang}**.
        Output: Valid JSON Array ONLY.
        Format:
        [
          {
            "word": "...",
            "definition": "...",
            "example": "..."
          }
        ]
        TEXT TO ANALYZE:
        ${rawText}
      `;
    } else if (type === 'GRAMMAR') {
      return `
        Role: You are a grammar teacher. Extract grammar points.
        Rules:
        - 'title': The name of the structure (can be in **${targetLang}** or **${nativeLang}**).
        - 'description': Explanation of usage, MUST be in **${nativeLang}** for student understanding.
        - 'example': Example sentences in **${targetLang}**.
        Output: Valid JSON Array ONLY.
        Format:
        [
          {
            "title": "...",
            "description": "...",
            "example": "..."
          }
        ]
        TEXT TO ANALYZE:
        ${rawText}
      `;
    } else {
      // EXERCISE
      return `
        Role: Quiz creator.
        Rules:
        - 'exerciseText': The question (usually in **${targetLang}**).
        - 'options': Answer choices.
        Output: Valid JSON Array ONLY.
        Format:
        [
          {
            "exerciseText": "Question content",
            "options": [
              { "optionText": "Option A", "isCorrect": false },
              { "optionText": "Option B", "isCorrect": true }
            ]
          }
        ]
        TEXT TO ANALYZE:
        ${rawText}
      `;
    }
  };

  const cleanAiResponse = (raw: string): string => {
    return raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
  };

  const analyzeTextWithAI = async (targetLang: string, nativeLang: string) => {
    if (!inputText.trim()) {
      toast.error('Please provide some text to analyze.');
      return;
    }
    const apiKey = userApiKey.trim();
    if (!apiKey) {
      toast.error('Please enter your AI API Key.');
      return;
    }

    setIsProcessing(true);
    setStep(2);

    const prompt = getSystemPrompt(contentType, inputText, targetLang, nativeLang);

    try {
      let responseText = '';

      if (selectedModel.includes('gemini')) {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }],
                },
              ],
            }),
          },
        );

        // Handle API key errors
        if (response.status === 400 || response.status === 401 || response.status === 403) {
          const errorData = await response.json().catch(() => ({ error: { message: 'Invalid API key' } }));
          const errorMessage = errorData.error?.message || 'Please check your Gemini API key and try again.';

          if (errorMessage.includes('leaked')) {
            toast.error('Your API key was reported as leaked by Google. Please generate a NEW key.');
          } else {
            toast.error(`Invalid API Key: ${errorMessage}`);
          }

          // Clear the invalid key
          localStorage.removeItem(USER_GEMINI_KEY_STORAGE);
          sessionStorage.removeItem(USER_GEMINI_KEY_STORAGE);
          setUserApiKey('');
          setIsKeyVerified(false);
          setStep(1);
          setIsProcessing(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`AI API Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (
          data.candidates &&
          data.candidates.length > 0 &&
          data.candidates[0].content &&
          data.candidates[0].content.parts &&
          data.candidates[0].content.parts.length > 0
        ) {
          responseText = data.candidates[0].content.parts[0].text;
        } else {
          throw new Error('Invalid response format from Gemini API');
        }
      } else {
        // OpenAI (GPT-4o-mini or similar)
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              { role: 'system', content: 'You are a helpful assistant that extracts educational content from text.' },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
          }),
        });

        // Handle API key errors for OpenAI
        if (response.status === 401 || response.status === 403) {
          toast.error('Invalid OpenAI API Key. Please check your key and try again.');
          localStorage.removeItem(USER_GEMINI_KEY_STORAGE);
          sessionStorage.removeItem(USER_GEMINI_KEY_STORAGE);
          setUserApiKey('');
          setIsKeyVerified(false);
          setStep(1);
          setIsProcessing(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`AI API Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
          responseText = data.choices[0].message.content;
        } else {
          throw new Error('Invalid response format from OpenAI API');
        }
      }

      const jsonString = cleanAiResponse(responseText);

      try {
        const parsedData = JSON.parse(jsonString);

        if (Array.isArray(parsedData)) {
          if (contentType === 'EXERCISE') {
            setExercises(parsedData);
          } else if (contentType === 'VOCABULARY') {
            setVocabularies(parsedData);
          } else if (contentType === 'GRAMMAR') {
            setGrammars(parsedData);
          }
          setStep(3);
        } else {
          throw new Error('AI did not return a valid JSON array.');
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        // Log for debugging during development
        if (process.env.NODE_ENV === 'development') {
          console.warn('Raw AI Response:', responseText);
        }
        toast.error('AI response format error. Please try again.');
        setStep(1);
      }
    } catch (error) {
      console.error('AI Analysis Error:', error);
      toast.error(`AI Analysis Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStep(1); // Go back to input
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Exercise Handlers ---
  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | ExerciseOption[]) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value } as Exercise;
    setExercises(updatedExercises);
  };

  const handleOptionChange = (exerciseIndex: number, optionIndex: number, field: keyof ExerciseOption, value: string | boolean) => {
    const updatedExercises = [...exercises];
    const updatedOptions = [...updatedExercises[exerciseIndex].options];
    updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], [field]: value } as ExerciseOption;

    if (field === 'isCorrect' && value === true) {
      updatedOptions.forEach((opt, idx) => {
        if (idx !== optionIndex) opt.isCorrect = false;
      });
    }

    updatedExercises[exerciseIndex].options = updatedOptions;
    setExercises(updatedExercises);
  };

  const addOption = (exerciseIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].options.push({ optionText: 'New Option', isCorrect: false });
    setExercises(updatedExercises);
  };

  const removeOption = (exerciseIndex: number, optionIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].options.splice(optionIndex, 1);
    setExercises(updatedExercises);
  };

  const removeExercise = (index: number) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(index, 1);
    setExercises(updatedExercises);
  };

  // --- Vocabulary Handlers ---
  const handleVocabularyChange = (index: number, field: keyof Vocabulary, value: string) => {
    const updatedVocabularies = [...vocabularies];
    updatedVocabularies[index] = { ...updatedVocabularies[index], [field]: value };
    setVocabularies(updatedVocabularies);
  };

  const removeVocabulary = (index: number) => {
    const updatedVocabularies = [...vocabularies];
    updatedVocabularies.splice(index, 1);
    setVocabularies(updatedVocabularies);
  };

  // --- Grammar Handlers ---
  const handleGrammarChange = (index: number, field: keyof Grammar, value: string) => {
    const updatedGrammars = [...grammars];
    updatedGrammars[index] = { ...updatedGrammars[index], [field]: value } as Grammar;
    setGrammars(updatedGrammars);
  };

  const removeGrammar = (index: number) => {
    const updatedGrammars = [...grammars];
    updatedGrammars.splice(index, 1);
    setGrammars(updatedGrammars);
  };

  const saveToUnit = async () => {
    setIsSaving(true);
    try {
      if (contentType === 'EXERCISE') {
        if (exercises.length === 0) {
          toast.warning('No exercises to save.');
          setIsSaving(false);
          return;
        }
        const payload: IExerciseDTO[] = exercises.map((ex, index) => ({
          exerciseText: ex.exerciseText,
          exerciseType: ExerciseType.MULTI_CHOICE,
          orderIndex: index,
          unit: { id: Number(unitId) },
          options: ex.options.map((opt, optIndex) => ({
            optionText: opt.optionText,
            isCorrect: opt.isCorrect,
            orderIndex: optIndex,
          })),
        }));
        await dispatch(bulkCreateExercises({ unitId, exercises: payload as unknown as IExercise[] })).unwrap();
        toast.success('Exercises saved successfully!');
      } else if (contentType === 'VOCABULARY') {
        if (vocabularies.length === 0) {
          toast.warning('No vocabularies to save.');
          setIsSaving(false);
          return;
        }
        const payload: IVocabularyDTO[] = vocabularies.map((vocab, index) => ({
          word: vocab.word,
          meaning: vocab.definition,
          example: vocab.example,
          orderIndex: index,
          unit: { id: Number(unitId) },
        }));
        await dispatch(bulkCreateVocabularies(payload)).unwrap();
        toast.success('Vocabularies saved successfully!');
      } else if (contentType === 'GRAMMAR') {
        if (grammars.length === 0) {
          toast.warning('No grammar topics to save.');
          setIsSaving(false);
          return;
        }
        const payload: IGrammarDTO[] = grammars.map((grammar, index) => ({
          title: grammar.title,
          contentMarkdown: grammar.description,
          exampleUsage: grammar.example,
          orderIndex: index,
          unit: { id: Number(unitId) },
        }));
        await dispatch(bulkCreateGrammars(payload)).unwrap();
        toast.success('Grammar topics saved successfully!');
      }

      if (onSuccess) onSuccess();
      toggle();
      // Reset state
      setStep(1);
      setExercises([]);
      setVocabularies([]);
      setGrammars([]);
      setInputText('');
    } catch (error) {
      console.error('Save Error:', error);
      toast.error('Failed to save content to backend.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {showFloatingButton && (
        <div className="ai-floating-btn" onClick={toggle}>
          <FontAwesomeIcon icon={faRobot} size="lg" />
        </div>
      )}

      {/* Draggable Modal */}
      {isOpen && (
        <Draggable handle=".modal-header">
          <div
            className="modal-dialog modal-lg shadow-lg ai-assistant-modal"
            style={{
              position: 'fixed',
              top: '10%',
              left: '50%',
              transform: 'translate(-50%, 0)',
              zIndex: 1050,
              margin: 0,
            }}
          >
            <div className="modal-content">
              <ModalHeader toggle={toggle} className="cursor-move d-flex justify-content-between align-items-center">
                <div>
                  <FontAwesomeIcon icon={faMagic} className="me-2 text-primary" />
                  AI Import Assistant
                </div>
                {isKeyVerified && (
                  <Button size="sm" color="danger" outline onClick={handleRemoveKey} className="ms-auto me-2">
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                    Remove Key
                  </Button>
                )}
              </ModalHeader>
              <ModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {/* BYOK Key Input Section */}
                {!isKeyVerified && (
                  <Card className="border-primary">
                    <CardBody>
                      <h5 className="mb-3">
                        <FontAwesomeIcon icon={faKey} className="me-2 text-primary" />
                        Configure AI Assistant
                      </h5>
                      <Alert color="info">
                        <strong>Bring Your Own Key (BYOK)</strong>
                        <p className="mb-2">
                          To use AI features, you need your own API Key (Google Gemini or OpenAI). Both are free to get.
                        </p>
                        <div className="d-flex flex-column gap-2">
                          <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-between"
                          >
                            <span>
                              <i className="bi bi-google me-2"></i>
                              Get Google Gemini API Key
                            </span>
                            <i className="bi bi-box-arrow-up-right"></i>
                          </a>
                          <a
                            href="https://platform.openai.com/api-keys"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-success d-flex align-items-center justify-content-between"
                          >
                            <span>
                              <i className="bi bi-chat-dots me-2"></i>
                              Get OpenAI / ChatGPT API Key
                            </span>
                            <i className="bi bi-box-arrow-up-right"></i>
                          </a>
                        </div>
                      </Alert>

                      <FormGroup>
                        <Label for="geminiKey">Your API Key (Gemini or OpenAI)</Label>
                        <Input
                          type="password"
                          id="geminiKey"
                          value={keyInputValue}
                          onChange={e => setKeyInputValue(e.target.value)}
                          placeholder="AIza... (Gemini) or sk-... (OpenAI)"
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              handleStartSession();
                            }
                          }}
                        />
                        <div className="form-text">
                          <i className="bi bi-info-circle me-1"></i>
                          Supported: Google Gemini (AIza...) or OpenAI (sk-...)
                        </div>
                      </FormGroup>

                      <FormGroup check className="mb-3">
                        <Label check>
                          <Input type="checkbox" checked={rememberKey} onChange={e => setRememberKey(e.target.checked)} /> Remember on this
                          device
                          <div className="form-text text-danger small">⚠️ Don&apos;t check this on public computers</div>
                        </Label>
                      </FormGroup>

                      <Button color="primary" block onClick={handleStartSession} disabled={!keyInputValue.trim()}>
                        <FontAwesomeIcon icon={faKey} className="me-2" />
                        Start Session
                      </Button>
                    </CardBody>
                  </Card>
                )}

                {/* Main Content - Only show if key is verified */}
                {isKeyVerified && (
                  <>
                    {step === 1 && (
                      <>
                        <Row className="mb-3">
                          <Col md={4}>
                            <FormGroup>
                              <Label for="contentType">Content Type</Label>
                              <Input
                                type="select"
                                id="contentType"
                                value={contentType}
                                onChange={e => setContentType(e.target.value as ContentType)}
                              >
                                <option value="EXERCISE">Exercises (Multiple Choice)</option>
                                <option value="VOCABULARY">Vocabulary</option>
                                <option value="GRAMMAR">Grammar</option>
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="targetLang">Target Language</Label>
                              <Input
                                type="select"
                                id="targetLang"
                                value={languageSettings.target}
                                onChange={e => setLanguageSettings({ ...languageSettings, target: e.target.value })}
                              >
                                <option value="English">English</option>
                                <option value="Japanese">Japanese</option>
                                <option value="Korean">Korean</option>
                                <option value="Chinese">Chinese</option>
                                <option value="French">French</option>
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="nativeLang">Native Language</Label>
                              <Input
                                type="select"
                                id="nativeLang"
                                value={languageSettings.native}
                                onChange={e => setLanguageSettings({ ...languageSettings, native: e.target.value })}
                              >
                                <option value="Vietnamese">Vietnamese</option>
                                <option value="English">English</option>
                              </Input>
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row className="mb-3">
                          <Col md={12}>
                            <FormGroup>
                              <Label for="aiModel">AI Model</Label>
                              <Input type="select" id="aiModel" value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
                                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recommended - Fast & Free)</option>
                                <option value="gemini-1.5-pro">Gemini 1.5 Pro (More Accurate)</option>
                                <option value="gpt-4o-mini">GPT-4o-mini (Requires OpenAI Key)</option>
                              </Input>
                              <div className="form-text">
                                {selectedModel.includes('gemini') ? (
                                  <span className="text-success">✓ Using your Gemini API Key</span>
                                ) : (
                                  <span className="text-warning">⚠️ This requires an OpenAI API Key (different from Gemini)</span>
                                )}
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>

                        <Nav tabs className="mb-3">
                          <NavItem>
                            <NavLink
                              className={classnames({ active: activeTab === '1' })}
                              onClick={() => setActiveTab('1')}
                              style={{ cursor: 'pointer' }}
                            >
                              <FontAwesomeIcon icon={faFileUpload} className="me-2" />
                              Upload File
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({ active: activeTab === '2' })}
                              onClick={() => setActiveTab('2')}
                              style={{ cursor: 'pointer' }}
                            >
                              <FontAwesomeIcon icon={faPaste} className="me-2" />
                              Raw Text
                            </NavLink>
                          </NavItem>
                        </Nav>

                        <TabContent activeTab={activeTab}>
                          <TabPane tabId="1">
                            <FormGroup>
                              <Label for="fileUpload">Select File (PDF, DOCX, TXT, or Image for OCR)</Label>
                              <Input type="file" id="fileUpload" accept={getAcceptAttributeWithImages()} onChange={handleFileChange} />
                              <div className="form-text mt-2">
                                <strong>Supported formats:</strong>
                                <ul className="mb-0 mt-1">
                                  <li>Documents: PDF, DOCX, XLSX, TXT</li>
                                  <li>Images (OCR): JPG, PNG, BMP, GIF, TIFF, WEBP</li>
                                </ul>
                              </div>
                              {isExtracting && (
                                <div className="mt-2">
                                  <Spinner size="sm" color="primary" /> Extracting text...
                                </div>
                              )}
                            </FormGroup>
                          </TabPane>
                          <TabPane tabId="2">
                            <FormGroup>
                              <Label for="rawText">Paste Text Here</Label>
                              <Input
                                type="textarea"
                                id="rawText"
                                rows={10}
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                placeholder={`Paste the content you want to convert into ${contentType.toLowerCase()}...`}
                              />
                            </FormGroup>
                          </TabPane>
                        </TabContent>

                        {activeTab === '1' && inputText && !isExtracting && (
                          <FormGroup className="mt-3">
                            <Label>Extracted Text Preview:</Label>
                            <Input type="textarea" rows={5} value={inputText} readOnly className="bg-light" />
                          </FormGroup>
                        )}
                      </>
                    )}

                    {step === 2 && isKeyVerified && (
                      <div className="text-center py-5">
                        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
                        <h5 className="mt-3">AI is analyzing your content...</h5>
                        <p className="text-muted">This might take a few seconds.</p>
                      </div>
                    )}

                    {step === 3 && isKeyVerified && (
                      <div>
                        <Alert color="info">Review and edit the generated content before saving.</Alert>

                        {/* EXERCISES REVIEW */}
                        {contentType === 'EXERCISE' &&
                          exercises.map((exercise, exIndex) => (
                            <Card key={exIndex} className="mb-3 border">
                              <CardBody>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <h6 className="fw-bold">Question {exIndex + 1}</h6>
                                  <Button size="sm" color="danger" outline onClick={() => removeExercise(exIndex)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </div>
                                <FormGroup>
                                  <Input
                                    type="textarea"
                                    value={exercise.exerciseText}
                                    onChange={e => handleExerciseChange(exIndex, 'exerciseText', e.target.value)}
                                  />
                                </FormGroup>

                                <Label className="fw-bold text-muted small">Options</Label>
                                {exercise.options.map((option, optIndex) => (
                                  <div key={optIndex} className="d-flex align-items-center mb-2">
                                    <div className="me-2">
                                      <Input
                                        type="radio"
                                        name={`correct-${exIndex}`}
                                        checked={option.isCorrect}
                                        onChange={() => handleOptionChange(exIndex, optIndex, 'isCorrect', true)}
                                      />
                                    </div>
                                    <Input
                                      type="text"
                                      value={option.optionText}
                                      onChange={e => handleOptionChange(exIndex, optIndex, 'optionText', e.target.value)}
                                      className={option.isCorrect ? 'border-success' : ''}
                                    />
                                    <Button
                                      size="sm"
                                      color="link"
                                      className="text-danger ms-1"
                                      onClick={() => removeOption(exIndex, optIndex)}
                                    >
                                      <FontAwesomeIcon icon={faTimes} />
                                    </Button>
                                  </div>
                                ))}
                                <Button size="sm" color="light" className="mt-1" onClick={() => addOption(exIndex)}>
                                  <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Option
                                </Button>
                              </CardBody>
                            </Card>
                          ))}

                        {/* VOCABULARY REVIEW */}
                        {contentType === 'VOCABULARY' &&
                          vocabularies.map((vocab, vIndex) => (
                            <Card key={vIndex} className="mb-3 border">
                              <CardBody>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <h6 className="fw-bold">Word {vIndex + 1}</h6>
                                  <Button size="sm" color="danger" outline onClick={() => removeVocabulary(vIndex)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </div>
                                <Row>
                                  <Col md={4}>
                                    <FormGroup>
                                      <Label>Word</Label>
                                      <Input
                                        type="text"
                                        value={vocab.word}
                                        onChange={e => handleVocabularyChange(vIndex, 'word', e.target.value)}
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col md={8}>
                                    <FormGroup>
                                      <Label>Definition</Label>
                                      <Input
                                        type="textarea"
                                        rows={2}
                                        value={vocab.definition}
                                        onChange={e => handleVocabularyChange(vIndex, 'definition', e.target.value)}
                                      />
                                    </FormGroup>
                                  </Col>
                                </Row>
                                <FormGroup>
                                  <Label>Example Sentence</Label>
                                  <Input
                                    type="textarea"
                                    rows={2}
                                    value={vocab.example}
                                    onChange={e => handleVocabularyChange(vIndex, 'example', e.target.value)}
                                  />
                                </FormGroup>
                              </CardBody>
                            </Card>
                          ))}

                        {/* GRAMMAR REVIEW */}
                        {contentType === 'GRAMMAR' &&
                          grammars.map((grammar, gIndex) => (
                            <Card key={gIndex} className="mb-3 border">
                              <CardBody>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <h6 className="fw-bold">Grammar Point {gIndex + 1}</h6>
                                  <Button size="sm" color="danger" outline onClick={() => removeGrammar(gIndex)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </div>
                                <FormGroup>
                                  <Label>Title</Label>
                                  <Input
                                    type="text"
                                    value={grammar.title}
                                    onChange={e => handleGrammarChange(gIndex, 'title', e.target.value)}
                                  />
                                </FormGroup>
                                <FormGroup>
                                  <Label>Description / Rule</Label>
                                  <Input
                                    type="textarea"
                                    rows={4}
                                    value={grammar.description}
                                    onChange={e => handleGrammarChange(gIndex, 'description', e.target.value)}
                                  />
                                </FormGroup>
                                <FormGroup>
                                  <Label>Example Usage</Label>
                                  <Input
                                    type="textarea"
                                    rows={3}
                                    value={grammar.example}
                                    onChange={e => handleGrammarChange(gIndex, 'example', e.target.value)}
                                  />
                                </FormGroup>
                              </CardBody>
                            </Card>
                          ))}

                        <div className="text-center mt-3">
                          <Button color="secondary" outline onClick={() => setStep(1)} className="me-2">
                            Back to Input
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                {step === 1 && isKeyVerified && (
                  <Button
                    color="primary"
                    onClick={() => analyzeTextWithAI(languageSettings.target, languageSettings.native)}
                    disabled={isExtracting || !inputText}
                  >
                    Analyze with AI
                  </Button>
                )}
                {step === 3 && isKeyVerified && (
                  <Button color="success" onClick={saveToUnit} disabled={isSaving}>
                    {isSaving ? <Spinner size="sm" /> : <FontAwesomeIcon icon={faSave} className="me-1" />}
                    Save to Unit
                  </Button>
                )}
                <Button color="secondary" onClick={toggle}>
                  Close
                </Button>
              </ModalFooter>
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
};

export default AIImportAssistant;
