import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Select, DatePicker, message, Typography, Upload, Avatar, Spin, Modal, Space, Tabs } from 'antd';
import { UserOutlined, UploadOutlined, LinkOutlined, CopyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAppDispatch } from 'app/config/store';
import { getAccount, updateAccount, updateAvatar } from 'app/shared/services/account.service';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const { Option } = Select;

const MyProfile: React.FC = () => {
  const { t } = useTranslation('common');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [pastedImage, setPastedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const pasteAreaRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setFetchingProfile(true);
    try {
      const profile = await dispatch(getAccount()).unwrap();

      // Set form values
      form.setFieldsValue({
        fullName: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        displayName: profile.displayName,
      });

      if (profile.imageUrl) {
        setAvatarUrl(profile.imageUrl);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      message.error(t('profile.loadError'));
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleAvatarChange = async (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    const file = info.file.originFileObj || info.file;

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
        setAvatarUrl(result.url);
        message.success(t('profile.avatarUploadSuccess'));
        await fetchProfile(); // Refresh to get updated avatar
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      message.error(t('profile.avatarUploadError'));
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
      // Call updateAvatar with URL string
      const result = await dispatch(updateAvatar(imageUrlInput)).unwrap();

      if (result.url) {
        setAvatarUrl(result.url);
        message.success('Cập nhật ảnh đại diện thành công!');
        setAvatarModalVisible(false);
        setImageUrlInput('');
        await fetchProfile(); // Refresh to get updated avatar
      }
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
        setAvatarUrl(result.url);
        message.success('Cập nhật ảnh đại diện thành công!');
        setAvatarModalVisible(false);
        setPastedImage(null);
        await fetchProfile(); // Refresh to get updated avatar
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
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

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const names = values.fullName?.split(' ') || [];
      const updateData = {
        firstName: names[0] || values.firstName,
        lastName: names.slice(1).join(' ') || values.lastName,
        email: values.email,
        displayName: values.displayName,
      };

      await dispatch(updateAccount(updateData)).unwrap();
      message.success(t('profile.updateSuccess'));
      await fetchProfile(); // Refresh profile data
    } catch (error: any) {
      console.error('Error updating profile:', error);
      message.error(error?.message || t('profile.updateError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', padding: '40px' }}>
      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
          background: '#ffffff',
          padding: '48px',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <Title level={2} style={{ color: '#4169e1', marginBottom: 32, fontSize: 28 }}>
          {t('profile.title')}
        </Title>

        {fetchingProfile ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16, color: '#999' }}>{t('common.loading')}</div>
          </div>
        ) : (
          <>
            {/* Avatar Upload */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Avatar size={120} src={avatarUrl} icon={!avatarUrl && <UserOutlined />} style={{ marginBottom: 16 }} />
              <div>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => setAvatarModalVisible(true)}
                  loading={loading}
                  style={{ borderRadius: 8 }}
                >
                  Thay đổi ảnh đại diện
                </Button>
              </div>
            </div>

            <Modal
              title={
                <div style={{ fontSize: 18, fontWeight: 600 }}>
                  <UserOutlined style={{ marginRight: 8, color: '#4169e1' }} />
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
                <Tabs.TabPane
                  tab={
                    <span>
                      <UploadOutlined />
                      Tải từ thiết bị
                    </span>
                  }
                  key="upload"
                >
                  <div style={{ padding: '24px 0', textAlign: 'center' }}>
                    <Upload.Dragger
                      accept="image/*"
                      showUploadList={false}
                      beforeUpload={() => false}
                      onChange={handleAvatarChange}
                      disabled={loading}
                    >
                      <p className="ant-upload-drag-icon">
                        <UploadOutlined style={{ fontSize: 48, color: '#4169e1' }} />
                      </p>
                      <p className="ant-upload-text" style={{ fontSize: 16 }}>
                        Click hoặc kéo thả ảnh vào đây
                      </p>
                      <p className="ant-upload-hint" style={{ color: '#999' }}>
                        Hỗ trợ: JPG, PNG, WEBP, GIF (tối đa 10MB)
                      </p>
                    </Upload.Dragger>
                  </div>
                </Tabs.TabPane>

                {/* Tab 2: From URL */}
                <Tabs.TabPane
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
                </Tabs.TabPane>

                {/* Tab 3: Paste from clipboard */}
                <Tabs.TabPane
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
                        e.currentTarget.style.borderColor = '#4169e1';
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
                          <CopyOutlined style={{ fontSize: 48, color: '#4169e1' }} />
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
                </Tabs.TabPane>
              </Tabs>
            </Modal>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label={<Text style={{ fontSize: 14, fontWeight: 500, color: '#333' }}>{t('profile.fullName')}</Text>}
                name="fullName"
                rules={[{ required: true, message: t('profile.fullNamePlaceholder') }]}
              >
                <Input size="large" placeholder={t('profile.fullNamePlaceholder')} style={{ borderRadius: 8 }} />
              </Form.Item>

              <Form.Item
                label={<Text style={{ fontSize: 14, fontWeight: 500, color: '#333' }}>{t('profile.email')}</Text>}
                name="email"
                rules={[
                  { required: true, message: t('profile.email') },
                  { type: 'email', message: t('register.validation.emailInvalid') },
                ]}
              >
                <Input size="large" placeholder="email@example.com" style={{ borderRadius: 8 }} disabled />
              </Form.Item>

              <Form.Item label={<Text style={{ fontSize: 14, fontWeight: 500, color: '#333' }}>{t('profile.gender')}</Text>} name="gender">
                <Select size="large" placeholder={t('profile.gender')} style={{ borderRadius: 8 }}>
                  <Option value="Nam">{t('profile.male')}</Option>
                  <Option value="Nữ">{t('profile.female')}</Option>
                  <Option value="Khác">{t('profile.other')}</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={<Text style={{ fontSize: 14, fontWeight: 500, color: '#333' }}>{t('profile.birthDate')}</Text>}
                name="birthDate"
              >
                <DatePicker size="large" format="DD/MM/YYYY" placeholder="21/1/2000" style={{ width: '100%', borderRadius: 8 }} />
              </Form.Item>

              <Form.Item style={{ marginTop: 32, textAlign: 'right' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  style={{
                    minWidth: 120,
                    height: 44,
                    borderRadius: 8,
                    background: '#4169e1',
                    fontWeight: 500,
                    fontSize: 15,
                  }}
                >
                  {t('profile.save')}
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
