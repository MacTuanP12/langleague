import { createSelector } from '@reduxjs/toolkit';
import { IRootState } from 'app/config/store';

// Book selectors
export const selectBookState = (state: IRootState) => state.book;
export const selectAllBooks = createSelector(selectBookState, state => state.entities || []);
export const selectSelectedBook = createSelector(selectBookState, state => state.entity);
export const selectBookLoading = createSelector(selectBookState, state => state.loading);
export const selectBookUpdating = createSelector(selectBookState, state => state.updating);
export const selectBookError = createSelector(selectBookState, state => state.errorMessage);

// Unit selectors
export const selectUnitState = (state: IRootState) => state.unit;
export const selectAllUnits = createSelector(selectUnitState, state => state.entities || []);
export const selectSelectedUnit = createSelector(selectUnitState, state => state.entity);
export const selectUnitLoading = createSelector(selectUnitState, state => state.loading);
export const selectUnitUpdating = createSelector(selectUnitState, state => state.updating);
export const selectUnitError = createSelector(selectUnitState, state => state.errorMessage);

// Vocabulary selectors
export const selectVocabularyState = (state: IRootState) => state.vocabulary;
export const selectAllVocabularies = createSelector(selectVocabularyState, state => state.entities || []);
export const selectVocabularyLoading = createSelector(selectVocabularyState, state => state.loading);
export const selectVocabularyUpdating = createSelector(selectVocabularyState, state => state.updating);
export const selectVocabularyError = createSelector(selectVocabularyState, state => state.errorMessage);

// Grammar selectors
export const selectGrammarState = (state: IRootState) => state.grammar;
export const selectAllGrammars = createSelector(selectGrammarState, state => state.entities || []);
export const selectGrammarLoading = createSelector(selectGrammarState, state => state.loading);
export const selectGrammarUpdating = createSelector(selectGrammarState, state => state.updating);
export const selectGrammarError = createSelector(selectGrammarState, state => state.errorMessage);

// Exercise selectors
export const selectExerciseState = (state: IRootState) => state.exercise;
export const selectAllExercises = createSelector(selectExerciseState, state => state.entities || []);
export const selectExerciseOptions = createSelector(selectExerciseState, state => state.exerciseOptions || {});
export const selectExerciseOptionsById = (exerciseId: number) =>
  createSelector(selectExerciseOptions, options => options[exerciseId] || []);
export const selectExerciseLoading = createSelector(selectExerciseState, state => state.loading);
export const selectExerciseUpdating = createSelector(selectExerciseState, state => state.updating);
export const selectExerciseError = createSelector(selectExerciseState, state => state.errorMessage);

// ExerciseOption selectors
export const selectExerciseOptionState = (state: IRootState) => state.exerciseOption;
export const selectAllExerciseOptions = createSelector(selectExerciseOptionState, state => state.entities || {});
export const selectExerciseOptionsByExerciseId = (exerciseId: number) =>
  createSelector(selectAllExerciseOptions, options => options[exerciseId] || []);
export const selectExerciseOptionLoading = createSelector(selectExerciseOptionState, state => state.loading);
export const selectExerciseOptionUpdating = createSelector(selectExerciseOptionState, state => state.updating);
export const selectExerciseOptionError = createSelector(selectExerciseOptionState, state => state.errorMessage);

// Enrollment selectors
export const selectEnrollmentState = (state: IRootState) => state.enrollment;
export const selectAllEnrollments = createSelector(selectEnrollmentState, state => state.entities || []);
export const selectSelectedEnrollment = createSelector(selectEnrollmentState, state => state.entity);
export const selectEnrollmentLoading = createSelector(selectEnrollmentState, state => state.loading);
export const selectEnrollmentUpdating = createSelector(selectEnrollmentState, state => state.updating);
export const selectEnrollmentError = createSelector(selectEnrollmentState, state => state.errorMessage);

// UserProfile selectors
export const selectUserProfileState = (state: IRootState) => state.userProfile;
export const selectCurrentUserProfile = createSelector(selectUserProfileState, state => state.entity);
export const selectUserProfileLoading = createSelector(selectUserProfileState, state => state.loading);
export const selectUserProfileUpdating = createSelector(selectUserProfileState, state => state.updating);
export const selectUserProfileError = createSelector(selectUserProfileState, state => state.errorMessage);
export const selectUserStreak = createSelector(selectCurrentUserProfile, profile => profile?.streakCount || 0);
export const selectUserTheme = createSelector(selectCurrentUserProfile, profile => profile?.theme);

// Progress selectors
export const selectProgressState = (state: IRootState) => state.progress;
export const selectAllProgresses = createSelector(selectProgressState, state => state.entities || []);
export const selectUserProgresses = createSelector(selectProgressState, state => state.entities || []); // Assuming userProgresses was mapped to entities in entity reducer
export const selectProgressLoading = createSelector(selectProgressState, state => state.loading);
export const selectProgressUpdating = createSelector(selectProgressState, state => state.updating);
export const selectProgressError = createSelector(selectProgressState, state => state.errorMessage);
export const selectProgressByUnitId = (unitId: number) =>
  createSelector(selectUserProgresses, progresses => progresses.find(p => p.unit?.id === unitId || p.unitId === unitId));
export const selectCompletedUnits = createSelector(selectUserProgresses, progresses =>
  progresses.filter(p => p.isCompleted).map(p => p.unit?.id || p.unitId),
);

// Combined selectors
export const selectUnitWithProgress = (unitId: number) =>
  createSelector(selectSelectedUnit, selectProgressByUnitId(unitId), (unit, progress) => ({
    unit,
    progress,
    isCompleted: progress?.isCompleted || false,
  }));

export const selectBookWithEnrollment = createSelector(selectSelectedBook, selectSelectedEnrollment, (book, enrollment) => ({
  book,
  enrollment,
  isEnrolled: !!enrollment,
}));
