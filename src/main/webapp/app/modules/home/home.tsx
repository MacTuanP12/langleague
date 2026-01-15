import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'app/config/store';
import './home.scss';
import { translate, Translate } from 'react-jhipster';
import { ModernHeader } from 'app/shared/layout/header/modern-header';
import { ModernFooter } from 'app/shared/layout/footer/modern-footer';

const FEATURED_BOOKS = [
  {
    id: 1,
    title: 'Milk and Honey',
    author: 'Rupi Kaur',
    coverColor: '#f4d5b8',
    image: '/content/images/book-milk-honey.png',
  },
  {
    id: 2,
    title: 'Python Crash Course',
    author: 'Eric Matthes',
    coverColor: '#5ba3a3',
    image: '/content/images/book-python.png',
  },
  {
    id: 3,
    title: 'Design of Everyday Things',
    author: 'Don Norman',
    coverColor: '#f5e6d3',
    image: '/content/images/book-design.png',
  },
  {
    id: 4,
    title: 'Atomic Habits',
    author: 'James Clear',
    coverColor: '#4a7c7e',
    image: '/content/images/book-atomic.png',
  },
];

export const HomeNew = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const account = useAppSelector(state => state.authentication.account);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      navigate(`/books/search?q=${encodeURIComponent(searchQuery)}`);
    }
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

        <div className="books-grid">
          {FEATURED_BOOKS.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-cover" style={{ backgroundColor: book.coverColor }}>
                <div className="book-placeholder">{book.title}</div>
              </div>
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="author">{book.author}</p>
                <Link to={`/books/${book.id}`} className="details-btn">
                  <Translate contentKey="home.featured.details">Details</Translate>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <ModernFooter />
    </div>
  );
};

export default HomeNew;
