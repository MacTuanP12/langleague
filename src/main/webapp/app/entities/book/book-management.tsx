import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IBook } from 'app/shared/model/book.model';

export const BookManagement = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await axios.get('/api/books');
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading books:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/api/books/${id}`);
        loadBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const filteredBooks = books.filter(
    book =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) || book.uploadedBy?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalBooks = books.length;
  const availableBooks = books.filter(b => b.isPublic).length;
  const uploadedBooks = books.filter(b => !b.isPublic).length;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="book-management">
      <div className="page-header">
        <h2>Book Management</h2>
        <p>Manage your library inventory, track issued books, and update catalog details.</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-label">Total Books</span>
          <span className="stat-value">{totalBooks}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Available</span>
          <span className="stat-value">{availableBooks}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Uploaded</span>
          <span className="stat-value">{uploadedBooks}</span>
        </div>
      </div>

      <div className="actions-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-filter">Filter</button>
        <Link to="/books/new" className="btn-primary">
          + Add New Book
        </Link>
      </div>

      <table className="books-table">
        <thead>
          <tr>
            <th>COVER</th>
            <th>BOOK DETAILS</th>
            <th>UPLOADED BY</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map(book => (
            <tr key={book.id}>
              <td>
                <img src={book.coverImageUrl || '/content/images/default-book.png'} alt={book.title} className="book-cover" />
              </td>
              <td>
                <div className="book-details">
                  <strong>{book.title}</strong>
                  <span className="book-description">{book.description}</span>
                </div>
              </td>
              <td>{book.uploadedBy}</td>
              <td>
                <div className="action-buttons">
                  <Link to={`/books/${book.id}/edit`} className="btn-icon">
                    <i className="fa fa-edit"></i>
                  </Link>
                  <Link to={`/books/${book.id}`} className="btn-icon">
                    <i className="fa fa-eye"></i>
                  </Link>
                  <button onClick={() => handleDelete(book.id)} className="btn-icon">
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredBooks.length === 0 && (
        <div className="no-results">
          <p>No books found</p>
        </div>
      )}

      <div className="pagination">
        <button disabled>Previous</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>...</button>
        <button>21</button>
        <button>Next</button>
      </div>
    </div>
  );
};

export default BookManagement;
