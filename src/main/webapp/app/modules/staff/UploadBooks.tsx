import React, { useState } from 'react';
import { Card, Upload, message, Typography, Space, List, Progress, Alert, Tag, Radio, Form, Input, Select, Button, Divider } from 'antd';
import {
  UploadOutlined,
  InboxOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RobotOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;
const { Option } = Select;
const { TextArea } = Input;

interface UploadedFile {
  name: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  message?: string;
}

const UploadBooks: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadMode, setUploadMode] = useState<'ai' | 'manual'>('manual');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form] = Form.useForm();

  // Handle manual upload with metadata
  const handleUploadManual = async (values: any) => {
    if (!selectedFile) {
      message.error('Vui lòng chọn file trước!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', values.title);
    formData.append('level', values.level);
    if (values.description) formData.append('description', values.description);
    if (values.thumbnailUrl) formData.append('thumbnailUrl', values.thumbnailUrl);

    const fileInfo: UploadedFile = {
      name: selectedFile.name,
      status: 'uploading',
      progress: 0,
    };

    setUploadedFiles(prev => [...prev, fileInfo]);

    try {
      const response = await axios.post('/api/staff/book-uploads/manual', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress(progressEvent) {
          const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
          setUploadedFiles(prev => prev.map(f => (f.name === selectedFile.name ? { ...f, progress } : f)));
        },
      });

      setUploadedFiles(prev =>
        prev.map(f =>
          f.name === selectedFile.name ? { ...f, status: 'success', progress: 100, message: 'Sách đã được tạo thành công!' } : f,
        ),
      );
      message.success(`Sách "${values.title}" đã được tạo thành công!`);

      // Reset form
      form.resetFields();
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadedFiles(prev =>
        prev.map(f =>
          f.name === selectedFile.name
            ? {
                ...f,
                status: 'error',
                progress: 0,
                message: error.response?.data?.message || 'Upload thất bại',
              }
            : f,
        ),
      );
      message.error(`Không thể tạo sách: ${error.response?.data?.message || 'Lỗi không xác định'}`);
    }
  };

  // Handle AI upload
  const handleUploadAI = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const fileInfo: UploadedFile = {
      name: file.name,
      status: 'uploading',
      progress: 0,
    };

    setUploadedFiles(prev => [...prev, fileInfo]);

    try {
      const response = await axios.post('/api/staff/book-uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress(progressEvent) {
          const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
          setUploadedFiles(prev => prev.map(f => (f.name === file.name ? { ...f, progress } : f)));
        },
      });

      setUploadedFiles(prev =>
        prev.map(f =>
          f.name === file.name
            ? { ...f, status: 'success', progress: 100, message: 'AI đang phân tích... Vui lòng kiểm tra trạng thái sau.' }
            : f,
        ),
      );
      message.success(`${file.name} đã được tải lên! AI đang xử lý...`);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadedFiles(prev =>
        prev.map(f =>
          f.name === file.name
            ? {
                ...f,
                status: 'error',
                progress: 0,
                message: error.response?.data?.message || 'Upload thất bại',
              }
            : f,
        ),
      );
      message.error(`Không thể tải lên ${file.name}`);
    }
  };

  const uploadPropsAI: UploadProps = {
    name: 'file',
    multiple: true,
    accept: '.pdf,.epub,.txt,.docx',
    beforeUpload(file) {
      const isValidType = [
        'application/pdf',
        'application/epub+zip',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ].includes(file.type);
      if (!isValidType) {
        message.error('Chỉ hỗ trợ file PDF, EPUB, TXT, hoặc DOCX!');
        return false;
      }
      const isLt200M = file.size / 1024 / 1024 < 200;
      if (!isLt200M) {
        message.error('File phải nhỏ hơn 200MB!');
        return false;
      }
      handleUploadAI(file);
      return false;
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        style={{
          marginBottom: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={2}>
              <UploadOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
              Tải Sách Lên
            </Title>
            <Paragraph type="secondary">Tải file sách để tạo nội dung học tập cho học viên.</Paragraph>
          </div>

          <Alert
            message="Định dạng file được hỗ trợ"
            description={
              <div>
                <Text>Bạn có thể tải lên các loại file sau:</Text>
                <ul style={{ marginTop: '8px', marginBottom: 0 }}>
                  <li>
                    <Tag color="blue">PDF</Tag> - Portable Document Format
                  </li>
                  <li>
                    <Tag color="green">EPUB</Tag> - Electronic Publication
                  </li>
                  <li>
                    <Tag color="orange">TXT</Tag> - Plain Text
                  </li>
                  <li>
                    <Tag color="purple">DOCX</Tag> - Microsoft Word Document
                  </li>
                </ul>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Kích thước tối đa: 200MB mỗi file
                </Text>
              </div>
            }
            type="info"
            showIcon
          />

          <Divider>Chọn phương thức tải lên</Divider>

          <Radio.Group value={uploadMode} onChange={e => setUploadMode(e.target.value)} style={{ width: '100%', marginBottom: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value="manual" style={{ fontSize: 16 }}>
                <Space>
                  <EditOutlined style={{ color: '#52c41a' }} />
                  <Text strong>✍️ Nhập thông tin thủ công (Nhanh - Đề xuất)</Text>
                </Space>
                <div style={{ marginLeft: 24, marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Tải file lên và nhập thông tin sách. Bạn có thể thêm chapters và exercises sau.
                  </Text>
                </div>
              </Radio>
              <Radio value="ai" style={{ fontSize: 16 }}>
                <Space>
                  <RobotOutlined style={{ color: '#1890ff' }} />
                  <Text strong>🤖 AI tự động phân tích (Beta - Có thể lâu hoặc lỗi)</Text>
                </Space>
                <div style={{ marginLeft: 24, marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    AI sẽ tự động phân tích file và tạo sách, chapters, exercises. Thời gian xử lý: 30-120 giây.
                  </Text>
                  <Alert
                    message="⚠️ Tính năng AI đang thử nghiệm và có thể thất bại nếu chatbot không chạy"
                    type="warning"
                    showIcon
                    style={{ marginTop: 8, fontSize: 12 }}
                  />
                </div>
              </Radio>
            </Space>
          </Radio.Group>

          {uploadMode === 'manual' ? (
            <Card title="📝 Nhập thông tin sách" style={{ marginBottom: 16, border: '1px solid #52c41a' }}>
              <Form form={form} layout="vertical" onFinish={handleUploadManual}>
                <Form.Item label="Chọn file sách" required>
                  <Upload
                    accept=".pdf,.epub,.txt,.docx"
                    beforeUpload={file => {
                      const isValidType = [
                        'application/pdf',
                        'application/epub+zip',
                        'text/plain',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                      ].includes(file.type);
                      if (!isValidType) {
                        message.error('Chỉ hỗ trợ PDF, EPUB, TXT, DOCX!');
                        return false;
                      }
                      const isLt200M = file.size / 1024 / 1024 < 200;
                      if (!isLt200M) {
                        message.error('File phải nhỏ hơn 200MB!');
                        return false;
                      }
                      setSelectedFile(file);
                      message.success(`Đã chọn file: ${file.name}`);
                      return false;
                    }}
                    fileList={selectedFile ? [{ uid: '1', name: selectedFile.name, status: 'done' }] : []}
                    onRemove={() => setSelectedFile(null)}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Chọn file</Button>
                  </Upload>
                </Form.Item>

                <Form.Item label="Tên sách" name="title" rules={[{ required: true, message: 'Vui lòng nhập tên sách' }]}>
                  <Input placeholder="Ví dụ: Tiếng Hàn Tổng Hợp 1" size="large" />
                </Form.Item>

                <Form.Item label="Cấp độ" name="level" rules={[{ required: true, message: 'Vui lòng chọn cấp độ' }]}>
                  <Select placeholder="Chọn cấp độ" size="large">
                    <Option value="BEGINNER">🟢 Beginner (Sơ cấp)</Option>
                    <Option value="INTERMEDIATE">🟡 Intermediate (Trung cấp)</Option>
                    <Option value="ADVANCED">🔴 Advanced (Cao cấp)</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Mô tả" name="description">
                  <TextArea rows={4} placeholder="Mô tả về sách, nội dung chính, đối tượng học viên..." maxLength={5000} showCount />
                </Form.Item>

                <Form.Item label="URL ảnh bìa (tùy chọn)" name="thumbnailUrl">
                  <Input placeholder="https://example.com/cover.jpg" size="large" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    disabled={!selectedFile}
                    loading={uploadedFiles.some(f => f.status === 'uploading')}
                  >
                    Tạo sách
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          ) : (
            <Dragger {...uploadPropsAI} style={{ padding: '40px' }}>
              <p className="ant-upload-drag-icon">
                <RobotOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text" style={{ fontSize: '18px', fontWeight: 500 }}>
                🤖 AI sẽ tự động phân tích file của bạn
              </p>
              <p className="ant-upload-hint" style={{ fontSize: '14px' }}>
                Click hoặc kéo thả file vào đây. AI sẽ xử lý trong 30-120 giây.
              </p>
            </Dragger>
          )}
        </Space>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card
          title={
            <Space>
              <FileTextOutlined />
              <Text strong>Lịch sử tải lên</Text>
            </Space>
          }
          style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        >
          <List
            dataSource={uploadedFiles}
            renderItem={item => (
              <List.Item>
                <div style={{ width: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        {item.status === 'success' && <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />}
                        {item.status === 'error' && <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />}
                        {item.status === 'uploading' && <UploadOutlined style={{ color: '#1890ff', fontSize: '20px' }} />}
                        <Text strong>{item.name}</Text>
                      </Space>
                      <Tag color={item.status === 'success' ? 'success' : item.status === 'error' ? 'error' : 'processing'}>
                        {item.status === 'success' ? 'Thành công' : item.status === 'error' ? 'Thất bại' : 'Đang tải'}
                      </Tag>
                    </div>
                    {item.status === 'uploading' && <Progress percent={item.progress} status="active" />}
                    {item.message && (
                      <Text type={item.status === 'error' ? 'danger' : 'secondary'} style={{ fontSize: '12px' }}>
                        {item.message}
                      </Text>
                    )}
                  </Space>
                </div>
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default UploadBooks;
