import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'app/shared/utils/useTranslation';
import { Card, Form, Input, Button, Switch, message, Typography, Space, Divider, Avatar, Upload, Modal, Tabs } from 'antd';
import {
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  LockOutlined,
  SaveOutlined,
  CameraOutlined,
  UploadOutlined,
  LinkOutlined,
  CopyOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import axios from 'axios';
import { TabPane } from 'reactstrap';

const { Title, Text } = Typography;

interface StaffSettings {
  name?: string;
  email?: string;
  notifications?: {
    emailNotifications?: boolean;
    newBookAlerts?: boolean;
    contentUpdates?: boolean;
  };
  profile?: {
    bio?: string;
    avatar?: string;
  };
}

const StaffSettings: React.FC = () => {
  const { t } = useTranslation('staff');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const pasteAreaRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<StaffSettings>({
    notifications: {
      emailNotifications: true,
      newBookAlerts: true,
      contentUpdates: true,
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await axios.get('/api/account');
      const accountData = response.data;

      setSettings({
        name: accountData.firstName + ' ' + accountData.lastName,
        email: accountData.email,
        notifications: {
          emailNotifications: true,
          newBookAlerts: true,
          contentUpdates: true,
        },
        profile: {
          bio: accountData.bio || '',
          avatar: accountData.imageUrl || '',
        },
      });

      setAvatarUrl(accountData.imageUrl || '');

      form.setFieldsValue({
        name: accountData.firstName + ' ' + accountData.lastName,
        email: accountData.email,
        bio: accountData.bio || '',
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveProfile = async (values: any) => {
    setLoading(true);
    try {
      await axios.post('/api/account', {
        firstName: values.name?.split(' ')[0] || '',
        lastName: values.name?.split(' ').slice(1).join(' ') || '',
        email: values.email,
        imageUrl: avatarUrl,
        displayName: values.name || '',
        bio: values.bio || '',
      });

      message.success(t('settings.profileSaved'));
    } catch (error: any) {
      console.error('Error saving profile:', error);
      message.error(error.response?.data?.message || t('settings.profileSaveFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = () => {
    setLoading(true);
    try {
      message.success(t('settings.notificationsSaved'));
    } catch (error) {
      message.error(t('settings.notificationsSaveFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error(t('settings.passwordMismatch'));
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/account/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success(t('settings.passwordChanged'));
      form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
    } catch (error: any) {
      console.error('Error changing password:', error);
      message.error(error.response?.data?.message || t('settings.passwordChangeFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarFromUrl = async () => {
    if (!imageUrlInput || !imageUrlInput.trim()) {
      message.error('Vui lòng nhập URL hình ảnh');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/files/upload/avatar-url', {
        imageUrl: imageUrlInput,
      });

      // Backend returns: { success: true, data: { imageUrl }, message: "..." }
      const newImageUrl = response.data.data?.imageUrl || response.data.imageUrl || imageUrlInput;

      // Update account with new avatar URL
      await axios.post('/api/account', {
        imageUrl: newImageUrl,
      });

      // Add cache-busting timestamp
      const urlWithTimestamp = `${newImageUrl}?t=${Date.now()}`;
      setAvatarUrl(urlWithTimestamp);
      message.success('Cập nhật ảnh đại diện thành công!');
      setAvatarModalVisible(false);
      setImageUrlInput('');
      setPastedImage(null);

      // Reload to show new avatar
      await loadSettings();
    } catch (error) {
      console.error('Error setting avatar from URL:', error);
      message.error('Không thể cập nhật ảnh từ URL');
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatarFile = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/files/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Backend returns: { success: true, data: { fileUrl, fileName }, message: "..." }
      const fileUrl = response.data.data?.fileUrl || response.data.fileUrl || response.data.url || '';

      if (fileUrl) {
        // Add cache-busting timestamp
        const urlWithTimestamp = `${fileUrl}?t=${Date.now()}`;
        setAvatarUrl(urlWithTimestamp);

        // Also update the account with new avatar
        await axios.post('/api/account', {
          imageUrl: fileUrl,
        });

        message.success('Tải ảnh thành công!');
        setAvatarModalVisible(false);

        // Reload to show new avatar
        await loadSettings();
      } else {
        throw new Error('No file URL returned from server');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      message.error('Không thể tải ảnh lên');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = event => {
            setPastedImage(event.target?.result as string);
          };
          reader.readAsDataURL(file);
          await uploadAvatarFile(file);
        }
        break;
      }
    }
  };

  const handlePasteAreaClick = () => {
    message.info('Nhấn Ctrl+V (hoặc Cmd+V) để paste ảnh đã copy');
    pasteAreaRef.current?.focus();
  };

  useEffect(() => {
    if (avatarModalVisible && activeTab === 'paste') {
      pasteAreaRef.current?.focus();
    }
  }, [avatarModalVisible, activeTab]);

  const uploadProps: UploadProps = {
    name: 'file',
    showUploadList: false,
    async beforeUpload(file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error(t('settings.imageOnly'));
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error(t('settings.imageTooLarge'));
        return false;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('/api/files/upload/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // API returns { success: true, data: { fileUrl, fileName }, message: "..." }
        const fileUrl = response.data.data?.fileUrl || response.data.fileUrl || response.data.url || '';

        if (fileUrl) {
          setAvatarUrl(fileUrl);

          // Update account with new avatar
          await axios.post('/api/account', {
            imageUrl: fileUrl,
          });

          message.success(t('settings.avatarUploaded'));

          // Reload settings to reflect change
          await loadSettings();
        } else {
          throw new Error('No file URL returned');
        }
      } catch (error) {
        console.error('Avatar upload error:', error);
        message.error(t('settings.avatarUploadFailed'));
      }

      return false;
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <SettingOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
        {t('settings.title')}
      </Title>

      {/* Profile Settings */}
      <Card
        title={
          <Space>
            <UserOutlined />
            <Text strong>{t('settings.profileSettings')}</Text>
          </Space>
        }
        style={{ marginBottom: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <div style={{ display: 'flex', marginBottom: '24px' }}>
          <div style={{ marginRight: '24px', textAlign: 'center' }}>
            <Avatar size={100} src={avatarUrl} icon={<UserOutlined />} />
            <Button icon={<CameraOutlined />} style={{ marginTop: '12px', width: '100px' }} onClick={() => setAvatarModalVisible(true)}>
              {t('settings.change')}
            </Button>
          </div>
          <div style={{ flex: 1 }}>
            <Form form={form} layout="vertical" onFinish={handleSaveProfile}>
              <Form.Item label={t('profile.fullName')} name="name" rules={[{ required: true, message: t('settings.nameRequired') }]}>
                <Input placeholder={t('settings.enterFullName')} />
              </Form.Item>
              <Form.Item
                label={t('profile.email')}
                name="email"
                rules={[{ required: true, type: 'email', message: t('settings.emailInvalid') }]}
              >
                <Input placeholder={t('settings.enterEmail')} disabled />
              </Form.Item>
              <Form.Item label={t('profile.bio')} name="bio">
                <Input.TextArea rows={3} placeholder={t('settings.tellAboutYourself')} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                  {t('settings.saveProfile')}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card
        title={
          <Space>
            <BellOutlined />
            <Text strong>{t('settings.notificationSettings')}</Text>
          </Space>
        }
        style={{ marginBottom: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>{t('settings.emailNotifications')}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.emailNotificationsDesc')}
              </Text>
            </div>
            <Switch
              checked={settings.notifications?.emailNotifications}
              onChange={checked =>
                setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, emailNotifications: checked },
                }))
              }
            />
          </div>
          <Divider style={{ margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>{t('settings.newBookAlerts')}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.newBookAlertsDesc')}
              </Text>
            </div>
            <Switch
              checked={settings.notifications?.newBookAlerts}
              onChange={checked =>
                setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, newBookAlerts: checked },
                }))
              }
            />
          </div>
          <Divider style={{ margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>{t('settings.contentUpdates')}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.contentUpdatesDesc')}
              </Text>
            </div>
            <Switch
              checked={settings.notifications?.contentUpdates}
              onChange={checked =>
                setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, contentUpdates: checked },
                }))
              }
            />
          </div>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveNotifications} loading={loading} style={{ marginTop: '12px' }}>
            {t('settings.saveNotifications')}
          </Button>
        </Space>
      </Card>

      {/* Security Settings */}
      <Card
        title={
          <Space>
            <LockOutlined />
            <Text strong>{t('settings.securitySettings')}</Text>
          </Space>
        }
        style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <Form layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            label={t('settings.currentPassword')}
            name="currentPassword"
            rules={[{ required: true, message: t('settings.currentPasswordRequired') }]}
          >
            <Input.Password placeholder={t('settings.enterCurrentPassword')} />
          </Form.Item>
          <Form.Item
            label={t('settings.newPassword')}
            name="newPassword"
            rules={[{ required: true, min: 6, message: t('settings.passwordMinLength') }]}
          >
            <Input.Password placeholder={t('settings.enterNewPassword')} />
          </Form.Item>
          <Form.Item
            label={t('settings.confirmPassword')}
            name="confirmPassword"
            rules={[{ required: true, message: t('settings.confirmPasswordRequired') }]}
          >
            <Input.Password placeholder={t('settings.confirmNewPassword')} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
              {t('settings.changePassword')}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Avatar Upload Modal */}
      <Modal
        title={
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            Cập nhật ảnh đại diện
          </div>
        }
        open={avatarModalVisible}
        onCancel={() => {
          setAvatarModalVisible(false);
          setImageUrlInput('');
          setPastedImage(null);
          setActiveTab('upload');
        }}
        footer={null}
        width={600}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginTop: 16 }}>
          {/* Tab 1: Upload from device */}
          <TabPane
            tab={
              <span>
                <UploadOutlined />
                Tải từ thiết bị
              </span>
            }
            key="upload"
          >
            <div style={{ padding: '24px 0', textAlign: 'center' }}>
              <Upload.Dragger accept="image/*" showUploadList={false} beforeUpload={uploadProps.beforeUpload} disabled={loading}>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: 16 }}>
                  Click hoặc kéo thả ảnh vào đây
                </p>
                <p className="ant-upload-hint" style={{ color: '#999' }}>
                  Hỗ trợ: JPG, PNG, WEBP, GIF (tối đa 10MB)
                </p>
              </Upload.Dragger>
            </div>
          </TabPane>

          {/* Tab 2: From URL */}
          <TabPane
            tab={
              <span>
                <LinkOutlined />
                Từ URL
              </span>
            }
            key="url"
          >
            <div style={{ padding: '24px 0' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                  <Text strong style={{ marginBottom: 8, display: 'block' }}>
                    Nhập URL hình ảnh
                  </Text>
                  <Input
                    size="large"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrlInput}
                    onChange={e => setImageUrlInput(e.target.value)}
                    onPressEnter={handleAvatarFromUrl}
                    disabled={loading}
                    prefix={<LinkOutlined style={{ color: '#999' }} />}
                  />
                  <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                    Nhập URL của hình ảnh từ internet
                  </Text>
                </div>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleAvatarFromUrl}
                  loading={loading}
                  disabled={!imageUrlInput}
                  block
                  style={{ borderRadius: 8 }}
                >
                  Cập nhật
                </Button>
              </Space>
            </div>
          </TabPane>

          {/* Tab 3: Paste from clipboard */}
          <TabPane
            tab={
              <span>
                <CopyOutlined />
                Paste ảnh
              </span>
            }
            key="paste"
          >
            <div style={{ padding: '24px 0' }}>
              <div
                ref={pasteAreaRef}
                tabIndex={0}
                onPaste={handlePaste}
                onClick={handlePasteAreaClick}
                style={{
                  border: '2px dashed #d9d9d9',
                  borderRadius: 8,
                  padding: 40,
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: pastedImage ? '#f0f5ff' : '#fafafa',
                  outline: 'none',
                  transition: 'all 0.3s',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#1890ff';
                  e.currentTarget.style.background = '#f0f5ff';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#d9d9d9';
                  if (!pastedImage) e.currentTarget.style.background = '#fafafa';
                }}
              >
                {pastedImage ? (
                  <Space direction="vertical" size="large">
                    <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                    <img src={pastedImage} alt="Pasted" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
                    <Text type="success" strong>
                      Ảnh đã được paste thành công!
                    </Text>
                  </Space>
                ) : (
                  <Space direction="vertical" size="large">
                    <CopyOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                    <div>
                      <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 8 }}>
                        Paste ảnh đã copy
                      </Text>
                      <Text type="secondary" style={{ fontSize: 14 }}>
                        Copy ảnh từ bất kỳ đâu và nhấn Ctrl+V (Cmd+V trên Mac)
                      </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic' }}>
                      Click vào đây và nhấn Ctrl+V
                    </Text>
                  </Space>
                )}
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default StaffSettings;
