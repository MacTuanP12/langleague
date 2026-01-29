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
import {
  extractTextFromFile,
  getAcceptAttributeWithImages,
  extractTextFromImage,
  isImageFile,
  mapLanguagesToOcrCodes,
  getSupportedOcrLanguages,
} from 'app/shared/util/file-text-extractor';
import { toast } from 'react-toastify';
import classnames from 'classnames';
import { generateUnitContent } from 'app/shared/util/ai-tutor.service';
import { SimpleMarkdownEditor } from 'app/shared/components/markdown-editor/simple-markdown-editor';
import './ai-import-assistant.scss';

// Export types for use in parent components
export interface AiImportExerciseOption {
  optionText: string;
  isCorrect: boolean;
}

export interface AiImportExercise {
  exerciseText: string;
  options: AiImportExerciseOption[];
}

export interface AiImportVocabulary {
  word: string;
  definition: string;
  example: string;
}

export interface AiImportGrammar {
  title: string;
  description: string;
  example: string;
}

export type AiImportContentType = 'EXERCISE' | 'VOCABULARY' | 'GRAMMAR';

interface AIImportAssistantProps {
  unitId?: string;
  onSuccess?: () => void;
  onDataReceived?: (type: AiImportContentType, data: AiImportExercise[] | AiImportVocabulary[] | AiImportGrammar[]) => void;
  initialContentType?: AiImportContentType;
  isOpen?: boolean;
  onToggle?: () => void;
  showFloatingButton?: boolean;
}

const AIImportAssistant: React.FC<AIImportAssistantProps> = ({
  unitId,
  onSuccess,
  onDataReceived,
  initialContentType = 'EXERCISE',
  isOpen: externalIsOpen,
  onToggle: externalOnToggle,
  showFloatingButton = true,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [contentType, setContentType] = useState<AiImportContentType>(initialContentType);
  const [inputText, setInputText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [languageSettings, setLanguageSettings] = useState({
    target: 'English',
    native: 'Vietnamese',
  });

  const [exercises, setExercises] = useState<AiImportExercise[]>([]);
  const [vocabularies, setVocabularies] = useState<AiImportVocabulary[]>([]);
  const [grammars, setGrammars] = useState<AiImportGrammar[]>([]);

  const [step, setStep] = useState(1); // 1: Input, 2: Processing, 3: Review

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      setIsExtracting(true);
      try {
        let text = '';

        if (isImageFile(selectedFile.name)) {
          toast.info('Processing image with OCR... This may take a moment.');
          // Use all system languages for OCR to support multilingual content
          const ocrLanguages = [languageSettings.native, languageSettings.target].filter(Boolean);
          text = await extractTextFromImage(selectedFile, ocrLanguages);
          toast.success('Image text extracted successfully using OCR!');
        } else {
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

  const getSystemPrompt = (type: AiImportContentType, rawText: string, targetLang: string, nativeLang: string): string => {
    if (type === 'VOCABULARY') {
      return `Role: You are a dictionary editor. Extract vocabulary from the text.

Rules:
- 'word': MUST be in ${targetLang}.
- 'definition': MUST be in ${nativeLang} (translate if necessary).
- 'example': A sentence in ${targetLang} using the word.

Output: Valid JSON Array ONLY. Do not include any markdown formatting, code blocks, or explanations. Return ONLY the JSON array.

Format:
[
  {
    "word": "...",
    "definition": "...",
    "example": "..."
  }
]

TEXT TO ANALYZE:
${rawText}`;
    } else if (type === 'GRAMMAR') {
      return `Role: You are a world-class Markdown designer and professional grammar content formatter. You specialize in transforming messy, unformatted OCR text from grammar books into beautifully structured, visually appealing Markdown documentation.

Language Context:
- Source Language (Ngôn ngữ gốc): ${nativeLang} - This is the original language of the input text (from OCR or manual copy).
- Target Language (Ngôn ngữ đích): ${targetLang} - This is the target language for learning.

Your Mission:
The input text below was extracted from a grammar book (via OCR or manual copy). It may be:
- Messy and unformatted
- Contain OCR errors or typos
- Lack proper structure or organization
- Missing visual hierarchy

Your job is to:
1. **Clean & Correct**: Fix OCR errors, typos, and formatting issues
2. **Organize**: Structure content into clear, logical sections with proper hierarchy
3. **Design**: Format using beautiful Markdown with professional typography
4. **Preserve**: Keep ALL original information - only improve presentation
5. **Extract**: Identify and format grammar points professionally
6. **Enhance**: Add visual structure (headings, lists, emphasis) to improve readability

Markdown Design Mastery - Your Toolkit:
- **Headings**: Use # for main titles, ## for major sections, ### for subsections, #### for sub-subsections
- **Emphasis**: Use **bold** for key terms, grammar rules, and important concepts. Use *italic* for subtle emphasis
- **Lists**: Use - or * for unordered lists, 1. 2. 3. for ordered/sequential lists
- **Code**: Use \`backticks\` for grammar patterns, structures, or technical terms
- **Blockquotes**: Use > for important notes, tips, warnings, or special information
- **Separators**: Use --- for visual section breaks
- **Structure**: Create clear hierarchy - main concept → explanation → examples → notes
- **Spacing**: Add proper line breaks and spacing for readability
- **Organization**: Group related information together logically

Output Rules:
- 'title': Extract or create a clear, concise title for the grammar point (can be in ${targetLang} or ${nativeLang})
- 'description': Format the explanation in BEAUTIFUL, PROFESSIONAL Markdown. MUST be in ${nativeLang} (the source language for explanation). 
  * Use proper Markdown formatting: headings, lists, bold, italic, code blocks
  * Structure content hierarchically (main concept → details → examples)
  * Make it visually appealing and easy to scan
  * Think like a professional technical writer creating beautiful documentation
  * The description should look like professionally designed educational content
- 'example': Format example sentences in ${targetLang} (the target language for learning). Use Markdown formatting like lists, code blocks, or structured paragraphs if appropriate.

CRITICAL: The 'description' field must be rich, well-formatted Markdown that looks like it was designed by a professional. It should be:
- Visually organized with clear hierarchy
- Easy to scan and read
- Professionally formatted
- Beautiful and engaging

Think of yourself as a master Markdown designer creating the most beautiful, readable grammar documentation possible.

Output: Valid JSON Array ONLY. Do not include any markdown formatting around the JSON, code blocks, or explanations. Return ONLY the JSON array.

Format:
[
  {
    "title": "Grammar Point Title",
    "description": "# Main Grammar Concept\n\n## Overview\nBrief introduction...\n\n## Structure\n- **Key point 1**: Explanation\n- **Key point 2**: Explanation\n\n## Usage Rules\n1. First rule\n2. Second rule\n\n## Examples\n> **Note**: Important tip here\n\n### Common Patterns\n\`pattern\` - explanation",
    "example": "Example sentence 1\nExample sentence 2\nExample sentence 3"
  }
]

RAW TEXT FROM GRAMMAR BOOK (OCR or Manual Copy):
${rawText}`;
    } else {
      return `Role: Quiz creator. Create multiple choice questions from the text.

Language Context:
- Source Language (Ngôn ngữ gốc): ${nativeLang} - This is the original language of the input text.
- Target Language (Ngôn ngữ đích): ${targetLang} - This is the language for the output content.

Rules:
- 'exerciseText': The question text MUST be in ${targetLang} (the target language for learning).
- 'options': Array of answer choices. Must have at least 2 options, and exactly ONE option must have "isCorrect": true.
- Each option must have "optionText" (string in ${targetLang}) and "isCorrect" (boolean).

Output: Valid JSON Array ONLY. Do not include any markdown formatting, code blocks, or explanations. Return ONLY the JSON array.

Format:
[
  {
    "exerciseText": "Question content",
    "options": [
      { "optionText": "Option A", "isCorrect": false },
      { "optionText": "Option B", "isCorrect": true },
      { "optionText": "Option C", "isCorrect": false }
    ]
  }
]

TEXT TO ANALYZE:
${rawText}`;
    }
  };

  const analyzeTextWithAI = async (targetLang: string, nativeLang: string) => {
    if (!inputText.trim()) {
      toast.error('Please provide some text to analyze.');
      return;
    }

    setIsProcessing(true);
    setStep(2);

    const prompt = getSystemPrompt(contentType, inputText, targetLang, nativeLang);

    try {
      if (contentType === 'EXERCISE') {
        const parsedData = await generateUnitContent<AiImportExercise>('', prompt, selectedModel);
        if (!Array.isArray(parsedData) || parsedData.length === 0) {
          toast.warning('No exercises were generated. Please try again with different text.');
          setStep(1);
          return;
        }
        setExercises(parsedData);
        setStep(3);
        toast.success(`Successfully generated ${parsedData.length} exercise item(s)!`);
      } else if (contentType === 'VOCABULARY') {
        const parsedData = await generateUnitContent<AiImportVocabulary>('', prompt, selectedModel);
        if (!Array.isArray(parsedData) || parsedData.length === 0) {
          toast.warning('No vocabulary items were generated. Please try again with different text.');
          setStep(1);
          return;
        }
        setVocabularies(parsedData);
        setStep(3);
        toast.success(`Successfully generated ${parsedData.length} vocabulary item(s)!`);
      } else if (contentType === 'GRAMMAR') {
        const parsedData = await generateUnitContent<AiImportGrammar>('', prompt, selectedModel);
        if (!Array.isArray(parsedData) || parsedData.length === 0) {
          toast.warning('No grammar topics were generated. Please try again with different text.');
          setStep(1);
          return;
        }
        setGrammars(parsedData);
        setStep(3);
        toast.success(`Successfully formatted ${parsedData.length} grammar topic(s) with beautiful Markdown!`);
      } else {
        throw new Error('Invalid content type');
      }
    } catch (error) {
      console.error('AI Analysis Error:', error);
      let errorMessage = 'Unknown error occurred';

      if (error instanceof Error) {
        errorMessage = error.message;
        // Provide more user-friendly error messages
        if (errorMessage.includes('JSON') || errorMessage.includes('parse')) {
          errorMessage = 'Failed to parse AI response. The AI may have returned invalid data. Please try again.';
        } else if (errorMessage.includes('API') || errorMessage.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (errorMessage.includes('API Key') || errorMessage.includes('unauthorized')) {
          errorMessage = 'API authentication failed. Please contact administrator.';
        }
      }

      toast.error(`AI Analysis Failed: ${errorMessage}`);
      setStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Handlers (Exercise, Vocabulary, Grammar) ---
  const handleExerciseChange = (index: number, field: keyof AiImportExercise, value: string | AiImportExerciseOption[]) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value } as AiImportExercise;
    setExercises(updatedExercises);
  };

  const handleOptionChange = (exerciseIndex: number, optionIndex: number, field: keyof AiImportExerciseOption, value: string | boolean) => {
    const updatedExercises = [...exercises];
    const updatedOptions = [...updatedExercises[exerciseIndex].options];
    updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], [field]: value } as AiImportExerciseOption;

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

  const handleVocabularyChange = (index: number, field: keyof AiImportVocabulary, value: string) => {
    const updatedVocabularies = [...vocabularies];
    updatedVocabularies[index] = { ...updatedVocabularies[index], [field]: value };
    setVocabularies(updatedVocabularies);
  };

  const removeVocabulary = (index: number) => {
    const updatedVocabularies = [...vocabularies];
    updatedVocabularies.splice(index, 1);
    setVocabularies(updatedVocabularies);
  };

  const handleGrammarChange = (index: number, field: keyof AiImportGrammar, value: string) => {
    const updatedGrammars = [...grammars];
    updatedGrammars[index] = { ...updatedGrammars[index], [field]: value } as AiImportGrammar;
    setGrammars(updatedGrammars);
  };

  const removeGrammar = (index: number) => {
    const updatedGrammars = [...grammars];
    updatedGrammars.splice(index, 1);
    setGrammars(updatedGrammars);
  };

  const handleImport = () => {
    if (!onDataReceived) {
      toast.error('Import function is not connected properly.');
      return;
    }

    if (contentType === 'EXERCISE') {
      if (exercises.length === 0) {
        toast.warning('No exercises to import.');
        return;
      }
      onDataReceived('EXERCISE', exercises);
      toast.success(`${exercises.length} exercises imported to editor!`);
    } else if (contentType === 'VOCABULARY') {
      if (vocabularies.length === 0) {
        toast.warning('No vocabularies to import.');
        return;
      }
      onDataReceived('VOCABULARY', vocabularies);
      toast.success(`${vocabularies.length} vocabularies imported to editor!`);
    } else if (contentType === 'GRAMMAR') {
      if (grammars.length === 0) {
        toast.warning('No grammar topics to import.');
        return;
      }
      onDataReceived('GRAMMAR', grammars);
      toast.success(`${grammars.length} grammar topics imported to editor!`);
    }

    if (onSuccess) onSuccess();
    toggle();
    setStep(1);
    setExercises([]);
    setVocabularies([]);
    setGrammars([]);
    setInputText('');
  };

  return (
    <>
      {showFloatingButton && (
        <div className="ai-floating-btn" onClick={toggle}>
          <FontAwesomeIcon icon={faRobot} size="lg" />
        </div>
      )}

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
              </ModalHeader>
              <ModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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
                            onChange={e => setContentType(e.target.value as AiImportContentType)}
                          >
                            <option value="EXERCISE">Exercises (Multiple Choice)</option>
                            <option value="VOCABULARY">Vocabulary</option>
                            <option value="GRAMMAR">Grammar</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="nativeLang">Native Language (Ngôn ngữ gốc)</Label>
                          <Input
                            type="select"
                            id="nativeLang"
                            value={languageSettings.native}
                            onChange={e => setLanguageSettings({ ...languageSettings, native: e.target.value })}
                          >
                            <option value="Vietnamese">Vietnamese</option>
                            <option value="English">English</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Korean">Korean</option>
                            <option value="Chinese">Chinese</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                            <option value="Spanish">Spanish</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="targetLang">Target Language (Ngôn ngữ đích)</Label>
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
                            <option value="German">German</option>
                            <option value="Spanish">Spanish</option>
                            <option value="Vietnamese">Vietnamese</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={12}>
                        <FormGroup>
                          <Label for="aiModel">AI Model</Label>
                          <Input type="select" id="aiModel" value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Free Tier)</option>
                            <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                            <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                          </Input>
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
                          <Label for="fileUpload">
                            Select File{' '}
                            {contentType === 'GRAMMAR' && (
                              <span className="text-primary">(Recommended: Upload image from grammar book for OCR)</span>
                            )}
                          </Label>
                          <Input type="file" id="fileUpload" accept={getAcceptAttributeWithImages()} onChange={handleFileChange} />
                          <div className="form-text mt-2">
                            <strong>Supported formats:</strong>
                            <ul className="mb-0 mt-1">
                              <li>Documents: PDF, DOCX, XLSX, TXT</li>
                              <li>Images (OCR): JPG, PNG, BMP, GIF, TIFF, WEBP</li>
                            </ul>
                            {contentType === 'GRAMMAR' && (
                              <div className="alert alert-info mt-2 mb-0" style={{ fontSize: '0.875rem' }}>
                                <strong>💡 Tip for Grammar:</strong> Upload an image of a grammar page from your book. The AI will extract
                                the text using OCR and then format it into beautiful, well-structured Markdown automatically!
                              </div>
                            )}
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
                          <Label for="rawText">
                            Paste Text Here{' '}
                            {contentType === 'GRAMMAR' && <span className="text-primary">(OCR text from grammar book)</span>}
                          </Label>
                          <SimpleMarkdownEditor
                            id="rawText"
                            value={inputText}
                            onChange={setInputText}
                            placeholder={
                              contentType === 'GRAMMAR'
                                ? 'Paste raw OCR text from grammar book. AI will format it into beautiful Markdown...'
                                : `Paste the content you want to convert into ${contentType.toLowerCase()}...`
                            }
                            minHeight={300}
                            disableFullscreen={true}
                          />
                          {contentType === 'GRAMMAR' && (
                            <div className="form-text mt-2">
                              <div className="alert alert-info mb-0" style={{ fontSize: '0.875rem' }}>
                                <strong>💡 Tip:</strong> Paste raw text extracted from grammar book (via OCR or manual copy). The AI will
                                clean OCR errors, organize content, and format it into beautiful, professional Markdown automatically!
                              </div>
                            </div>
                          )}
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

                {step === 2 && (
                  <div className="text-center py-5">
                    <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
                    <h5 className="mt-3">AI is analyzing your content...</h5>
                    <p className="text-muted">This might take a few seconds.</p>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <Alert color="info">Review and edit the generated content before importing.</Alert>

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
                                <Button size="sm" color="link" className="text-danger ms-1" onClick={() => removeOption(exIndex, optIndex)}>
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
                              <SimpleMarkdownEditor
                                value={vocab.example}
                                onChange={value => handleVocabularyChange(vIndex, 'example', value)}
                                placeholder="Example sentence (Markdown supported)"
                                minHeight={120}
                                disableFullscreen={true}
                              />
                            </FormGroup>
                          </CardBody>
                        </Card>
                      ))}

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
                              <SimpleMarkdownEditor
                                value={grammar.description}
                                onChange={value => handleGrammarChange(gIndex, 'description', value)}
                                placeholder="Grammar description (Markdown supported)"
                                minHeight={200}
                                disableFullscreen={true}
                              />
                            </FormGroup>
                            <FormGroup>
                              <Label>Example Usage</Label>
                              <SimpleMarkdownEditor
                                value={grammar.example}
                                onChange={value => handleGrammarChange(gIndex, 'example', value)}
                                placeholder="Example usage (Markdown supported)"
                                disableFullscreen={true}
                                minHeight={150}
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
              </ModalBody>
              <ModalFooter>
                {step === 1 && (
                  <Button
                    color="primary"
                    onClick={() => analyzeTextWithAI(languageSettings.target, languageSettings.native)}
                    disabled={isExtracting || !inputText}
                  >
                    Analyze with AI
                  </Button>
                )}
                {step === 3 && (
                  <Button color="success" onClick={handleImport}>
                    <FontAwesomeIcon icon={faSave} className="me-1" />
                    Import to Editor
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
