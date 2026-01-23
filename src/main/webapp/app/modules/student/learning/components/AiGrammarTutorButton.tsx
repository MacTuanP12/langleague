import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form, Alert } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
// Import hook để lấy Redux state
import { useAppSelector } from 'app/config/store';
import { generateAiGrammarHelp, Language } from 'app/shared/util/ai-tutor.service';
import { ApiKeySetupModal } from 'app/shared/components/ApiKeySetupModal';
import { STORAGE_KEYS } from 'app/config/storage-keys';
import ReactMarkdown from 'react-markdown';

interface AiGrammarTutorButtonProps {
  grammarTitle: string;
  grammarContent: string;
  grammarExamples?: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

export const AiGrammarTutorButton: React.FC<AiGrammarTutorButtonProps> = ({ grammarTitle, grammarContent, grammarExamples }) => {
  // 1. Lấy ngôn ngữ hiện tại từ JHipster Redux
  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  // State for UI visibility
  const [showChatModal, setShowChatModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  // State for Logic
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyModalError, setKeyModalError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');

  useEffect(() => {
    // Load key from storage on mount
    const storedKey = localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleAskClick = () => {
    setError(null);
    setKeyModalError(null);
    if (!apiKey) {
      setShowKeyModal(true);
    } else {
      setShowChatModal(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || loading) return;

    const userMessage = userInput.trim();
    setUserInput('');

    // Add user message to chat
    const newUserMessage: ChatMessage = { role: 'user', parts: userMessage };
    setChatHistory(prev => [...prev, newUserMessage]);

    setLoading(true);
    setError(null);

    try {
      // 2. Truyền ngôn ngữ vào Service
      const result = await generateAiGrammarHelp(apiKey, {
        grammarTopic: grammarTitle,
        grammarContent,
        grammarExamples,
        userQuestion: userMessage,
        chatHistory,
        language: currentLocale as Language, // Ép kiểu string -> Language
      });

      // Add AI response to chat
      const newAiMessage: ChatMessage = { role: 'model', parts: result };
      setChatHistory(prev => [...prev, newAiMessage]);
    } catch (err: unknown) {
      const errorMessage = (err as Error).message;
      if (errorMessage === 'INVALID_KEY') {
        setShowChatModal(false);
        setShowKeyModal(true);
        setKeyModalError(translate('langleague.student.learning.aiTutor.invalidKeyError'));
        localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
        setApiKey('');
      } else if (errorMessage === 'RATE_LIMIT_ERROR') {
        setError(
          translate(
            'langleague.student.learning.aiTutor.rateLimitError',
            'You have exceeded your API quota. The system automatically retried but the limit persists. Please wait a few minutes or upgrade your API plan.',
          ),
        );
      } else {
        setError(errorMessage || translate('langleague.student.learning.aiTutor.somethingWentWrong'));
      }
    } finally {
      setLoading(false);
    }
  };

  // ... (Giữ nguyên các hàm handleSaveKey, handleChangeKey, v.v.)
  const handleSaveKey = (newKey: string) => {
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, newKey);
    setApiKey(newKey);
    setShowKeyModal(false);
    setKeyModalError(null);
    setShowChatModal(true);
  };

  const handleChangeKey = () => {
    setShowChatModal(false);
    setShowKeyModal(true);
    setError(null);
    setKeyModalError(null);
  };

  const handleClearChat = () => {
    setChatHistory([]);
    setError(null);
  };

  const toggleChatModal = () => {
    setShowChatModal(!showChatModal);
    if (!showChatModal) {
      setError(null);
    }
  };

  const toggleKeyModal = () => setShowKeyModal(!showKeyModal);

  return (
    <>
      <Button color="primary" size="lg" className="ai-grammar-tutor-btn w-100" onClick={handleAskClick}>
        <i className="bi bi-robot me-2"></i>
        <Translate contentKey="langleague.student.learning.aiTutor.grammarButton">Ask AI Tutor</Translate>
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

      {/* Chat Modal */}
      <Modal isOpen={showChatModal} toggle={toggleChatModal} centered size="lg" scrollable>
        {/* ... (Phần nội dung Modal giữ nguyên như code cũ của bạn) */}
        <ModalHeader toggle={toggleChatModal}>
          <div className="d-flex align-items-center">
            <i className="bi bi-robot me-2 text-primary"></i>
            <Translate contentKey="langleague.student.learning.aiTutor.grammarTitle">AI Grammar Tutor</Translate>
            <span className="ms-2 text-muted small">- {grammarTitle}</span>
          </div>
        </ModalHeader>
        <ModalBody style={{ minHeight: '400px', maxHeight: '500px' }}>
          {error && (
            <Alert color="danger" className="mb-3">
              {error}
            </Alert>
          )}

          {/* Chat History */}
          <div className="chat-history mb-3" style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {chatHistory.length === 0 ? (
              <div className="text-center text-muted py-5">
                <i className="bi bi-chat-dots" style={{ fontSize: '3rem' }}></i>
                <p className="mt-3">
                  <Translate contentKey="langleague.student.learning.aiTutor.grammarPromptPlaceholder">
                    Ask anything about this grammar topic...
                  </Translate>
                </p>
              </div>
            ) : (
              chatHistory.map((message, index) => (
                <div key={index} className={`mb-3 p-3 rounded ${message.role === 'user' ? 'bg-primary text-white ms-5' : 'bg-light me-5'}`}>
                  <div className="d-flex align-items-start">
                    <i className={`bi ${message.role === 'user' ? 'bi-person-fill' : 'bi-robot'} me-2`}></i>
                    <div className="flex-grow-1">
                      {message.role === 'model' ? <ReactMarkdown>{message.parts}</ReactMarkdown> : <p className="mb-0">{message.parts}</p>}
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                  <span className="visually-hidden">Thinking...</span>
                </div>
                <span className="text-muted">
                  <Translate contentKey="langleague.student.learning.aiTutor.thinking">Thinking...</Translate>
                </span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <Form onSubmit={handleSendMessage}>
            <div className="d-flex gap-2">
              <Input
                type="text"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder={translate('langleague.student.learning.aiTutor.grammarPromptPlaceholder')}
                disabled={loading}
                className="flex-grow-1"
              />
              <Button color="primary" type="submit" disabled={!userInput.trim() || loading}>
                <i className="bi bi-send-fill"></i>
              </Button>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter className="justify-content-between">
          <div className="d-flex gap-2">
            <Button color="link" className="text-muted p-0 text-decoration-none" onClick={handleChangeKey} size="sm">
              <i className="bi bi-gear-fill me-1"></i>
              <Translate contentKey="langleague.student.learning.aiTutor.changeKey">Change Key</Translate>
            </Button>
            {chatHistory.length > 0 && (
              <Button color="link" className="text-danger p-0 text-decoration-none" onClick={handleClearChat} size="sm">
                <i className="bi bi-trash-fill me-1"></i>
                <Translate contentKey="langleague.student.learning.aiTutor.grammarClear">Clear Chat</Translate>
              </Button>
            )}
          </div>
          <Button color="secondary" onClick={toggleChatModal}>
            <Translate contentKey="langleague.student.learning.aiTutor.close">Close</Translate>
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AiGrammarTutorButton;
