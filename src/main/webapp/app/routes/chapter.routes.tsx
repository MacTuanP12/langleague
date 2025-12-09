import * as React from 'react';
import { RouteObject } from 'react-router-dom';
import ChapterList from 'app/components/ChapterList';
import LessonList from 'app/components/LessonList';

export const chapterRoutes: RouteObject[] = [
  {
    path: 'chapters',
    element: <ChapterList />,
  },
  {
    path: 'books/:bookId/chapters',
    element: <ChapterList />,
  },
  {
    path: 'chapters/:chapterId/lessons',
    element: <LessonList />,
  },
];
