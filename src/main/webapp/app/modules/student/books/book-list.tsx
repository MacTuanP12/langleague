import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchPublicBooks } from 'app/shared/reducers/book.reducer';
import { formatDate } from 'app/shared/util';
import { BookListSkeleton, ErrorDisplay } from 'app/shared/components';
import './book-list.scss';

export const BookList = () => {
  const dispatch = useAppDispatch();
  const { books, loading, errorMessage } = useAppSelector(state => state.book);

  useEffect(() => {
    dispatch(fetchPublicBooks());
  }, [dispatch]);

  if (loading) {
    return <BookListSkeleton count={8} />;
  }

  if (errorMessage) {
    return <ErrorDisplay message={errorMessage} onRetry={() => dispatch(fetchPublicBooks())} />;
  }

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h1>
          <Translate contentKey="langleague.student.books.title">My Books</Translate>
        </h1>
        <p>
          <Translate contentKey="langleague.student.books.detail.description">Choose a book to start learning</Translate>
        </p>
      </div>

      <div className="book-grid">
        {!books || books.length === 0 ? (
          <div className="empty-state">
            <p>
              <Translate contentKey="langleague.student.books.noBooks">No books available</Translate>
            </p>
          </div>
        ) : (
          books.map(book => (
            <Link key={book.id} to={`/student/books/${book.id}`} className="book-card">
              <div className="book-cover">
                <img
                  src={book.coverImageUrl || '/content/images/default-book.png'}
                  alt={book.title}
                  onError={e => (e.currentTarget.src = '/content/images/default-book.png')}
                />
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="book-description">{book.description}</p>
                <div className="book-meta">
                  <span className="book-status">
                    {book.isPublic ? (
                      <Translate contentKey="langleague.student.books.detail.yes">Yes</Translate>
                    ) : (
                      <Translate contentKey="langleague.student.books.detail.no">No</Translate>
                    )}
                  </span>
                  {book.createdDate && <span className="book-date">{formatDate(book.createdDate)}</span>}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default BookList;
