import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  message,
  Spin,
  Divider,
  Switch,
  Radio,
  Modal,
  Row,
  Col,
  Select,
  Tabs,
  Space,
} from 'antd';
import {
  UserOutlined,
  CameraOutlined,
  BulbOutlined,
  SaveOutlined,
  MailOutlined,
  BellOutlined,
  UploadOutlined,
  LinkOutlined,
  CopyOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getAccount, updateAccount, updateAvatar } from 'app/shared/services/account.service';
import { setTheme } from 'app/shared/reducers/theme.reducer';
import { setLocale } from 'app/shared/reducers/locale.reducer';
import { getCurrentAppUser, updateCurrentAppUser, createAppUser } from 'app/shared/services/app-user.service';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();

  // Redux State
  const account = useAppSelector(state => state.authentication.account);
  const currentTheme = useAppSelector(state => state.theme.mode);
  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  // Local State
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [appUserData, setAppUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [pastedImage, setPastedImage] = useState<string | null>(null);

  // 1. Fetch Data (User & AppUser Profile)
  useEffect(() => {
    const initData = async () => {
      setFetchLoading(true);
      try {
        // Lấy thông tin tài khoản chính (Account)
        const userResult = await dispatch(getAccount()).unwrap();

        // Lấy thông tin profile mở rộng (AppUser)
        let appUserResult = null;
        try {
          appUserResult = await dispatch(getCurrentAppUser()).unwrap();
          setAppUserData(appUserResult);
        } catch (e) {
          console.warn('Chưa có AppUser profile, sẽ tạo mới khi lưu.');
        }

        // Fill data vào form
        form.setFieldsValue({
          firstName: userResult.firstName,
          lastName: userResult.lastName,
          email: userResult.email,
          bio: appUserResult?.bio || '',
          language: currentLocale || userResult.langKey || 'vi',
        });

        setAvatarUrl(userResult.imageUrl || appUserResult?.avatar || '');

        // Fill settings từ AppUser nếu có
        if (appUserResult) {
          // Giả sử API trả về các field này (nếu chưa có cần update Backend)
          // setEnableNotifications(appUserResult.notificationEnabled ?? true);
          // setDailyReminder(appUserResult.dailyReminderEnabled ?? true);
        }
      } catch (error) {
        message.error(currentLocale === 'vi' ? 'Không thể tải thông tin' : 'Failed to load settings');
      } finally {
        setFetchLoading(false);
      }
    };

    initData();
  }, [dispatch, form]);

  // 2. Handle Avatar Upload
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
        // Add cache-busting timestamp to force reload
        const urlWithTimestamp = `${result.url}?t=${Date.now()}`;
        setAvatarUrl(urlWithTimestamp);
        message.success(currentLocale === 'vi' ? 'Cập nhật ảnh thành công!' : 'Avatar updated successfully!');
        setAvatarModalVisible(false);
        setPastedImage(null);

        // Refresh account data to update Redux state
        await dispatch(getAccount()).unwrap();
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      message.error(currentLocale === 'vi' ? 'Không thể tải ảnh lên' : 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarFromUrl = async () => {
    if (!imageUrlInput || !imageUrlInput.trim()) {
      message.error(currentLocale === 'vi' ? 'Vui lòng nhập URL hình ảnh' : 'Please enter image URL');
      return;
    }

    setUploadingAvatar(true);
    try {
      const result = await dispatch(updateAvatar(imageUrlInput)).unwrap();

      if (result.url) {
        // Add cache-busting timestamp to force reload
        const urlWithTimestamp = `${result.url}?t=${Date.now()}`;
        setAvatarUrl(urlWithTimestamp);
        message.success(currentLocale === 'vi' ? 'Cập nhật ảnh thành công!' : 'Avatar updated successfully!');
        setAvatarModalVisible(false);
        setImageUrlInput('');

        // Refresh account data to update Redux state
        await dispatch(getAccount()).unwrap();
      }
    } catch (error) {
      console.error('Error setting avatar from URL:', error);
      message.error(currentLocale === 'vi' ? 'Không thể cập nhật ảnh từ URL' : 'Failed to update avatar from URL');
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

  // 3. Save Changes
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // A. Update Account (JHipster User)
      const userUpdate = {
        ...account,
        firstName: values.firstName,
        lastName: values.lastName,
        langKey: values.language,
        imageUrl: avatarUrl,
      };

      await dispatch(updateAccount(userUpdate as any)).unwrap();

      // Update locale in Redux if changed
      if (values.language && values.language !== currentLocale) {
        dispatch(setLocale(values.language));
      }

      // B. Update AppUser (Profile mở rộng)
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
      dispatch(getAccount()); // Refresh redux state
    } catch (error) {
      console.error(error);
      message.error(currentLocale === 'vi' ? 'Không thể cập nhật' : 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spin size="large" tip={currentLocale === 'vi' ? 'Đang tải cài đặt...' : 'Loading settings...'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <Card className="max-w-4xl mx-auto shadow-md rounded-xl overflow-hidden" bodyStyle={{ padding: '40px' }}>
        {/* Header */}
        <div className="text-center mb-10">
          <Title level={2} className="text-blue-600 mb-2">
            {currentLocale === 'vi' ? '⚙️ Cài đặt tài khoản' : '⚙️ Account Settings'}
          </Title>
          <Text type="secondary">
            {currentLocale === 'vi'
              ? 'Quản lý thông tin cá nhân và tùy chỉnh trải nghiệm học tập'
              : 'Manage your personal information and customize your learning experience'}
          </Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* 1. Avatar Section */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-dashed border-gray-300 text-center">
            <div className="relative inline-block">
              <Avatar size={120} src={avatarUrl} icon={<UserOutlined />} className="border-4 border-white shadow-lg mb-4" />
              <Button
                type="primary"
                shape="circle"
                icon={<CameraOutlined />}
                className="absolute bottom-4 right-0 shadow-md"
                onClick={() => setAvatarModalVisible(true)}
              />
            </div>
            <div className="mt-2 text-gray-500 text-sm">
              {currentLocale === 'vi' ? 'Nhấn vào biểu tượng máy ảnh để thay đổi ảnh đại diện' : 'Click the camera icon to change avatar'}
            </div>
          </div>

          {/* Avatar Upload Modal */}
          <Modal
            title={currentLocale === 'vi' ? '📸 Cập nhật ảnh đại diện' : '📸 Update Avatar'}
            open={avatarModalVisible}
            onCancel={() => {
              setAvatarModalVisible(false);
              setImageUrlInput('');
              setPastedImage(null);
              setActiveTab('upload');
            }}
            footer={null}
            centered
            width={600}
          >
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              {/* Tab 1: Upload from device */}
              <Tabs.TabPane
                tab={
                  <span>
                    <UploadOutlined />
                    {currentLocale === 'vi' ? ' Tải từ thiết bị' : ' Upload'}
                  </span>
                }
                key="upload"
              >
                <div className="p-6 text-center">
                  <Upload.Dragger
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={file => {
                      const isImage = file.type.startsWith('image/');
                      if (!isImage) {
                        message.error(currentLocale === 'vi' ? 'Chỉ hỗ trợ file ảnh!' : 'Only image files!');
                        return false;
                      }
                      const isLt5M = file.size / 1024 / 1024 < 5;
                      if (!isLt5M) {
                        message.error(currentLocale === 'vi' ? 'Ảnh phải nhỏ hơn 5MB!' : 'Image must be smaller than 5MB!');
                        return false;
                      }
                      handleAvatarUpload(file);
                      return false;
                    }}
                    disabled={uploadingAvatar}
                  >
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined style={{ fontSize: 48, color: '#4169e1' }} />
                    </p>
                    <p className="ant-upload-text">
                      {currentLocale === 'vi' ? 'Click hoặc kéo thả ảnh vào đây' : 'Click or drag image here'}
                    </p>
                    <p className="ant-upload-hint">
                      {currentLocale === 'vi' ? 'Hỗ trợ: JPG, PNG (Max 5MB)' : 'Supports: JPG, PNG (Max 5MB)'}
                    </p>
                  </Upload.Dragger>
                </div>
              </Tabs.TabPane>

              {/* Tab 2: From URL */}
              <Tabs.TabPane
                tab={
                  <span>
                    <LinkOutlined />
                    {currentLocale === 'vi' ? ' Từ URL' : ' From URL'}
                  </span>
                }
                key="url"
              >
                <div className="p-6">
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <div>
                      <Text strong style={{ marginBottom: 8, display: 'block' }}>
                        {currentLocale === 'vi' ? 'Nhập URL hình ảnh' : 'Enter image URL'}
                      </Text>
                      <Input
                        size="large"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrlInput}
                        onChange={e => setImageUrlInput(e.target.value)}
                        onPressEnter={handleAvatarFromUrl}
                        disabled={uploadingAvatar}
                        prefix={<LinkOutlined />}
                      />
                    </div>
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleAvatarFromUrl}
                      loading={uploadingAvatar}
                      disabled={!imageUrlInput}
                      block
                    >
                      {currentLocale === 'vi' ? 'Cập nhật' : 'Update'}
                    </Button>
                  </Space>
                </div>
              </Tabs.TabPane>

              {/* Tab 3: Paste */}
              <Tabs.TabPane
                tab={
                  <span>
                    <CopyOutlined />
                    {currentLocale === 'vi' ? ' Paste ảnh' : ' Paste'}
                  </span>
                }
                key="paste"
              >
                <div className="p-6">
                  <div
                    tabIndex={0}
                    onPaste={handlePaste}
                    style={{
                      border: '2px dashed #d9d9d9',
                      borderRadius: 8,
                      padding: 40,
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: pastedImage ? '#f0f5ff' : '#fafafa',
                    }}
                  >
                    {pastedImage ? (
                      <Space direction="vertical" size="large">
                        <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                        <img src={pastedImage} alt="Pasted" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
                        <Text type="success" strong>
                          {currentLocale === 'vi' ? 'Ảnh đã được paste thành công!' : 'Image pasted successfully!'}
                        </Text>
                      </Space>
                    ) : (
                      <Space direction="vertical" size="large">
                        <CopyOutlined style={{ fontSize: 48, color: '#4169e1' }} />
                        <Text strong>{currentLocale === 'vi' ? 'Click vào đây và nhấn Ctrl+V' : 'Click here and press Ctrl+V'}</Text>
                      </Space>
                    )}
                  </div>
                </div>
              </Tabs.TabPane>
            </Tabs>
          </Modal>

          {/* 2. Personal Info */}
          <div className="mb-8">
            <Title level={4} className="flex items-center gap-2 mb-4 text-gray-700">
              <UserOutlined className="text-blue-500" />
              {currentLocale === 'vi' ? 'Thông tin cá nhân' : 'Personal Information'}
            </Title>
            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={currentLocale === 'vi' ? 'Họ (First Name)' : 'First Name'}
                  name="firstName"
                  rules={[{ required: true, message: currentLocale === 'vi' ? 'Vui lòng nhập họ' : 'Please enter first name' }]}
                >
                  <Input size="large" className="rounded-lg" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={currentLocale === 'vi' ? 'Tên (Last Name)' : 'Last Name'}
                  name="lastName"
                  rules={[{ required: true, message: currentLocale === 'vi' ? 'Vui lòng nhập tên' : 'Please enter last name' }]}
                >
                  <Input size="large" className="rounded-lg" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Email" name="email">
                  <Input
                    size="large"
                    prefix={<MailOutlined className="text-gray-400" />}
                    disabled
                    className="bg-gray-100 text-gray-500 rounded-lg"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={currentLocale === 'vi' ? 'Tiểu sử (Bio)' : 'Bio'} name="bio">
                  <TextArea
                    rows={4}
                    placeholder={currentLocale === 'vi' ? 'Viết vài dòng về bản thân...' : 'Write something about yourself...'}
                    maxLength={200}
                    showCount
                    className="rounded-lg"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* 3. Language Settings */}
          <div className="mb-8">
            <Title level={4} className="flex items-center gap-2 mb-4 text-gray-700">
              🌐 {currentLocale === 'vi' ? 'Ngôn ngữ' : 'Language'}
            </Title>
            <Form.Item name="language">
              <Select size="large" style={{ width: '100%' }}>
                <Option value="vi">🇻🇳 Tiếng Việt</Option>
                <Option value="en">🇬🇧 English</Option>
              </Select>
            </Form.Item>
          </div>

          <Divider />

          {/* 4. Theme Settings */}
          <div className="mb-8">
            <Title level={4} className="flex items-center gap-2 mb-4 text-gray-700">
              <BulbOutlined className="text-yellow-500" />
              {currentLocale === 'vi' ? 'Giao diện' : 'Theme'}
            </Title>
            <Radio.Group
              value={currentTheme}
              onChange={e => dispatch(setTheme(e.target.value))}
              className="w-full flex gap-4"
              buttonStyle="solid"
            >
              <Radio.Button value="light" className="flex-1 text-center h-12 leading-[48px] rounded-lg">
                ☀️ {currentLocale === 'vi' ? 'Sáng' : 'Light'}
              </Radio.Button>
              <Radio.Button value="dark" className="flex-1 text-center h-12 leading-[48px] rounded-lg">
                🌙 {currentLocale === 'vi' ? 'Tối' : 'Dark'}
              </Radio.Button>
              <Radio.Button value="auto" className="flex-1 text-center h-12 leading-[48px] rounded-lg">
                💻 {currentLocale === 'vi' ? 'Tự động' : 'Auto'}
              </Radio.Button>
            </Radio.Group>
          </div>

          <Divider />

          {/* 5. Notifications */}
          <div className="mb-10">
            <Title level={4} className="flex items-center gap-2 mb-4 text-gray-700">
              <BellOutlined className="text-red-500" />
              {currentLocale === 'vi' ? 'Thông báo' : 'Notifications'}
            </Title>

            <Form.Item name="emailNotificationEnabled" valuePropName="checked" noStyle>
              <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center mb-3">
                <div>
                  <div className="font-medium text-gray-800">{currentLocale === 'vi' ? 'Thông báo qua Email' : 'Email Notifications'}</div>
                  <div className="text-sm text-gray-500">
                    {currentLocale === 'vi'
                      ? 'Nhận thông báo về bài học mới và cập nhật hệ thống qua email'
                      : 'Receive notifications about new lessons and system updates via email'}
                  </div>
                </div>
                <Form.Item name="emailNotificationEnabled" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item name="dailyReminderEnabled" valuePropName="checked" noStyle>
              <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-800">{currentLocale === 'vi' ? 'Nhắc nhở hàng ngày' : 'Daily Reminder'}</div>
                  <div className="text-sm text-gray-500">
                    {currentLocale === 'vi'
                      ? 'Nhận email nhắc nhở học tập vào 8:00 tối mỗi ngày'
                      : 'Receive daily email reminder to study at 8:00 PM'}
                  </div>
                </div>
                <Form.Item name="dailyReminderEnabled" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>
            </Form.Item>
          </div>

          {/* Footer Actions */}
          <Form.Item className="mb-0 text-right">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<SaveOutlined />}
              className="h-12 px-8 rounded-lg bg-blue-600 hover:bg-blue-500 border-none shadow-blue-200 shadow-lg font-semibold"
            >
              {currentLocale === 'vi' ? 'Lưu thay đổi' : 'Save Changes'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;
