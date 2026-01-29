import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Collapse,
  Row,
  Col,
  Spinner,
} from 'reactstrap';
import { translate, Translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { createGrammar, updateGrammar, reset } from 'app/shared/reducers/grammar.reducer';
import { toast } from 'react-toastify';
import { IGrammar } from 'app/shared/model/grammar.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faChevronDown, faChevronUp, faMagic, faImage } from '@fortawesome/free-solid-svg-icons';
import { generateGrammarContent, DEFAULT_GEMINI_MODEL } from 'app/shared/util/ai-utils';
import { SimpleMarkdownEditor } from 'app/shared/components/markdown-editor/simple-markdown-editor';
import { extractTextFromImage, isImageFile, getAcceptAttributeWithImages } from 'app/shared/util/file-text-extractor';

interface GrammarModalProps {
  isOpen: boolean;
  toggle: () => void;
  unitId: string;
  onSuccess: () => void;
  grammarEntity?: IGrammar | null;
}

export const GrammarModal = ({ isOpen, toggle, unitId, onSuccess, grammarEntity }: GrammarModalProps) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.grammar.loading);
  const updateSuccess = useAppSelector(state => state.grammar.updateSuccess);

  const [formData, setFormData] = useState({
    title: '',
    contentMarkdown: '',
    exampleUsage: '',
  });

  const [errors, setErrors] = useState({
    title: false,
    contentMarkdown: false,
  });

  // AI State
  const [aiConfigOpen, setAiConfigOpen] = useState(false);
  const [aiModel, setAiModel] = useState(DEFAULT_GEMINI_MODEL);
  const [targetLang, setTargetLang] = useState('English');
  const [nativeLang, setNativeLang] = useState('Vietnamese');
  const [isGenerating, setIsGenerating] = useState(false);
  const isGeneratingRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(reset());
      if (grammarEntity) {
        setFormData({
          title: grammarEntity.title || '',
          contentMarkdown: grammarEntity.contentMarkdown || '',
          exampleUsage: grammarEntity.exampleUsage || '',
        });
      } else {
        setFormData({
          title: '',
          contentMarkdown: '',
          exampleUsage: '',
        });
      }
      setErrors({
        title: false,
        contentMarkdown: false,
      });
    }
  }, [isOpen, grammarEntity]);

  useEffect(() => {
    if (updateSuccess) {
      onSuccess();
      toggle();
    }
  }, [updateSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleMarkdownChange = (fieldName: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleOcrUpload = async (fieldName: 'contentMarkdown' | 'exampleUsage', file: File) => {
    if (!isImageFile(file.name)) {
      toast.error('Please upload an image file for OCR');
      return;
    }

    try {
      toast.info('Processing image with OCR... This may take a moment.');
      const ocrLanguages = [nativeLang, targetLang].filter(Boolean);
      const extractedText = await extractTextFromImage(file, ocrLanguages);

      setFormData(prev => ({
        ...prev,
        [fieldName]: prev[fieldName] ? prev[fieldName] + '\n\n' + extractedText : extractedText,
      }));
      toast.success('Text extracted successfully using OCR!');
    } catch (error) {
      toast.error(`Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error(error);
    }
  };

  // Handle paste event (Ctrl+V or Cmd+V) for OCR
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = async (e: ClipboardEvent) => {
      // Check if clipboard contains image
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.startsWith('image/')) {
            e.preventDefault();
            try {
              const file = items[i].getAsFile();
              if (file && isImageFile(file.name || 'image.png')) {
                toast.info('Processing image with OCR... This may take a moment.');
                const ocrLanguages = [nativeLang, targetLang].filter(Boolean);
                const extractedText = await extractTextFromImage(file, ocrLanguages);
                setFormData(prev => ({
                  ...prev,
                  contentMarkdown: prev.contentMarkdown ? prev.contentMarkdown + '\n\n' + extractedText : extractedText,
                }));
                toast.success('Text extracted successfully using OCR!');
              }
            } catch (error) {
              console.error('OCR Error:', error);
              toast.error(`Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [isOpen, nativeLang, targetLang]);

  const handleGenerateAI = async () => {
    if (isGeneratingRef.current) return;

    if (!formData.title.trim()) {
      toast.error(translate('langleague.teacher.editor.grammar.error.enterTitle'));
      return;
    }

    isGeneratingRef.current = true;
    setIsGenerating(true);

    try {
      const result = await generateGrammarContent(formData.title, {
        apiKey: '', // Not needed
        model: aiModel,
        targetLang,
        nativeLang,
      });

      if (result) {
        setFormData(prev => ({
          ...prev,
          contentMarkdown: result.description || prev.contentMarkdown,
          exampleUsage: result.example || prev.exampleUsage,
        }));
        toast.success(translate('langleague.teacher.editor.ai.generated'));
      } else {
        toast.warning(translate('langleague.teacher.editor.ai.noResult') || 'No content was generated. Please try again.');
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      let errorMessage = translate('langleague.teacher.editor.ai.error') || 'Failed to generate content';

      if (error instanceof Error) {
        const msg = error.message;
        if (msg.includes('Rate limit') || msg.includes('429')) {
          errorMessage = translate('langleague.teacher.editor.ai.rateLimit') || 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (msg.includes('API Key') || msg.includes('unauthorized')) {
          errorMessage = translate('langleague.teacher.editor.ai.authError') || 'API authentication failed. Please contact administrator.';
        } else if (msg.includes('network') || msg.includes('Network')) {
          errorMessage = translate('langleague.teacher.editor.ai.networkError') || 'Network error. Please check your connection.';
        } else {
          errorMessage = msg;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      title: !formData.title.trim(),
      contentMarkdown: !formData.contentMarkdown.trim(),
    };

    if (newErrors.title || newErrors.contentMarkdown) {
      setErrors(newErrors);
      return;
    }

    if (!unitId) {
      toast.error(translate('global.messages.error.missingUnitId'));
      return;
    }

    const entity = {
      ...formData,
      orderIndex: grammarEntity ? grammarEntity.orderIndex : 0,
      unitId: Number(unitId),
      id: grammarEntity ? grammarEntity.id : undefined,
    };

    if (grammarEntity) {
      dispatch(updateGrammar(entity));
    } else {
      dispatch(createGrammar(entity));
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} backdrop="static" id="grammar-modal" autoFocus={false} size="lg">
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>
          {grammarEntity ? translate('langleagueApp.grammar.home.createOrEditLabel') : translate('langleagueApp.grammar.home.createLabel')}
        </ModalHeader>
        <ModalBody>
          {/* AI Configuration Section */}
          <div className="mb-3 border rounded p-2 bg-light">
            <div
              className="d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => setAiConfigOpen(!aiConfigOpen)}
              style={{ cursor: 'pointer' }}
            >
              <span className="fw-bold text-primary">
                <FontAwesomeIcon icon={faRobot} className="me-2" />
                <Translate contentKey="langleague.teacher.editor.ai.settings">AI Settings</Translate>
              </span>
              <FontAwesomeIcon icon={aiConfigOpen ? faChevronUp : faChevronDown} />
            </div>
            <Collapse isOpen={aiConfigOpen}>
              <div className="mt-3">
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>
                        <Translate contentKey="langleague.teacher.editor.ai.targetLang">Target Lang</Translate>
                      </Label>
                      <Input type="select" value={targetLang} onChange={e => setTargetLang(e.target.value)}>
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
                  <Col md={6}>
                    <FormGroup>
                      <Label>
                        <Translate contentKey="langleague.teacher.editor.ai.nativeLang">Native Lang</Translate>
                      </Label>
                      <Input type="select" value={nativeLang} onChange={e => setNativeLang(e.target.value)}>
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
                </Row>
              </div>
            </Collapse>
          </div>

          <FormGroup>
            <Label for="grammar-title">
              {translate('langleagueApp.grammar.title')} <span className="text-danger">*</span>
            </Label>
            <div className="d-flex gap-2">
              <Input type="text" name="title" id="grammar-title" value={formData.title} onChange={handleChange} invalid={errors.title} />
              <Button
                type="button"
                color="warning"
                outline
                onClick={handleGenerateAI}
                disabled={isGenerating || !formData.title.trim()}
                title={translate('langleague.teacher.editor.ai.autoFill')}
              >
                {isGenerating ? <Spinner size="sm" /> : <FontAwesomeIcon icon={faMagic} />}
              </Button>
            </div>
            <FormFeedback>{translate('entity.validation.required')}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Label for="grammar-contentMarkdown" className="mb-0">
                {translate('langleagueApp.grammar.contentMarkdown')} <span className="text-danger">*</span>
              </Label>
              <Input
                type="file"
                accept={getAcceptAttributeWithImages()}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleOcrUpload('contentMarkdown', file);
                  e.target.value = '';
                }}
                style={{ display: 'none' }}
                id="ocr-contentMarkdown"
              />
              <Button
                type="button"
                color="info"
                size="sm"
                outline
                onClick={() => document.getElementById('ocr-contentMarkdown')?.click()}
                title="Upload image for OCR (or press Ctrl+V to paste from clipboard)"
              >
                <FontAwesomeIcon icon="image" className="me-1" />
                OCR
              </Button>
            </div>
            <SimpleMarkdownEditor
              id="grammar-contentMarkdown"
              value={formData.contentMarkdown}
              onChange={handleMarkdownChange('contentMarkdown')}
              placeholder="Grammar description (Markdown supported). Tip: Paste image with Ctrl+V for OCR"
              minHeight={250}
              disableFullscreen={true}
            />
            {errors.contentMarkdown && <div className="invalid-feedback d-block">{translate('entity.validation.required')}</div>}
          </FormGroup>

          <FormGroup>
            <Label for="grammar-exampleUsage">{translate('langleagueApp.grammar.exampleUsage')}</Label>
            <SimpleMarkdownEditor
              id="grammar-exampleUsage"
              value={formData.exampleUsage}
              onChange={handleMarkdownChange('exampleUsage')}
              placeholder="Example usage (Markdown supported)"
              minHeight={150}
              disableFullscreen={true}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            {translate('entity.action.cancel')}
          </Button>
          <Button color="primary" type="submit" disabled={loading}>
            {translate('entity.action.save')}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
