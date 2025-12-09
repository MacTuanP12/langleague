import React, { useState, useEffect } from 'react';
import { useTranslation } from 'app/shared/utils/useTranslation';
import { Form, Input, Button, Select, Card, Typography, Divider, message, Switch, Space, Row, Col, Spin } from 'antd';
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
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getAccount, updateAccount } from 'app/shared/services/account.service';
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
