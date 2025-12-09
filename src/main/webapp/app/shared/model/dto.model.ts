// Auto-generated TypeScript interfaces matching Backend DTOs
// Last updated: 2025-12-05

export enum Level {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum LearningStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

// ==================== BOOK DOMAIN ====================

export interface BookDTO {
  id?: number;
  title: string;
  level: Level;
  description?: string;
  thumbnail?: string;
  isActive?: boolean;
  averageRating?: number;
  totalReviews?: number;
}

export interface ChapterDTO {
  id?: number;
  title: string;
  orderIndex: number;
  book?: BookDTO;
}

export interface ChapterDetailDTO extends ChapterDTO {
  description?: string;
  pageStart?: number;
  pageEnd?: number;
  totalWords?: number;
  totalGrammars?: number;
  totalExercises?: number;
}

// ==================== USER LIBRARY ====================

export interface UserBookDTO {
  id?: number;
  savedAt: string;
  learningStatus: LearningStatus;
  currentChapterId?: number;
  currentChapterTitle?: string;
  lastAccessedAt?: string;
  progressPercentage?: number;
  isFavorite?: boolean;
  appUserId?: number;
  appUserDisplayName?: string;
  bookId: number;
  bookTitle: string;
  bookThumbnail?: string;
  bookLevel?: string;
  bookDescription?: string;
}

export interface UserChapterDTO {
  id?: number;
  savedAt: string;
  learningStatus: LearningStatus;
  lastAccessedAt?: string;
  isFavorite?: boolean;
  notes?: string;
  tags?: string;
  appUser?: AppUserDTO;
  chapter?: ChapterDTO;
  // Extended fields
  chapterTitle?: string;
  chapterOrderIndex?: number;
  bookId?: number;
  bookTitle?: string;
  bookThumbnail?: string;
  bookLevel?: string;
  progressPercent?: number;
  completed?: boolean;
}

// ==================== PROGRESS TRACKING ====================

export interface ChapterProgressDTO {
  id?: number;
  percent?: number;
  lastAccessed?: string;
  completed?: boolean;
  appUser?: AppUserDTO;
  chapter?: ChapterDTO;
}

export interface MyChapterDTO {
  chapterId: number;
  chapterTitle: string;
  chapterOrderIndex: number;
  bookId: number;
  bookTitle: string;
  bookThumbnail?: string;
  bookLevel?: string;
  progressPercent: number;
  completed: boolean;
  lastAccessed: string;
}

// ==================== LEARNING CONTENT ====================

export interface WordDTO {
  id?: number;
  text: string;
  meaning: string;
  pronunciation?: string;
  partOfSpeech?: string;
  orderIndex?: number;
  chapterId?: number;
}

export interface WordExampleDTO {
  id?: number;
  sentence: string;
  translation: string;
  orderIndex?: number;
  wordId?: number;
}

export interface GrammarDTO {
  id?: number;
  pattern: string;
  explanation: string;
  usage?: string;
  orderIndex?: number;
  chapterId?: number;
}

export interface GrammarExampleDTO {
  id?: number;
  sentence: string;
  translation: string;
  orderIndex?: number;
  grammarId?: number;
}

// ==================== EXERCISES ====================

export interface ListeningExerciseDTO {
  id?: number;
  question: string;
  audioUrl?: string;
  correctAnswer?: string;
  orderIndex?: number;
  chapterId?: number;
}

export interface ListeningOptionDTO {
  id?: number;
  optionText: string;
  isCorrect?: boolean;
  orderIndex?: number;
  listeningExerciseId?: number;
}

export interface ReadingExerciseDTO {
  id?: number;
  passage: string;
  question: string;
  correctAnswer?: string;
  orderIndex?: number;
  chapterId?: number;
}

export interface ReadingOptionDTO {
  id?: number;
  optionText: string;
  isCorrect?: boolean;
  orderIndex?: number;
  readingExerciseId?: number;
}

export interface SpeakingExerciseDTO {
  id?: number;
  prompt: string;
  sampleAnswer?: string;
  orderIndex?: number;
  chapterId?: number;
}

export interface WritingExerciseDTO {
  id?: number;
  prompt: string;
  sampleAnswer?: string;
  orderIndex?: number;
  chapterId?: number;
}

export interface ExerciseResultDTO {
  id?: number;
  score?: number;
  completedAt?: string;
  timeSpent?: number;
  userAnswer?: string;
  isCorrect?: boolean;
  appUserId?: number;
  listeningExerciseId?: number;
  readingExerciseId?: number;
  speakingExerciseId?: number;
  writingExerciseId?: number;
}

// ==================== USER DOMAIN ====================

export interface AppUserDTO {
  id?: number;
  displayName?: string;
  bio?: string;
  avatar?: string;
  totalPoints?: number;
  currentLevel?: number;
  streak?: number;
  internalUser?: UserDTO;
}

export interface UserDTO {
  id?: number;
  login?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
  activated?: boolean;
  langKey?: string;
  authorities?: string[];
}

// ==================== SOCIAL ====================

export interface BookReviewDTO {
  id?: number;
  rating: number;
  comment?: string;
  reviewDate?: string;
  appUserId?: number;
  appUserDisplayName?: string;
  bookId?: number;
}

export interface CommentDTO {
  id?: number;
  content: string;
  commentDate?: string;
  appUserId?: number;
  appUserDisplayName?: string;
  chapterId?: number;
}

// ==================== GAMIFICATION ====================

export interface AchievementDTO {
  id?: number;
  name: string;
  description?: string;
  iconUrl?: string;
  requiredPoints?: number;
}

export interface UserAchievementDTO {
  id?: number;
  earnedAt?: string;
  appUserId?: number;
  achievementId?: number;
  achievementName?: string;
}

export interface LearningStreakDTO {
  id?: number;
  currentStreak?: number;
  longestStreak?: number;
  lastStudyDate?: string;
  appUserId?: number;
}

export interface StudySessionDTO {
  id?: number;
  sessionDate?: string;
  duration?: number;
  pointsEarned?: number;
  appUserId?: number;
}

// ==================== NOTIFICATIONS ====================

export interface NotificationDTO {
  id?: number;
  type?: string;
  title?: string;
  message?: string;
  isRead?: boolean;
  createdAt?: string;
  userLogin?: string;
}

// ==================== UPLOAD ====================

export interface BookUploadDTO {
  id?: number;
  originalFilename?: string;
  storedFilename?: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  processingStatus?: string;
  errorMessage?: string;
  extractedBookId?: number;
}

// ==================== STATISTICS ====================

export interface UserBookStatisticsDTO {
  totalBooks: number;
  booksInProgress: number;
  booksCompleted: number;
  favoriteBooks: number;
}

export interface DashboardStatsDTO {
  totalUsers?: number;
  totalBooks?: number;
  totalChapters?: number;
  activeUsers?: number;
}
