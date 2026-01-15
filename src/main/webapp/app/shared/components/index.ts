// Loading Components
export { LoadingSpinner, InlineSpinner } from './loading/LoadingSpinner';
export type { LoadingSpinnerProps } from './loading/LoadingSpinner';
export {
  Skeleton,
  BookSkeleton, // ✅ Fixed: Renamed from CourseSkeleton
  LessonSkeleton,
  DashboardSkeleton,
  TextLineSkeleton,
  ProfileSkeleton,
  BookListSkeleton,
} from './loading/Skeleton';
export type { SkeletonProps } from './loading/Skeleton';

// Error Components
export { ErrorDisplay, InlineError, ErrorAlert } from './error/ErrorDisplay';
export type { ErrorDisplayProps } from './error/ErrorDisplay';

// Modal Components
export { ConfirmModal } from './modal/ConfirmModal';
export type { ConfirmModalProps } from './modal/ConfirmModal';

// Learning Components (for book content navigation)
export { ContentSidebar, UnitList } from './learning';

// Empty State Component
export { EmptyState } from './EmptyState';
