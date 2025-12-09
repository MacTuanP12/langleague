import React from 'react';
import { Card, Typography, Tooltip } from 'antd';
import { FireOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface StreakDisplayProps {
  currentStreak: number;
  compact?: boolean;
  showAnimation?: boolean;
}

/**
 * Component hiển thị streak (chuỗi ngày học liên tiếp)
 * Có animation và hiệu ứng gamification
 */
const StreakDisplay: React.FC<StreakDisplayProps> = ({ currentStreak, compact = false, showAnimation = true }) => {
  if (compact) {
    // Compact version cho Header
    return (
      <Tooltip title={`Bạn đã học liên tiếp ${currentStreak} ngày!`}>
        <div
          className={`
            flex items-center gap-2 px-3 py-2 rounded-full bg-orange-50
            cursor-pointer hover:bg-orange-100 transition-all
            ${showAnimation && currentStreak > 0 ? 'animate-streak-pulse' : ''}
          `}
        >
          <FireOutlined
            style={{
              fontSize: 20,
              color: currentStreak > 0 ? '#FF6B35' : '#D4D4D4',
            }}
          />
          <Text strong style={{ color: '#FF6B35', fontSize: 16 }}>
            {currentStreak}
          </Text>
        </div>
      </Tooltip>
    );
  }

  // Full card version cho Dashboard
  return (
    <Card
      className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white hover:shadow-card-hover transition-all"
      style={{ borderRadius: 16 }}
    >
      <div className="text-center">
        <div
          className={`
            inline-flex items-center justify-center w-20 h-20 mb-3
            rounded-full bg-gradient-to-br from-orange-400 to-orange-600
            ${showAnimation && currentStreak > 0 ? 'animate-bounce-soft' : ''}
          `}
        >
          <FireOutlined style={{ fontSize: 40, color: '#fff' }} />
        </div>

        <div>
          <Text className="block text-4xl font-bold text-orange-600 mb-1">{currentStreak}</Text>
          <Text className="text-neutral-600">{currentStreak === 0 ? 'Ngày' : currentStreak === 1 ? 'Ngày' : 'Ngày'}</Text>
        </div>

        <div className="mt-3 pt-3 border-t border-orange-200">
          <Text type="secondary" className="text-sm">
            🔥 Chuỗi ngày học liên tiếp
          </Text>
        </div>

        {currentStreak >= 7 && (
          <div className="mt-2">
            <Text className="text-xs text-orange-600 font-semibold">⭐ Tuyệt vời! Tiếp tục phát huy!</Text>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StreakDisplay;
