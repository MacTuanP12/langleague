import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { loadingBarMiddleware } from 'react-redux-loading-bar';

import authentication from '../shared/auth/auth.reducer';
import studySession from '../shared/reducers/study-session.reducer';
import chapter from '../shared/reducers/chapter.reducer';
import book from '../shared/reducers/book.reducer';
import progress from '../shared/reducers/progress.reducer';
import lesson from '../shared/reducers/lesson.reducer';
import locale from '../shared/reducers/locale.reducer';
import theme from '../shared/reducers/theme.reducer';
import bookReview from '../shared/reducers/book-review.reducer';
import comment from '../shared/reducers/comment.reducer';
import achievement from '../shared/reducers/achievement.reducer';
import favorite from '../shared/reducers/favorite.reducer';

const store = configureStore({
  reducer: {
    authentication,
    studySession,
    chapter,
    book,
    progress,
    lesson,
    locale,
    theme,
    bookReview,
    comment,
    achievement,
    favorite,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['authentication/login/fulfilled'],
      },
    }).concat(loadingBarMiddleware()),
});

// Types
export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;

export default store;
