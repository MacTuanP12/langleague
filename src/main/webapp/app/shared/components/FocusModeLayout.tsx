import React, { useEffect } from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

interface FocusModeLayoutProps {
  children: React.ReactNode;
  onExit: () => void;
  progress?: number;
  showProgress?: boolean;
}

/**
 * Focus Mode Layout cho Exercise
 * Ẩn header/sidebar, chỉ hiển thị nội dung bài tập để tối đa hóa tập trung
 */
const FocusModeLayout: React.FC<FocusModeLayoutProps> = ({ children, onExit, progress = 0, showProgress = true }) => {
  useEffect(() => {
    // Ẩn header và sidebar khi vào Focus Mode
    const header = document.querySelector('.dashboard-header');
    const sidebar = document.querySelector('.dashboard-sidebar');

    if (header) (header as HTMLElement).style.display = 'none';
    if (sidebar) (sidebar as HTMLElement).style.display = 'none';

    // Cleanup khi unmount
    return () => {
      if (header) (header as HTMLElement).style.display = '';
      if (sidebar) (sidebar as HTMLElement).style.display = '';
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#FAFAFA',
        zIndex: 1000,
        overflow: 'auto',
      }}
    >
      {/* Focus Mode Header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 10,
        }}
      >
        {/* Progress Bar */}
        {showProgress && (
          <div style={{ flex: 1, maxWidth: 600, marginRight: 24 }}>
            <div
              style={{
                height: 8,
                background: '#f0f0f0',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #58CC02 0%, #46A302 100%)',
                  width: `${progress}%`,
                  transition: 'width 0.3s ease',
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        )}

        {/* Exit Button */}
        <Button
          type="text"
          size="large"
          icon={<CloseOutlined />}
          onClick={onExit}
          style={{
            color: '#666',
            fontWeight: 500,
          }}
        >
          Thoát
        </Button>
      </div>

      {/* Content */}
      <div
        style={{
          padding: '24px',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default FocusModeLayout;
