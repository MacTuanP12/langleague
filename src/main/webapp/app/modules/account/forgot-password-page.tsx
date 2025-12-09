import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MailOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAppDispatch } from 'app/config/store';
import { requestPasswordReset } from 'app/shared/services/account.service';
import './forgot-password.scss'; // Đảm bảo tên file SCSS khớp với file bạn lưu

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const { t } = useTranslation('password');
  const [form] = Form.useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Gọi API thực tế để yêu cầu đặt lại mật khẩu
      await dispatch(requestPasswordReset(values.email)).unwrap();
      message.success(t('forgotPassword.emailSent'));
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
      const errorMsg = error?.message || t('forgotPassword.error');
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // --- TRẠNG THÁI THÀNH CÔNG (Sau khi gửi mail) ---
  if (isSubmitted) {
    return (
      <div className="forgot-password-container">
        {/* Đã xóa LanguageSwitch ở đây */}
        <div className="forgot-password-card success-card">
          <div className="success-icon">
            <CheckCircleOutlined />
          </div>
          <Title level={2} className="success-title">
            {t('forgotPassword.checkEmail')}
          </Title>
          <Text className="success-message">{t('forgotPassword.checkEmailMessage')}</Text>
          <Button type="primary" size="large" block className="return-button" onClick={() => navigate('/login')}>
            {t('forgotPassword.returnToLogin')}
          </Button>
        </div>
      </div>
    );
  }

  // --- FORM NHẬP EMAIL ---
  return (
    <div className="forgot-password-container">
      {/* Đã xóa LanguageSwitch ở đây */}
      <div className="forgot-password-card">
        <div className="card-header">
          <div className="icon-wrapper">
            <MailOutlined />
          </div>
          <Title level={2} className="card-title">
            {t('forgotPassword.title')}
          </Title>
          <Text className="card-description">{t('forgotPassword.description')}</Text>
        </div>

        <Form form={form} onFinish={onFinish} layout="vertical" className="forgot-password-form">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t('forgotPassword.validation.emailRequired') },
              { type: 'email', message: t('forgotPassword.validation.emailInvalid') },
            ]}
          >
            <Input prefix={<MailOutlined className="input-icon" />} placeholder={t('forgotPassword.email')} size="large" />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <Button type="primary" htmlType="submit" block size="large" loading={loading} className="submit-button">
              {loading ? t('forgotPassword.sending') : t('forgotPassword.sendLink')}
            </Button>
          </Form.Item>

          <div className="back-link">
            <Link to="/login">
              <ArrowLeftOutlined /> {t('forgotPassword.backToLogin')}
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
