import React, { useState, useEffect } from 'react';
import { useTranslation } from 'app/shared/utils/useTranslation';
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Typography,
  Divider,
  message,
  Switch,
  Space,
  Row,
  Col,
  Spin,
  Avatar,
  Upload,
  Modal,
  Tabs,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  BgColorsOutlined,
  NotificationOutlined,
  SecurityScanOutlined,
  CameraOutlined,
  UploadOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getAccount, updateAccount, updateAvatar } from 'app/shared/services/account.service';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

interface AdminSettings {
  username: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  theme: 'light' | 'dark';
  language: string;
  enableNotifications: boolean;
  enableSecurityAlerts: boolean;
  dailyReports: boolean;
  maintenanceMode: boolean;
}

const AdminSettings: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.authentication.account);

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableSecurityAlerts, setEnableSecurityAlerts] = useState(true);
  const [dailyReports, setDailyReports] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Avatar upload states
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [pastedImage, setPastedImage] = useState<string | null>(null);

  // Load account data on mount
  useEffect(() => {
    const loadAccountData = async () => {
      try {
        setDataLoading(true);
        await dispatch(getAccount()).unwrap();
      } catch (error) {
        console.error('Failed to load account:', error);
        message.error('Failed to load account data');
      } finally {
        setDataLoading(false);
      }
    };
    loadAccountData();
  }, [dispatch]);

  // Update form when account data is loaded
  useEffect(() => {
    if (account) {
      form.setFieldsValue({
        username: account.login,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        langKey: account.langKey || 'en',
      });
      // Set avatar URL
      setAvatarUrl(account.imageUrl || '');
    }
  }, [account, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await dispatch(
        updateAccount({
          login: values.username,
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          langKey: values.langKey,
        }),
      ).unwrap();

      message.success('Account settings saved successfully!');
    } catch (error) {
      console.error('Failed to update account:', error);
      message.error('Failed to save account settings');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordChange = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('New passwords do not match!');
      return;
    }

    setPasswordLoading(true);
    try {
      await axios.post('/api/account/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      message.success('Password updated successfully!');
      passwordForm.resetFields();
    } catch (error) {
      console.error('Failed to change password:', error);
      message.error('Failed to change password. Please check your current password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Avatar upload handlers
  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true);
    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Call updateAvatar with base64 string
      const result = await dispatch(updateAvatar(base64)).unwrap();

      if (result.url) {
        // Add cache-busting timestamp
        const urlWithTimestamp = `${result.url}?t=${Date.now()}`;
        setAvatarUrl(urlWithTimestamp);
        message.success('Avatar updated successfully!');
        setAvatarModalVisible(false);
        setPastedImage(null);

        // Refresh account data
        await dispatch(getAccount()).unwrap();
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      message.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarFromUrl = async () => {
    if (!imageUrlInput || !imageUrlInput.trim()) {
      message.error('Please enter image URL');
      return;
    }

    setUploadingAvatar(true);
    try {
      const result = await dispatch(updateAvatar(imageUrlInput)).unwrap();

      if (result.url) {
        const urlWithTimestamp = `${result.url}?t=${Date.now()}`;
        setAvatarUrl(urlWithTimestamp);
        message.success('Avatar updated successfully!');
        setAvatarModalVisible(false);
        setImageUrlInput('');

        // Refresh account data
        await dispatch(getAccount()).unwrap();
      }
    } catch (error) {
      console.error('Error setting avatar from URL:', error);
      message.error('Failed to update avatar from URL');
    } finally {
      setUploadingAvatar(false);
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
          await handleAvatarUpload(file);
        }
        break;
      }
    }
  };

  if (dataLoading) {
    return (
      <div style={{ padding: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Loading account data..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '32px' }}>
      <Title level={2} style={{ marginBottom: 32, color: '#667eea' }}>
        Admin Settings
      </Title>

      {/* Avatar Section */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: 24,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              size={120}
              src={avatarUrl}
              icon={<UserOutlined />}
              style={{ border: '4px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<CameraOutlined />}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
              onClick={() => setAvatarModalVisible(true)}
            />
          </div>
          <div style={{ marginTop: 12, color: '#6c757d', fontSize: 13 }}>Click the camera icon to change your avatar</div>
        </div>
      </Card>

      {/* Avatar Upload Modal */}
      <Modal
        title="Update Avatar"
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
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane
            tab={
              <span>
                <UploadOutlined /> Upload
              </span>
            }
            key="upload"
          >
            <Upload.Dragger
              accept="image/*"
              showUploadList={false}
              beforeUpload={file => {
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('Only image files are allowed!');
                  return false;
                }
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error('Image must be smaller than 5MB!');
                  return false;
                }
                handleAvatarUpload(file);
                return false;
              }}
              disabled={uploadingAvatar}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">Click or drag image to upload</p>
              <p className="ant-upload-hint">Support JPG, PNG, GIF (max 5MB)</p>
            </Upload.Dragger>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <LinkOutlined /> From URL
              </span>
            }
            key="url"
          >
            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder="Enter image URL"
                value={imageUrlInput}
                onChange={e => setImageUrlInput(e.target.value)}
                onPressEnter={handleAvatarFromUrl}
                disabled={uploadingAvatar}
              />
              <Button type="primary" onClick={handleAvatarFromUrl} loading={uploadingAvatar}>
                Set Avatar
              </Button>
            </Space.Compact>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <CameraOutlined /> Paste
              </span>
            }
            key="paste"
          >
            <div
              onPaste={handlePaste}
              tabIndex={0}
              style={{
                border: '2px dashed #d9d9d9',
                borderRadius: 8,
                padding: 40,
                textAlign: 'center',
                cursor: 'pointer',
                background: pastedImage ? `url(${pastedImage}) center/contain no-repeat` : '#fafafa',
                minHeight: 200,
              }}
            >
              {!pastedImage && (
                <div>
                  <CameraOutlined style={{ fontSize: 48, color: '#bbb' }} />
                  <p>Press Ctrl+V (or Cmd+V) to paste image</p>
                </div>
              )}
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Modal>

      {/* Account Information */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: 24,
        }}
      >
        <Title level={4} style={{ color: '#667eea', marginBottom: 24 }}>
          <UserOutlined style={{ marginRight: 8 }} />
          Account Information
        </Title>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<Text style={{ fontSize: 14, fontWeight: 500 }}>Username</Text>}
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  size="large"
                  style={{ height: '48px', fontSize: '15px' }}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<Text style={{ fontSize: 14, fontWeight: 500 }}>Email</Text>}
                name="email"
                rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" size="large" style={{ height: '48px', fontSize: '15px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<Text style={{ fontSize: 14, fontWeight: 500 }}>First Name</Text>}
                name="firstName"
                rules={[{ required: true, message: 'Please input your first name!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="First name" size="large" style={{ height: '48px', fontSize: '15px' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<Text style={{ fontSize: 14, fontWeight: 500 }}>Last Name</Text>}
                name="lastName"
                rules={[{ required: true, message: 'Please input your last name!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Last name" size="large" style={{ height: '48px', fontSize: '15px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item label={<Text style={{ fontSize: 14, fontWeight: 500 }}>Language</Text>} name="langKey">
                <Select size="large" style={{ height: '48px' }}>
                  <Option value="en">English</Option>
                  <Option value="vi">Tiếng Việt</Option>
                  <Option value="es">Español</Option>
                  <Option value="fr">Français</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Button type="primary" htmlType="submit" loading={loading} size="large">
            Save Account Settings
          </Button>
        </Form>
      </Card>

      {/* Password Settings */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: 24,
        }}
      >
        <Title level={4} style={{ color: '#667eea', marginBottom: 24 }}>
          <LockOutlined style={{ marginRight: 8 }} />
          Change Password
        </Title>

        <Form form={passwordForm} layout="vertical" onFinish={onPasswordChange}>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<Text style={{ fontSize: 14, fontWeight: 500 }}>Current Password</Text>}
                name="currentPassword"
                rules={[{ required: true, message: 'Please input your current password!' }]}
              >
                <Input.Password
                  placeholder="Current password"
                  size="large"
                  style={{ fontSize: '15px' }}
                  prefix={<LockOutlined />}
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<Text style={{ fontSize: 14, fontWeight: 500 }}>New Password</Text>}
                name="newPassword"
                rules={[
                  { required: true, message: 'Please input a new password!' },
                  { min: 4, message: 'Password must be at least 4 characters!' },
                ]}
              >
                <Input.Password
                  placeholder="New password"
                  size="large"
                  style={{ fontSize: '15px' }}
                  prefix={<LockOutlined />}
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<Text style={{ fontSize: 14, fontWeight: 500 }}>Confirm Password</Text>}
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Confirm password"
                  size="large"
                  style={{ fontSize: '15px' }}
                  prefix={<LockOutlined />}
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Button type="primary" htmlType="submit" size="large" loading={passwordLoading}>
            Update Password
          </Button>
        </Form>
      </Card>

      {/* Notification Settings */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: 24,
        }}
      >
        <Title level={4} style={{ color: '#667eea', marginBottom: 24 }}>
          <NotificationOutlined style={{ marginRight: 8 }} />
          Notification Settings
        </Title>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>Enable All Notifications</Text>
              <div style={{ color: '#6c757d', fontSize: '13px' }}>Receive notifications about system updates and activities</div>
            </div>
            <Switch checked={enableNotifications} onChange={setEnableNotifications} />
          </div>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>Daily Reports</Text>
              <div style={{ color: '#6c757d', fontSize: '13px' }}>Get daily reports about user activities and system performance</div>
            </div>
            <Switch checked={dailyReports} onChange={setDailyReports} disabled={!enableNotifications} />
          </div>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>Security Alerts</Text>
              <div style={{ color: '#6c757d', fontSize: '13px' }}>Receive alerts about security issues and suspicious activities</div>
            </div>
            <Switch checked={enableSecurityAlerts} onChange={setEnableSecurityAlerts} disabled={!enableNotifications} />
          </div>
        </Space>
      </Card>

      {/* System Settings */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <Title level={4} style={{ color: '#667eea', marginBottom: 24 }}>
          <SecurityScanOutlined style={{ marginRight: 8 }} />
          System Settings
        </Title>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>Maintenance Mode</Text>
              <div style={{ color: '#6c757d', fontSize: '13px' }}>Disable user access while performing maintenance</div>
            </div>
            <Switch checked={maintenanceMode} onChange={setMaintenanceMode} />
          </div>

          <Divider />

          <div>
            <Text strong>Account Created</Text>
            <div style={{ color: '#6c757d', fontSize: '13px', marginTop: 8 }}>
              {account?.createdDate ? new Date(account.createdDate).toLocaleString() : 'N/A'}
            </div>
          </div>

          <Divider />

          <div>
            <Text strong>Account Status</Text>
            <div style={{ color: '#6c757d', fontSize: '13px', marginTop: 8 }}>{account?.activated ? 'Active' : 'Inactive'}</div>
          </div>

          <Divider />

          <div>
            <Text strong>Authorities</Text>
            <div style={{ color: '#6c757d', fontSize: '13px', marginTop: 8 }}>{account?.authorities?.join(', ') || 'N/A'}</div>
          </div>

          <Divider />

          <Button type="primary" danger>
            Export System Logs
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default AdminSettings;
