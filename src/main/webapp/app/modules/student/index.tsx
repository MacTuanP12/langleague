import React from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { StudentLayout } from 'app/modules/student/layout/student-layout';
import StudentDashboard from 'app/modules/student/dashboard/student-dashboard';
import BookList from 'app/modules/student/books/book-list';
import BookDetail from 'app/modules/student/books/book-detail';
import BookLearn from 'app/modules/student/learning/book-learn';
import UnitExercisePage from 'app/modules/student/learning/unit-exercise-page';
import UnitGrammarPage from 'app/modules/student/learning/unit-grammar-page';
import UnitVocabularyPage from 'app/modules/student/learning/unit-vocabulary-page';
import Flashcard from 'app/modules/student/learning/flashcard';
import FlashcardList from 'app/modules/student/learning/flashcard-list';
import GameHub from 'app/modules/student/games/game-hub';
import StudentProfile from 'app/modules/student/profile/student-profile';

const StudentRoutes = () => {
  return (
    <ErrorBoundaryRoutes>
      <Route element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="dashboard" element={<StudentDashboard />} />

        {/* Books */}
        <Route path="books">
          <Route index element={<BookList />} />
          <Route path=":id" element={<BookDetail />} />
        </Route>

        {/* Learning */}
        <Route path="learn">
          <Route path="book/:bookId" element={<BookLearn />} />
          <Route path="unit/:unitId/exercise" element={<UnitExercisePage />} />
          <Route path="unit/:unitId/grammar" element={<UnitGrammarPage />} />
          <Route path="unit/:unitId/vocabulary" element={<UnitVocabularyPage />} />
          <Route path="unit/:unitId/flashcard" element={<Flashcard />} />
        </Route>

        {/* Flashcards */}
        <Route path="flashcards">
          <Route index element={<FlashcardList />} />
          <Route path="unit/:unitId" element={<Flashcard />} />
        </Route>

        {/* Games - Student Only */}
        <Route path="games">
          <Route index element={<GameHub />} />
        </Route>

        {/* Profile */}
        <Route path="profile" element={<StudentProfile />} />
      </Route>
    </ErrorBoundaryRoutes>
  );
};

export default StudentRoutes;
