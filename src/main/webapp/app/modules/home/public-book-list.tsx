import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { Container, Badge, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getPublicBooks } from 'app/entities/book/book.reducer';
import { formatDate } from 'app/shared/util';
import { ModernHeader } from 'app/shared/layout/header/modern-header';
import { ModernFooter } from 'app/shared/layout/footer/modern-footer';
import { BookListSkeleton, ErrorDisplay } from 'app/shared/components';
import './public-books.scss'; // Use specific styles instead of full student.scss

export const PublicBookList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookList = useAppSelector(state => state.book.entities);
  const loading = useAppSelector(state => state.book.loading);
  const errorMessage = useAppSelector(state => state.book.errorMessage);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getPublicBooks({}));
  }, [dispatch]);

  // Initialize search query from URL param if present
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  const filteredBooks = useMemo(() => {
    if (!bookList) return [];
    if (!searchQuery) return bookList;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return bookList.filter(
      book =>
        book.title?.toLowerCase().includes(lowerCaseQuery) || (book.description && book.description.toLowerCase().includes(lowerCaseQuery)),
    );
  }, [bookList, searchQuery]);

  const handleBookClick = (bookId: number) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="public-books-page">
      <ModernHeader />
      <div className="public-books-container">
        {/* Page Header */}
        <div className="public-header d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h1>
              <FontAwesomeIcon icon="book" className="me-3" />
              <Translate contentKey="home.books.title">Available Books</Translate>
            </h1>
            <p className="mb-0">
              <Translate contentKey="home.books.description">Choose a book to start your learning journey</Translate>
            </p>
          </div>
          <div className="search-box" style={{ minWidth: '300px' }}>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FontAwesomeIcon icon="search" className="text-muted" />
              </span>
              <Input
                type="text"
                className="border-start-0 ps-0"
                placeholder={translate('home.search.placeholder')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search books"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <BookListSkeleton count={8} />
        ) : errorMessage ? (
          <ErrorDisplay message={errorMessage} onRetry={() => dispatch(getPublicBooks({}))} />
        ) : (
          <>
            {/* Books Grid */}
            {!filteredBooks || filteredBooks.length === 0 ? (
              <div className="empty-state text-center py-5">
                <div className="empty-icon mb-3">
                  <FontAwesomeIcon icon="book-open" size="3x" className="text-muted" />
                </div>
                <h3>
                  <Translate contentKey="home.books.noBooks">No books available</Translate>
                </h3>
                <p className="text-muted">
                  {searchQuery ? (
                    <Translate contentKey="langleague.student.dashboard.noBooksDescription">
                      Try adjusting your search or filter to find what you're looking for.
                    </Translate>
                  ) : (
                    <Translate contentKey="home.books.noBooksDescription">Check back later for new learning materials</Translate>
                  )}
                </p>
              </div>
            ) : (
              <div className="books-grid">
                {filteredBooks.map(book => (
                  <div key={book.id} onClick={() => handleBookClick(book.id)} className="book-card-student" style={{ cursor: 'pointer' }}>
                    <div className="book-image-wrapper">
                      <img
                        src={book.coverImageUrl || '/content/images/default-book.png'}
                        alt={book.title}
                        onError={e => (e.currentTarget.src = '/content/images/default-book.png')}
                      />
                      {book.isPublic && (
                        <Badge className="book-badge new">
                          <FontAwesomeIcon icon="globe" className="me-1" />
                          <Translate contentKey="home.books.public">Public</Translate>
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
                        <Translate contentKey="home.books.viewDetails">View Details</Translate>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <ModernFooter variant="compact" />
    </div>
  );
};

export default PublicBookList;
