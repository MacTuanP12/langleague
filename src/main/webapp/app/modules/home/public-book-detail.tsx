import React, { useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity as fetchBookById, getPublicBooks as fetchPublicBooks } from 'app/entities/book/book.reducer';
import { fetchUnitsByBookId } from 'app/shared/reducers/unit.reducer';
import { fetchEnrollmentByBookId, enrollInBook } from 'app/entities/enrollment/enrollment.reducer';
import { Translate, translate } from 'react-jhipster';
import { LoadingSpinner } from 'app/shared/components';
import { ModernHeader } from 'app/shared/layout/header/modern-header';
import { ModernFooter } from 'app/shared/layout/footer/modern-footer';
import './public-book-detail.scss';

export const PublicBookDetail = () => {
  const params = useParams<{ id?: string }>();
  const id = params.id;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Redux state
  const selectedBook = useAppSelector(state => state.book.entity);
  const books = useAppSelector(state => state.book.entities);
  const bookLoading = useAppSelector(state => state.book.loading);
  const selectedEnrollment = useAppSelector(state => state.enrollment.entity);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);

  useEffect(() => {
    if (id) {
      const bookId = Number(id);
      dispatch(fetchBookById(bookId));
      dispatch(fetchUnitsByBookId(bookId));
      if (isAuthenticated) {
        dispatch(fetchEnrollmentByBookId(bookId));
      }
      dispatch(fetchPublicBooks({}));
    }
  }, [id, dispatch, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      // Redirect to login, preserving the current location to return to
      navigate('/login', { state: { from: location } });
      return;
    }
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
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
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
    <div className="public-book-detail-page">
      <ModernHeader />
      <div className="book-detail" style={{ maxWidth: '1200px', margin: '0 auto', minHeight: 'auto' }}>
        <div className="book-detail-header">
          <Link to="/" className="back-link">
            ← <Translate contentKey="langleague.student.books.detail.backToHome">Back to Home</Translate>
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

              <UnitsListWrapper
                selectedBook={selectedBook}
                selectedEnrollment={selectedEnrollment}
                handleEnroll={handleEnroll}
                isAuthenticated={isAuthenticated}
                location={location}
              />
            </div>
          </div>

          {relatedBooks.length > 0 && (
            <div className="related-books">
              <h4>
                <Translate contentKey="langleague.student.books.detail.relatedBooks">Related Books</Translate>
              </h4>
              <div className="related-books-grid">
                {relatedBooks.map(relatedBook => (
                  <Link key={relatedBook.id} to={`/book/${relatedBook.id}`} className="related-book-card">
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
      <ModernFooter />
    </div>
  );
};

// Helper component to handle units list safely and render buttons
const UnitsListWrapper = ({ selectedBook, selectedEnrollment, handleEnroll, isAuthenticated, location }) => {
  const unitsEntities = useAppSelector(state => state.unit.entities);
  const unitsCustom = useAppSelector(state => state.unit.units);
  const units = unitsEntities && unitsEntities.length > 0 ? unitsEntities : unitsCustom || [];

  return (
    <>
      {isAuthenticated && selectedEnrollment && selectedEnrollment.id ? (
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
                to={isAuthenticated ? `/student/learn/book/${selectedBook.id}/unit/${unit.id}` : '/login'}
                state={!isAuthenticated ? { from: location } : undefined}
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

export default PublicBookDetail;
