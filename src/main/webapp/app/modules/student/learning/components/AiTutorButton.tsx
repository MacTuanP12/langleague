import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { generateAiExplanation, Language } from 'app/shared/util/ai-tutor.service';
import { ApiKeySetupModal } from 'app/shared/components/ApiKeySetupModal';
import { STORAGE_KEYS } from 'app/config/storage-keys';
import ReactMarkdown from 'react-markdown';
import { useAppSelector } from 'app/config/store';

interface AiTutorButtonProps {
  questionText: string;
  correctAnswer: string;
  userContext?: string;
}

export const AiTutorButton: React.FC<AiTutorButtonProps> = ({ questionText, correctAnswer, userContext }) => {
  // State for UI visibility
  const [showResultModal, setShowResultModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  // State for Logic
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [keyModalError, setKeyModalError] = useState<string | null>(null);

  // Get current language from store
  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  useEffect(() => {
    // Load key from storage on mount
    const storedKey = localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleExplainClick = () => {
    setError(null);
    setKeyModalError(null);
    if (!apiKey) {
      setShowKeyModal(true);
    } else {
      fetchExplanation(apiKey);
    }
  };

  const fetchExplanation = async (key: string) => {
    setLoading(true);
    setShowResultModal(true);
    setExplanation(null); // Clear previous result

    try {
      // Map current locale to supported AI language
      const langMap: Record<string, Language> = {
        en: 'en',
        vi: 'vi',
        ja: 'ja',
        ko: 'ko',
        'zh-cn': 'zh',
        'zh-tw': 'zh',
      };
      const language = langMap[currentLocale] || 'en';

      const result = await generateAiExplanation(key, {
        question: questionText,
        correctAnswer,
        userAnswer: userContext,
        language,
      });
      setExplanation(result);
    } catch (err: unknown) {
      if ((err as Error).message === 'INVALID_KEY') {
        // Close result modal and open key modal to ask for new key
        setShowResultModal(false);
        setShowKeyModal(true);
        setKeyModalError(translate('langleague.student.learning.aiTutor.invalidKeyError'));
        // Clear invalid key from storage
        localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
        setApiKey('');
      } else if ((err as Error).message === 'RATE_LIMIT_ERROR') {
        setError(
          translate(
            'langleague.student.learning.aiTutor.rateLimitError',
            'You have exceeded your API quota. The system automatically retried but the limit persists. Please wait a few minutes or upgrade your API plan.',
          ),
        );
      } else {
        setError((err as Error).message || translate('langleague.student.learning.aiTutor.somethingWentWrong'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = (newKey: string) => {
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, newKey);
    setApiKey(newKey);
    setShowKeyModal(false);
    setKeyModalError(null);

    // Immediately try to fetch explanation with the new key
    fetchExplanation(newKey);
  };

  const handleChangeKey = () => {
    setShowResultModal(false);
    setShowKeyModal(true);
    setError(null);
    setKeyModalError(null);
  };

  const toggleResultModal = () => setShowResultModal(!showResultModal);
  const toggleKeyModal = () => setShowKeyModal(!showKeyModal);

  return (
    <>
      <Button color="info" size="sm" className="ms-2 ai-tutor-btn" onClick={handleExplainClick}>
        <i className="bi bi-robot me-1"></i>
        <Translate contentKey="langleague.student.learning.aiTutor.button">Explain with AI</Translate>
      </Button>

      {/* Key Input Modal */}
      <ApiKeySetupModal
        isOpen={showKeyModal}
        onToggle={toggleKeyModal}
        onSave={handleSaveKey}
        error={keyModalError}
        initialKey={apiKey}
        title={translate('langleague.student.learning.aiTutor.setupTitle')}
        description={translate('langleague.student.learning.aiTutor.setupDescription')}
      />

      {/* Result Modal */}
      <Modal isOpen={showResultModal} toggle={toggleResultModal} centered scrollable>
        <ModalHeader toggle={toggleResultModal}>
          <div className="d-flex align-items-center justify-content-between w-100">
            <span>
              <i className="bi bi-robot me-2 text-primary"></i>
              <Translate contentKey="langleague.student.learning.aiTutor.title">AI Tutor Explanation</Translate>
            </span>
          </div>
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary mb-2" role="status">
                <span className="visually-hidden">
                  <Translate contentKey="langleague.student.learning.aiTutor.thinking">Thinking...</Translate>
                </span>
              </div>
              <p className="text-muted">
                <Translate contentKey="langleague.student.learning.aiTutor.thinking">Thinking...</Translate>
              </p>
            </div>
          ) : error ? (
            <Alert color="danger">{error}</Alert>
          ) : (
            <div className="ai-explanation">
              <div className="mb-3 p-3 bg-light rounded border-start border-4 border-info">
                <p className="fw-bold mb-1 small text-uppercase text-muted">
                  <Translate contentKey="langleague.student.learning.aiTutor.question">Question</Translate>
                </p>
                <p className="mb-0 fst-italic">&quot;{questionText}&quot;</p>
              </div>

              <div className="explanation-content">
                <ReactMarkdown>{explanation || ''}</ReactMarkdown>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="justify-content-between">
          <Button color="link" className="text-muted p-0 text-decoration-none" onClick={handleChangeKey} size="sm">
            <i className="bi bi-gear-fill me-1"></i>
            <Translate contentKey="langleague.student.learning.aiTutor.changeKey">Change Key</Translate>
          </Button>
          <Button color="secondary" onClick={toggleResultModal}>
            <Translate contentKey="langleague.student.learning.aiTutor.close">Close</Translate>
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AiTutorButton;
