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
import { createVocabulary, updateVocabulary, reset } from 'app/shared/reducers/vocabulary.reducer';
import { toast } from 'react-toastify';
import { IVocabulary } from 'app/shared/model/vocabulary.model';
import { processImageUrl } from 'app/shared/util/image-utils';
import { MediaUploadField } from 'app/shared/components/form/MediaUploadField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faChevronDown, faChevronUp, faMagic } from '@fortawesome/free-solid-svg-icons';
import { generateVocabularyContent, DEFAULT_GEMINI_MODEL } from 'app/shared/util/ai-utils';
import { SimpleMarkdownEditor } from 'app/shared/components/markdown-editor/simple-markdown-editor';

interface VocabularyModalProps {
  isOpen: boolean;
  toggle: () => void;
  unitId: string;
  onSuccess: () => void;
  vocabularyEntity?: IVocabulary | null;
}

export const VocabularyModal = ({ isOpen, toggle, unitId, onSuccess, vocabularyEntity }: VocabularyModalProps) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.vocabulary.loading);
  const updateSuccess = useAppSelector(state => state.vocabulary.updateSuccess);

  const [formData, setFormData] = useState({
    word: '',
    phonetic: '',
    meaning: '',
    example: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState({
    word: false,
    meaning: false,
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
      if (vocabularyEntity) {
        setFormData({
          word: vocabularyEntity.word || '',
          phonetic: vocabularyEntity.phonetic || '',
          meaning: vocabularyEntity.meaning || '',
          example: vocabularyEntity.example || '',
          imageUrl: vocabularyEntity.imageUrl || '',
        });
      } else {
        setFormData({
          word: '',
          phonetic: '',
          meaning: '',
          example: '',
          imageUrl: '',
        });
      }
      setErrors({
        word: false,
        meaning: false,
      });
    }
  }, [isOpen, vocabularyEntity]);

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

  const handleGenerateAI = async () => {
    if (isGeneratingRef.current) return;

    if (!formData.word.trim()) {
      toast.error(translate('langleague.teacher.editor.vocabulary.error.enterWord'));
      return;
    }

    isGeneratingRef.current = true;
    setIsGenerating(true);

    try {
      const result = await generateVocabularyContent(formData.word, {
        apiKey: '', // Not needed
        model: aiModel,
        targetLang,
        nativeLang,
      });

      if (result) {
        setFormData(prev => ({
          ...prev,
          phonetic: result.phonetic || prev.phonetic,
          meaning: result.definition || prev.meaning,
          example: result.example || prev.example,
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
      word: !formData.word.trim(),
      meaning: !formData.meaning.trim(),
    };

    if (newErrors.word || newErrors.meaning) {
      setErrors(newErrors);
      return;
    }

    if (!unitId) {
      toast.error(translate('global.messages.error.missingUnitId'));
      return;
    }

    const entity = {
      ...formData,
      imageUrl: processImageUrl(formData.imageUrl),
      orderIndex: vocabularyEntity ? vocabularyEntity.orderIndex : 0,
      unitId: Number(unitId),
      id: vocabularyEntity ? vocabularyEntity.id : undefined,
    };

    if (vocabularyEntity) {
      dispatch(updateVocabulary(entity));
    } else {
      dispatch(createVocabulary(entity));
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} backdrop="static" id="vocabulary-modal" autoFocus={false} size="lg">
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>
          {vocabularyEntity
            ? translate('langleagueApp.vocabulary.home.createOrEditLabel')
            : translate('langleagueApp.vocabulary.home.createLabel')}
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
            <Label for="vocabulary-word">
              {translate('langleagueApp.vocabulary.word')} <span className="text-danger">*</span>
            </Label>
            <div className="d-flex gap-2">
              <Input type="text" name="word" id="vocabulary-word" value={formData.word} onChange={handleChange} invalid={errors.word} />
              <Button
                type="button"
                color="warning"
                outline
                onClick={handleGenerateAI}
                disabled={isGenerating || !formData.word.trim()}
                title={translate('langleague.teacher.editor.ai.autoFill')}
              >
                {isGenerating ? <Spinner size="sm" /> : <FontAwesomeIcon icon={faMagic} />}
              </Button>
            </div>
            <FormFeedback>{translate('entity.validation.required')}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="vocabulary-phonetic">{translate('langleagueApp.vocabulary.phonetic')}</Label>
            <Input type="text" name="phonetic" id="vocabulary-phonetic" value={formData.phonetic} onChange={handleChange} />
          </FormGroup>

          <FormGroup>
            <Label for="vocabulary-meaning">
              {translate('langleagueApp.vocabulary.meaning')} <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="meaning"
              id="vocabulary-meaning"
              value={formData.meaning}
              onChange={handleChange}
              invalid={errors.meaning}
            />
            <FormFeedback>{translate('entity.validation.required')}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="vocabulary-example">{translate('langleagueApp.vocabulary.example')}</Label>
            <SimpleMarkdownEditor
              id="vocabulary-example"
              value={formData.example}
              onChange={handleMarkdownChange('example')}
              placeholder="Example sentence (Markdown supported)"
              minHeight={150}
              disableFullscreen={true}
            />
          </FormGroup>

          <MediaUploadField
            type="image"
            label={translate('langleagueApp.vocabulary.imageUrl')}
            value={formData.imageUrl}
            onChange={url => setFormData(prev => ({ ...prev, imageUrl: url }))}
            placeholder={translate('global.form.image.url.placeholder')}
          />
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
