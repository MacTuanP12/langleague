import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  ProfileOutlined,
  TeamOutlined,
  UploadOutlined,
  HomeOutlined,
  CheckOutlined,
  ReadOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { TOKEN_KEY } from 'app/config/constants';
import {
  getUnreadCount,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  NotificationDTO,
} from 'app/shared/services/notification.service';
import { getCurrentUser } from 'app/shared/services/user.service';
import { IUser } from 'app/shared/model/models';
import LanguageToggle from './LanguageToggle';
import NotificationDropdown from './NotificationDropdown';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import '../../../content/css/dashboard.tailwind.css';
import { COLORS, GRADIENTS, LAYOUT, Z_INDEX } from '../constants/theme.constants';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

// Helper function to decode JWT and extract user info
const decodeJwtUser = (token: string): IUser | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    let authorities = ['ROLE_USER'];

    if (payload.auth) {
      authorities = typeof payload.auth === 'string' ? payload.auth.split(/[,\s]+/).filter(Boolean) : payload.auth;
    } else if (payload.authorities) {
      authorities = Array.isArray(payload.authorities) ? payload.authorities : [payload.authorities];
    }

    return {
      login: payload.sub || 'user',
      firstName: payload.given_name || 'User',
      lastName: payload.family_name || '',
      email: payload.email || '',
      authorities,
    };
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

// Helper function to get fallback user
const getFallbackUser = (): IUser => ({
  login: 'user',
  firstName: 'User',
  lastName: '',
  email: 'user@example.com',
  authorities: ['ROLE_USER'],
});

// Menu items generators
const getUserMenuItems = (t: any) => [
  {
    key: '/dashboard',
    icon: <HomeOutlined />,
    label: t('menu.dashboard'),
  },
  {
    key: '/dashboard/books',
    icon: <BookOutlined />,
    label: t('menu.bookLibrary'),
  },
  {
    key: '/dashboard/my-books',
    icon: <HeartOutlined />,
    label: t('menu.myBooks'),
  },
  {
    key: '/dashboard/my-chapters',
    icon: <ReadOutlined />,
    label: t('menu.myChapters'),
  },
  {
    key: '/dashboard/flashcard',
    icon: <CheckOutlined />,
    label: t('menu.flashcard'),
  },
  {
    key: '/dashboard/settings',
    icon: <SettingOutlined />,
    label: t('menu.settings'),
  },
];

const getAdminMenuItems = (t: any) => [
  {
    key: '/admin',
    icon: <DashboardOutlined />,
    label: t('menu.dashboard'),
  },
  {
    key: '/admin/users',
    icon: <TeamOutlined />,
    label: t('menu.userManagement'),
  },
  {
    key: '/admin/book-approval',
    icon: <BookOutlined />,
    label: 'Duyệt Sách',
  },
];

const getStaffMenuItems = (t: any) => [
  {
    key: '/staff',
    icon: <DashboardOutlined />,
    label: t('menu.overview'),
  },
  {
    key: '/staff/books',
    icon: <BookOutlined />,
    label: t('menu.bookManagement'),
  },
  {
    key: '/staff/upload',
    icon: <UploadOutlined />,
    label: t('menu.uploadBooks'),
  },
  {
    key: '/staff/settings',
    icon: <SettingOutlined />,
    label: t('menu.settings'),
  },
];

const getDropdownMenuItems = (t: any) => [
  {
    key: 'profile',
    icon: <ProfileOutlined />,
    label: t('menu.myProfile'),
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: t('menu.settings'),
  },
  {
    type: 'divider' as const,
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: t('common.logout'),
    danger: true,
  },
];

// Helper to determine user role
const getUserRole = (user: IUser | null): 'admin' | 'staff' | 'user' => {
  if (!user) return 'user';
  if (user.authorities?.includes('ROLE_ADMIN')) return 'admin';
  if (user.authorities?.includes('ROLE_STAFF')) return 'staff';
  return 'user';
};

// Helper to get role display name
const getRoleDisplayName = (user: IUser | null, t: any): string => {
  const role = getUserRole(user);
  if (role === 'admin') return t('roles.administrator');
  if (role === 'staff') return t('roles.staff');
  return t('roles.student');
};

// Helper to get user display name
const getUserDisplayName = (user: IUser | null, t: any): string => {
  if (!user) return t('common.loading');
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  return user.displayName || user.login || t('common.user');
};

const DashboardLayout = () => {
  const { t } = useTranslation('common');
  const [collapsed, setCollapsed] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(state => state.theme.actualTheme);
  const isDark = themeMode === 'dark';

  // Load user info and unread count on mount
  useEffect(() => {
    loadCurrentUser();
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await dispatch(getCurrentUser()).unwrap();
      setCurrentUser(user);
    } catch (error: any) {
      // Fallback: decode JWT token
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        const decodedUser = decodeJwtUser(token);
        if (decodedUser) {
          setCurrentUser(decodedUser);
          return;
        }
      }
      // Final fallback
      setCurrentUser(getFallbackUser());
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await dispatch(getUnreadCount()).unwrap();
      setUnreadCount(count);
    } catch (error: any) {
      // Silently handle errors - notification service might not be ready
      if (error?.response?.status === 500 || error?.code === 'ERR_BAD_RESPONSE') {
        console.warn('Notification API not available, using default value');
        setUnreadCount(0);
      }
    }
  };

  const loadNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const result = await dispatch(getUnreadNotifications({ page: 0, size: 10 })).unwrap();
      setNotifications(result.content || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleNotificationClick = async (notification: NotificationDTO) => {
    if (!notification.isRead && notification.id) {
      try {
        await dispatch(markAsRead(notification.id)).unwrap();
        setNotifications(prev => prev.map(n => (n.id === notification.id ? { ...n, isRead: true } : n)));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await dispatch(markAllAsRead()).unwrap();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationVisibleChange = (visible: boolean) => {
    setNotificationVisible(visible);
    if (visible) {
      loadNotifications();
    }
  };

  // Determine user role and menu items
  const userRole = getUserRole(currentUser);
  const menuItems = userRole === 'admin' ? getAdminMenuItems(t) : userRole === 'staff' ? getStaffMenuItems(t) : getUserMenuItems(t);
  const dropdownMenuItems = getDropdownMenuItems(t);

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      // Clear token from all storage locations (for backward compatibility)
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('authToken'); // legacy key
      sessionStorage.removeItem(TOKEN_KEY); // legacy location
      navigate('/login');
    } else if (key === 'profile') {
      navigate('/dashboard/profile');
    } else if (key === 'settings') {
      navigate('/dashboard/settings');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Sidebar - Academic Style */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={LAYOUT.sider.expanded}
        style={{
          background: isDark ? 'linear-gradient(180deg, #0f1419 0%, #1a1f26 100%)' : 'linear-gradient(180deg, #1e3a5f 0%, #2c5282 100%)',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.08)',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: Z_INDEX.sider,
          borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Logo - Academic Style */}
        <div
          style={{
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'rgba(255, 255, 255, 0.03)',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            📖
          </div>
          {!collapsed && (
            <Text
              strong
              style={{
                marginLeft: '14px',
                fontSize: '18px',
                color: '#ffffff',
                letterSpacing: '0.3px',
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                fontWeight: 600,
              }}
            >
              LangLeague
            </Text>
          )}
        </div>

        {/* User Info in Sidebar - Academic Style */}
        {!collapsed && currentUser && (
          <div
            style={{
              padding: '24px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(255, 255, 255, 0.04)',
            }}
          >
            <Space direction="vertical" size={10} style={{ width: '100%' }} align="center">
              <Avatar
                size={64}
                src={currentUser.imageUrl || currentUser.avatarUrl}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                }}
              />
              <div style={{ textAlign: 'center', width: '100%' }}>
                <Text strong style={{ display: 'block', fontSize: '15px', color: '#ffffff', marginBottom: '4px', fontWeight: 600 }}>
                  {getUserDisplayName(currentUser, t)}
                </Text>
                <Text style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500, letterSpacing: '0.3px' }}>
                  {getRoleDisplayName(currentUser, t)}
                </Text>
              </div>
            </Space>
          </div>
        )}

        {/* Menu - Academic Style */}
        <Menu
          key={userRole}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            borderRight: 0,
            marginTop: '16px',
            padding: '0 12px',
            background: 'transparent',
            color: '#fff',
            fontSize: '14px',
          }}
          theme="dark"
        />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? LAYOUT.sider.collapsed : LAYOUT.sider.expanded,
          transition: 'margin-left 0.2s',
          background: COLORS.background.default,
        }}
      >
        {/* Header - Academic Style */}
        <Header
          style={{
            padding: '0 40px',
            background: isDark ? '#1f1f1f' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: isDark ? '0 1px 4px rgba(0, 0, 0, 0.3)' : '0 1px 4px rgba(0, 0, 0, 0.08)',
            position: 'fixed',
            top: 0,
            right: 0,
            left: collapsed ? LAYOUT.sider.collapsed : LAYOUT.sider.expanded,
            zIndex: Z_INDEX.header,
            height: LAYOUT.header.height,
            transition: 'left 0.2s',
            borderBottom: isDark ? '1px solid #434343' : '1px solid #e8eaed',
          }}
        >
          <Space size="middle" align="center">
            {/* Collapse Button - Academic Style */}
            <div
              onClick={() => setCollapsed(!collapsed)}
              style={{
                cursor: 'pointer',
                fontSize: '18px',
                color: isDark ? '#ffffff' : '#1e3a5f',
                padding: '8px',
                borderRadius: '6px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = isDark ? '#2a2a2a' : '#f3f4f6')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          </Space>

          <Space size="middle" align="center" style={{ marginRight: '4px' }}>
            {/* Notifications */}
            <NotificationDropdown
              visible={notificationVisible}
              onVisibleChange={handleNotificationVisibleChange}
              notifications={notifications}
              unreadCount={unreadCount}
              loading={loadingNotifications}
              isDark={isDark}
              onNotificationClick={handleNotificationClick}
              onMarkAllRead={handleMarkAllRead}
            />

            {/* Language Toggle */}
            <LanguageToggle />

            {/* User Menu - Academic Style */}
            <Dropdown menu={{ items: dropdownMenuItems, onClick: handleUserMenuClick }} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer', padding: '8px 14px', borderRadius: '8px', transition: 'background 0.2s' }} size="small">
                <Avatar
                  size={36}
                  src={currentUser?.imageUrl || currentUser?.avatarUrl}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#2c5282', border: isDark ? '2px solid #434343' : '2px solid #e8eaed' }}
                />
                <Text strong style={{ fontSize: '14px', color: isDark ? '#ffffff' : '#1e3a5f', fontWeight: 600 }}>
                  {getUserDisplayName(currentUser, t)}
                </Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Main Content - Academic Style */}
        <Content
          style={{
            margin: `${LAYOUT.header.height}px 0 0 0`,
            background: isDark ? '#141414' : '#f8f9fa',
            minHeight: `calc(100vh - ${LAYOUT.header.height}px)`,
            padding: '24px',
          }}
        >
          <div
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
            }}
          >
            <Outlet />
          </div>
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: 'center',
            background: isDark ? '#1a1f26' : GRADIENTS.primaryHorizontal,
            padding: '20px 50px',
            color: '#fff',
          }}
        >
          <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', fontWeight: 500 }}>{t('footer.copyright')}</Text>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
