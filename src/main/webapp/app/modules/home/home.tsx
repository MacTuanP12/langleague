import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import './home.scss';
import { translate, Translate } from 'react-jhipster';
import { ModernHeader } from 'app/shared/layout/header/modern-header';
import { ModernFooter } from 'app/shared/layout/footer/modern-footer';
import { getNewestBooks } from 'app/entities/book/book.reducer';

export const HomeNew = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const account = useAppSelector(state => state.authentication.account);
  const bookList = useAppSelector(state => state.book.entities);
  const loading = useAppSelector(state => state.book.loading);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getNewestBooks());
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to public books list with search query
      navigate(`/books?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleBookClick = id => {
    navigate(`/book/${id}`);
  };

  return (
    <div className="home-new-container">
      {/* Header */}
      <ModernHeader />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            <Translate contentKey="home.title">Discover Knowledge</Translate>
          </h1>
          <p>
            <Translate contentKey="home.subtitle">Explore our vast collection of educational resources</Translate>
          </p>

          <form className="search-bar" onSubmit={handleSearch}>
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder={translate('home.search.placeholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <Translate contentKey="home.search.button">Search</Translate>
            </button>
          </form>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>
            <i className="bi bi-book"></i> <Translate contentKey="home.featured.title">Featured Books</Translate>
          </h2>
          <Link to="/books" className="view-all">
            <Translate contentKey="home.featured.viewAll">View all</Translate> <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="text-center p-5">
            <Translate contentKey="home.loading">Loading...</Translate>
          </div>
        ) : (
          <div className="books-grid">
            {bookList &&
              bookList.map(book => (
                <div key={book.id} className="book-card" onClick={() => handleBookClick(book.id)}>
                  <div
                    className="book-cover"
                    style={{ backgroundImage: book.coverImageUrl ? `url(${book.coverImageUrl})` : 'none', backgroundColor: '#e0e0e0' }}
                  >
                    {!book.coverImageUrl && <div className="book-placeholder">{book.title}</div>}
                  </div>
                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <Link to={`/book/${book.id}`} className="details-btn">
                      <Translate contentKey="home.featured.details">Details</Translate>
                    </Link>
                  </div>
                </div>
              ))}
            {bookList && bookList.length === 0 && (
              <div className="text-center w-100">
                <Translate contentKey="home.noBooks">No books found.</Translate>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <ModernFooter />
    </div>
  );
};

export default HomeNew;
