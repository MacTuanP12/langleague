import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';

export interface ConfirmModalProps {
  title?: string;
  content: string;
  okText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  danger?: boolean;
}

const showConfirmModal = ({
  title = 'Confirm',
  content,
  okText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  danger = false,
}: ConfirmModalProps) => {
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    okText,
    cancelText,
    okButtonProps: danger ? { danger: true } : undefined,
    async onOk(): Promise<void> {
      await onConfirm();
    },
  });
};

export default showConfirmModal;
