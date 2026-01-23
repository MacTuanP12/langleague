import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { Container, Badge, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEnrolledBooks } from 'app/entities/book/book.reducer';
import { formatDate } from 'app/shared/util';
import { BookListSkeleton, ErrorDisplay } from 'app/shared/components';
import '../student.scss';

export const BookList = () => {
  const dispatch = useAppDispatch();
  const bookList = useAppSelector(state => state.book.entities);
  const loading = useAppSelector(state => state.book.loading);
  const errorMessage = useAppSelector(state => state.book.errorMessage);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getEnrolledBooks({}));
  }, [dispatch]);

  const filteredBooks = useMemo(() => {
    if (!bookList) return [];
    if (!searchQuery) return bookList;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return bookList.filter(
      book =>
        book.title?.toLowerCase().includes(lowerCaseQuery) || (book.description && book.description.toLowerCase().includes(lowerCaseQuery)),
    );
  }, [bookList, searchQuery]);

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
        <ErrorDisplay message={errorMessage} onRetry={() => dispatch(getEnrolledBooks({}))} />
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
            <Translate contentKey="langleague.student.books.title">My Books</Translate>
          </h1>
          <p>
            <Translate contentKey="langleague.student.books.description">Continue your learning journey</Translate>
          </p>
        </div>
        <div className="header-actions">
          <div className="search-box" style={{ maxWidth: '300px' }}>
            <FontAwesomeIcon icon="search" className="search-icon" />
            <Input
              type="text"
              placeholder={translate('langleague.student.dashboard.search.placeholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search books"
            />
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {!filteredBooks || filteredBooks.length === 0 ? (
        <div className="empty-state-student">
          <div className="empty-icon">
            <FontAwesomeIcon icon="book-open" />
          </div>
          <h3>
            <Translate contentKey="langleague.student.books.noBooks">No books available</Translate>
          </h3>
          <p>
            {searchQuery ? (
              <Translate contentKey="langleague.student.dashboard.noBooksDescription">
                Try adjusting your search or filter to find what you're looking for.
              </Translate>
            ) : (
              <Translate contentKey="langleague.student.books.noBooksDescription">You haven't enrolled in any books yet.</Translate>
            )}
          </p>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map(book => (
            <div key={book.id} className="book-card-student">
              <Link to={`/student/books/${book.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
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
              </Link>

              <div className="book-actions">
                <Link to={`/student/learn/book/${book.id}`} className="continue-learning-btn w-100 text-center text-decoration-none">
                  <FontAwesomeIcon icon="play-circle" className="me-2" />
                  <Translate contentKey="langleague.student.dashboard.book.continue">Continue</Translate>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default BookList;
