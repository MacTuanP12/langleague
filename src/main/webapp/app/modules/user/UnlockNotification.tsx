import React, { useState } from 'react';
import { Modal, Typography, Button } from 'antd';
import { Trophy, Sparkles } from 'lucide-react';
import { UserAchievementDTO } from 'app/shared/services/achievement.service';
import { t } from 'i18next';

const { Title, Text } = Typography;

export interface UnlockNotificationProps {
  achievement: UserAchievementDTO;
  onClose: () => void;
}

const UnlockNotification: React.FC<UnlockNotificationProps> = ({ achievement, onClose }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const rarityColors = {
    COMMON: '#8c8c8c',
    RARE: '#1890ff',
    EPIC: '#722ed1',
    LEGENDARY: '#faad14',
  };

  const achievementData = achievement.achievement;
  const color = rarityColors[achievementData?.rarity || 'COMMON'];

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      centered
      width={500}
      closeIcon={null}
      maskStyle={{ backdropFilter: 'blur(4px)' }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '32px',
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
          borderRadius: '12px',
        }}
      >
        {/* Icon with animation */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: `0 8px 24px ${color}40`,
            animation: 'pulse 2s infinite',
          }}
        >
          {achievementData?.iconUrl ? (
            <img src={achievementData.iconUrl} alt={achievementData.name} style={{ width: 80, height: 80, borderRadius: '50%' }} />
          ) : (
            <Trophy size={64} color="white" />
          )}
        </div>

        {/* Sparkles */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Sparkles size={24} style={{ position: 'absolute', top: -10, left: '30%', color }} />
          <Sparkles size={20} style={{ position: 'absolute', top: -5, right: '25%', color }} />
        </div>

        {/* Achievement unlocked text */}
        <Text
          style={{
            display: 'block',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color,
            fontWeight: 600,
            marginBottom: '8px',
          }}
        >
          {t('achievements.notifications.unlocked')}
        </Text>

        <Title level={2} style={{ margin: '0 0 8px', color }}>
          {achievementData?.name}
        </Title>

        <Text type="secondary" style={{ fontSize: '16px', display: 'block', marginBottom: '24px' }}>
          {achievementData?.description}
        </Text>

        <div
          style={{
            display: 'inline-block',
            padding: '8px 24px',
            borderRadius: '24px',
            backgroundColor: `${color}20`,
            marginBottom: '24px',
          }}
        >
          <Text strong style={{ color, fontSize: '18px' }}>
            +{achievementData?.points || 0} Points
          </Text>
        </div>

        <div>
          <Button type="primary" size="large" onClick={handleClose} style={{ backgroundColor: color, borderColor: color }}>
            Awesome!
          </Button>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
        `}
      </style>
    </Modal>
  );
};

export default UnlockNotification;
