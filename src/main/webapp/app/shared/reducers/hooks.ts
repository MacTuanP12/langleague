import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IBook } from 'app/shared/model/book.model';
import { IUnit } from 'app/shared/model/unit.model';
import { IVocabulary } from 'app/shared/model/vocabulary.model';
import { IGrammar } from 'app/shared/model/grammar.model';
import { IExercise } from 'app/shared/model/exercise.model';
import { IExerciseOption } from 'app/shared/model/exercise-option.model';
import { IUserProfile } from 'app/shared/model/user-profile.model';
import { IProgress } from 'app/shared/model/progress.model';
import { ThemeMode } from 'app/shared/model/enumerations/enums.model';
import {
  getEntities as fetchBooks,
  getEntity as fetchBookById,
  createEntity as createBook,
  updateEntity as updateBook,
  deleteEntity as deleteBook,
  reset as clearSelectedBook,
} from 'app/entities/book/book.reducer';
import { fetchUnitById, fetchUnitsByBookId, createUnit, updateUnit, deleteUnit, clearSelectedUnit } from 'app/shared/reducers/unit.reducer';
import {
  fetchVocabulariesByUnitId,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
  bulkCreateVocabularies,
  bulkUpdateVocabularies,
} from 'app/shared/reducers/vocabulary.reducer';
import {
  fetchGrammarsByUnitId,
  createGrammar,
  updateGrammar,
  deleteGrammar,
  bulkCreateGrammars,
  bulkUpdateGrammars,
} from 'app/shared/reducers/grammar.reducer';
import {
  fetchExercisesByUnitId,
  fetchExercisesWithOptions,
  createExercise,
  updateExercise,
  deleteExercise,
  bulkCreateExercises,
  bulkUpdateExercises,
} from 'app/shared/reducers/exercise.reducer';
import {
  fetchExerciseOptions,
  createExerciseOption,
  updateExerciseOption,
  deleteExerciseOption,
  bulkCreateExerciseOptions,
  bulkUpdateExerciseOptions,
  clearExerciseOptions,
} from 'app/shared/reducers/exercise-option.reducer';
import {
  fetchMyEnrollments,
  fetchEnrollmentByBookId,
  enrollInBook as enrollInBookAction,
  deleteEntity as deleteEnrollment,
  reset as clearSelectedEnrollment,
} from 'app/entities/enrollment/enrollment.reducer';
import {
  fetchCurrentUserProfile,
  fetchUserProfileById,
  createUserProfile,
  updateUserProfile,
  updateUserProfileTheme,
  deleteUserProfile,
  clearUserProfile,
} from 'app/shared/reducers/user-profile.reducer';
import {
  fetchProgressByUserAndUnit,
  fetchProgressesByUser,
  fetchProgressesByUnit,
  fetchMyProgresses,
  fetchMyProgressByUnit,
  createProgress,
  updateProgress,
  markUnitComplete,
  deleteProgress,
  clearProgresses,
} from 'app/shared/reducers/progress.reducer';
import {
  selectAllBooks,
  selectSelectedBook,
  selectBookLoading,
  selectAllUnits,
  selectSelectedUnit,
  selectUnitLoading,
  selectAllVocabularies,
  selectVocabularyLoading,
  selectAllGrammars,
  selectGrammarLoading,
  selectAllExercises,
  selectExerciseLoading,
  selectExerciseOptions,
  selectExerciseOptionsByExerciseId,
  selectAllEnrollments,
  selectSelectedEnrollment,
  selectEnrollmentLoading,
  selectCurrentUserProfile,
  selectUserProfileLoading,
  selectUserStreak,
  selectUserTheme,
  selectUserProgresses,
  selectProgressLoading,
  selectProgressByUnitId,
  selectCompletedUnits,
} from './selectors';

// Book hooks
export const useBooks = () => {
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectAllBooks);
  const selectedBook = useAppSelector(selectSelectedBook);
  const loading = useAppSelector(selectBookLoading);

  const loadBooks = useCallback(() => dispatch(fetchBooks({})), [dispatch]);
  const loadBook = useCallback((id: number) => dispatch(fetchBookById(id)), [dispatch]);
  const addBook = useCallback((book: IBook) => dispatch(createBook(book)), [dispatch]);
  const editBook = useCallback((book: IBook) => dispatch(updateBook(book)), [dispatch]);
  const removeBook = useCallback((id: number) => dispatch(deleteBook(id)), [dispatch]);
  const clearBook = useCallback(() => dispatch(clearSelectedBook()), [dispatch]);

  return {
    books,
    selectedBook,
    loading,
    loadBooks,
    loadBook,
    addBook,
    editBook,
    removeBook,
    clearBook,
  };
};

// Unit hooks
export const useUnits = () => {
  const dispatch = useAppDispatch();
  const units = useAppSelector(selectAllUnits);
  const selectedUnit = useAppSelector(selectSelectedUnit);
  const loading = useAppSelector(selectUnitLoading);

  const loadUnit = useCallback((id: number | string) => dispatch(fetchUnitById(id)), [dispatch]);
  const loadUnitsByBook = useCallback((bookId: number | string) => dispatch(fetchUnitsByBookId(bookId)), [dispatch]);
  const addUnit = useCallback((unit: IUnit) => dispatch(createUnit(unit)), [dispatch]);
  const editUnit = useCallback((unit: IUnit) => dispatch(updateUnit(unit)), [dispatch]);
  const removeUnit = useCallback((id: number) => dispatch(deleteUnit(id)), [dispatch]);
  const clearUnit = useCallback(() => dispatch(clearSelectedUnit()), [dispatch]);

  return {
    units,
    selectedUnit,
    loading,
    loadUnit,
    loadUnitsByBook,
    addUnit,
    editUnit,
    removeUnit,
    clearUnit,
  };
};

// Vocabulary hooks
export const useVocabularies = () => {
  const dispatch = useAppDispatch();
  const vocabularies = useAppSelector(selectAllVocabularies);
  const loading = useAppSelector(selectVocabularyLoading);

  const loadVocabularies = useCallback((unitId: number | string) => dispatch(fetchVocabulariesByUnitId(unitId)), [dispatch]);
  const addVocabulary = useCallback((vocabulary: IVocabulary) => dispatch(createVocabulary(vocabulary)), [dispatch]);
  const editVocabulary = useCallback((vocabulary: IVocabulary) => dispatch(updateVocabulary(vocabulary)), [dispatch]);
  const removeVocabulary = useCallback((id: number) => dispatch(deleteVocabulary(id)), [dispatch]);
  const addBulkVocabularies = useCallback((vocabList: IVocabulary[]) => dispatch(bulkCreateVocabularies(vocabList)), [dispatch]);
  const editBulkVocabularies = useCallback((vocabList: IVocabulary[]) => dispatch(bulkUpdateVocabularies(vocabList)), [dispatch]);

  return {
    vocabularies,
    loading,
    loadVocabularies,
    addVocabulary,
    editVocabulary,
    removeVocabulary,
    addBulkVocabularies,
    editBulkVocabularies,
  };
};

// Grammar hooks
export const useGrammars = () => {
  const dispatch = useAppDispatch();
  const grammars = useAppSelector(selectAllGrammars);
  const loading = useAppSelector(selectGrammarLoading);

  const loadGrammars = useCallback((unitId: number | string) => dispatch(fetchGrammarsByUnitId(unitId)), [dispatch]);
  const addGrammar = useCallback((grammar: IGrammar) => dispatch(createGrammar(grammar)), [dispatch]);
  const editGrammar = useCallback((grammar: IGrammar) => dispatch(updateGrammar(grammar)), [dispatch]);
  const removeGrammar = useCallback((id: number) => dispatch(deleteGrammar(id)), [dispatch]);
  const addBulkGrammars = useCallback((grammarList: IGrammar[]) => dispatch(bulkCreateGrammars(grammarList)), [dispatch]);
  const editBulkGrammars = useCallback((grammarList: IGrammar[]) => dispatch(bulkUpdateGrammars(grammarList)), [dispatch]);

  return {
    grammars,
    loading,
    loadGrammars,
    addGrammar,
    editGrammar,
    removeGrammar,
    addBulkGrammars,
    editBulkGrammars,
  };
};

// Exercise hooks
export const useExercises = () => {
  const dispatch = useAppDispatch();
  const exercises = useAppSelector(selectAllExercises);
  const exerciseOptions = useAppSelector(selectExerciseOptions);
  const loading = useAppSelector(selectExerciseLoading);

  const loadExercises = useCallback((unitId: number | string) => dispatch(fetchExercisesByUnitId(unitId)), [dispatch]);
  const loadExercisesWithOptions = useCallback((unitId: number | string) => dispatch(fetchExercisesWithOptions(unitId)), [dispatch]);
  const addExercise = useCallback((exercise: IExercise) => dispatch(createExercise(exercise)), [dispatch]);
  const editExercise = useCallback((exercise: IExercise) => dispatch(updateExercise(exercise)), [dispatch]);
  const removeExercise = useCallback((id: number) => dispatch(deleteExercise(id)), [dispatch]);
  const addBulkExercises = useCallback(
    (unitId: string | number, exerciseList: IExercise[]) => dispatch(bulkCreateExercises({ unitId, exercises: exerciseList })),
    [dispatch],
  );
  const editBulkExercises = useCallback((exerciseList: IExercise[]) => dispatch(bulkUpdateExercises(exerciseList)), [dispatch]);

  return {
    exercises,
    exerciseOptions,
    loading,
    loadExercises,
    loadExercisesWithOptions,
    addExercise,
    editExercise,
    removeExercise,
    addBulkExercises,
    editBulkExercises,
  };
};

// ExerciseOption hooks
export const useExerciseOptions = (exerciseId: number) => {
  const dispatch = useAppDispatch();
  const options = useAppSelector(state => selectExerciseOptionsByExerciseId(exerciseId)(state));

  const loadOptions = useCallback(() => dispatch(fetchExerciseOptions(exerciseId)), [dispatch, exerciseId]);
  const addOption = useCallback((option: IExerciseOption) => dispatch(createExerciseOption(option)), [dispatch]);
  const editOption = useCallback((option: IExerciseOption) => dispatch(updateExerciseOption(option)), [dispatch]);
  const removeOption = useCallback((optionId: number) => dispatch(deleteExerciseOption({ exerciseId, optionId })), [dispatch, exerciseId]);
  const addBulkOptions = useCallback(
    (optionList: IExerciseOption[]) => dispatch(bulkCreateExerciseOptions({ exerciseId, options: optionList })),
    [dispatch, exerciseId],
  );
  const editBulkOptions = useCallback(
    (optionList: IExerciseOption[]) => dispatch(bulkUpdateExerciseOptions({ exerciseId, options: optionList })),
    [dispatch, exerciseId],
  );
  const clearOptions = useCallback(() => dispatch(clearExerciseOptions(exerciseId)), [dispatch, exerciseId]);

  return {
    options,
    loadOptions,
    addOption,
    editOption,
    removeOption,
    addBulkOptions,
    editBulkOptions,
    clearOptions,
  };
};

// Enrollment hooks
export const useEnrollments = () => {
  const dispatch = useAppDispatch();
  const enrollments = useAppSelector(selectAllEnrollments);
  const selectedEnrollment = useAppSelector(selectSelectedEnrollment);
  const loading = useAppSelector(selectEnrollmentLoading);

  const loadMyEnrollments = useCallback(() => dispatch(fetchMyEnrollments()), [dispatch]);
  const loadEnrollmentByBook = useCallback((bookId: number | string) => dispatch(fetchEnrollmentByBookId(bookId)), [dispatch]);
  const enrollInBook = useCallback((data: { bookId: number; userId?: number }) => dispatch(enrollInBookAction(data.bookId)), [dispatch]);
  const unenroll = useCallback((id: number) => dispatch(deleteEnrollment(id)), [dispatch]);
  const clearEnrollment = useCallback(() => dispatch(clearSelectedEnrollment()), [dispatch]);

  return {
    enrollments,
    selectedEnrollment,
    loading,
    loadMyEnrollments,
    loadEnrollmentByBook,
    enrollInBook,
    unenroll,
    clearEnrollment,
  };
};

// UserProfile hooks
export const useUserProfile = () => {
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector(selectCurrentUserProfile);
  const loading = useAppSelector(selectUserProfileLoading);
  const streak = useAppSelector(selectUserStreak);
  const theme = useAppSelector(selectUserTheme);

  const loadCurrentProfile = useCallback(() => dispatch(fetchCurrentUserProfile()), [dispatch]);
  const loadProfile = useCallback((id: number) => dispatch(fetchUserProfileById(id)), [dispatch]);
  const createProfile = useCallback((profile: IUserProfile) => dispatch(createUserProfile(profile)), [dispatch]);
  const editProfile = useCallback((profile: IUserProfile) => dispatch(updateUserProfile(profile)), [dispatch]);
  const changeTheme = useCallback((newTheme: ThemeMode) => dispatch(updateUserProfileTheme(newTheme)), [dispatch]);
  const removeProfile = useCallback((id: number) => dispatch(deleteUserProfile(id)), [dispatch]);
  const clearProfile = useCallback(() => dispatch(clearUserProfile()), [dispatch]);

  return {
    userProfile,
    loading,
    streak,
    theme,
    loadCurrentProfile,
    loadProfile,
    createProfile,
    editProfile,
    changeTheme,
    removeProfile,
    clearProfile,
  };
};

// Progress hooks
export const useProgress = () => {
  const dispatch = useAppDispatch();
  const progresses = useAppSelector(selectUserProgresses);
  const loading = useAppSelector(selectProgressLoading);
  const completedUnits = useAppSelector(selectCompletedUnits);

  const loadProgressByUserAndUnit = useCallback(
    (userProfileId: number, unitId: number) => dispatch(fetchProgressByUserAndUnit({ userProfileId, unitId })),
    [dispatch],
  );
  const loadProgressesByUser = useCallback((userProfileId: number) => dispatch(fetchProgressesByUser(userProfileId)), [dispatch]);
  const loadProgressesByUnit = useCallback((unitId: number) => dispatch(fetchProgressesByUnit(unitId)), [dispatch]);
  const loadMyProgresses = useCallback(() => dispatch(fetchMyProgresses()), [dispatch]);
  const loadMyProgressByUnit = useCallback((unitId: number) => dispatch(fetchMyProgressByUnit(unitId)), [dispatch]);
  const addProgress = useCallback((progress: IProgress) => dispatch(createProgress(progress)), [dispatch]);
  const editProgress = useCallback((progress: IProgress) => dispatch(updateProgress(progress)), [dispatch]);
  const completeUnit = useCallback((unitId: number) => dispatch(markUnitComplete(unitId)), [dispatch]);
  const removeProgress = useCallback((id: number) => dispatch(deleteProgress(id)), [dispatch]);
  const clearAllProgresses = useCallback(() => dispatch(clearProgresses()), [dispatch]);

  const getProgressByUnit = useCallback((unitId: number) => selectProgressByUnitId(unitId), []);

  return {
    progresses,
    loading,
    completedUnits,
    loadProgressByUserAndUnit,
    loadProgressesByUser,
    loadProgressesByUnit,
    loadMyProgresses,
    loadMyProgressByUnit,
    addProgress,
    editProgress,
    completeUnit,
    removeProgress,
    clearAllProgresses,
    getProgressByUnit,
  };
};

// Export User Management hook for admin
export { useUserManagement } from './user-management.hook';
