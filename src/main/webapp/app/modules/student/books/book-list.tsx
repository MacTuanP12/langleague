import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { Container, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchPublicBooks } from 'app/shared/reducers/book.reducer';
import { formatDate } from 'app/shared/util';
import { BookListSkeleton, ErrorDisplay } from 'app/shared/components';
import '../student.scss';

export const BookList = () => {
  const dispatch = useAppDispatch();
  const { books, loading, errorMessage } = useAppSelector(state => state.book);

  useEffect(() => {
    dispatch(fetchPublicBooks());
  }, [dispatch]);

  if (loading) {
    return (
      <Container fluid className="student-page-container">
        <BookListSkeleton count={8} />
      </Container>
    );
  }

  if (errorMessage) {
    return (
      <Container fluid className="student-page-container">
        <ErrorDisplay message={errorMessage} onRetry={() => dispatch(fetchPublicBooks())} />
      </Container>
    );
  }

  return (
    <Container fluid className="student-page-container">
      {/* Page Header */}
      <div className="student-header mb-4">
        <div className="header-content">
          <h1>
            <FontAwesomeIcon icon="book" className="me-3" />
            <Translate contentKey="langleague.student.books.title">Available Books</Translate>
          </h1>
          <p>
            <Translate contentKey="langleague.student.books.description">Choose a book to start your learning journey</Translate>
          </p>
        </div>
      </div>

      {/* Books Grid */}
      {!books || books.length === 0 ? (
        <div className="empty-state-student">
          <div className="empty-icon">
            <FontAwesomeIcon icon="book-open" />
          </div>
          <h3>
            <Translate contentKey="langleague.student.books.noBooks">No books available</Translate>
          </h3>
          <p>
            <Translate contentKey="langleague.student.books.noBooksDescription">Check back later for new learning materials</Translate>
          </p>
        </div>
      ) : (
        <div className="books-grid">
          {books.map(book => (
            <Link key={book.id} to={`/student/books/${book.id}`} className="book-card-student" style={{ textDecoration: 'none' }}>
              <div className="book-image-wrapper">
                <img
                  src={book.coverImageUrl || '/content/images/default-book.png'}
                  alt={book.title}
                  onError={e => (e.currentTarget.src = '/content/images/default-book.png')}
                />
                {book.isPublic && (
                  <Badge className="book-badge new">
                    <FontAwesomeIcon icon="globe" className="me-1" />
                    <Translate contentKey="langleague.student.books.public">Public</Translate>
                  </Badge>
                )}
              </div>

              <div className="book-content">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-description">{book.description}</p>

                <div className="book-stats">
                  {book.createdDate && (
                    <span className="stat-item">
                      <FontAwesomeIcon icon="calendar" />
                      {formatDate(book.createdDate)}
                    </span>
                  )}
                </div>
              </div>

              <div className="book-actions">
                <button className="continue-learning-btn w-100">
                  <FontAwesomeIcon icon="play-circle" className="me-2" />
                  <Translate contentKey="langleague.student.books.viewDetails">View Details</Translate>
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
};

export default BookList;
