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
import { USER_GEMINI_KEY_STORAGE, generateVocabularyContent } from 'app/shared/util/ai-utils';
import { DEFAULT_GEMINI_MODEL } from 'app/shared/util/ai-utils';

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
  const [apiKey, setApiKey] = useState('');
  const [aiModel, setAiModel] = useState(DEFAULT_GEMINI_MODEL);
  const [targetLang, setTargetLang] = useState('English');
  const [nativeLang, setNativeLang] = useState('Vietnamese');
  const [isGenerating, setIsGenerating] = useState(false);
  const isGeneratingRef = useRef(false);

  useEffect(() => {
    const storedKey = localStorage.getItem(USER_GEMINI_KEY_STORAGE) || sessionStorage.getItem(USER_GEMINI_KEY_STORAGE);
    if (storedKey) setApiKey(storedKey);
  }, []);

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

  const handleGenerateAI = async () => {
    if (isGeneratingRef.current) return;

    if (!formData.word.trim()) {
      toast.error(translate('langleague.teacher.editor.vocabulary.error.enterWord'));
      return;
    }
    if (!apiKey) {
      setAiConfigOpen(true);
      toast.info(translate('langleague.teacher.editor.ai.configureKey'));
      return;
    }

    isGeneratingRef.current = true;
    setIsGenerating(true);

    try {
      const result = await generateVocabularyContent(formData.word, {
        apiKey,
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
      }
    } finally {
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }
  };

  const saveApiKey = () => {
    localStorage.setItem(USER_GEMINI_KEY_STORAGE, apiKey);
    toast.success(translate('langleague.teacher.editor.ai.keySaved'));
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
                <FormGroup>
                  <Label>
                    <Translate contentKey="langleague.teacher.editor.ai.apiKey">API Key (Gemini/OpenAI)</Translate>
                  </Label>
                  <div className="d-flex gap-2">
                    <Input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Enter API Key" />
                    <Button color="secondary" outline onClick={saveApiKey} size="sm">
                      <Translate contentKey="langleague.teacher.editor.ai.saveKey">Save</Translate>
                    </Button>
                  </div>
                  <small className="text-muted">
                    <Translate contentKey="langleague.teacher.editor.ai.getKey">Get key from</Translate>{' '}
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
                      Google AI Studio
                    </a>
                  </small>
                </FormGroup>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label>
                        <Translate contentKey="langleague.teacher.editor.ai.model">Model</Translate>
                      </Label>
                      <Input type="select" value={aiModel} onChange={e => setAiModel(e.target.value)}>
                        <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                        <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash (Latest)</option>
                        <option value="gemini-1.5-flash-001">Gemini 1.5 Flash-001</option>
                        <option value="gemini-1.5-flash-8b">Gemini 1.5 Flash-8b</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                        <option value="gemini-pro">Gemini 1.0 Pro</option>
                        <option value="gpt-4o-mini">GPT-4o-mini</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>
                        <Translate contentKey="langleague.teacher.editor.ai.targetLang">Target Lang</Translate>
                      </Label>
                      <Input type="select" value={targetLang} onChange={e => setTargetLang(e.target.value)}>
                        <option value="English">English</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Korean">Korean</option>
                        <option value="Chinese">Chinese</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>
                        <Translate contentKey="langleague.teacher.editor.ai.nativeLang">Native Lang</Translate>
                      </Label>
                      <Input type="select" value={nativeLang} onChange={e => setNativeLang(e.target.value)}>
                        <option value="Vietnamese">Vietnamese</option>
                        <option value="English">English</option>
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
            <Input type="textarea" name="example" id="vocabulary-example" value={formData.example} onChange={handleChange} />
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
