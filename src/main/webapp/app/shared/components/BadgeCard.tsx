import React from 'react';
import { Card, Badge, Typography, Space } from 'antd';
import { Trophy, Lock } from 'lucide-react';

const { Text, Title } = Typography;

interface BadgeCardProps {
  name: string;
  description: string;
  iconUrl?: string;
  badgeColor?: string;
  rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  locked?: boolean;
  progress?: number;
  requirement?: number;
  unlockedDate?: string;
  onClick?: () => void;
}

const rarityColors = {
  COMMON: '#8c8c8c',
  RARE: '#1890ff',
  EPIC: '#722ed1',
  LEGENDARY: '#faad14',
};

const BadgeCard: React.FC<BadgeCardProps> = ({
  name,
  description,
  iconUrl,
  badgeColor,
  rarity = 'COMMON',
  locked = false,
  progress,
  requirement,
  unlockedDate,
  onClick,
}) => {
  const rarityColor = rarityColors[rarity];

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      style={{
        borderRadius: '12px',
        border: locked ? '2px solid #d9d9d9' : `2px solid ${rarityColor}`,
        opacity: locked ? 0.6 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
      bodyStyle={{ padding: '16px' }}
    >
      {/* Rarity badge */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          padding: '2px 8px',
          borderRadius: '4px',
          backgroundColor: rarityColor,
          color: 'white',
          fontSize: '10px',
          fontWeight: 600,
          textTransform: 'uppercase',
        }}
      >
        {rarity}
      </div>

      <Space direction="vertical" style={{ width: '100%' }} size="small">
        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: '8px', position: 'relative' }}>
          {iconUrl ? (
            <img src={iconUrl} alt={name} style={{ width: 64, height: 64, borderRadius: '50%' }} />
          ) : (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: badgeColor || rarityColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              {locked ? <Lock size={32} color="white" /> : <Trophy size={32} color="white" />}
            </div>
          )}
        </div>

        {/* Name */}
        <Title level={5} style={{ textAlign: 'center', margin: '8px 0 4px' }}>
          {name}
        </Title>

        {/* Description */}
        <Text type="secondary" style={{ fontSize: '12px', textAlign: 'center', display: 'block' }}>
          {description}
        </Text>

        {/* Progress bar (if locked and has progress) */}
        {locked && progress !== undefined && requirement !== undefined && (
          <div style={{ marginTop: '8px' }}>
            <div
              style={{
                height: '6px',
                backgroundColor: '#f0f0f0',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(progress / requirement) * 100}%`,
                  backgroundColor: rarityColor,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <Text type="secondary" style={{ fontSize: '11px', marginTop: '4px', display: 'block', textAlign: 'center' }}>
              {progress} / {requirement}
            </Text>
          </div>
        )}

        {/* Unlocked date */}
        {!locked && unlockedDate && (
          <Text type="secondary" style={{ fontSize: '11px', textAlign: 'center', display: 'block', marginTop: '4px' }}>
            Unlocked: {new Date(unlockedDate).toLocaleDateString()}
          </Text>
        )}
      </Space>
    </Card>
  );
};

export default BadgeCard;
