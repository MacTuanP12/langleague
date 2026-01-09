import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchBooks, deleteBook } from 'app/shared/reducers/book.reducer';
import TeacherLayout from 'app/modules/teacher/layout/teacher-layout';
import { DataTable, Column } from 'app/shared/components/data-table';
import { LoadingSpinner, ErrorDisplay, ConfirmModal } from 'app/shared/components';
import { IBook } from 'app/shared/model/book.model';
import './book-management.scss';

export const BookManagement = () => {
  const dispatch = useAppDispatch();
  const { books, loading, errorMessage } = useAppSelector(state => state.book);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleDeleteClick = (id: number) => {
    setBookToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (bookToDelete) {
      try {
        await dispatch(deleteBook(bookToDelete));
        toast.success(translate('langleague.teacher.books.actions.deleteSuccess'));
      } catch (error) {
        toast.error(translate('langleague.teacher.books.actions.deleteFailed'));
      }
    }
    setDeleteModalOpen(false);
    setBookToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setBookToDelete(null);
  };

  // Memoize filtered books to prevent unnecessary recalculations
  const filteredBooks = useMemo(
    () =>
      books.filter(
        book =>
          book.title?.toLowerCase().includes(searchTerm.toLowerCase()) || book.uploadedBy?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [books, searchTerm]
  );

  // Memoize statistics
  const stats = useMemo(
    () => ({
      totalBooks: books.length,
      availableBooks: books.filter(b => b.isPublic).length,
      uploadedBooks: books.filter(b => !b.isPublic).length,
    }),
    [books]
  );

  // Define table columns with memoization
  const columns: Column<IBook>[] = useMemo(
    () => [
      {
        key: 'cover',
        header: translate('langleague.teacher.books.table.cover'),
        width: '100px',
        render: book => <img src={book.coverImageUrl || '/content/images/default-book.png'} alt={book.title} className="book-cover" />,
      },
      {
        key: 'details',
        header: translate('langleague.teacher.books.table.details'),
        render: book => (
          <div className="book-details">
            <strong>{book.title}</strong>
            <span className="book-description">{book.description}</span>
          </div>
        ),
      },
      {
        key: 'uploadedBy',
        header: translate('langleague.teacher.books.table.uploadedBy'),
        width: '200px',
        render: book => book.uploadedBy || 'N/A',
      },
      {
        key: 'actions',
        header: translate('langleague.teacher.books.table.actions'),
        width: '150px',
        render: book => (
          <div className="action-buttons">
            <Link to={`/teacher/books/${book.id}/edit`} className="btn-icon" title={translate('langleague.teacher.books.actions.edit')}>
              <i className="fa fa-edit"></i>
            </Link>
            <Link to={`/teacher/books/${book.id}`} className="btn-icon" title={translate('langleague.teacher.books.actions.view')}>
              <i className="fa fa-eye"></i>
            </Link>
            <button onClick={() => handleDeleteClick(book.id)} className="btn-icon" title={translate('langleague.teacher.books.actions.delete')}>
              <i className="fa fa-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    [handleDeleteClick]
  );

  if (loading) {
    return (
      <TeacherLayout>
        <LoadingSpinner
          message="langleague.teacher.books.management.loading"
          isI18nKey
        />
      </TeacherLayout>
    );
  }

  if (errorMessage) {
    return (
      <TeacherLayout>
        <ErrorDisplay
          message={errorMessage}
          onRetry={() => dispatch(fetchBooks())}
        />
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="book-management">
        <div className="page-header">
          <h2>
            <Translate contentKey="langleague.teacher.books.management.title">Book Management</Translate>
          </h2>
          <p>
            <Translate contentKey="langleague.teacher.books.management.description">
              Manage your library inventory, track issued books, and update catalog details.
            </Translate>
          </p>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <span className="stat-label">
              <Translate contentKey="langleague.teacher.books.stats.total">Total Books</Translate>
            </span>
            <span className="stat-value">{stats.totalBooks}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">
              <Translate contentKey="langleague.teacher.books.stats.available">Available</Translate>
            </span>
            <span className="stat-value">{stats.availableBooks}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">
              <Translate contentKey="langleague.teacher.books.stats.uploaded">Uploaded</Translate>
            </span>
            <span className="stat-value">{stats.uploadedBooks}</span>
          </div>
        </div>

        <div className="actions-bar">
          <div className="search-box">
            <input
              type="text"
              placeholder={translate('langleague.teacher.books.search.placeholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-filter">
            <Translate contentKey="langleague.teacher.books.actions.filter">Filter</Translate>
          </button>
          <Link to="/teacher/books/new" className="btn-primary">
            <Translate contentKey="langleague.teacher.books.actions.addNew">+ Add New Book</Translate>
          </Link>
        </div>

        <DataTable
          data={filteredBooks}
          columns={columns}
          keyExtractor={book => book.id}
          emptyMessage={translate('langleague.teacher.books.management.noBooks')}
        />

        <div className="pagination">
          <button disabled>
            <Translate contentKey="langleague.teacher.books.pagination.previous">Previous</Translate>
          </button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>...</button>
          <button>21</button>
          <button>
            <Translate contentKey="langleague.teacher.books.pagination.next">Next</Translate>
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="langleague.teacher.books.actions.confirmDeleteTitle"
        message="langleague.teacher.books.actions.confirmDelete"
        confirmText="langleague.common.delete"
        cancelText="langleague.common.cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isI18nKey
        variant="danger"
      />
    </TeacherLayout>
  );
};

export default BookManagement;
