import React from 'react';
import { Timeline, Typography } from 'antd';
import { BookOpen, Trophy, Award, CheckCircle } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text } = Typography;

export interface TimelineItem {
  id: number;
  type: string;
  title: string;
  description?: string;
  timestamp: string;
  points?: number;
}

interface ProgressTimelineProps {
  items: TimelineItem[];
}

const getIcon = (type: string) => {
  switch (type) {
    case 'chapter_completed':
      return <CheckCircle size={16} color="#52c41a" />;
    case 'achievement_unlocked':
      return <Trophy size={16} color="#faad14" />;
    case 'book_started':
      return <BookOpen size={16} color="#1890ff" />;
    case 'exercise_completed':
      return <Award size={16} color="#722ed1" />;
    default:
      return <CheckCircle size={16} color="#8c8c8c" />;
  }
};

const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ items }) => {
  const timelineItems = items.map(item => ({
    dot: getIcon(item.type),
    children: (
      <div>
        <Text strong>{item.title}</Text>
        {item.description && (
          <div>
            <Text type="secondary">{item.description}</Text>
          </div>
        )}
        {item.points && (
          <div>
            <Text type="warning">+{item.points} points</Text>
          </div>
        )}
        <div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {dayjs(item.timestamp).fromNow()}
          </Text>
        </div>
      </div>
    ),
  }));

  return <Timeline items={timelineItems} />;
};

export default ProgressTimeline;
