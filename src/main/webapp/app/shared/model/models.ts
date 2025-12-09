// DTOs matching backend exactly - follow JHipster convention

// User Role Enum
export enum UserRole {
  ADMIN = 'ROLE_ADMIN',
  STAFF = 'ROLE_STAFF',
  USER = 'ROLE_USER',
}

// Book DTO - matches BookDTO.java
export interface IBook {
  id?: number;
  title: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'; // Match Level enum in backend
  description?: string;
  thumbnail?: string;
  averageRating?: number;
  totalReviews?: number;
  isActive?: boolean;
  author?: string;
  publisher?: string;
  publishYear?: number;
  source?: string;
  totalPages?: number;
  pdfUrl?: string;
  createdBy?: number;
  createdDate?: string;
  totalChapters?: number;
  processingStatus?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

// Chapter DTO - matches ChapterDTO.java
export interface IChapter {
  id?: number;
  title: string;
  orderIndex: number;
  bookId: number;
  bookTitle?: string;
  description?: string;
  pageStart?: number;
  pageEnd?: number;
  totalWords?: number;
  totalGrammars?: number;
  totalExercises?: number;
}

// Word DTO - matches WordDTO.java
export interface IWord {
  id?: number;
  text: string;
  meaning?: string;
  pronunciation?: string;
  partOfSpeech?: string;
  imageUrl?: string;
  chapterId?: number;
  orderIndex?: number;
}

// WordExample DTO - matches WordExampleDTO.java
export interface IWordExample {
  id?: number;
  sentence: string;
  translation?: string;
  wordId?: number;
}

// Grammar DTO - matches GrammarDTO.java
export interface IGrammar {
  id?: number;
  title: string;
  pattern: string;
  meaning?: string;
  explanation?: string;
  chapterId?: number;
  orderIndex?: number;
}

// GrammarExample DTO
export interface IGrammarExample {
  id?: number;
  sentence: string;
  translation?: string;
  explanation?: string;
  grammarId?: number;
}

// Exercise Base
export interface IExerciseBase {
  id?: number;
  chapterId?: number;
  orderIndex?: number;
  skillType: 'LISTENING' | 'SPEAKING' | 'READING' | 'WRITING';
}

// ListeningExercise DTO
export interface IListeningExercise extends IExerciseBase {
  audioUrl: string;
  imageUrl?: string;
  question: string;
  correctAnswer: string;
  maxScore?: number;
}

// ListeningOption DTO
export interface IListeningOption {
  id?: number;
  listeningExerciseId?: number;
  label: string;
  text: string;
  isCorrect: boolean;
}

// SpeakingExercise DTO
export interface ISpeakingExercise extends IExerciseBase {
  prompt: string;
  sampleAudio?: string;
  targetPhrase?: string;
  maxScore?: number;
}

// ReadingExercise DTO
export interface IReadingExercise extends IExerciseBase {
  passage: string;
  question: string;
  correctAnswer: string;
  maxScore?: number;
}

// ReadingOption DTO
export interface IReadingOption {
  id?: number;
  readingExerciseId?: number;
  label: string;
  text: string;
  isCorrect: boolean;
}

// WritingExercise DTO
export interface IWritingExercise extends IExerciseBase {
  prompt: string;
  sampleAnswer?: string;
  minWords?: number;
  maxScore?: number;
}

// StudySession DTO - matches StudySessionDTO.java
export interface IStudySession {
  id?: number;
  userId?: number;
  chapterId?: number;
  startTime?: string;
  endTime?: string;
  duration?: number;
  status?: string;
  progress?: number;
  score?: number;
}

// UserProgress DTO - matches UserProgressDTO.java (Book Progress)
export interface IBookProgress {
  id?: number;
  userId?: number;
  bookId?: number;
  currentPage?: number;
  totalPages?: number;
  progressPercentage?: number;
  lastAccessedDate?: string;
  isCompleted?: boolean;
  completedDate?: string;
}

// ChapterProgress DTO
export interface IChapterProgress {
  id?: number;
  userId?: number;
  chapterId?: number;
  progressPercentage?: number;
  wordsLearned?: number;
  grammarsLearned?: number;
  exercisesCompleted?: number;
  isCompleted?: boolean;
  completedDate?: string;
  lastAccessedDate?: string;
}

// UserVocabulary DTO - matches UserVocabularyDTO.java
export interface IUserVocabulary {
  id?: number;
  userId?: number;
  wordId?: number;
  chapterId?: number;
  isFavorite?: boolean;
  masteryLevel?: number;
  lastReviewedDate?: string;
  isMemorized?: boolean;
}

// LearningStreak DTO - matches LearningStreakDTO.java
export interface ILearningStreak {
  id?: number;
  userId?: number;
  currentStreak?: number;
  longestStreak?: number;
  lastStudyDate?: string;
  totalStudyDays?: number;
  iconUrl?: string;
}

// StreakMilestone DTO
export interface IStreakMilestone {
  id?: number;
  milestoneDays: number;
  rewardName: string;
  iconUrl?: string;
  description?: string;
}

// Achievement DTO - matches AchievementDTO.java
export interface IAchievement {
  id?: number;
  title: string;
  description?: string;
  iconUrl?: string;
  category?: string;
  requiredValue?: number;
}

// UserAchievement DTO - matches UserAchievementDTO.java
export interface IUserAchievement {
  id?: number;
  userId?: number;
  achievementId?: number;
  unlockedDate?: string;
  achievementTitle?: string;
  achievementIcon?: string;
}

// Comment DTO - matches CommentDTO.java
export interface IComment {
  id?: number;
  userId?: number;
  chapterId?: number;
  content: string;
  createdDate?: string;
  parentCommentId?: number;
  userName?: string;
  userAvatar?: string;
}

// ExerciseResult DTO - matches ExerciseResultDTO.java
export interface IExerciseResult {
  id?: number;
  userId?: number;
  chapterId?: number;
  exerciseType?: 'LISTENING' | 'SPEAKING' | 'READING' | 'WRITING';
  exerciseId?: number;
  userAnswer?: string;
  audioUrl?: string;
  isCorrect?: boolean;
  score?: number;
  maxScore?: number;
  completedDate?: string;
}

// User DTO (simplified)
export interface IUser {
  id?: number;
  login?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  imageUrl?: string; // Backend uses imageUrl instead of avatarUrl
  authorities?: string[];
  activated?: boolean;
  createdDate?: string;
  langKey?: string;
  password?: string; // Only used when creating users
}

// Legacy interfaces for backward compatibility (deprecated - will be removed)
export interface ILesson {
  id?: number;
  chapterId?: number;
  title?: string;
  content?: string;
  orderIndex?: number;
  chapterTitle?: string;
  thumbnail?: string;
  description?: string;
  level?: string;
  estimatedMinutes?: number;
}

export interface IUserProgress {
  id?: number;
  userId?: number;
  lessonId?: number;
  progressPercentage?: number;
  completed?: boolean;
}
