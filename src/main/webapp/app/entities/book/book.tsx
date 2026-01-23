import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IBook } from 'app/shared/model/book.model';
import { Translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities, deleteEntity } from 'app/entities/book/book.reducer';

export const Book = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const books = useAppSelector(state => state.book.entities);
  const loading = useAppSelector(state => state.book.loading);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getEntities({}));
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await dispatch(deleteEntity(id)).unwrap();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const filteredBooks = books.filter(
    book =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.teacherProfile?.user?.login?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div>
        <Translate contentKey="global.loading">Loading...</Translate>
      </div>
    );
  }

  return (
    <div className="book-management">
      <div className="page-header">
        <h2>
          <Translate contentKey="langleagueApp.book.home.title">Books</Translate>
        </h2>
      </div>

      <div className="actions-bar">
        <Link to="/book/new" className="btn btn-primary">
          <Translate contentKey="langleagueApp.book.home.createLabel">Create new Book</Translate>
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <Translate contentKey="global.field.id">ID</Translate>
              </th>
              <th>
                <Translate contentKey="langleagueApp.book.title">Title</Translate>
              </th>
              <th>
                <Translate contentKey="langleagueApp.book.description">Description</Translate>
              </th>
              <th>
                <Translate contentKey="langleagueApp.book.isPublic">Is Public</Translate>
              </th>
              <th>
                <Translate contentKey="langleagueApp.book.teacherProfile">Teacher</Translate>
              </th>
              <th>
                <Translate contentKey="entity.action.edit">Edit</Translate>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map(book => (
              <tr key={book.id}>
                <td>
                  <Link to={`/book/${book.id}`}>{book.id}</Link>
                </td>
                <td>{book.title}</td>
                <td>{book.description}</td>
                <td>{book.isPublic ? 'true' : 'false'}</td>
                <td>{book.teacherProfile?.user?.login}</td>
                <td>
                  <div className="btn-group flex-btn-group-container">
                    <Link to={`/book/${book.id}`} className="btn btn-info btn-sm">
                      <span className="d-none d-md-inline">
                        <Translate contentKey="entity.action.view">View</Translate>
                      </span>
                    </Link>
                    <Link to={`/book/${book.id}/edit`} className="btn btn-primary btn-sm">
                      <span className="d-none d-md-inline">
                        <Translate contentKey="entity.action.edit">Edit</Translate>
                      </span>
                    </Link>
                    <button onClick={() => handleDelete(book.id)} className="btn btn-danger btn-sm">
                      <span className="d-none d-md-inline">
                        <Translate contentKey="entity.action.delete">Delete</Translate>
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Book;
