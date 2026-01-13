import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup, Alert } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { generateAiExplanation } from 'app/shared/util/ai-tutor.service';
import ReactMarkdown from 'react-markdown';

interface AiTutorButtonProps {
  questionText: string;
  correctAnswer: string;
  userContext?: string;
}

const STORAGE_KEY = 'USER_GEMINI_KEY';

export const AiTutorButton: React.FC<AiTutorButtonProps> = ({ questionText, correctAnswer, userContext }) => {
  // State for UI visibility
  const [showResultModal, setShowResultModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  // State for Logic
  const [apiKey, setApiKey] = useState<string>('');
  const [tempKey, setTempKey] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load key from storage on mount
    const storedKey = localStorage.getItem(STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleExplainClick = () => {
    setError(null);
    if (!apiKey) {
      setTempKey('');
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
      const result = await generateAiExplanation(key, {
        question: questionText,
        correctAnswer,
        userAnswer: userContext,
      });
      setExplanation(result);
    } catch (err: unknown) {
      if ((err as Error).message === 'INVALID_KEY') {
        // Close result modal and open key modal to ask for new key
        setShowResultModal(false);
        setShowKeyModal(true);
        setError('Invalid API Key. Please check and try again.');
        // Clear invalid key from storage
        localStorage.removeItem(STORAGE_KEY);
        setApiKey('');
      } else {
        setError((err as Error).message || 'Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempKey.trim()) return;

    const newKey = tempKey.trim();
    localStorage.setItem(STORAGE_KEY, newKey);
    setApiKey(newKey);
    setShowKeyModal(false);

    // Immediately try to fetch explanation with the new key
    fetchExplanation(newKey);
  };

  const handleChangeKey = () => {
    setShowResultModal(false);
    setTempKey(apiKey); // Pre-fill with current key
    setShowKeyModal(true);
    setError(null);
  };

  const toggleResultModal = () => setShowResultModal(!showResultModal);
  const toggleKeyModal = () => setShowKeyModal(!showKeyModal);

  return (
    <>
      <Button color="info" size="sm" className="ms-2 ai-tutor-btn" onClick={handleExplainClick} title="Get explanation from AI Tutor">
        <i className="bi bi-robot me-1"></i>
        <Translate contentKey="langleague.student.learning.aiTutor.button">Explain with AI</Translate>
      </Button>

      {/* Key Input Modal */}
      <Modal isOpen={showKeyModal} toggle={toggleKeyModal} centered>
        <ModalHeader toggle={toggleKeyModal}>
          <i className="bi bi-key-fill me-2 text-warning"></i>
          Setup AI Tutor
        </ModalHeader>
        <ModalBody>
          <p className="text-muted small">
            To use the AI Tutor feature, you need to provide your own Google Gemini API Key. It&apos;s free and we only store it in your
            browser.
          </p>

          {error && (
            <Alert color="danger" className="py-2 small">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSaveKey}>
            <FormGroup>
              <Label for="apiKey" className="fw-bold small">
                Gemini API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={tempKey}
                onChange={e => setTempKey(e.target.value)}
                placeholder="Paste your API key here..."
                autoFocus
              />
            </FormGroup>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="small text-decoration-none"
              >
                <i className="bi bi-box-arrow-up-right me-1"></i>
                Get a free key here
              </a>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleKeyModal} size="sm">
            Cancel
          </Button>
          <Button color="primary" onClick={handleSaveKey} disabled={!tempKey.trim()} size="sm">
            Save & Explain
          </Button>
        </ModalFooter>
      </Modal>

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
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Thinking...</p>
            </div>
          ) : error ? (
            <Alert color="danger">{error}</Alert>
          ) : (
            <div className="ai-explanation">
              <div className="mb-3 p-3 bg-light rounded border-start border-4 border-info">
                <p className="fw-bold mb-1 small text-uppercase text-muted">Question</p>
                <p className="mb-0 fst-italic">&quot;{questionText}&quot;</p>
              </div>

              <div className="explanation-content">
                <ReactMarkdown>{explanation || ''}</ReactMarkdown>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="justify-content-between">
          <Button color="link" className="text-muted p-0 text-decoration-none" onClick={handleChangeKey} size="sm" title="Change API Key">
            <i className="bi bi-gear-fill me-1"></i> Change Key
          </Button>
          <Button color="secondary" onClick={toggleResultModal}>
            <Translate contentKey="entity.action.close">Close</Translate>
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AiTutorButton;
