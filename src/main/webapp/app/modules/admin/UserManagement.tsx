import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  Badge,
  Dropdown,
  MenuProps,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ReloadOutlined,
  MoreOutlined,
  LockOutlined,
  UnlockOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useAppDispatch } from 'app/config/store';
import { getUsers, createUser, updateUser, deleteUser } from 'app/shared/services/user.service';
import { IUser, UserRole } from 'app/shared/model/models';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as ds from 'app/shared/styles/design-system';

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

  const fetchUsers = async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const result = await dispatch(getUsers({ page, size })).unwrap();
      const usersData = result.content || result;
      setUsers(Array.isArray(usersData) ? usersData : []);
      setPagination({
        current: page + 1,
        pageSize: size,
        total: result.totalElements || (Array.isArray(usersData) ? usersData.length : 0),
      });
    } catch (error: any) {
      message.error(t('admin.userManagement.loadError') || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchUsers((newPagination.current || 1) - 1, newPagination.pageSize || 20);
  };

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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isEditMode && selectedUser) {
        await dispatch(
          updateUser({
            id: selectedUser.id,
            login: selectedUser.login,
            ...values,
          }),
        ).unwrap();
        message.success(t('admin.userManagement.updateSuccess') || 'User updated successfully');
      } else {
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
      message.error(t('common.error') || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

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
      message.error(t('admin.userManagement.deleteError') || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (authorities?: string[]) => {
    if (!authorities || authorities.length === 0) return ds.colors.info;
    const role = authorities[0];
    if (role === 'ROLE_ADMIN') return ds.colors.error;
    if (role === 'ROLE_STAFF') return ds.colors.secondary.DEFAULT;
    return ds.colors.success;
  };

  const getRoleDisplay = (authorities?: string[]) => {
    if (!authorities || authorities.length === 0) return 'User';
    const role = authorities[0];
    if (role === 'ROLE_ADMIN') return 'Admin';
    if (role === 'ROLE_STAFF') return 'Staff';
    return 'User';
  };

  const columns: ColumnsType<IUser> = [
    {
      title: <Text strong>{t('admin.userManagement.user') || 'User'}</Text>,
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar size={40} src={record.avatarUrl || record.imageUrl} icon={<UserOutlined />} style={{ backgroundColor: ds.colors.info }} />
          <div>
            <Text strong>{record.firstName} {record.lastName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>@{record.login}</Text>
          </div>
        </Space>
      ),
      width: 250,
    },
    {
      title: <Text strong>{t('admin.userManagement.email') || 'Email'}</Text>,
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: <Text strong>{t('admin.userManagement.role') || 'Role'}</Text>,
      key: 'role',
      render: (_, record) => (
        <Tag color={getRoleColor(record.authorities)} style={{ borderRadius: ds.borderRadius.sm }}>
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
      title: <Text strong>{t('admin.userManagement.status') || 'Status'}</Text>,
      key: 'status',
      render: (_, record) => (
        <Badge
          status={record.activated ? 'success' : 'default'}
          text={
            <Text>{record.activated ? t('admin.userManagement.active') || 'Active' : t('admin.userManagement.inactive') || 'Inactive'}</Text>
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
      title: <Text strong>{t('admin.userManagement.createdDate') || 'Created Date'}</Text>,
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: date => <Text>{date ? dayjs(date).format('DD/MM/YYYY') : '-'}</Text>,
      sorter(a, b) {
        if (!a.createdDate || !b.createdDate) return 0;
        return dayjs(a.createdDate).unix() - dayjs(b.createdDate).unix();
      },
      width: 120,
    },
    {
      title: <Text strong>{t('admin.userManagement.actions') || 'Actions'}</Text>,
      key: 'actions',
      render(_, record) {
        const menuItems: MenuProps['items'] = [
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: t('common.edit') || 'Edit',
            onClick: () => showModal(record),
          },
          {
            key: 'lock',
            icon: record.activated ? <LockOutlined /> : <UnlockOutlined />,
            label: record.activated ? 'Lock Account' : 'Unlock Account',
            onClick() {
              message.info(`${record.activated ? 'Locking' : 'Unlocking'} account: ${record.login}`);
            },
          },
          {
            key: 'reset',
            icon: <KeyOutlined />,
            label: 'Reset Password',
            onClick() {
              message.info(`Reset password for: ${record.login}`);
            },
          },
          {
            type: 'divider',
          },
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: t('common.delete') || 'Delete',
            danger: true,
            onClick() {
              Modal.confirm({
                title: t('admin.userManagement.confirmDelete') || 'Confirm Delete?',
                content: t('admin.userManagement.deleteConfirmMessage') || 'Are you sure you want to delete this user?',
                okText: t('common.delete') || 'Delete',
                cancelText: t('common.cancel') || 'Cancel',
                okButtonProps: { danger: true },
                onOk: () => handleDelete(record),
              });
            },
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        );
      },
      width: 80,
      fixed: 'right',
    },
  ];

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
    <div style={ds.pageContainerStyle}>
      <Card style={ds.cardBaseStyle}>
        <Row justify="space-between" align="middle" style={{ marginBottom: ds.spacing.lg }}>
          <Col>
            <Title level={3} style={{ margin: 0, color: ds.colors.text.primary }}>
              <UserOutlined style={{ marginRight: ds.spacing.sm, color: ds.colors.admin.solid }} />
              {t('admin.userManagement.title') || 'Account Management'}
            </Title>
            <Text type="secondary">
              {t('admin.userManagement.subtitle') || 'Manage user accounts and permissions'}
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => showModal()}
              style={{ borderRadius: ds.borderRadius.md }}
            >
              {t('admin.userManagement.addUser') || 'Add User'}
            </Button>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: ds.spacing.md }}>
          <Col flex="auto">
            <Input
              placeholder={t('admin.userManagement.searchPlaceholder') || 'Search by name, email, username...'}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              size="large"
              style={ds.inputStyle}
              allowClear
            />
          </Col>
          <Col>
            <Select
              placeholder={t('admin.userManagement.role') || 'Role'}
              style={{ ...ds.inputStyle, width: 150 }}
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
              style={{ borderRadius: ds.borderRadius.md }}
            >
              {t('admin:userManagement.refresh')}
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: total => <Text>{t('admin:userManagement.totalUsers', { count: total })}</Text>,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={
          <Text strong style={{ fontSize: '18px', color: ds.colors.text.primary }}>
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
      >
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            label={<Text strong>{t('admin.userManagement.username') || 'Username'}</Text>}
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
            <Input placeholder={t('admin.userManagement.username') || 'Username'} disabled={isEditMode} style={ds.inputStyle} />
          </Form.Item>

          {!isEditMode && (
            <Form.Item
              label={<Text strong>{t('admin.userManagement.password') || 'Password'}</Text>}
              name="password"
              rules={[
                { required: true, message: t('admin.userManagement.validation.passwordRequired') || 'Please enter password' },
                { min: 4, message: t('admin.userManagement.validation.passwordTooShort') || 'Password must be at least 4 characters' },
                { max: 100, message: t('admin.userManagement.validation.passwordTooLong') || 'Password cannot exceed 100 characters' },
              ]}
            >
              <Input.Password placeholder="Password" style={ds.inputStyle} />
            </Form.Item>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<Text strong>First Name</Text>}
                name="firstName"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="First Name" style={ds.inputStyle} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<Text strong>Last Name</Text>}
                name="lastName"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Last Name" style={ds.inputStyle} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<Text strong>Email</Text>}
            name="email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input placeholder="email@example.com" style={ds.inputStyle} />
          </Form.Item>

          <Form.Item
            label={<Text strong>Role</Text>}
            name="authorities"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select placeholder="Select role" mode="multiple" style={ds.inputStyle}>
              <Option value={UserRole.ADMIN}>Admin</Option>
              <Option value={UserRole.STAFF}>Staff</Option>
              <Option value={UserRole.USER}>User</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<Text strong>Status</Text>}
            name="activated"
            valuePropName="checked"
            initialValue={true}
          >
            <Select style={ds.inputStyle}>
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
