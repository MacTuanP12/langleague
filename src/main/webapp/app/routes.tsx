import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './shared/layout/dashboard-layout';
import PrivateRoute from './shared/auth/PrivateRoute';
import BookUploadManager from 'app/modules/staff/BookUploadManager';
import ChapterStepperEditor from 'app/modules/staff/ChapterStepperEditor';

// ==================== PUBLIC PAGES ====================
const Home = React.lazy(() => import('./modules/home/home'));
const AuthSlider = React.lazy(() => import('./modules/account/auth-slider'));
const ForgotPassword = React.lazy(() => import('./modules/account/forgot-password-page'));
const ContactUs = React.lazy(() => import('./modules/home/contact-us'));

// ==================== USER PAGES ====================
const Dashboard = React.lazy(() => import('./modules/dashboard/dashboard'));
const MyProfile = React.lazy(() => import('./modules/dashboard/MyProfile'));
const MyCourses = React.lazy(() => import('./modules/dashboard/MyCourses'));
const BookLessons = React.lazy(() => import('./modules/dashboard/BookLessons'));
const ChapterExercise = React.lazy(() => import('./modules/dashboard/ChapterExercise'));
const Settings = React.lazy(() => import('./modules/dashboard/Settings'));
const Flashcard = React.lazy(() => import('./modules/dashboard/Flashcard'));
const AddToFlashcard = React.lazy(() => import('./modules/dashboard/AddToFlashcard'));
const VocabularyList = React.lazy(() => import('./modules/courses/vocabulary-list'));
const ReadingLesson = React.lazy(() => import('./modules/courses/reading-lesson'));

// User learning pages
const BookLibrary = React.lazy(() => import('./modules/user/BookLibrary'));
const BookDetail = React.lazy(() => import('./modules/user/BookDetail'));
const ChapterLearning = React.lazy(() => import('./modules/user/ChapterLearning'));
const ListeningExercise = React.lazy(() => import('./modules/user/ListeningExercise'));
const ReadingExercise = React.lazy(() => import('./modules/user/ReadingExercise'));
const SpeakingExercise = React.lazy(() => import('./modules/user/SpeakingExercise'));
const WritingExercise = React.lazy(() => import('./modules/user/WritingExercise'));
const MyBooks = React.lazy(() => import('./modules/user/MyBooks'));
const MyChapters = React.lazy(() => import('./modules/user/MyChapters'));

// New feature pages
const Achievements = React.lazy(() => import('./modules/user/Achievements'));
const LearningReports = React.lazy(() => import('./modules/user/LearningReports'));
const ExerciseAnalytics = React.lazy(() => import('./modules/user/ExerciseAnalytics'));
const FavoritesPage = React.lazy(() => import('./modules/user/FavoritesPage'));

// ==================== ADMIN PAGES ====================
const AdminOverview = React.lazy(() => import('./modules/admin/AdminOverview'));
const UserManagement = React.lazy(() => import('./modules/admin/UserManagement'));
const CourseManagement = React.lazy(() => import('./modules/admin/CourseManagement'));
const BookApproval = React.lazy(() => import('./modules/admin/BookApproval'));
const AdminSettings = React.lazy(() => import('./modules/admin/AdminSettings'));

// ==================== STAFF PAGES ====================
const StaffOverview = React.lazy(() => import('./modules/staff/StaffOverview'));
const BookManagement = React.lazy(() => import('./modules/staff/BookManagement'));
const StaffChapterManagement = React.lazy(() => import('./modules/staff/StaffChapterManagement'));
const StaffContentEditor = React.lazy(() => import('./modules/staff/StaffContentEditor'));
const ChapterContentEditor = React.lazy(() => import('./modules/staff/ChapterContentEditor'));
const UploadBooks = React.lazy(() => import('./modules/staff/UploadBooks'));
const StaffSettings = React.lazy(() => import('./modules/staff/StaffSettings'));

const AppRoutes = () => {
  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route index element={<Home />} />
      <Route path="login" element={<AuthSlider />} />
      <Route path="register" element={<AuthSlider />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="contact" element={<ContactUs />} />

      {/* ==================== USER ROUTES (ROLE_USER) ==================== */}
      <Route
        path="dashboard"
        element={
          <PrivateRoute hasAnyAuthorities={['ROLE_USER', 'ROLE_ADMIN', 'ROLE_STAFF']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="flashcard" element={<Flashcard />} />
        <Route path="flashcard/add" element={<AddToFlashcard />} />

        {/* Courses & Learning */}
        <Route path="courses" element={<MyCourses />} />
        <Route path="courses/:courseId/chapters" element={<BookLessons />} />
        <Route path="courses/chapter/:id" element={<ChapterExercise />} />
        <Route path="vocabulary" element={<VocabularyList />} />
        <Route path="lesson/:id" element={<ReadingLesson />} />

        {/* Book Library */}
        <Route path="books" element={<BookLibrary />} />
        <Route path="books/:bookId" element={<BookDetail />} />
        <Route path="books/:bookId/chapter/:chapterId" element={<ChapterLearning />} />

        {/* My Books & Chapters */}
        <Route path="my-books" element={<MyBooks />} />
        <Route path="my-chapters" element={<MyChapters />} />

        {/* Exercises */}
        <Route path="exercise/listening/:id" element={<ListeningExercise />} />
        <Route path="exercise/reading/:id" element={<ReadingExercise />} />
        <Route path="exercise/speaking/:id" element={<SpeakingExercise />} />
        <Route path="exercise/writing/:id" element={<WritingExercise />} />

        {/* New Feature Pages */}
        <Route path="achievements" element={<Achievements />} />
        <Route path="reports" element={<LearningReports />} />
        <Route path="analytics" element={<ExerciseAnalytics />} />
        <Route path="favorites" element={<FavoritesPage />} />
      </Route>

      {/* ==================== ADMIN ROUTES (ROLE_ADMIN) ==================== */}
      <Route
        path="admin"
        element={
          <PrivateRoute hasAnyAuthorities={['ROLE_ADMIN']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="courses" element={<CourseManagement />} />
        <Route path="book-approval" element={<BookApproval />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* ==================== STAFF ROUTES (ROLE_STAFF) ==================== */}
      <Route
        path="staff"
        element={
          <PrivateRoute hasAnyAuthorities={['ROLE_STAFF', 'ROLE_ADMIN']}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<StaffOverview />} />
        <Route path="books" element={<BookManagement />} />
        <Route path="books/:bookId/chapters" element={<StaffChapterManagement />} />
        <Route path="chapters/:chapterId/content" element={<StaffContentEditor />} />
        <Route path="chapters/:chapterId/edit" element={<ChapterContentEditor />} />
        <Route path="chapters/:chapterId/stepper" element={<ChapterStepperEditor />} />
        <Route path="books/:bookId/editor" element={<ChapterContentEditor />} />
        <Route path="editor/:chapterId" element={<ChapterContentEditor />} />
        <Route path="upload" element={<UploadBooks />} />
        <Route path="upload-manager" element={<BookUploadManager />} />
        <Route path="settings" element={<StaffSettings />} />
      </Route>

      {/* ==================== 404 REDIRECT ==================== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
