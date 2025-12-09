import React from 'react';
import { Button, ButtonProps } from 'antd';

interface GamificationButtonProps extends Omit<ButtonProps, 'variant'> {
  buttonVariant?: 'primary' | 'secondary' | 'danger' | 'success';
  use3DStyle?: boolean;
}

/**
 * Gamification Button với hiệu ứng 3D và animation
 * Tạo cảm giác interactive và thú vị khi click
 */
const GamificationButton: React.FC<GamificationButtonProps> = ({
  children,
  buttonVariant = 'primary',
  use3DStyle = true,
  className = '',
  ...props
}) => {
  const getVariantClasses = () => {
    if (!use3DStyle) return '';

    switch (buttonVariant) {
      case 'primary':
        return 'bg-primary hover:bg-primary-hover text-white font-bold border-b-4 border-primary-dark active:border-b-0 active:translate-y-1';
      case 'secondary':
        return 'bg-secondary hover:bg-secondary-hover text-white font-bold border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1';
      case 'danger':
        return 'bg-danger hover:bg-danger-hover text-white font-bold border-b-4 border-[#E63535] active:border-b-0 active:translate-y-1';
      case 'success':
        return 'bg-success hover:bg-success-hover text-white font-bold border-b-4 border-success-dark active:border-b-0 active:translate-y-1';
      default:
        return '';
    }
  };

  return (
    <Button
      {...props}
      className={`
        ${getVariantClasses()}
        transition-all duration-100 rounded-xl
        ${className}
      `.trim()}
    >
      {children}
    </Button>
  );
};

export default GamificationButton;
