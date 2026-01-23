import React from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { StudentLayout } from 'app/modules/student/layout/student-layout';
import StudentDashboard from 'app/modules/student/dashboard/student-dashboard';
import BookList from 'app/modules/student/books/book-list';
import BookDetail from 'app/modules/student/books/book-detail';
import BookLearn from 'app/modules/student/learning/book-learn';
import UnitExercise from 'app/modules/student/learning/unit-exercise';
import UnitGrammar from 'app/modules/student/learning/unit-grammar';
import UnitVocabulary from 'app/modules/student/learning/unit-vocabulary';
import Flashcard from 'app/modules/student/learning/flashcard';
import FlashcardList from 'app/modules/student/learning/flashcard-list';
import GameHub from 'app/modules/student/games/game-hub';
import StudentProfile from 'app/modules/student/profile/student-profile';

const StudentRoutes = () => {
  return (
    <ErrorBoundaryRoutes>
      {/* Routes with Student Layout (Sidebar, Header, Footer) */}
      <Route element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="dashboard" element={<StudentDashboard />} />

        {/* Books */}
        <Route path="books">
          <Route index element={<BookList />} />
          <Route path=":id" element={<BookDetail />} />
        </Route>

        {/* Flashcards */}
        <Route path="flashcards">
          <Route index element={<FlashcardList />} />
          {/* Specific route for review mode inside layout if needed, but usually flashcard is full screen */}
        </Route>

        {/* Games - Student Only */}
        <Route path="games">
          <Route index element={<GameHub />} />
        </Route>

        {/* Profile */}
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Learning Routes - Full Screen (No Sidebar) */}
      <Route path="learn">
        <Route path="book/:bookId" element={<BookDetail />} />
        <Route path="book/:bookId/unit/:unitId" element={<BookLearn />} />

        {/* Review Mode Flashcard - Must be before :unitId route */}
        <Route path="unit/review/flashcard" element={<Flashcard />} />

        {/* Standalone unit routes */}
        <Route path="unit/:unitId/exercise" element={<UnitExercise />} />
        <Route path="unit/:unitId/grammar" element={<UnitGrammar />} />
        <Route path="unit/:unitId/vocabulary" element={<UnitVocabulary />} />
        <Route path="unit/:unitId/flashcard" element={<Flashcard />} />
      </Route>
    </ErrorBoundaryRoutes>
  );
};

export default StudentRoutes;
