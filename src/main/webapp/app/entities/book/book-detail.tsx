import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { IBook } from 'app/shared/model/book.model';
import { IUnit } from 'app/shared/model/unit.model';
import { LoadingSpinner } from 'app/shared/components';

export const BookDetail = () => {
  const [book, setBook] = useState<IBook | null>(null);
  const [units, setUnits] = useState<IUnit[]>([]);
  const [selectedTab, setSelectedTab] = useState<'all' | 'enrolled' | 'not-enrolled'>('all');
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadBook();
      loadUnits();
    }
  }, [id]);

  const loadBook = async () => {
    try {
      const response = await axios.get(`/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error loading book:', error);
      toast.error('Failed to load book details. Please try again.');
    }
  };

  const loadUnits = async () => {
    try {
      const response = await axios.get(`/api/books/${id}/units`);
      setUnits(response.data);
    } catch (error) {
      console.error('Error loading units:', error);
      toast.error('Failed to load units. Please try again.');
    }
  };

  if (!book) {
    return <LoadingSpinner message="Loading book details..." />;
  }

  return (
    <div className="book-detail">
      <div className="book-detail-header">
        <Link to="/student/home" className="back-link">
          ← Home
        </Link>
        <h2>{book.title}</h2>
      </div>

      <div className="detail-content">
        <div className="sidebar">
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
                <Link to={`/books/${book.id}/learn`} className="btn-enroll">
                  Enroll Now
                </Link>
              </div>
            </div>

            {/* Other courses placeholder */}
            <div className="course-card">
              <img src="/content/images/default-book.png" alt="Modern History" />
              <div className="course-info">
                <h4>Modern History</h4>
                <p>Journey through epochs of the 20th century...</p>
                <Link to="#" className="btn-enroll">
                  Enroll Now
                </Link>
              </div>
            </div>

            <div className="course-card">
              <img src="/content/images/default-book.png" alt="Calculus I" />
              <div className="course-info">
                <h4>Calculus I</h4>
                <p>Derivatives, Integrals, and limits explained...</p>
                <Link to="#" className="btn-continue">
                  Continue Learning
                </Link>
              </div>
            </div>
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
