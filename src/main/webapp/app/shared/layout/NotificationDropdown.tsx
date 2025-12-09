import React from 'react';
import { Dropdown, Badge, List, Button, Empty, Spin, Typography } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { NotificationDTO } from 'app/shared/services/notification.service';
import dayjs from 'dayjs';

const { Text } = Typography;

interface NotificationDropdownProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  notifications: NotificationDTO[];
  unreadCount: number;
  loading: boolean;
  isDark: boolean;
  onNotificationClick: (notification: NotificationDTO) => void;
  onMarkAllRead: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  visible,
  onVisibleChange,
  notifications,
  unreadCount,
  loading,
  isDark,
  onNotificationClick,
  onMarkAllRead,
}) => {
  const { t } = useTranslation('common');

  return (
    <Dropdown
      open={visible}
      onOpenChange={onVisibleChange}
      placement="bottomRight"
      trigger={['click']}
      dropdownRender={() => (
        <div
          style={{
            width: 360,
            maxHeight: 480,
            background: isDark ? '#1f1f1f' : '#fff',
            borderRadius: '8px',
            boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            border: isDark ? '1px solid #434343' : '1px solid #e8eaed',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: isDark ? '1px solid #434343' : '1px solid #e8eaed',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: isDark ? '#2a2a2a' : '#f8f9fa',
            }}
          >
            <Text strong style={{ fontSize: '15px', color: isDark ? '#ffffff' : '#1e3a5f', fontWeight: 600 }}>
              {t('settings.notifications')}
            </Text>
            {unreadCount > 0 && (
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                onClick={onMarkAllRead}
                style={{ color: isDark ? '#667eea' : '#1e3a5f', fontWeight: 500 }}
              >
                Mark all read
              </Button>
            )}
          </div>

          {/* Notification List */}
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <Spin />
              </div>
            ) : notifications.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No notifications" style={{ padding: '40px 20px' }} />
            ) : (
              <List
                dataSource={notifications}
                renderItem={item => (
                  <List.Item
                    style={{
                      padding: '14px 20px',
                      cursor: 'pointer',
                      background: item.isRead ? '#fff' : '#f0f7ff',
                      borderLeft: item.isRead ? 'none' : '3px solid #2c5282',
                      transition: 'background 0.2s',
                    }}
                    onClick={() => onNotificationClick(item)}
                    onMouseEnter={e => (e.currentTarget.style.background = item.isRead ? '#f8f9fa' : '#e6f3ff')}
                    onMouseLeave={e => (e.currentTarget.style.background = item.isRead ? '#fff' : '#f0f7ff')}
                  >
                    <List.Item.Meta
                      title={
                        <Text strong style={{ fontSize: '14px', color: '#1e3a5f', fontWeight: 600 }}>
                          {item.title}
                        </Text>
                      }
                      description={
                        <>
                          <Text style={{ fontSize: '13px', color: '#4b5563', display: 'block', marginBottom: '6px', lineHeight: 1.5 }}>
                            {item.message}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px', color: '#9ca3af' }}>
                            {item.createdDate ? dayjs(item.createdDate).fromNow() : ''}
                          </Text>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
        </div>
      )}
    >
      <Badge count={unreadCount} size="small" offset={[-4, 4]} style={{ backgroundColor: '#2c5282' }}>
        <BellOutlined style={{ fontSize: '18px', color: isDark ? '#ffffff' : '#1e3a5f', cursor: 'pointer' }} />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;
