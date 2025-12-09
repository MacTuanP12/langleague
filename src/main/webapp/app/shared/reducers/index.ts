import { combineReducers } from '@reduxjs/toolkit';
import localeReducer from './locale.reducer';
import themeReducer from './theme.reducer';
import bookReducer from './book.reducer';
import chapterReducer from './chapter.reducer';
import progressReducer from './progress.reducer';
import bookReviewReducer from './book-review.reducer';
import commentReducer from './comment.reducer';
import achievementReducer from './achievement.reducer';
import favoriteReducer from './favorite.reducer';

const rootReducer = combineReducers({
  locale: localeReducer,
  theme: themeReducer,
  book: bookReducer,
  chapter: chapterReducer,
  progress: progressReducer,
  bookReview: bookReviewReducer,
  comment: commentReducer,
  achievement: achievementReducer,
  favorite: favoriteReducer,
});

export default rootReducer;
