import React, { useState } from 'react';
import { Steps, Button, Card, Form, Input, message, Space } from 'antd';
import { BookOutlined, FormOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { StepsProps } from 'antd';

const ChapterStepperEditor: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams<{ chapterId: string }>();

  // Step 1: Thông tin cơ bản
  const BasicInfoStep = () => (
    <div className="max-w-lg mx-auto py-8">
      <h3 className="mb-4 font-bold text-lg">Bước 1: Thông tin Chương</h3>
      <Form.Item name="title" label="Tên chương" rules={[{ required: true, message: 'Vui lòng nhập tên chương' }]}>
        <Input placeholder="Ví dụ: Bài 1 - Xin chào" size="large" />
      </Form.Item>
      <Form.Item name="description" label="Mô tả">
        <Input.TextArea rows={4} placeholder="Mô tả nội dung bài học..." />
      </Form.Item>
      <Form.Item name="orderIndex" label="Thứ tự" rules={[{ required: true }]}>
        <Input type="number" placeholder="1, 2, 3..." size="large" />
      </Form.Item>
    </div>
  );

  // Step 2: Soạn nội dung (Dùng Editor hoặc List)
  const ContentStep = () => (
    <div className="py-8">
      <h3 className="mb-4 font-bold text-lg">Bước 2: Nội dung Từ vựng & Ngữ pháp</h3>
      {/* Component quản lý list từ vựng (Bạn có thể tách riêng) */}
      <div className="border border-dashed p-8 text-center rounded bg-gray-50">
        <Space direction="vertical" size="large">
          <div>
            <BookOutlined style={{ fontSize: 48, color: '#667eea' }} />
            <p className="mt-4 text-gray-600">Danh sách từ vựng sẽ được quản lý ở đây</p>
          </div>
          <Button
            type="primary"
            icon={<BookOutlined />}
            onClick={() => {
              message.info('Chuyển đến trang quản lý từ vựng');
              // Navigate to word management
            }}
          >
            Quản lý Từ vựng
          </Button>
          <Button
            type="default"
            onClick={() => {
              message.info('Chuyển đến trang quản lý ngữ pháp');
              // Navigate to grammar management
            }}
          >
            Quản lý Ngữ pháp
          </Button>
        </Space>
      </div>
    </div>
  );

  // Step 3: Bài tập
  const ExerciseStep = () => (
    <div className="py-8">
      <h3 className="mb-4 font-bold text-lg">Bước 3: Tạo Bài tập (Exercises)</h3>
      {/* Component Drag & Drop Exercise */}
      <div className="border border-dashed p-8 text-center rounded bg-gray-50">
        <Space direction="vertical" size="large">
          <div>
            <FormOutlined style={{ fontSize: 48, color: '#f093fb' }} />
            <p className="mt-4 text-gray-600">Danh sách bài tập sẽ được quản lý ở đây</p>
          </div>
          <Space wrap>
            <Button
              type="primary"
              icon={<FormOutlined />}
              onClick={() => {
                message.info('Thêm bài tập Viết');
              }}
            >
              Thêm bài tập Viết
            </Button>
            <Button
              type="default"
              onClick={() => {
                message.info('Thêm bài tập Nghe');
              }}
            >
              Thêm bài tập Nghe
            </Button>
            <Button
              type="default"
              onClick={() => {
                message.info('Thêm bài tập Đọc');
              }}
            >
              Thêm bài tập Đọc
            </Button>
            <Button
              type="default"
              onClick={() => {
                message.info('Thêm bài tập Nói');
              }}
            >
              Thêm bài tập Nói
            </Button>
          </Space>
        </Space>
      </div>
    </div>
  );

  // Step 4: Review & Publish
  const ReviewStep = () => (
    <div className="py-8 text-center">
      <CheckCircleOutlined style={{ fontSize: 80, color: '#52c41a' }} />
      <h3 className="mt-6 mb-4 font-bold text-2xl text-green-600">Sẵn sàng xuất bản!</h3>
      <p className="text-gray-600 mb-8">Chương học của bạn đã hoàn tất và sẵn sàng để xuất bản.</p>
      <Card className="max-w-md mx-auto text-left">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <strong>Tên chương:</strong> {form.getFieldValue('title') || '(Chưa nhập)'}
          </div>
          <div>
            <strong>Mô tả:</strong> {form.getFieldValue('description') || '(Chưa nhập)'}
          </div>
          <div>
            <strong>Thứ tự:</strong> {form.getFieldValue('orderIndex') || '(Chưa nhập)'}
          </div>
        </Space>
      </Card>
    </div>
  );

  const steps = [
    { title: 'Thông tin', icon: <FileTextOutlined />, content: <BasicInfoStep /> },
    { title: 'Nội dung', icon: <BookOutlined />, content: <ContentStep /> },
    { title: 'Bài tập', icon: <FormOutlined />, content: <ExerciseStep /> },
    { title: 'Hoàn tất', icon: <CheckCircleOutlined />, content: <ReviewStep /> },
  ];

  const stepsItems: StepsProps['items'] = steps.map(item => ({
    title: item.title,
    icon: item.icon,
  }));

  const next = () => {
    if (currentStep === 0) {
      form
        .validateFields()
        .then(() => {
          setCurrentStep(currentStep + 1);
        })
        .catch(() => message.error('Vui lòng điền đủ thông tin'));
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => setCurrentStep(currentStep - 1);

  const handlePublish = () => {
    message.success('Xuất bản chương thành công!');
    // Save to backend
    navigate(-1);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Soạn Chương Học</h2>
        <p className="text-gray-600 mt-2">Tạo nội dung chương học theo từng bước đơn giản</p>
      </div>

      <Steps current={currentStep} items={stepsItems} className="mb-8" />

      <Form form={form} layout="vertical">
        <div className="steps-content min-h-[300px]">{steps[currentStep].content}</div>
      </Form>

      <div className="steps-action flex justify-end gap-4 mt-8 pt-4 border-t">
        {currentStep > 0 && <Button onClick={prev}>Quay lại</Button>}
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Tiếp theo
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button type="primary" className="bg-green-600 border-green-600 hover:bg-green-700" onClick={handlePublish}>
            Xuất bản Chương
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChapterStepperEditor;
