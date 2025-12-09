import React from 'react';
import { Rate } from 'antd';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  allowHalf?: boolean;
  showCount?: boolean;
  count?: number;
  size?: 'small' | 'default' | 'large';
}

const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  onChange,
  disabled = false,
  allowHalf = false,
  showCount = false,
  count,
  size = 'default',
}) => {
  const fontSize = size === 'small' ? 14 : size === 'large' ? 24 : 18;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Rate value={value} onChange={onChange} disabled={disabled} allowHalf={allowHalf} style={{ fontSize, color: '#fadb14' }} />
      {showCount && count !== undefined && <span style={{ color: '#8c8c8c', fontSize: '14px' }}>({count})</span>}
    </div>
  );
};

export default StarRating;
