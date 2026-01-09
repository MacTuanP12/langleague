import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { IBook } from 'app/shared/model/book.model';
import { IUnit } from 'app/shared/model/unit.model';
import { IEnrollment } from 'app/shared/model/enrollment.model';
import './book-detail.scss';
import {Translate} from "react-jhipster";

export const BookDetail = () => {
  const [book, setBook] = useState<IBook | null>(null);
  const [units, setUnits] = useState<IUnit[]>([]);
  const [enrollment, setEnrollment] = useState<IEnrollment | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<IBook[]>([]);
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
    return (
      <div>
        <Translate contentKey="langleague.student.books.detail.loading">Loading...</Translate>
      </div>
    );
  }

  return (
    <div className="book-detail">
      <div className="book-detail-header">
        <Link to="/student/books" className="back-link">
          ← <Translate contentKey="langleague.student.books.detail.backToBooks">Back to Books</Translate>
        </Link>
        <h2>{book.title}</h2>
      </div>

      <div className="book-detail-content">
        <div className="book-info-panel">
          <img src={book.coverImageUrl || '/content/images/default-book.png'} alt={book.title} className="book-cover-large" />
          <div className="book-description">
            <h3>{book.title}</h3>
            <p className="description">{book.description}</p>

            {enrollment ? (
              <Link to={`/student/learn/book/${book.id}`} className="btn-continue">
                <i className="bi bi-play-circle"></i>{' '}
                <Translate contentKey="langleague.student.books.detail.startLearning">Continue Learning</Translate>
              </Link>
            ) : (
              <button onClick={handleEnroll} className="btn-enroll">
                <i className="bi bi-bookmark-plus"></i>{' '}
                <Translate contentKey="langleague.student.books.detail.startLearning">Enroll Now</Translate>
              </button>
            )}

            <div className="learning-objectives">
              <h4>
                <Translate contentKey="langleague.student.books.detail.units.title">UNITS IN THIS BOOK</Translate>
              </h4>
              <div className="units-list">
                {units.length === 0 ? (
                  <p className="no-units">
                    <Translate contentKey="langleague.student.books.detail.units.empty">No units available yet</Translate>
                  </p>
                ) : (
                  units.map((unit, index) => (
                    <div key={unit.id} className="unit-item">
                      <span className="unit-number">{index + 1}</span>
                      <span className="unit-title">{unit.title}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {relatedBooks.length > 0 && (
          <div className="related-books">
            <h4>Related Books</h4>
            <div className="related-books-grid">
              {relatedBooks.map(relatedBook => (
                <Link key={relatedBook.id} to={`/student/books/${relatedBook.id}`} className="related-book-card">
                  <img src={relatedBook.coverImageUrl || '/content/images/default-book.png'} alt={relatedBook.title} />
                  <div className="related-book-info">
                    <h5>{relatedBook.title}</h5>
                    <p>{relatedBook.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
