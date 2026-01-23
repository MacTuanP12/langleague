import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity as fetchBookById, getPublicBooks as fetchPublicBooks } from 'app/entities/book/book.reducer';
import { fetchUnitsByBookId } from 'app/shared/reducers/unit.reducer';
import { fetchEnrollmentByBookId, enrollInBook } from 'app/entities/enrollment/enrollment.reducer';
import './book-detail.scss';
import { Translate, translate } from 'react-jhipster';
import { LoadingSpinner } from 'app/shared/components';

export const BookDetail = () => {
  // Handle both :id (from /books/:id) and :bookId (from /learn/book/:bookId)
  const params = useParams<{ id?: string; bookId?: string }>();
  const id = params.id || params.bookId;

  const dispatch = useAppDispatch();

  // Redux state
  const selectedBook = useAppSelector(state => state.book.entity);
  const books = useAppSelector(state => state.book.entities);
  const bookLoading = useAppSelector(state => state.book.loading);
  const selectedEnrollment = useAppSelector(state => state.enrollment.entity);

  useEffect(() => {
    if (id) {
      const bookId = Number(id);
      dispatch(fetchBookById(bookId));
      dispatch(fetchUnitsByBookId(bookId));
      dispatch(fetchEnrollmentByBookId(bookId));
      dispatch(fetchPublicBooks({}));
    }
  }, [id, dispatch]);

  const handleEnroll = async () => {
    if (!id) return;
    try {
      await dispatch(enrollInBook(Number(id))).unwrap();
      toast.success(translate('langleague.student.books.messages.enrollSuccess', 'Successfully enrolled in the book!'));
    } catch (error) {
      toast.error(translate('langleague.student.books.messages.enrollError', 'Failed to enroll. Please try again.'));
      console.error('Error enrolling:', error);
    }
  };

  if (bookLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <LoadingSpinner message="langleague.student.books.detail.loading" isI18nKey />
      </div>
    );
  }

  if (!selectedBook || !selectedBook.id) {
    return null;
  }

  // Filter related books (excluding current book)
  const relatedBooks = (books || []).filter(b => b.id !== Number(id)).slice(0, 3);

  return (
    <div className="book-detail">
      <div className="book-detail-header">
        <Link to="/student/books" className="back-link">
          ← <Translate contentKey="langleague.student.books.detail.backToBooks">Back to Books</Translate>
        </Link>
        <h2>{selectedBook.title}</h2>
      </div>

      <div className="book-detail-content">
        <div className="book-info-panel">
          <img
            src={selectedBook.coverImageUrl || '/content/images/default-book.png'}
            alt={selectedBook.title}
            className="book-cover-large"
          />
          <div className="book-description">
            <h3>{selectedBook.title}</h3>
            <p className="description">{selectedBook.description}</p>

            <UnitsListWrapper selectedBook={selectedBook} selectedEnrollment={selectedEnrollment} handleEnroll={handleEnroll} />
          </div>
        </div>

        {relatedBooks.length > 0 && (
          <div className="related-books">
            <h4>
              <Translate contentKey="langleague.student.books.detail.relatedBooks">Related Books</Translate>
            </h4>
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

// Helper component to handle units list safely and render buttons
const UnitsListWrapper = ({ selectedBook, selectedEnrollment, handleEnroll }) => {
  const unitsEntities = useAppSelector(state => state.unit.entities);
  const unitsCustom = useAppSelector(state => state.unit.units);
  const units = unitsEntities && unitsEntities.length > 0 ? unitsEntities : unitsCustom || [];

  return (
    <>
      {selectedEnrollment && selectedEnrollment.id ? (
        <Link
          to={units.length > 0 ? `/student/learn/book/${selectedBook.id}/unit/${units[0].id}` : '#'}
          className={`btn-continue ${units.length === 0 ? 'disabled' : ''}`}
          style={units.length === 0 ? { pointerEvents: 'none', opacity: 0.6 } : {}}
        >
          <i className="bi bi-play-circle"></i>{' '}
          <Translate contentKey="langleague.student.books.detail.startLearning">Continue Learning</Translate>
        </Link>
      ) : (
        <button onClick={handleEnroll} className="btn-enroll">
          <i className="bi bi-bookmark-plus"></i> <Translate contentKey="langleague.student.books.detail.enrollNow">Enroll Now</Translate>
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
              <Link
                key={unit.id}
                to={`/student/learn/book/${selectedBook.id}/unit/${unit.id}`}
                className="unit-item"
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <span className="unit-number">{index + 1}</span>
                <span className="unit-title">{unit.title}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default BookDetail;
