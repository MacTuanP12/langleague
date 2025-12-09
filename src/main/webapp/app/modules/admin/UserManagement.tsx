import React, { useState, useEffect } from 'react';
import { useTranslation } from 'app/shared/utils/useTranslation';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Card,
  Avatar,
  Typography,
  Row,
  Col,
  Modal,
  Form,
  message,
  Popconfirm,
  Badge,
} from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useAppDispatch } from 'app/config/store';
import { getUsers, createUser, updateUser, deleteUser } from 'app/shared/services/user.service';
import { IUser, UserRole } from 'app/shared/model/models';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { Option } = Select;

const UserManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [form] = Form.useForm();

  // Load users
  const fetchUsers = async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const result = await dispatch(getUsers({ page, size })).unwrap();
      // Handle the pageable response structure
      const usersData = result.content || result;
      setUsers(Array.isArray(usersData) ? usersData : []);
      setPagination({
        current: page + 1,
        pageSize: size,
        total: result.totalElements || (Array.isArray(usersData) ? usersData.length : 0),
      });
    } catch (error: any) {
      console.error('Error fetching users:', error);
      let errorMessage = t('admin.userManagement.loadError') || 'Failed to load users';

      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage = t('error.network') || 'Cannot connect to server. Please check if backend is running (http://localhost:8080)';
      } else if (error.response?.status === 401) {
        errorMessage = t('error.sessionExpired') || 'Session expired. Please login again';
      } else if (error.response?.status === 403) {
        errorMessage = t('error.permission') || 'You do not have permission to access this function';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      message.error(errorMessage);
      // Set empty array to avoid undefined errors
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle table pagination
  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchUsers((newPagination.current || 1) - 1, newPagination.pageSize || 20);
  };

  // Show modal for create/edit
  const showModal = (user?: IUser) => {
    if (user) {
      setIsEditMode(true);
      setSelectedUser(user);
      form.setFieldsValue({
        login: user.login,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        authorities: user.authorities,
        activated: user.activated,
      });
    } else {
      setIsEditMode(false);
      setSelectedUser(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Handle form submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isEditMode && selectedUser) {
        // For update, include the id and login
        await dispatch(
          updateUser({
            id: selectedUser.id,
            login: selectedUser.login,
            ...values,
          }),
        ).unwrap();
        message.success(t('admin.userManagement.updateSuccess') || 'User updated successfully');
      } else {
        // For create, ensure authorities is an array
        const createData = {
          ...values,
          authorities: Array.isArray(values.authorities) ? values.authorities : [values.authorities],
        };
        await dispatch(createUser(createData)).unwrap();
        message.success(t('admin.userManagement.createSuccess') || 'User created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchUsers(pagination.current - 1, pagination.pageSize);
    } catch (error: any) {
      console.error('Error submitting user:', error);
      let errorMessage = t('common.error') || 'An error occurred';

      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage = t('error.network') || 'Cannot connect to server. Please check backend';
      } else if (error.response?.status === 401) {
        errorMessage = t('error.sessionExpired') || 'Session expired';
      } else if (error.response?.status === 403) {
        errorMessage = t('error.permission') || 'You do not have permission to perform this action';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || t('common.error') || 'Invalid data';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (user: IUser) => {
    try {
      if (!user.login) {
        message.error(t('admin.userManagement.userNotFound') || 'User information not found');
        return;
      }
      setLoading(true);
      await dispatch(deleteUser(user.login)).unwrap();
      message.success(t('admin.userManagement.deleteSuccess') || 'User deleted successfully');
      fetchUsers(pagination.current - 1, pagination.pageSize);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      let errorMessage = t('admin.userManagement.deleteError') || 'Failed to delete user';

      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage = t('error.network') || 'Cannot connect to server';
      } else if (error.response?.status === 401) {
        errorMessage = t('error.sessionExpired') || 'Session expired';
      } else if (error.response?.status === 403) {
        errorMessage = t('error.deletePermission') || 'You do not have permission to delete users';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get role tag color
  const getRoleColor = (authorities?: string[]) => {
    if (!authorities || authorities.length === 0) return 'default';
    const role = authorities[0];
    if (role === 'ROLE_ADMIN') return 'red';
    if (role === 'ROLE_STAFF') return 'blue';
    return 'green';
  };

  // Get role display name
  const getRoleDisplay = (authorities?: string[]) => {
    if (!authorities || authorities.length === 0) return 'User';
    const role = authorities[0];
    if (role === 'ROLE_ADMIN') return 'Admin';
    if (role === 'ROLE_STAFF') return 'Staff';
    return 'User';
  };

  // Table columns - Academic Style
  const columns: ColumnsType<IUser> = [
    {
      title: (
        <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {t('admin.userManagement.user') || 'User'}
        </Text>
      ),
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar size={40} src={record.avatarUrl || record.imageUrl} icon={<UserOutlined />} style={{ backgroundColor: '#2c5282' }} />
          <div>
            <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {record.firstName} {record.lastName}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12, fontFamily: 'Inter, system-ui, sans-serif' }}>
              @{record.login}
            </Text>
          </div>
        </Space>
      ),
      width: 250,
    },
    {
      title: (
        <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {t('admin.userManagement.email') || 'Email'}
        </Text>
      ),
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: (
        <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {t('admin.userManagement.role') || 'Role'}
        </Text>
      ),
      key: 'role',
      render: (_, record) => (
        <Tag color={getRoleColor(record.authorities)} style={{ borderRadius: '6px', fontFamily: 'Inter, system-ui, sans-serif' }}>
          {getRoleDisplay(record.authorities)}
        </Tag>
      ),
      filters: [
        { text: t('admin.userManagement.roles.admin') || 'Admin', value: UserRole.ADMIN },
        { text: t('admin.userManagement.roles.staff') || 'Staff', value: UserRole.STAFF },
        { text: t('admin.userManagement.roles.user') || 'User', value: UserRole.USER },
      ],
      onFilter: (value: any, record) => record.authorities?.includes(value) || false,
      width: 120,
    },
    {
      title: (
        <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {t('admin.userManagement.status') || 'Status'}
        </Text>
      ),
      key: 'status',
      render: (_, record) => (
        <Badge
          status={record.activated ? 'success' : 'default'}
          text={
            <Text style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {record.activated ? t('admin.userManagement.active') || 'Active' : t('admin.userManagement.inactive') || 'Inactive'}
            </Text>
          }
        />
      ),
      filters: [
        { text: t('admin.userManagement.active') || 'Active', value: true },
        { text: t('admin.userManagement.inactive') || 'Inactive', value: false },
      ],
      onFilter: (value: any, record) => record.activated === value,
      width: 150,
    },
    {
      title: (
        <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {t('admin.userManagement.createdDate') || 'Created Date'}
        </Text>
      ),
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: date => <Text style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{date ? dayjs(date).format('DD/MM/YYYY') : '-'}</Text>,
      sorter(a, b) {
        if (!a.createdDate || !b.createdDate) return 0;
        return dayjs(a.createdDate).unix() - dayjs(b.createdDate).unix();
      },
      width: 120,
    },
    {
      title: (
        <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {t('admin.userManagement.actions') || 'Actions'}
        </Text>
      ),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            size="small"
            style={{ color: '#2c5282', fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {t('common.edit') || 'Edit'}
          </Button>
          <Popconfirm
            title={t('admin.userManagement.confirmDelete') || 'Confirm Delete?'}
            description={t('admin.userManagement.deleteConfirmMessage') || 'Are you sure you want to delete this user?'}
            onConfirm={() => handleDelete(record)}
            okText={t('common.delete') || 'Delete'}
            cancelText={t('common.cancel') || 'Cancel'}
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {t('common.delete') || 'Delete'}
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 150,
      fixed: 'right',
    },
  ];

  // Filter users by search
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      !searchText ||
      user.login?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchText.toLowerCase());

    const matchesRole = selectedRole === 'all' || user.authorities?.includes(selectedRole);

    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ padding: '24px', background: '#f8f9fa', minHeight: '100vh' }}>
      <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #e8eaed' }}>
        {/* Header - Academic Style */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3} style={{ margin: 0, fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600, color: '#1e3a5f' }}>
              <UserOutlined style={{ marginRight: 8 }} />
              {t('admin.userManagement.title') || 'Account Management'}
            </Title>
            <Text type="secondary" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {t('admin.userManagement.subtitle') || 'Manage user accounts and permissions'}
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => showModal()}
              style={{
                borderRadius: 8,
                background: '#2c5282',
                borderColor: '#2c5282',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 500,
              }}
            >
              {t('admin.userManagement.addUser') || 'Add User'}
            </Button>
          </Col>
        </Row>

        {/* Filters - Academic Style */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Input
              placeholder={t('admin.userManagement.searchPlaceholder') || 'Search by name, email, username...'}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              size="large"
              style={{ borderRadius: 8, fontFamily: 'Inter, system-ui, sans-serif' }}
              allowClear
            />
          </Col>
          <Col>
            <Select
              placeholder={t('admin.userManagement.role') || 'Role'}
              style={{ width: 150, fontFamily: 'Inter, system-ui, sans-serif' }}
              size="large"
              value={selectedRole}
              onChange={setSelectedRole}
            >
              <Option value="all">{t('admin.userManagement.allRoles') || 'All Roles'}</Option>
              <Option value={UserRole.ADMIN}>{t('admin.userManagement.roles.admin') || 'Admin'}</Option>
              <Option value={UserRole.STAFF}>{t('admin.userManagement.roles.staff') || 'Staff'}</Option>
              <Option value={UserRole.USER}>{t('admin.userManagement.roles.user') || 'User'}</Option>
            </Select>
          </Col>
          <Col>
            <Button
              icon={<ReloadOutlined />}
              size="large"
              onClick={() => fetchUsers(0, pagination.pageSize)}
              style={{ borderRadius: 8, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Refresh
            </Button>
          </Col>
        </Row>

        {/* Table - Academic Style */}
        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: total => <Text style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{`Total ${total} users`}</Text>,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Create/Edit Modal - Academic Style */}
      <Modal
        title={
          <Text strong style={{ fontSize: '18px', fontFamily: 'Inter, system-ui, sans-serif', color: '#1e3a5f' }}>
            {isEditMode ? t('admin.userManagement.editUser') || 'Edit User' : t('admin.userManagement.addNewUser') || 'Add New User'}
          </Text>
        }
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText={isEditMode ? t('common.update') || 'Update' : t('common.create') || 'Create'}
        cancelText={t('common.cancel') || 'Cancel'}
        width={600}
        confirmLoading={loading}
        okButtonProps={{ style: { background: '#2c5282', borderColor: '#2c5282', fontFamily: 'Inter, system-ui, sans-serif' } }}
        cancelButtonProps={{ style: { fontFamily: 'Inter, system-ui, sans-serif' } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            label={
              <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                {t('admin.userManagement.username') || 'Username'}
              </Text>
            }
            name="login"
            rules={[
              { required: true, message: t('admin.userManagement.validation.usernameRequired') || 'Please enter username' },
              { min: 3, message: t('admin.userManagement.validation.usernameTooShort') || 'Username must be at least 3 characters' },
              {
                pattern: /^[a-z0-9_-]{3,50}$/,
                message:
                  t('admin.userManagement.validation.usernameInvalid') ||
                  'Username can only contain lowercase letters, numbers, underscore and hyphen',
              },
            ]}
          >
            <Input
              placeholder={t('admin.userManagement.username') || 'Username'}
              disabled={isEditMode}
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            />
          </Form.Item>

          {!isEditMode && (
            <Form.Item
              label={
                <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {t('admin.userManagement.password') || 'Password'}
                </Text>
              }
              name="password"
              rules={[
                { required: true, message: t('admin.userManagement.validation.passwordRequired') || 'Please enter password' },
                { min: 4, message: t('admin.userManagement.validation.passwordTooShort') || 'Password must be at least 4 characters' },
                { max: 100, message: t('admin.userManagement.validation.passwordTooLong') || 'Password cannot exceed 100 characters' },
              ]}
            >
              <Input.Password placeholder="Password" style={{ fontFamily: 'Inter, system-ui, sans-serif' }} />
            </Form.Item>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    First Name
                  </Text>
                }
                name="firstName"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="First Name" style={{ fontFamily: 'Inter, system-ui, sans-serif' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Last Name
                  </Text>
                }
                name="lastName"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Last Name" style={{ fontFamily: 'Inter, system-ui, sans-serif' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={
              <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Email
              </Text>
            }
            name="email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input placeholder="email@example.com" style={{ fontFamily: 'Inter, system-ui, sans-serif' }} />
          </Form.Item>

          <Form.Item
            label={
              <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Role
              </Text>
            }
            name="authorities"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select placeholder="Select role" mode="multiple" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <Option value={UserRole.ADMIN}>Admin</Option>
              <Option value={UserRole.STAFF}>Staff</Option>
              <Option value={UserRole.USER}>User</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <Text strong style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Status
              </Text>
            }
            name="activated"
            valuePropName="checked"
            initialValue={true}
          >
            <Select style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
