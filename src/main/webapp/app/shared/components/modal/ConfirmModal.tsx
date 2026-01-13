import React, { useEffect, useRef, useState } from 'react';
import { Translate } from 'react-jhipster';
import './ConfirmModal.scss';

export interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isI18nKey?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isI18nKey = false,
  variant = 'warning',
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and keyboard handler
  useEffect(() => {
    if (!isOpen) return;

    // Focus confirm button when modal opens
    confirmButtonRef.current?.focus();

    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isConfirming) {
        onCancel();
      }
    };

    // Handle Tab key for focus trap
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusableElements = [cancelButtonRef.current, confirmButtonRef.current].filter(Boolean);
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
    };
  }, [isOpen, onCancel, isConfirming]);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
      // Only close on success
      onCancel();
    } catch (error) {
      // Don't close on error - let parent handle it
      console.error('Confirm action failed:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isConfirming) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  const variantIcons = {
    danger: 'bi-exclamation-triangle-fill',
    warning: 'bi-exclamation-circle-fill',
    info: 'bi-info-circle-fill',
  };

  return (
    <div className="confirm-modal-backdrop" onClick={handleBackdropClick} role="presentation">
      <div
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby="modal-description"
      >
        <div className={`modal-icon modal-icon-${variant}`} aria-hidden="true">
          <i className={`bi ${variantIcons[variant]}`}></i>
        </div>

        {title && (
          <h3 id="modal-title" className="modal-title">
            {isI18nKey ? <Translate contentKey={title}>{title}</Translate> : title}
          </h3>
        )}

        <p id="modal-description" className="modal-message">
          {isI18nKey ? <Translate contentKey={message}>{message}</Translate> : message}
        </p>

        <div className="modal-actions">
          <button
            ref={cancelButtonRef}
            type="button"
            className="btn btn-cancel"
            onClick={onCancel}
            disabled={isConfirming}
            aria-label={isI18nKey ? undefined : cancelText}
          >
            {isI18nKey ? <Translate contentKey={cancelText}>{cancelText}</Translate> : cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            className={`btn btn-confirm btn-${variant}`}
            onClick={handleConfirm}
            disabled={isConfirming}
            aria-label={isI18nKey ? undefined : confirmText}
          >
            {isConfirming ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <Translate contentKey="langleague.common.processing">Processing...</Translate>
              </>
            ) : isI18nKey ? (
              <Translate contentKey={confirmText}>{confirmText}</Translate>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
