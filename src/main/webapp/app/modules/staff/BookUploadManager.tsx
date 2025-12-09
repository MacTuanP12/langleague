import React, { useState, useEffect } from 'react';
import { Card, Upload, message, Typography, Space, List, Alert, Tag, Button, Modal, Spin } from 'antd';
import {
  UploadOutlined,
  InboxOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { uploadBook, getMyUploads, retryUpload, BookUploadDTO } from 'app/shared/services/book-upload.service';

const { Text } = Typography;
const { Dragger } = Upload;

const BookUploadManager: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState<BookUploadDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState<BookUploadDTO | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    loadUploads();
    // Auto-refresh every 10 seconds to check processing status
    const interval = setInterval(loadUploads, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadUploads = async () => {
    try {
      setLoading(true);
      const response = await getMyUploads();
      setUploads(response.data);
    } catch (error) {
      console.error('Failed to load uploads:', error);
      message.error('Failed to load upload history');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const response = await uploadBook(file);
      message.success(`${file.name} uploaded successfully! Processing started...`);
      setUploads(prev => [response.data, ...prev]);
      return true;
    } catch (error: any) {
      console.error('Upload error:', error);
      message.error(error.response?.data?.message || `Failed to upload ${file.name}`);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleRetry = async (uploadId: number) => {
    try {
      await retryUpload(uploadId);
      message.success('Upload queued for retry');
      loadUploads();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to retry upload');
    }
  };

  const showDetails = (upload: BookUploadDTO) => {
    setSelectedUpload(upload);
    setDetailModalVisible(true);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf,.docx,.doc,.txt',
    beforeUpload(file) {
      const isValidType = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain',
      ].includes(file.type);

      if (!isValidType) {
        message.error('You can only upload PDF, DOCX, DOC, or TXT files!');
        return false;
      }

      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error('File must be smaller than 50MB!');
        return false;
      }

      handleUpload(file);
      return false;
    },
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'default', icon: <SyncOutlined spin />, text: 'Pending' },
      PROCESSING: { color: 'processing', icon: <SyncOutlined spin />, text: 'Processing' },
      COMPLETED: { color: 'success', icon: <CheckCircleOutlined />, text: 'Completed' },
      FAILED: { color: 'error', icon: <CloseCircleOutlined />, text: 'Failed' },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <Tag icon={config.icon} color={config.color}>
        {config.text}
      </Tag>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Upload Section */}
      <Card
        title={
          <Space>
            <UploadOutlined />
            <span>Upload Book Document</span>
          </Space>
        }
        style={{ marginBottom: '24px' }}
      >
        <Alert
          message="Supported Formats"
          description="Upload PDF, DOCX, DOC, or TXT files. Our AI chatbot will extract book information, chapters, and exercises automatically."
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />

        <Dragger {...uploadProps} disabled={uploading}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for PDF, DOCX, DOC, TXT files up to 50MB. The system will automatically extract book content using AI.
          </p>
        </Dragger>
      </Card>

      {/* Upload History Section */}
      <Card
        title={
          <Space>
            <FileTextOutlined />
            <span>Upload History</span>
            <Button size="small" onClick={loadUploads} loading={loading} icon={<SyncOutlined />}>
              Refresh
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <List
            dataSource={uploads}
            locale={{ emptyText: 'No uploads yet' }}
            renderItem={upload => (
              <List.Item
                actions={[
                  <Button key="details" type="link" icon={<EyeOutlined />} onClick={() => showDetails(upload)}>
                    Details
                  </Button>,
                  upload.status === 'FAILED' && (
                    <Button key="retry" type="link" danger icon={<SyncOutlined />} onClick={() => handleRetry(upload.id)}>
                      Retry
                    </Button>
                  ),
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <FileTextOutlined />
                      <Text strong>{upload.originalFileName}</Text>
                      {getStatusTag(upload.status)}
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Text type="secondary">Uploaded: {formatDate(upload.uploadedAt)}</Text>
                      {upload.processedAt && <Text type="secondary">Processed: {formatDate(upload.processedAt)}</Text>}
                      {upload.createdBookTitle && (
                        <Text type="success">
                          <CheckCircleOutlined /> Created book: <strong>{upload.createdBookTitle}</strong>
                        </Text>
                      )}
                      {upload.errorMessage && <Text type="danger">{upload.errorMessage}</Text>}
                      {upload.retryCount > 0 && <Text type="warning">Retry count: {upload.retryCount}</Text>}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Spin>
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Upload Details"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>,
          selectedUpload?.status === 'FAILED' && (
            <Button
              key="retry"
              type="primary"
              danger
              icon={<SyncOutlined />}
              onClick={() => {
                handleRetry(selectedUpload.id);
                setDetailModalVisible(false);
              }}
            >
              Retry
            </Button>
          ),
        ].filter(Boolean)}
        width={700}
      >
        {selectedUpload && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div>
              <Text strong>File Name:</Text>
              <br />
              <Text>{selectedUpload.originalFileName}</Text>
            </div>

            <div>
              <Text strong>Status:</Text>
              <br />
              {getStatusTag(selectedUpload.status)}
            </div>

            <div>
              <Text strong>Uploaded At:</Text>
              <br />
              <Text>{formatDate(selectedUpload.uploadedAt)}</Text>
            </div>

            {selectedUpload.processedAt && (
              <div>
                <Text strong>Processed At:</Text>
                <br />
                <Text>{formatDate(selectedUpload.processedAt)}</Text>
              </div>
            )}

            {selectedUpload.createdBookTitle && (
              <div>
                <Text strong>Created Book:</Text>
                <br />
                <Text type="success">{selectedUpload.createdBookTitle}</Text>
              </div>
            )}

            {selectedUpload.errorMessage && <Alert message="Error" description={selectedUpload.errorMessage} type="error" showIcon />}

            {selectedUpload.chatbotResponse && (
              <div>
                <Text strong>Chatbot Response:</Text>
                <br />
                <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', overflow: 'auto', maxHeight: '300px' }}>
                  {JSON.stringify(JSON.parse(selectedUpload.chatbotResponse), null, 2)}
                </pre>
              </div>
            )}
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default BookUploadManager;
