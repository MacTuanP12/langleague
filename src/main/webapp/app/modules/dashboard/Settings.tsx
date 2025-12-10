import React, { useState, useEffect, useCallback } from 'react';
import { Card, Typography, Form, Input, Button, Avatar, Upload, message, Spin, Divider, Switch, Radio, Modal, Row, Col, Select, Tabs, Space, Alert } from 'antd';
import { UserOutlined, CameraOutlined, BulbOutlined, SaveOutlined, MailOutlined, BellOutlined, UploadOutlined, LinkOutlined, CopyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getAccount, updateAccount, updateAvatar } from 'app/shared/services/account.service';
import { setTheme } from 'app/shared/reducers/theme.reducer';
import { setLocale } from 'app/shared/reducers/locale.reducer';
import { getCurrentAppUser, updateCurrentAppUser, createAppUser } from 'app/shared/services/app-user.service';
import { RcFile } from 'antd/es/upload';
import * as ds from 'app/shared/styles/design-system';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const { account, currentTheme, currentLocale } = useAppSelector(state => ({
    account: state.authentication.account,
    currentTheme: state.theme.mode,
    currentLocale: state.locale.currentLocale,
  }));

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [appUserData, setAppUserData] = useState<any>(null);

  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');

  const resetModalState = useCallback(() => {
    setAvatarModalVisible(false);
    setPreviewImage(null);
    setUploadError(null);
    setUrlInput('');
    setActiveTab('upload');
  }, []);

  useEffect(() => {
    const initData = async () => {
      setFetchLoading(true);
      try {
        const userResult = await dispatch(getAccount()).unwrap();
        let appUserResult = null;
        try {
          appUserResult = await dispatch(getCurrentAppUser()).unwrap();
          setAppUserData(appUserResult);
        } catch (e) {
          console.warn('AppUser profile not found, will create one on save.');
        }

        form.setFieldsValue({
          firstName: userResult.firstName,
          lastName: userResult.lastName,
          email: userResult.email,
          bio: appUserResult?.bio || '',
          language: currentLocale || userResult.langKey || 'vi',
        });

        setAvatarUrl(userResult.imageUrl || appUserResult?.avatar || '');
      } catch (error) {
        message.error(currentLocale === 'vi' ? 'Không thể tải thông tin' : 'Failed to load settings');
      } finally {
        setFetchLoading(false);
      }
    };
    initData();
  }, [dispatch, form, currentLocale]);

  const handleFileValidation = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      setUploadError(currentLocale === 'vi' ? 'Tệp được chọn không phải là hình ảnh.' : 'Selected file is not an image.');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      setUploadError(currentLocale === 'vi' ? 'Kích thước ảnh phải nhỏ hơn 5MB.' : 'Image size must be smaller than 5MB.');
      return false;
    }
    setUploadError(null);
    return true;
  };

  const handleShowPreview = async (file: RcFile) => {
    if (!handleFileValidation(file)) {
      setPreviewImage(null);
      return;
    }
    const preview = await getBase64(file);
    setPreviewImage(preview);
  };

  const handleConfirmUpload = async () => {
    if (!previewImage) {
      message.warn(currentLocale === 'vi' ? 'Vui lòng chọn một ảnh để tải lên' : 'Please select an image to upload');
      return;
    }
    setUploading(true);
    try {
      const result = await dispatch(updateAvatar(previewImage)).unwrap();
      if (result.url) {
        setAvatarUrl(`${result.url}?t=${Date.now()}`);
        message.success(currentLocale === 'vi' ? 'Cập nhật ảnh đại diện thành công!' : 'Avatar updated successfully!');
        resetModalState();
        await dispatch(getAccount()).unwrap();
      }
    } catch (error) {
      setUploadError(currentLocale === 'vi' ? 'Không thể tải ảnh lên. Vui lòng thử lại.' : 'Failed to upload avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.includes('image')) {
        const file = items[i].getAsFile();
        if (file) {
          await handleShowPreview(file as RcFile);
          break;
        }
      }
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await dispatch(updateAccount({ ...account, ...values, langKey: values.language } as any)).unwrap();
      if (values.language && values.language !== currentLocale) {
        dispatch(setLocale(values.language));
      }
      const appUserPayload = {
        id: appUserData?.id,
        displayName: `${values.firstName} ${values.lastName}`.trim(),
        bio: values.bio || '',
        avatar: avatarUrl,
        emailNotificationEnabled: values.emailNotificationEnabled ?? true,
        dailyReminderEnabled: values.dailyReminderEnabled ?? true,
      };
      if (appUserData?.id) {
        await dispatch(updateCurrentAppUser(appUserPayload)).unwrap();
      } else {
        await dispatch(createAppUser(appUserPayload)).unwrap();
      }
      message.success(currentLocale === 'vi' ? 'Cập nhật thành công!' : 'Settings updated successfully!');
      dispatch(getAccount());
    } catch (error) {
      message.error(currentLocale === 'vi' ? 'Không thể cập nhật' : 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
  }

  return (
    <div style={{ ...ds.pageContainerStyle, padding: ds.spacing.lg }}>
      <Card style={{ ...ds.cardBaseStyle, maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: ds.spacing.xxl }}>
          <Title level={2} style={{ color: ds.colors.primary.DEFAULT }}>
            ⚙️ {currentLocale === 'vi' ? 'Cài đặt tài khoản' : 'Account Settings'}
          </Title>
          <Text type="secondary">
            {currentLocale === 'vi' ? 'Quản lý thông tin và tùy chỉnh trải nghiệm' : 'Manage your info and customize your experience'}
          </Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: ds.borderRadius.xl, padding: ds.spacing.lg, marginBottom: ds.spacing.xl, textAlign: 'center' }}>
            <div className="relative inline-block">
              <Avatar size={120} src={avatarUrl} icon={<UserOutlined />} style={{ border: `4px solid ${ds.colors.background.primary}`, boxShadow: ds.shadows.lg }} />
              <Button type="primary" shape="circle" icon={<CameraOutlined />} style={{ position: 'absolute', bottom: 4, right: 4 }} onClick={() => setAvatarModalVisible(true)} />
            </div>
          </div>

          <Modal
            title={`📸 ${currentLocale === 'vi' ? 'Cập nhật ảnh đại diện' : 'Update Avatar'}`}
            open={avatarModalVisible}
            onCancel={resetModalState}
            footer={[
              <Button key="back" onClick={resetModalState}>Hủy</Button>,
              <Button key="submit" type="primary" loading={uploading} onClick={handleConfirmUpload} disabled={!previewImage}>Cập nhật</Button>,
            ]}
            centered
            width={600}
          >
            {uploadError && <Alert message={uploadError} type="error" showIcon style={{ marginBottom: ds.spacing.md }} />}
            {previewImage && (
              <div style={{ textAlign: 'center', marginBottom: ds.spacing.md }}>
                <Text strong>Xem trước</Text>
                <img src={previewImage} alt="Preview" style={{ width: '50%', margin: '10px auto', borderRadius: ds.borderRadius.md }} />
              </div>
            )}
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <Tabs.TabPane tab={<span><UploadOutlined /> Tải lên</span>} key="upload">
                <Upload.Dragger accept="image/*" showUploadList={false} beforeUpload={file => { handleShowPreview(file); return false; }} disabled={uploading} style={{ marginTop: ds.spacing.md, background: 'var(--bg-secondary)', border: `2px dashed ${ds.colors.border.default}` }}>
                  <p className="ant-upload-drag-icon"><UploadOutlined style={{ fontSize: 48, color: ds.colors.primary.DEFAULT }} /></p>
                  <p className="ant-upload-text">Click hoặc kéo thả ảnh</p>
                  <p className="ant-upload-hint">Hỗ trợ: JPG, PNG (Tối đa 5MB)</p>
                </Upload.Dragger>
              </Tabs.TabPane>
              <Tabs.TabPane tab={<span><LinkOutlined /> Từ URL</span>} key="url">
                <div style={{ padding: ds.spacing.lg }}>
                  <Input size="large" placeholder="https://example.com/image.jpg" value={urlInput} onChange={e => { setUrlInput(e.target.value); setPreviewImage(e.target.value); setUploadError(null); }} disabled={uploading} prefix={<LinkOutlined />} style={ds.inputStyle} />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab={<span><CopyOutlined /> Paste</span>} key="paste">
                <div tabIndex={0} onPaste={handlePaste} style={{ padding: ds.spacing.lg, textAlign: 'center', marginTop: ds.spacing.md, border: `2px dashed ${ds.colors.border.default}`, borderRadius: ds.borderRadius.md, cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                  {previewImage && activeTab === 'paste' ? <Text type="success" strong><CheckCircleOutlined /> Ảnh đã được paste!</Text> : <><CopyOutlined style={{ fontSize: 48, color: ds.colors.primary.DEFAULT }} /><p>Click và nhấn Ctrl+V để paste</p></>}
                </div>
              </Tabs.TabPane>
            </Tabs>
          </Modal>

          <div className="mb-8">
            <Title level={4} style={{ color: ds.colors.text.primary, marginBottom: ds.spacing.md }}><UserOutlined style={{ color: ds.colors.info }} /> Thông tin cá nhân</Title>
            <Row gutter={24}>
              <Col xs={24} sm={12}><Form.Item label="Họ" name="firstName" rules={[{ required: true, message: 'Vui lòng nhập họ' }]}><Input size="large" style={ds.inputStyle} /></Form.Item></Col>
              <Col xs={24} sm={12}><Form.Item label="Tên" name="lastName" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}><Input size="large" style={ds.inputStyle} /></Form.Item></Col>
              <Col span={24}><Form.Item label="Email" name="email"><Input size="large" prefix={<MailOutlined />} disabled style={{ ...ds.inputStyle, background: 'var(--bg-tertiary)' }} /></Form.Item></Col>
              <Col span={24}><Form.Item label="Tiểu sử" name="bio"><TextArea rows={4} placeholder="Kể về bạn..." maxLength={200} showCount style={ds.inputStyle} /></Form.Item></Col>
            </Row>
          </div>

          <Divider />

          <div className="mb-8">
            <Title level={4} style={{ color: ds.colors.text.primary, marginBottom: ds.spacing.md }}>🌐 Ngôn ngữ</Title>
            <Form.Item name="language"><Select size="large" style={{ width: '100%' }}><Option value="vi">🇻🇳 Tiếng Việt</Option><Option value="en">🇬🇧 English</Option></Select></Form.Item>
          </div>

          <Divider />

          <div className="mb-8">
            <Title level={4} style={{ color: ds.colors.text.primary, marginBottom: ds.spacing.md }}><BulbOutlined style={{ color: ds.colors.warning }} /> Giao diện</Title>
            <Radio.Group value={currentTheme} onChange={e => dispatch(setTheme(e.target.value))} buttonStyle="solid" style={{ width: '100%', display: 'flex', gap: ds.spacing.sm }}>
              {['light', 'dark', 'auto'].map(theme => (
                <Radio.Button key={theme} value={theme} style={{ flex: 1, textAlign: 'center', height: 48, lineHeight: '48px', borderRadius: ds.borderRadius.md }}>
                  {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻'} {currentLocale === 'vi' ? (theme === 'light' ? 'Sáng' : theme === 'dark' ? 'Tối' : 'Tự động') : (theme.charAt(0).toUpperCase() + theme.slice(1))}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>

          <Divider />

          <div className="mb-10">
            <Title level={4} style={{ color: ds.colors.text.primary, marginBottom: ds.spacing.md }}><BellOutlined style={{ color: ds.colors.error }} /> Thông báo</Title>
            <Form.Item name="emailNotificationEnabled" valuePropName="checked">
              <div style={{ background: 'var(--bg-secondary)', borderRadius: ds.borderRadius.lg, padding: ds.spacing.md, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: ds.spacing.sm }}>
                <span>Nhận thông báo qua Email</span>
                <Switch />
              </div>
            </Form.Item>
            <Form.Item name="dailyReminderEnabled" valuePropName="checked">
              <div style={{ background: 'var(--bg-secondary)', borderRadius: ds.borderRadius.lg, padding: ds.spacing.md, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Nhắc nhở hàng ngày</span>
                <Switch />
              </div>
            </Form.Item>
          </div>

          <Form.Item className="mb-0 text-right">
            <Button type="primary" htmlType="submit" size="large" loading={loading} icon={<SaveOutlined />}>Lưu thay đổi</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;
