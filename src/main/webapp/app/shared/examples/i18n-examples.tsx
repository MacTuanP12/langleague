/**
 * Example usage of i18n translations for new features
 * This file demonstrates how to use translations in React components
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

// ==================== 1. BOOK REVIEWS ====================
export const BookReviewExample = () => {
  const { t } = useTranslation('book-reviews');

  return (
    <div>
      <h1>{t('bookReviews.title')}</h1>
      <button>{t('bookReviews.writeReview')}</button>
      <p>{t('bookReviews.noReviews')}</p>
      {/* With interpolation */}
      <span>{t('bookReviews.stats.totalReviews', { count: 5 })}</span>
    </div>
  );
};

// ==================== 2. COMMENTS ====================
export const CommentsExample = () => {
  const { t } = useTranslation('comments');

  return (
    <div>
      <h1>{t('comments.title')}</h1>
      <input placeholder={t('comments.form.placeholder')} />
      <button>{t('comments.form.submit')}</button>
      <span>{t('comments.stats.likes', { count: 10 })}</span>
    </div>
  );
};

// ==================== 3. ACHIEVEMENTS ====================
export const AchievementsExample = () => {
  const { t } = useTranslation('achievements');

  return (
    <div>
      <h1>{t('achievements.title')}</h1>
      <div className="achievement">
        <h3>{t('achievements.types.firstBook.name')}</h3>
        <p>{t('achievements.types.firstBook.description')}</p>
      </div>
      <div className="stats">
        <span>{t('achievements.stats.unlocked')}: 5</span>
        <span>{t('achievements.stats.remaining')}: 15</span>
      </div>
    </div>
  );
};

// ==================== 4. LEARNING REPORTS ====================
export const ReportsExample = () => {
  const { t } = useTranslation('reports');

  return (
    <div>
      <h1>{t('reports.title')}</h1>
      <button>{t('reports.exportPDF')}</button>
      <div className="stats">
        <div>{t('reports.stats.totalTime')}</div>
        <div>{t('reports.stats.wordsLearned')}</div>
        <div>{t('reports.stats.booksCompleted')}</div>
      </div>
      <p>{t('reports.summary.studiedHours', { hours: 25 })}</p>
    </div>
  );
};

// ==================== 5. EXERCISE ANALYTICS ====================
export const AnalyticsExample = () => {
  const { t } = useTranslation('analytics');

  return (
    <div>
      <h1>{t('analytics.title')}</h1>
      <div className="overview">
        <span>{t('analytics.overview.totalExercises')}: 50</span>
        <span>{t('analytics.overview.averageScore')}: 85%</span>
      </div>
      <select>
        <option>{t('analytics.types.multipleChoice')}</option>
        <option>{t('analytics.types.fillInBlank')}</option>
        <option>{t('analytics.types.matching')}</option>
      </select>
    </div>
  );
};

// ==================== 6. FAVORITES ====================
export const FavoritesExample = () => {
  const { t } = useTranslation('favorites');

  return (
    <div>
      <h1>{t('favorites.title')}</h1>
      <button>{t('favorites.addToFavorites')}</button>
      <p>{t('favorites.noFavorites')}</p>
      <div className="stats">
        <span>{t('favorites.stats.books', { count: 3 })}</span>
        <span>{t('favorites.stats.chapters', { count: 12 })}</span>
      </div>
    </div>
  );
};

// ==================== 7. STUDY SESSIONS ====================
export const StudySessionsExample = () => {
  const { t } = useTranslation('study-sessions');

  return (
    <div>
      <h1>{t('studySessions.title')}</h1>
      <button>{t('studySessions.startSession')}</button>
      <div className="timer">
        <span>{t('studySessions.timer.elapsed')}: 25:00</span>
        <span>{t('studySessions.timer.target')}: 60:00</span>
      </div>
      <p>{t('studySessions.goals.minutesPerDay', { minutes: 30 })}</p>
    </div>
  );
};

// ==================== 8. FLASHCARDS ====================
export const FlashcardsExample = () => {
  const { t } = useTranslation('flashcards');

  return (
    <div>
      <h1>{t('flashcards.title')}</h1>
      <button>{t('flashcards.create')}</button>
      <div className="deck">
        <h3>{t('flashcards.deck.title')}</h3>
        <span>{t('flashcards.deck.cardCount', { count: 25 })}</span>
      </div>
      <div className="practice">
        <button>{t('flashcards.practice.flip')}</button>
        <button>{t('flashcards.practice.next')}</button>
        <span>{t('flashcards.practice.progress', { current: 5, total: 25 })}</span>
      </div>
    </div>
  );
};

// ==================== 9. NOTES ====================
export const NotesExample = () => {
  const { t } = useTranslation('notes');

  return (
    <div>
      <h1>{t('notes.title')}</h1>
      <button>{t('notes.createNote')}</button>
      <form>
        <input placeholder={t('notes.form.titlePlaceholder')} />
        <textarea placeholder={t('notes.form.contentPlaceholder')} />
        <button>{t('notes.form.save')}</button>
      </form>
      <div className="editor-toolbar">
        <button title={t('notes.editor.bold')}>B</button>
        <button title={t('notes.editor.italic')}>I</button>
        <button title={t('notes.editor.highlight')}>H</button>
      </div>
    </div>
  );
};

// ==================== 10. STREAK MILESTONES ====================
export const StreaksExample = () => {
  const { t } = useTranslation('streaks');

  return (
    <div>
      <h1>{t('streaks.title')}</h1>
      <div className="current-streak">
        <h2>{t('streaks.currentStreak')}</h2>
        <span>{t('streaks.stats.days', { count: 15 })}</span>
        <p>{t('streaks.stats.keepGoing')}</p>
      </div>
      <div className="milestones">
        <div className="milestone">
          <span>{t('streaks.milestoneList.7days.icon')}</span>
          <h3>{t('streaks.milestoneList.7days.name')}</h3>
          <p>{t('streaks.milestoneList.7days.description')}</p>
        </div>
        <div className="milestone">
          <span>{t('streaks.milestoneList.30days.icon')}</span>
          <h3>{t('streaks.milestoneList.30days.name')}</h3>
          <p>{t('streaks.milestoneList.30days.description')}</p>
        </div>
      </div>
    </div>
  );
};

// ==================== USING MULTIPLE NAMESPACES ====================
export const MultiNamespaceExample = () => {
  const { t } = useTranslation(['book-reviews', 'common', 'achievements']);

  return (
    <div>
      <h1>{t('bookReviews.title', { ns: 'book-reviews' })}</h1>
      <button>{t('common.save', { ns: 'common' })}</button>
      <button>{t('common.cancel', { ns: 'common' })}</button>
      <span>{t('achievements.notifications.congratulations', { ns: 'achievements' })}</span>
    </div>
  );
};

// ==================== WITH TOAST NOTIFICATIONS ====================
export const ToastExample = () => {
  const { t } = useTranslation(['book-reviews', 'favorites', 'notes']);

  const handleSubmitReview = () => {
    // toast.success(t('bookReviews.messages.submitSuccess'));
    console.log(t('bookReviews.messages.submitSuccess'));
  };

  const handleAddFavorite = () => {
    // toast.info(t('favorites.messages.added'));
    console.log(t('favorites.messages.added'));
  };

  const handleDeleteNote = () => {
    if (confirm(t('notes.messages.deleteConfirm'))) {
      // toast.success(t('notes.messages.deleted'));
      console.log(t('notes.messages.deleted'));
    }
  };

  return (
    <div>
      <button onClick={handleSubmitReview}>{t('bookReviews.form.submit')}</button>
      <button onClick={handleAddFavorite}>{t('favorites.addToFavorites')}</button>
      <button onClick={handleDeleteNote}>{t('notes.deleteNote')}</button>
    </div>
  );
};
