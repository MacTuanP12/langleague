import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { IBook } from 'app/shared/model/book.model';
import { IUnit } from 'app/shared/model/unit.model';
import { IEnrollment } from 'app/shared/model/enrollment.model';
import './book-detail.scss';

export const BookDetail = () => {
  const [book, setBook] = useState<IBook | null>(null);
  const [units, setUnits] = useState<IUnit[]>([]);
  const [enrollment, setEnrollment] = useState<IEnrollment | null>(null);
  const [selectedTab, setSelectedTab] = useState<'all' | 'enrolled' | 'not-enrolled'>('all');
  const [relatedBooks, setRelatedBooks] = useState<IBook[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadBook();
      loadUnits();
      loadEnrollment();
      loadRelatedBooks();
    }
  }, [id]);

  const loadBook = async () => {
    try {
      const response = await axios.get<IBook>(`/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error loading book:', error);
    }
  };

  const loadUnits = async () => {
    try {
      const response = await axios.get<IUnit[]>(`/api/books/${id}/units`);
      setUnits(response.data);
    } catch (error) {
      console.error('Error loading units:', error);
    }
  };

  const loadEnrollment = async () => {
    try {
      const response = await axios.get<IEnrollment>(`/api/enrollments/book/${id}`);
      setEnrollment(response.data);
    } catch (error) {
      // Not enrolled yet
      console.warn('Not enrolled in this book');
    }
  };

  const loadRelatedBooks = async () => {
    try {
      const response = await axios.get<IBook[]>('/api/books', {
        params: { size: 3 },
      });
      setRelatedBooks(response.data.filter(b => b.id !== Number(id)));
    } catch (error) {
      console.error('Error loading related books:', error);
    }
  };

  const handleEnroll = async () => {
    try {
      await axios.post('/api/enrollments', {
        bookId: id,
      });
      loadEnrollment();
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="book-detail">
      <div className="book-detail-header">
        <div className="header-content">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Toggle Sidebar">
              {isSidebarOpen ? '☰ Hide Sidebar' : '☰ Show Sidebar'}
            </button>
            <Link to="/student/dashboard" className="back-link">
              ← Home
            </Link>
          </div>
          <h2>{book.title}</h2>
        </div>
      </div>

      <div className={`detail-content ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="search-box">
            <input type="text" placeholder="Search for books, courses, or topics..." />
          </div>

          <div className="tabs">
            <button className={selectedTab === 'all' ? 'active' : ''} onClick={() => setSelectedTab('all')}>
              All
            </button>
            <button className={selectedTab === 'enrolled' ? 'active' : ''} onClick={() => setSelectedTab('enrolled')}>
              Enrolled
            </button>
            <button className={selectedTab === 'not-enrolled' ? 'active' : ''} onClick={() => setSelectedTab('not-enrolled')}>
              Not Enroll
            </button>
          </div>

          <div className="courses-list">
            <div className="course-card featured">
              <img src={book.coverImageUrl || '/content/images/default-book.png'} alt={book.title} />
              <div className="course-info">
                <h4>{book.title}</h4>
                <p>{book.description}</p>
                {enrollment ? (
                  <Link to={`/student/learn/book/${book.id}`} className="btn-continue">
                    Continue Learning
                  </Link>
                ) : (
                  <button onClick={handleEnroll} className="btn-enroll">
                    Enroll Now
                  </button>
                )}
              </div>
            </div>

            {relatedBooks.map(relatedBook => (
              <div key={relatedBook.id} className="course-card">
                <img src={relatedBook.coverImageUrl || '/content/images/default-book.png'} alt={relatedBook.title} />
                <div className="course-info">
                  <h4>{relatedBook.title}</h4>
                  <p>{relatedBook.description}</p>
                  <Link to={`/student/books/${relatedBook.id}`} className="btn-enroll">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="main-content">
          <div className="book-info-panel">
            <img src={book.coverImageUrl || '/content/images/default-book.png'} alt={book.title} className="book-cover-large" />
            <div className="book-description">
              <h3>{book.title}</h3>
              <p className="subtitle">Dr. Richard Feynman</p>
              <p className="description">{book.description}</p>
              <p className="detailed-description">
                Dive into the fascinating world of physics with this comprehensive eBook that covers the fundamental principles that govern
                our universe. From the mechanics of motion to the laws of thermodynamics, you will explore real-world applications of
                physical concepts. The curriculum includes interactive problem-solving sessions, visual demonstrations, and a universal
                context to bring equations to life.
              </p>
              <div className="learning-objectives">
                <h4>WHAT YOU&apos;LL LEARN</h4>
                <ul>
                  <li>Newton&apos;s Laws of Motion</li>
                  <li>Energy, Work, and Power</li>
                  <li>Thermodynamics and Heat Transfer</li>
                  <li>Introduction to Quantum Theory</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
