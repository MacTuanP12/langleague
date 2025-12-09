import React from 'react';
import { Button, Progress } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface FocusLayoutProps {
  children: React.ReactNode;
  progress?: number; // % hoàn thành bài học
  title?: string;
  onExit?: () => void;
}

const FocusLayout: React.FC<FocusLayoutProps> = ({ children, progress = 0, title, onExit }) => {
  const navigate = useNavigate();

  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      navigate(-1); // Quay lại trang trước
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 1. Minimal Header */}
      <header className="h-16 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4 flex-1">
          <Button
            type="text"
            icon={<CloseOutlined className="text-gray-500 text-lg" />}
            onClick={handleExit}
            className="hover:bg-gray-100 rounded-full"
          />
          {/* Progress Bar */}
          <div className="flex-1 max-w-md mx-auto">
            <Progress percent={progress} showInfo={false} strokeColor="#58CC02" size="small" />
          </div>
        </div>

        <div className="font-semibold text-gray-700 hidden md:block">{title || 'Đang học tập'}</div>
      </header>

      {/* 2. Main Content Area (Centered & Focused) */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">{children}</main>
    </div>
  );
};

export default FocusLayout;
