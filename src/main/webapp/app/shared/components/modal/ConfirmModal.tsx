import React from 'react';
import { Translate } from 'react-jhipster';
import './ConfirmModal.scss';

export interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
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
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const variantIcons = {
    danger: 'bi-exclamation-triangle-fill',
    warning: 'bi-exclamation-circle-fill',
    info: 'bi-info-circle-fill',
  };

  return (
    <div className="confirm-modal-backdrop" onClick={handleBackdropClick}>
      <div className="confirm-modal" role="dialog" aria-modal="true">
        <div className={`modal-icon modal-icon-${variant}`}>
          <i className={`bi ${variantIcons[variant]}`}></i>
        </div>

        {title && (
          <h3 className="modal-title">
            {isI18nKey ? <Translate contentKey={title}>{title}</Translate> : title}
          </h3>
        )}

        <p className="modal-message">
          {isI18nKey ? <Translate contentKey={message}>{message}</Translate> : message}
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-cancel"
            onClick={onCancel}
          >
            {isI18nKey ? <Translate contentKey={cancelText}>{cancelText}</Translate> : cancelText}
          </button>
          <button
            type="button"
            className={`btn btn-confirm btn-${variant}`}
            onClick={onConfirm}
          >
            {isI18nKey ? <Translate contentKey={confirmText}>{confirmText}</Translate> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

