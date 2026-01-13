import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchMyBooks, deleteBook } from 'app/shared/reducers/book.reducer';
import TeacherLayout from 'app/modules/teacher/teacher-layout';
import { DataTable, Column } from 'app/shared/components/data-table';
import { LoadingSpinner, ConfirmModal } from 'app/shared/components';
import { IBook } from 'app/shared/model/book.model';
import './book-management.scss';

export const BookManagement = () => {
  const dispatch = useAppDispatch();
  const { books, loading } = useAppSelector(state => state.book);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchMyBooks());
  }, [dispatch]);

  const handleDeleteClick = (id: number) => {
    setBookToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (bookToDelete) {
      try {
        await dispatch(deleteBook(bookToDelete)).unwrap();
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
  // Add safe fallback to handle undefined books
  const filteredBooks = useMemo(
    () => (books || []).filter(book => book.title?.toLowerCase().includes(searchTerm.toLowerCase())),
    [books, searchTerm],
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
            <span className={`book-status ${book.isPublic ? 'public' : 'private'}`}>{book.isPublic ? 'Public' : 'Private'}</span>
          </div>
        ),
      },
      {
        key: 'actions',
        header: translate('langleague.teacher.books.table.actions'),
        width: '200px',
        render: book => (
          <div className="action-buttons">
            <Link to={`/teacher/books/${book.id}`} className="btn-manage" title="Manage Content">
              Manage Content
            </Link>
            <Link to={`/teacher/books/${book.id}/edit`} className="btn-icon" title={translate('langleague.teacher.books.actions.edit')}>
              <i className="fa fa-edit"></i>
            </Link>
            <button
              onClick={() => handleDeleteClick(book.id)}
              className="btn-icon"
              title={translate('langleague.teacher.books.actions.delete')}
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  if (loading) {
    return (
      <TeacherLayout>
        <LoadingSpinner message="langleague.teacher.books.management.loading" isI18nKey />
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout
      title={<Translate contentKey="langleague.teacher.books.management.title">Book Management</Translate>}
      subtitle={<Translate contentKey="langleague.teacher.books.management.description">Manage your library inventory</Translate>}
      showBackButton={false}
    >
      <div className="book-management">
        <div className="actions-bar">
          <div className="search-box">
            <input
              type="text"
              placeholder={translate('langleague.teacher.books.search.placeholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
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
