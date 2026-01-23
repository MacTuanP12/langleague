import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup, Alert } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { API_PROVIDER_LINKS } from 'app/config/storage-keys';

export interface ApiKeySetupModalProps {
  isOpen: boolean;
  onToggle: () => void;
  onSave: (key: string) => void;
  error?: string | null;
  initialKey?: string;
  title?: string;
  description?: string;
  showProviderLinks?: boolean;
}

/**
 * Validates Gemini API Key format
 * Format: AIza + 35 characters (alphanumeric, underscore, hyphen)
 */
const validateGeminiKey = (key: string): boolean => {
  const GEMINI_KEY_REGEX = /^AIza[0-9A-Za-z_-]{35}$/;
  return GEMINI_KEY_REGEX.test(key);
};

/**
 * Shared component for API Key setup
 * Used across student and teacher features
 */
export const ApiKeySetupModal: React.FC<ApiKeySetupModalProps> = ({
  isOpen,
  onToggle,
  onSave,
  error: externalError,
  initialKey = '',
  title,
  description,
  showProviderLinks = true,
}) => {
  const [tempKey, setTempKey] = useState(initialKey);
  const [showKey, setShowKey] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTempKey(initialKey);
      setValidationError(null);
    }
  }, [isOpen, initialKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedKey = tempKey.trim();

    if (!trimmedKey) {
      setValidationError(translate('langleague.apiKey.errors.empty'));
      return;
    }

    // Validate key format
    const isGeminiValid = validateGeminiKey(trimmedKey);

    if (!isGeminiValid) {
      setValidationError(translate('langleague.apiKey.errors.invalidFormat'));
      return;
    }

    setValidationError(null);
    onSave(trimmedKey);
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempKey(e.target.value);
    setValidationError(null);
  };

  const displayError = externalError || validationError;

  return (
    <Modal isOpen={isOpen} toggle={onToggle} centered>
      <ModalHeader toggle={onToggle}>
        <i className="bi bi-key-fill me-2 text-warning"></i>
        {title || <Translate contentKey="langleague.apiKey.setupTitle">Setup AI API Key</Translate>}
      </ModalHeader>
      <ModalBody>
        <p className="text-muted small">
          {description || (
            <Translate contentKey="langleague.apiKey.setupDescription">
              To use AI features, you need to provide your own API Key (Google Gemini). It&apos;s free and we only store it in your browser.
            </Translate>
          )}
        </p>

        {displayError && (
          <Alert color="danger" className="py-2 small">
            {displayError}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="apiKey" className="fw-bold small">
              <Translate contentKey="langleague.apiKey.label">API Key</Translate>
            </Label>
            <div className="input-group">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={tempKey}
                onChange={handleKeyChange}
                placeholder={translate('langleague.apiKey.placeholder')}
                autoFocus
                className="form-control"
              />
              <Button
                type="button"
                color="secondary"
                outline
                onClick={() => setShowKey(!showKey)}
                title={showKey ? translate('langleague.apiKey.hideKey') : translate('langleague.apiKey.showKey')}
              >
                <i className={`bi ${showKey ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </Button>
            </div>
            <small className="text-muted form-text">
              <Translate contentKey="langleague.apiKey.formatHint">Supported formats: Google Gemini (AIza...)</Translate>
            </small>
          </FormGroup>

          <div className="mt-3 mb-3">
            <div className="d-flex align-items-center mb-1">
              <span className="me-2">🔐</span>
              <small className="text-muted">
                <Translate contentKey="langleague.apiKey.security.browserOnly">
                  API key của bạn chỉ được sử dụng trong trình duyệt
                </Translate>
              </small>
            </div>
            <div className="d-flex align-items-center mb-1">
              <span className="me-2">❌</span>
              <small className="text-muted">
                <Translate contentKey="langleague.apiKey.security.noStorage">Chúng tôi KHÔNG lưu key</Translate>
              </small>
            </div>
            <div className="d-flex align-items-center">
              <span className="me-2">⚠️</span>
              <small className="text-muted">
                <Translate contentKey="langleague.apiKey.security.noShare">Không chia sẻ key với người khác</Translate>
              </small>
            </div>
          </div>

          {showProviderLinks && (
            <div className="mt-3">
              <p className="small fw-bold mb-2">
                <Translate contentKey="langleague.apiKey.getKeyTitle">Get your free API key:</Translate>
              </p>
              <div className="d-flex flex-column gap-2">
                <a
                  href={API_PROVIDER_LINKS.GOOGLE_GEMINI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-between"
                >
                  <span>
                    <i className="bi bi-google me-2"></i>
                    <Translate contentKey="langleague.apiKey.providers.gemini">Google Gemini API Key</Translate>
                  </span>
                  <i className="bi bi-box-arrow-up-right"></i>
                </a>
              </div>
              <Alert color="info" className="mt-3 small mb-0">
                <strong>
                  <Translate contentKey="langleague.apiKey.recommendation">💡 Recommendation:</Translate>
                </strong>
                <p className="mb-0 mt-1">
                  <Translate contentKey="langleague.apiKey.recommendationText">
                    We recommend Google Gemini for better Vietnamese language support and it&apos;s completely free!
                  </Translate>
                </p>
              </Alert>
            </div>
          )}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onToggle} size="sm">
          <Translate contentKey="langleague.apiKey.cancel">Cancel</Translate>
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={!tempKey.trim()} size="sm">
          <i className="bi bi-check-lg me-1"></i>
          <Translate contentKey="langleague.apiKey.saveButton">Save & Continue</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ApiKeySetupModal;
