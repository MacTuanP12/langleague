/**
 * Dashboard Constants
 * Extracted hardcoded data to separate constants file
 */

export interface EnrolledCourse {
  id: number;
  title: string;
  description: string;
  progress: number;
  coverColor: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ENROLLED';
  image: string;
}

export type FilterTab = 'all' | 'enrolled' | 'notEnroll';

// TODO: This should be replaced with API call to /api/enrollments or similar endpoint
// Keeping as fallback data for demo purposes only
export const FALLBACK_COURSES: EnrolledCourse[] = [
  {
    id: 1,
    title: 'Introduction to Physics',
    description: 'A comprehensive guide to the basics of physics. Explore the mysteries and natural world.',
    progress: 75,
    coverColor: '#2d5f5d',
    status: 'ACTIVE',
    image: '/content/images/course-physics.png',
  },
  {
    id: 2,
    title: 'Modern History',
    description: 'Explore the major events of the 20th century. Understanding the transformation of the world.',
    progress: 45,
    coverColor: '#f4d5b8',
    status: 'ACTIVE',
    image: '/content/images/course-history.png',
  },
  {
    id: 3,
    title: 'Calculus I',
    description: 'Derivatives, integrals, and limits explained in a fun and simple manner.',
    progress: 100,
    coverColor: '#3d6060',
    status: 'COMPLETED',
    image: '/content/images/course-calculus.png',
  },
  {
    id: 4,
    title: 'Creative Writing',
    description: 'Unlock your imagination and master the art of storytelling.',
    progress: 30,
    coverColor: '#1e3a5f',
    status: 'ENROLLED',
    image: '/content/images/course-writing.png',
  },
  {
    id: 5,
    title: 'Cybersecurity 101',
    description: 'Protect digital assets and understand modern network security principles.',
    progress: 60,
    coverColor: '#1a1a1a',
    status: 'ACTIVE',
    image: '/content/images/course-cyber.png',
  },
  {
    id: 6,
    title: 'Intro to Biology',
    description: 'Understand the complex systems of life, from cells to ecosystems.',
    progress: 20,
    coverColor: '#d4a574',
    status: 'ENROLLED',
    image: '/content/images/course-biology.png',
  },
];

export const FILTER_TABS: Array<{ key: FilterTab; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'enrolled', label: 'Enrolled' },
  { key: 'notEnroll', label: 'Not Enroll' },
];

