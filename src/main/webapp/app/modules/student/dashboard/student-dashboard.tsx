import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppFooter } from 'app/shared/layout/footer/app-footer';
import './student-dashboard.scss';

const ENROLLED_COURSES = [
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

export const StudentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'enrolled' | 'notEnroll'>('all');

  const filteredCourses = ENROLLED_COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterTab === 'enrolled') {
      return matchesSearch && (course.status === 'ACTIVE' || course.status === 'COMPLETED');
    }
    if (filterTab === 'notEnroll') {
      return matchesSearch && course.status === 'ENROLLED';
    }
    return matchesSearch;
  });

  return (
    <div className="dashboard-content-wrapper">
      {/* Search and Filter */}
      <div className="search-filter-section">
        <div className="search-wrapper">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search for books, courses, or topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button className={`filter-tab ${filterTab === 'all' ? 'active' : ''}`} onClick={() => setFilterTab('all')}>
            All
          </button>
          <button className={`filter-tab ${filterTab === 'enrolled' ? 'active' : ''}`} onClick={() => setFilterTab('enrolled')}>
            Enrolled
          </button>
          <button className={`filter-tab ${filterTab === 'notEnroll' ? 'active' : ''}`} onClick={() => setFilterTab('notEnroll')}>
            Not Enroll
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {filteredCourses.map(course => (
          <div key={course.id} className="course-card">
            {course.status === 'COMPLETED' && <div className="badge-completed">✓ COMPLETED</div>}
            {course.status === 'ENROLLED' && <div className="badge-enrolled">⊕ ENROLLED</div>}

            <div className="course-cover" style={{ backgroundColor: course.coverColor }}>
              <div className="course-placeholder">{course.title}</div>
            </div>

            <div className="course-info">
              <h3>{course.title}</h3>
              <p>{course.description}</p>

              {course.status !== 'ENROLLED' && (
                <div className="progress-section">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <span className="progress-text">{course.progress}%</span>
                </div>
              )}

              <button className="enroll-btn">
                {course.status === 'COMPLETED' ? 'Review' : course.status === 'ENROLLED' ? 'Enroll Now →' : 'Continue Learning →'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="no-results">
          <i className="bi bi-search"></i>
          <p>No courses found matching your search.</p>
        </div>
      )}

      {/* Load More */}
      <div className="load-more-section">
        <button className="load-more-btn">
          Load more books <i className="bi bi-arrow-down"></i>
        </button>
      </div>

      {/* Footer */}
      <AppFooter showLogo={true} showSocial={true} />
    </div>
  );
};

export default StudentDashboard;
