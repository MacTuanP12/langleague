import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IBook } from 'app/shared/model/book.model';
import { IUnit } from 'app/shared/model/unit.model';
import './flashcard-list.scss';

export const FlashcardList = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [units, setUnits] = useState<{ [bookId: number]: IUnit[] }>({});
  const [expandedBookId, setExpandedBookId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingUnits, setLoadingUnits] = useState<{ [bookId: number]: boolean }>({});
  const navigate = useNavigate();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get<IBook[]>('/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnits = async (bookId: number) => {
    if (units[bookId]) {
      // Already loaded, just toggle
      setExpandedBookId(expandedBookId === bookId ? null : bookId);
      return;
    }

    try {
      setLoadingUnits({ ...loadingUnits, [bookId]: true });
      const response = await axios.get<IUnit[]>(`/api/books/${bookId}/units`);
      setUnits({
        ...units,
        [bookId]: response.data,
      });
      setExpandedBookId(bookId);
    } catch (error) {
      console.error('Error loading units:', error);
    } finally {
      setLoadingUnits({ ...loadingUnits, [bookId]: false });
    }
  };

  return (
    <div className="flashcard-list">
      <div className="page-header">
        <button onClick={() => navigate('/student/dashboard')} className="back-btn" type="button">
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="header-content">
          <h1>📚 Flashcards</h1>
          <p>Practice vocabulary with interactive flashcards</p>
        </div>
      </div>

      <div className="books-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-book"></i>
            <h3>No books available</h3>
            <p>Start by enrolling in a book from the Books section</p>
            <Link to="/student/books" className="cta-btn">
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="books-grid">
            {books.map(book => (
              <div key={book.id} className="book-card">
                <div className="book-header" onClick={() => loadUnits(book.id)}>
                  <div className="book-cover">
                    {book.coverImageUrl ? (
                      <img src={book.coverImageUrl} alt={book.title} />
                    ) : (
                      <div className="placeholder-cover">
                        <i className="bi bi-book"></i>
                      </div>
                    )}
                  </div>
                  <div className="book-info">
                    <h3>{book.title}</h3>
                    {book.description && <p className="book-desc">{book.description}</p>}
                    <i className={`bi bi-chevron-${expandedBookId === book.id ? 'up' : 'down'}`}></i>
                  </div>
                </div>

                {expandedBookId === book.id && (
                  <div className="units-list">
                    {loadingUnits[book.id] ? (
                      <div className="units-loading">
                        <div className="small-spinner"></div>
                        <p>Loading units...</p>
                      </div>
                    ) : units[book.id]?.length === 0 ? (
                      <p className="no-units">No units available</p>
                    ) : (
                      units[book.id]?.map(unit => (
                        <Link key={unit.id} to={`/student/learn/unit/${unit.id}/flashcard`} className="unit-item">
                          <div className="unit-icon">🎴</div>
                          <div className="unit-info">
                            <h4>{unit.title}</h4>
                            {unit.summary && <p className="unit-summary">{unit.summary}</p>}
                            <span className="vocab-count">
                              <i className="bi bi-card-text"></i> {unit.vocabularyCount || 0} flashcards
                            </span>
                          </div>
                          <i className="bi bi-arrow-right"></i>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardList;
