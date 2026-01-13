// Redux Store
export { default as getStore, useAppDispatch, useAppSelector } from 'app/config/store';
export type { IRootState, AppDispatch, AppThunk } from 'app/config/store';

// Reducers
export { default as bookReducer } from './book.reducer';
export { default as unitReducer } from './unit.reducer';
export { default as vocabularyReducer } from './vocabulary.reducer';
export { default as grammarReducer } from './grammar.reducer';
export { default as exerciseReducer } from './exercise.reducer';
export { default as exerciseOptionReducer } from './exercise-option.reducer';
export { default as enrollmentReducer } from './enrollment.reducer';
export { default as userProfileReducer } from './user-profile.reducer';
export { default as progressReducer } from './progress.reducer';

// Book actions
export { fetchBooks, fetchBookById, createBook, updateBook, deleteBook, reset as resetBook, clearSelectedBook } from './book.reducer';

// Unit actions
export {
  fetchUnitById,
  fetchUnitsByBookId,
  createUnit,
  updateUnit,
  deleteUnit,
  reset as resetUnit,
  clearSelectedUnit,
} from './unit.reducer';

// Vocabulary actions
export {
  fetchVocabulariesByUnitId,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
  bulkCreateVocabularies,
  bulkUpdateVocabularies,
  reset as resetVocabulary,
} from './vocabulary.reducer';

// Grammar actions
export {
  fetchGrammarsByUnitId,
  createGrammar,
  updateGrammar,
  deleteGrammar,
  bulkCreateGrammars,
  bulkUpdateGrammars,
  reset as resetGrammar,
} from './grammar.reducer';

// Exercise actions
export {
  fetchExercisesByUnitId,
  fetchExerciseOptions,
  fetchExercisesWithOptions,
  createExercise,
  updateExercise,
  deleteExercise,
  createExerciseOption,
  updateExerciseOption,
  deleteExerciseOption,
  bulkCreateExercises,
  bulkUpdateExercises,
  reset as resetExercise,
} from './exercise.reducer';

// ExerciseOption actions
export {
  fetchExerciseOptions as fetchOptions,
  fetchExerciseOptionById,
  createExerciseOption as createOption,
  updateExerciseOption as updateOption,
  deleteExerciseOption as deleteOption,
  bulkCreateExerciseOptions,
  bulkUpdateExerciseOptions,
  reset as resetExerciseOption,
  clearExerciseOptions,
} from './exercise-option.reducer';

// Enrollment actions
export {
  fetchMyEnrollments,
  fetchEnrollmentByBookId,
  createEnrollment,
  deleteEnrollment,
  reset as resetEnrollment,
  clearSelectedEnrollment,
} from './enrollment.reducer';

// UserProfile actions
export {
  fetchCurrentUserProfile,
  fetchUserProfileById,
  createUserProfile,
  updateUserProfile,
  updateUserProfileTheme,
  deleteUserProfile,
  reset as resetUserProfile,
  clearUserProfile,
} from './user-profile.reducer';

// Progress actions
export {
  fetchProgressByUserAndUnit,
  fetchProgressesByUser,
  fetchProgressesByUnit,
  fetchMyProgresses,
  fetchMyProgressByUnit,
  createProgress,
  updateProgress,
  markUnitComplete,
  deleteProgress,
  reset as resetProgress,
  clearProgresses,
} from './progress.reducer';

// Selectors
export * from './selectors';

// Custom Hooks
export * from './hooks';
