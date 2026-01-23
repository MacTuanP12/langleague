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
import { faRobot, faChevronDown, faChevronUp, faMagic } from '@fortawesome/free-solid-svg-icons';
import { USER_GEMINI_KEY_STORAGE, generateGrammarContent, DEFAULT_GEMINI_MODEL } from 'app/shared/util/ai-utils';

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

  const handleGenerateAI = async () => {
    if (isGeneratingRef.current) return;

    if (!formData.title.trim()) {
      toast.error(translate('langleague.teacher.editor.grammar.error.enterTitle'));
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
      const result = await generateGrammarContent(formData.title, {
        apiKey,
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
            <Label for="grammar-contentMarkdown">
              {translate('langleagueApp.grammar.contentMarkdown')} <span className="text-danger">*</span>
            </Label>
            <Input
              type="textarea"
              name="contentMarkdown"
              id="grammar-contentMarkdown"
              rows="6"
              value={formData.contentMarkdown}
              onChange={handleChange}
              invalid={errors.contentMarkdown}
            />
            <FormFeedback>{translate('entity.validation.required')}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="grammar-exampleUsage">{translate('langleagueApp.grammar.exampleUsage')}</Label>
            <Input
              type="textarea"
              name="exampleUsage"
              id="grammar-exampleUsage"
              rows="3"
              value={formData.exampleUsage}
              onChange={handleChange}
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
