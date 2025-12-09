/**
 * Centralized export for all API services
 * Import services from this file instead of individual service files
 */

// Core services
export * from './account.service';
export * from './app-user.service';
export * from './user.service';

// Content services
export * from './book.service';
export * from './book-upload.service';
// Export user-book.service with renamed functions to avoid conflicts
export {
  getMyBooks as getUserBooks,
  getFavoriteBooks,
  getBooksByStatus as getUserBooksByStatus,
  getStatistics as getUserBookStatistics,
  saveBook,
  removeBook,
  updateLearningStatus,
  updateCurrentChapter,
  updateProgress as updateUserBookProgress,
  toggleFavorite as toggleUserBookFavorite,
} from './user-book.service';
export * from './chapter.service';
// Note: lesson.service.ts has been removed - Backend only uses chapters
export * from './word.service';
export * from './grammar.service';

// Exercise services
export * from './exercise.service';

// Social & Engagement services
export * from './book-review.service';
export * from './comment.service';
export * from './favorite.service';

// Progress tracking services
// Export progress.service with renamed functions to avoid conflicts
export {
  getMyBooks as getMyBooksProgress,
  getBookProgress,
  upsertBookProgress,
  updateBookProgress,
  deleteBookProgress,
  getMyChapters,
  getChapterProgress,
  getChapterProgressesByBook,
  upsertChapterProgress,
  updateChapterProgress,
  deleteChapterProgress,
  getMyBooksApi,
  getBookProgressApi,
  getChapterProgressApi,
  upsertBookProgressApi,
  upsertChapterProgressApi,
} from './progress.service';
export * from './study-session.service';
export * from './learning-streak.service';
export * from './learning-report.service';

// Gamification services
export * from './achievement.service';
export * from './book-review.service';

// Notification service
export * from './notification.service';

// Utility services
export * from './file-upload.service';
export * from './captcha.service';

// Note: user-management.service.ts has been merged into user.service.ts
// All admin user management APIs are available from user.service.ts
