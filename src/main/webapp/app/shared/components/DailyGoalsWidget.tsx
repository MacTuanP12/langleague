import React from 'react';
import { Card, Progress, Typography, Space } from 'antd';
import { TrophyOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface DailyGoalsWidgetProps {
  currentXP: number;
  targetXP: number;
  compact?: boolean;
}

/**
 * Widget hiển thị mục tiêu XP hằng ngày
 * Sử dụng Ring Progress để tạo cảm giác hoàn thành
 */
const DailyGoalsWidget: React.FC<DailyGoalsWidgetProps> = ({ currentXP, targetXP, compact = false }) => {
  const percentage = Math.min((currentXP / targetXP) * 100, 100);
  const isCompleted = currentXP >= targetXP;

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary-light to-success-light rounded-xl">
        <TrophyOutlined style={{ fontSize: 24, color: isCompleted ? '#58CC02' : '#A3A3A3' }} />
        <div className="flex-1">
          <Text className="block text-xs text-neutral-600">Mục tiêu ngày</Text>
          <Text strong className="text-primary">
            {currentXP}/{targetXP} XP
          </Text>
        </div>
        <Progress
          type="circle"
          percent={percentage}
          width={50}
          strokeColor={{
            '0%': '#58CC02',
            '100%': '#46A302',
          }}
          format={() => ''}
        />
      </div>
    );
  }

  return (
    <Card className="border-2 border-primary-light hover:shadow-card-hover transition-all" style={{ borderRadius: 16 }}>
      <div className="text-center">
        <Title level={4} className="mb-4 text-primary">
          <TrophyOutlined className="mr-2" />
          Mục tiêu hôm nay
        </Title>

        <div className="mb-4">
          <Progress
            type="circle"
            percent={percentage}
            width={120}
            strokeWidth={8}
            strokeColor={{
              '0%': '#58CC02',
              '100%': '#46A302',
            }}
            format={() => (
              <div>
                <Text className="block text-2xl font-bold text-primary">{currentXP}</Text>
                <Text className="text-xs text-neutral-500">/ {targetXP} XP</Text>
              </div>
            )}
          />
        </div>

        {isCompleted ? (
          <div className="bg-success-light p-3 rounded-lg animate-slide-up">
            <Space>
              <CheckCircleOutlined style={{ color: '#58CC02', fontSize: 20 }} />
              <Text strong className="text-success">
                🎉 Hoàn thành mục tiêu!
              </Text>
            </Space>
          </div>
        ) : (
          <div>
            <Text type="secondary" className="text-sm">
              Còn lại: {targetXP - currentXP} XP
            </Text>
            <div className="mt-2 text-xs text-neutral-500">💡 Hoàn thành 1 bài tập để đạt mục tiêu</div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DailyGoalsWidget;
