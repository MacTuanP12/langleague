import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { IBook } from 'app/shared/model/book.model';
import './book-list.scss';

export const BookList = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await axios.get<IBook[]>('/api/books');
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading books:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h1>Available Books</h1>
        <p>Choose a book to start learning</p>
      </div>

      <div className="book-grid">
        {books.length === 0 ? (
          <div className="empty-state">
            <p>No books available</p>
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
                  <span className="book-status">{book.isPublic ? 'Public' : 'Private'}</span>
                  {book.createdDate && <span className="book-date">{new Date(book.createdDate).toLocaleDateString()}</span>}
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
