import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'app/config/store';
import './home.scss';

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
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">◆</div>
            <span className="logo-text">LangLeague</span>
          </div>

          <div className="header-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
                <Link to="/account/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="user-menu">
                <span>Welcome, {account.login}</span>
                <Link to="/account/settings" className="btn-primary">
                  Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Knowledge</h1>
          <p>Explore our vast collection of educational resources</p>

          <form className="search-bar" onSubmit={handleSearch}>
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>
            <i className="bi bi-bookmark"></i> Featured Books
          </h2>
          <Link to="/books" className="view-all">
            View all <i className="bi bi-arrow-right"></i>
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
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">◆</div>
              <span>LangLeague</span>
            </div>
            <p>
              LangLeague is an open educational library dedicated to providing accessible knowledge for everyone. We believe in the power of
              books to transform lives and build a better future through education.
            </p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li>
                <i className="bi bi-envelope"></i>
                <a href="mailto:support@bookflow.com">support@bookflow.edu</a>
              </li>
              <li>
                <i className="bi bi-telephone"></i>
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} LangLeague. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomeNew;
