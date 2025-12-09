import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card, Typography, Divider, message, Switch, Radio, Spin, Avatar, Upload, Modal } from 'antd';
import { UserOutlined, MailOutlined, BulbOutlined, LockOutlined, CameraOutlined, UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { setTheme, updateSystemTheme } from 'app/shared/reducers/theme.reducer';
import { setLocale } from 'app/shared/reducers/locale.reducer';
import axios from 'axios';
import type { UploadProps } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const Settings: React.FC = () => {
  const { t } = useTranslation('common');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [dailyNotifications, setDailyNotifications] = useState(true);
  const [appUserData, setAppUserData] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(state => state.theme.mode);
  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  // Listen to system theme changes for auto mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      dispatch(updateSystemTheme());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      setFetchLoading(true);
      try {
        const userResponse = await axios.get('/api/account');
        const userResult = userResponse.data;

        // Set avatar URL
        setAvatarUrl(userResult.imageUrl || '');

        try {
          const appUserResponse = await axios.get('/api/app-users/me');
          const appUserResult = appUserResponse.data;
          setAppUserData(appUserResult);
        } catch (appUserError) {
          console.log('AppUser not found, using default values');
        }

        // Set form values
        form.setFieldsValue({
          username: userResult.firstName + ' ' + userResult.lastName,
          email: userResult.email,
          language: currentLocale || userResult.langKey || 'vi',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        message.error('Không thể tải thông tin người dùng');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchUserData();
  }, [form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Split username into first and last name
      const nameParts = values.username.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Update locale in Redux store
      if (values.language && values.language !== currentLocale) {
        dispatch(setLocale(values.language));
      }

      // Update user account info
      const userUpdate = {
        firstName,
        lastName,
        email: values.email,
        langKey: values.language,
        imageUrl: avatarUrl, // Include avatar URL
      };

      await axios.post('/api/account', userUpdate);

      // Update app user profile and notification settings
      if (appUserData?.id) {
        await axios.put(`/api/app-users/${appUserData.id}`, {
          id: appUserData.id,
          displayName: values.username,
          notificationEnabled: enableNotifications,
          dailyReminderEnabled: dailyNotifications,
        });
      } else {
        // Create AppUser if doesn't exist
        try {
          await axios.post('/api/app-users', {
            displayName: values.username,
            notificationEnabled: enableNotifications,
            dailyReminderEnabled: dailyNotifications,
          });
        } catch (error) {
          console.log('Could not create AppUser, settings may not persist');
        }
      }

      message.success(currentLocale === 'vi' ? 'Cập nhật thông tin thành công!' : 'Settings updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      message.error(currentLocale === 'vi' ? 'Không thể cập nhật thông tin' : 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    showUploadList: false,
    async beforeUpload(file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error(currentLocale === 'vi' ? 'Chỉ hỗ trợ file ảnh!' : 'Only image files supported!');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error(currentLocale === 'vi' ? 'Ảnh phải nhỏ hơn 5MB!' : 'Image must be smaller than 5MB!');
        return false;
      }

      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('/api/files/upload/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const fileUrl = response.data.data?.fileUrl || response.data.fileUrl || '';

        if (fileUrl) {
          setAvatarUrl(fileUrl);

          // Update account with new avatar
          await axios.post('/api/account', {
            imageUrl: fileUrl,
          });

          message.success(currentLocale === 'vi' ? 'Tải ảnh thành công!' : 'Avatar uploaded successfully!');
          setAvatarModalVisible(false);
        }
      } catch (error) {
        console.error('Avatar upload error:', error);
        message.error(currentLocale === 'vi' ? 'Không thể tải ảnh lên' : 'Failed to upload avatar');
      } finally {
        setUploadingAvatar(false);
      }

      return false;
    },
  };

  if (fetchLoading) {
    return (
      <div style={{ padding: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '32px' }}>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        <Title level={3} style={{ color: '#667eea', marginBottom: 32 }}>
          {t('settings.title')}
        </Title>

        {/* Avatar Section */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Avatar size={120} src={avatarUrl} icon={<UserOutlined />} style={{ marginBottom: 16 }} />
          <div>
            <Button icon={<CameraOutlined />} onClick={() => setAvatarModalVisible(true)} style={{ borderRadius: 8 }}>
              {currentLocale === 'vi' ? 'Thay đổi ảnh đại diện' : 'Change Avatar'}
            </Button>
          </div>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<Text style={{ fontSize: 14, fontWeight: 500 }}>{t('settings.username')}</Text>}
            name="username"
            rules={[{ required: true, message: t('settings.updateError') }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#999' }} />}
              size="large"
              placeholder={t('settings.username')}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            label={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: 500 }}>Email</Text>
                <LockOutlined style={{ fontSize: 12, color: '#999' }} />
                <Text style={{ fontSize: 12, color: '#999' }}>({t('settings.loadError')})</Text>
              </div>
            }
            name="email"
          >
            <Input
              prefix={<MailOutlined style={{ color: '#999' }} />}
              size="large"
              disabled
              style={{
                borderRadius: 8,
                backgroundColor: '#f5f5f5',
                cursor: 'not-allowed',
                color: '#999',
              }}
            />
          </Form.Item>

          <Form.Item label={<Text style={{ fontSize: 14, fontWeight: 500 }}>{t('settings.interfaceLanguage')}</Text>} name="language">
            <Select
              size="large"
              style={{ borderRadius: 8 }}
              onChange={value => {
                dispatch(setLocale(value));
                form.setFieldsValue({ language: value });
              }}
            >
              <Option value="en">English</Option>
              <Option value="vi">Tiếng Việt</Option>
            </Select>
          </Form.Item>

          <Divider />

          <Title level={4} style={{ fontSize: 16, marginBottom: 24 }}>
            <BulbOutlined style={{ marginRight: 8, color: '#667eea' }} />
            {t('settings.theme')}
          </Title>

          <div style={{ marginBottom: 24 }}>
            <Radio.Group value={currentTheme} onChange={e => dispatch(setTheme(e.target.value))} style={{ width: '100%' }}>
              <Radio.Button
                value="light"
                style={{
                  width: '33%',
                  textAlign: 'center',
                  height: 44,
                  lineHeight: '44px',
                  borderRadius: '8px 0 0 8px',
                }}
              >
                ☀️ {t('settings.themeLight')}
              </Radio.Button>
              <Radio.Button
                value="dark"
                style={{
                  width: '34%',
                  textAlign: 'center',
                  height: 44,
                  lineHeight: '44px',
                }}
              >
                🌙 {t('settings.themeDark')}
              </Radio.Button>
              <Radio.Button
                value="auto"
                style={{
                  width: '33%',
                  textAlign: 'center',
                  height: 44,
                  lineHeight: '44px',
                  borderRadius: '0 8px 8px 0',
                }}
              >
                💻 {t('settings.themeAuto')}
              </Radio.Button>
            </Radio.Group>
            <Text
              style={{
                display: 'block',
                marginTop: 12,
                fontSize: 12,
                color: '#999',
                textAlign: 'center',
              }}
            >
              {currentLocale === 'vi' ? 'Chế độ tự động sẽ theo cài đặt hệ thống của bạn' : 'Auto mode follows your system preference'}
            </Text>
          </div>

          <Divider />

          <Title level={4} style={{ fontSize: 16, marginBottom: 24 }}>
            {t('settings.notifications')}
          </Title>

          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: 500 }}>{t('settings.enableNotifications')}</Text>
              <Switch
                checked={enableNotifications}
                onChange={setEnableNotifications}
                style={{
                  backgroundColor: enableNotifications ? '#52c41a' : '#d9d9d9',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: 500 }}>{t('settings.dailyNotifications')}</Text>
              <Switch
                checked={dailyNotifications}
                onChange={setDailyNotifications}
                style={{
                  backgroundColor: dailyNotifications ? '#52c41a' : '#d9d9d9',
                }}
              />
            </div>
          </div>

          <Form.Item style={{ marginTop: 32, marginBottom: 0, textAlign: 'right' }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              style={{
                background: '#667eea',
                borderColor: '#667eea',
                borderRadius: 8,
                padding: '0 48px',
                height: 44,
                fontWeight: 500,
              }}
            >
              {t('settings.save')}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Avatar Upload Modal */}
      <Modal
        title={currentLocale === 'vi' ? 'Tải ảnh đại diện' : 'Upload Avatar'}
        open={avatarModalVisible}
        onCancel={() => setAvatarModalVisible(false)}
        footer={null}
        centered
      >
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Avatar size={120} src={avatarUrl} icon={<UserOutlined />} style={{ marginBottom: 24 }} />
          <div>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} loading={uploadingAvatar} size="large" type="primary" style={{ borderRadius: 8 }}>
                {uploadingAvatar
                  ? currentLocale === 'vi'
                    ? 'Đang tải lên...'
                    : 'Uploading...'
                  : currentLocale === 'vi'
                    ? 'Chọn ảnh'
                    : 'Select Image'}
              </Button>
            </Upload>
            <div style={{ marginTop: 16, color: '#999', fontSize: 12 }}>
              {currentLocale === 'vi' ? 'Hỗ trợ: JPG, PNG (< 5MB)' : 'Supports: JPG, PNG (< 5MB)'}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
