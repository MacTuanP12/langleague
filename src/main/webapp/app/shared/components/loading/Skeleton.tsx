import React from 'react';
import './Skeleton.scss';

// ============================================
// TypeScript Interfaces
// ============================================
export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
}

// ============================================
// Base Skeleton Component
// ============================================
export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  className = '',
  variant = 'rectangular',
  animation = 'wave',
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
    };

    switch (variant) {
      case 'text':
        return {
          ...styles,
          height: height || '1em',
          borderRadius: borderRadius || '4px',
          width: width || '100%',
        };
      case 'circular':
        return {
          ...styles,
          borderRadius: '50%',
          width: width || height || '40px',
          height: height || width || '40px',
        };
      case 'rectangular':
      default:
        return {
          ...styles,
          borderRadius: borderRadius || '8px',
        };
    }
  };

  const animationClass = animation !== 'none' ? `skeleton-${animation}` : '';

  return (
    <div className={`skeleton ${animationClass} ${className}`} style={getVariantStyles()} aria-busy="true" aria-live="polite" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// ============================================
// Book Card Skeleton - For Dashboard
// ============================================
export const BookSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`book-skeleton ${className}`}>
      {/* Book Image Area */}
      <Skeleton variant="rectangular" height={180} className="book-skeleton-image" />

      {/* Book Info */}
      <div className="book-skeleton-content">
        {/* Badge */}
        <Skeleton variant="rectangular" width={80} height={24} borderRadius={12} className="book-skeleton-badge" />

        {/* Title */}
        <Skeleton variant="text" height={24} className="book-skeleton-title" />
        <Skeleton variant="text" width="70%" height={20} className="book-skeleton-subtitle" />

        {/* Progress Bar */}
        <div className="book-skeleton-progress">
          <Skeleton variant="rectangular" height={8} borderRadius={4} />
          <div className="book-skeleton-progress-text">
            <Skeleton variant="text" width={60} height={16} />
            <Skeleton variant="text" width={80} height={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Lesson Skeleton - For BookLearn
// ============================================
export const LessonSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`lesson-skeleton ${className}`}>
      {/* Sidebar */}
      <div className="lesson-skeleton-sidebar">
        <Skeleton variant="text" height={20} width="60%" className="lesson-skeleton-sidebar-title" />
        <div className="lesson-skeleton-units">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="lesson-skeleton-unit">
              <Skeleton variant="circular" width={32} height={32} />
              <div className="lesson-skeleton-unit-text">
                <Skeleton variant="text" height={16} />
                <Skeleton variant="text" width="70%" height={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="lesson-skeleton-content">
        {/* Header */}
        <div className="lesson-skeleton-header">
          <Skeleton variant="text" height={32} width="40%" />
          <Skeleton variant="text" height={20} width="60%" className="lesson-skeleton-description" />
        </div>

        {/* Content Cards Grid */}
        <div className="lesson-skeleton-cards">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="lesson-skeleton-card">
              <Skeleton variant="circular" width={48} height={48} />
              <div className="lesson-skeleton-card-text">
                <Skeleton variant="text" height={18} />
                <Skeleton variant="text" width="80%" height={14} />
              </div>
            </div>
          ))}
        </div>

        {/* Progress Section */}
        <div className="lesson-skeleton-progress-section">
          <Skeleton variant="text" height={20} width="30%" />
          <Skeleton variant="rectangular" height={12} borderRadius={6} />
        </div>
      </div>
    </div>
  );
};

// ============================================
// Dashboard Grid Skeleton - For Loading Multiple Cards
// ============================================
export const DashboardSkeleton: React.FC<{ count?: number; className?: string }> = ({ count = 6, className = '' }) => {
  return (
    <div className={`dashboard-skeleton ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <BookSkeleton key={index} />
      ))}
    </div>
  );
};

// ============================================
// Text Line Skeleton - For Paragraphs
// ============================================
export const TextLineSkeleton: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`text-line-skeleton ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} variant="text" width={index === lines - 1 ? '70%' : '100%'} height={16} />
      ))}
    </div>
  );
};

// ============================================
// Profile Skeleton - For StudentProfile
// ============================================
export const ProfileSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`profile-skeleton ${className}`}>
      <div className="profile-skeleton-card">
        {/* Avatar Section */}
        <div className="profile-skeleton-header">
          <div className="profile-skeleton-avatar-section">
            <Skeleton variant="circular" width={120} height={120} className="profile-skeleton-avatar" />
            <Skeleton variant="rectangular" width={140} height={36} borderRadius={8} className="profile-skeleton-change-photo" />
          </div>
        </div>

        {/* Form Fields */}
        <div className="profile-skeleton-form">
          {/* Full Name */}
          <div className="profile-skeleton-field">
            <Skeleton variant="text" width={100} height={20} className="profile-skeleton-label" />
            <Skeleton variant="rectangular" height={48} borderRadius={8} className="profile-skeleton-input" />
          </div>

          {/* Email */}
          <div className="profile-skeleton-field">
            <Skeleton variant="text" width={120} height={20} className="profile-skeleton-label" />
            <Skeleton variant="rectangular" height={48} borderRadius={8} className="profile-skeleton-input" />
          </div>

          {/* Bio */}
          <div className="profile-skeleton-field">
            <Skeleton variant="text" width={100} height={20} className="profile-skeleton-label" />
            <Skeleton variant="rectangular" height={120} borderRadius={8} className="profile-skeleton-textarea" />
          </div>

          {/* Theme */}
          <div className="profile-skeleton-field">
            <Skeleton variant="text" width={140} height={20} className="profile-skeleton-label" />
            <Skeleton variant="rectangular" height={48} borderRadius={8} className="profile-skeleton-input" />
          </div>

          {/* Save Button */}
          <Skeleton variant="rectangular" width={180} height={48} borderRadius={8} className="profile-skeleton-button" />
        </div>
      </div>
    </div>
  );
};

// ============================================
// Book List Skeleton - For BookList
// ============================================
export const BookListSkeleton: React.FC<{ count?: number; className?: string }> = ({ count = 8, className = '' }) => {
  return (
    <div className={`book-list-skeleton ${className}`}>
      {/* Header */}
      <div className="book-list-skeleton-header">
        <Skeleton variant="text" width={200} height={40} className="book-list-skeleton-title" />
        <Skeleton variant="text" width={300} height={24} className="book-list-skeleton-description" />
      </div>

      {/* Book Grid */}
      <div className="book-list-skeleton-grid">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="book-list-skeleton-card">
            {/* Book Cover */}
            <Skeleton variant="rectangular" height={240} className="book-list-skeleton-cover" />

            {/* Book Info */}
            <div className="book-list-skeleton-info">
              <Skeleton variant="text" height={24} className="book-list-skeleton-book-title" />
              <Skeleton variant="text" height={18} width="90%" className="book-list-skeleton-book-description" />
              <Skeleton variant="text" height={18} width="70%" className="book-list-skeleton-book-description" />

              {/* Meta Info */}
              <div className="book-list-skeleton-meta">
                <Skeleton variant="rectangular" width={60} height={24} borderRadius={12} />
                <Skeleton variant="text" width={100} height={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
