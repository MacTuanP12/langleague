import React, { ReactNode } from 'react';
import { Card, Statistic } from 'antd';

interface ChartCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  color?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, value, icon, color = '#1890ff' }) => {
  return (
    <Card>
      <Statistic title={title} value={value} prefix={icon} style={{ color }} />
    </Card>
  );
};

export default ChartCard;
