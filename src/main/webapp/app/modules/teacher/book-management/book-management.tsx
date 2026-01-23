import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getMyBooks, deleteEntity } from 'app/entities/book/book.reducer';
import TeacherLayout from 'app/modules/teacher/teacher-layout';
import { DataTable, Column } from 'app/shared/components/data-table';
import { LoadingSpinner, ConfirmModal } from 'app/shared/components';
import { IBook } from 'app/shared/model/book.model';
import { Container, Button, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './book-management.scss';
import '../teacher.scss';

export const BookManagement = () => {
  const dispatch = useAppDispatch();
  const { entities, loading } = useAppSelector(state => state.book);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getMyBooks({}));
  }, [dispatch]);

  const handleDeleteClick = (id: number) => {
    setBookToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (bookToDelete) {
      try {
        await dispatch(deleteEntity(bookToDelete)).unwrap();
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
    () => (entities || []).filter(book => book.title?.toLowerCase().includes(searchTerm.toLowerCase())),
    [entities, searchTerm],
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
            <span className={`book-status ${book.isPublic ? 'public' : 'private'}`}>
              {book.isPublic ? (
                <Translate contentKey="langleague.teacher.books.form.fields.publicStatus">Public</Translate>
              ) : (
                <Translate contentKey="langleague.teacher.books.form.fields.privateStatus">Private</Translate>
              )}
            </span>
          </div>
        ),
      },
      {
        key: 'actions',
        header: translate('langleague.teacher.books.table.actions'),
        width: '250px',
        render: book => (
          <div className="action-buttons">
            <Button
              tag={Link}
              to={`/teacher/books/${book.id}`}
              color="primary"
              size="sm"
              className="me-2"
              title={translate('langleague.teacher.dashboard.quickActions.manageContent')}
            >
              <FontAwesomeIcon icon="list" className="me-1" />
              <Translate contentKey="langleague.teacher.dashboard.quickActions.manageContent">Manage Content</Translate>
            </Button>
            <Button
              tag={Link}
              to={`/teacher/books/${book.id}/edit`}
              color="secondary"
              size="sm"
              className="btn-icon me-1"
              title={translate('langleague.teacher.books.actions.edit')}
            >
              <FontAwesomeIcon icon="pencil-alt" />
            </Button>
            <Button
              onClick={() => handleDeleteClick(book.id)}
              color="danger"
              size="sm"
              className="btn-icon"
              title={translate('langleague.teacher.books.actions.delete')}
            >
              <FontAwesomeIcon icon="trash" />
            </Button>
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
      <Container fluid className="teacher-page-container">
        <div className="search-filter-bar">
          <div className="search-box">
            <Input
              type="text"
              placeholder={translate('langleague.teacher.books.search.placeholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button tag={Link} to="/teacher/books/new" color="primary" className="action-btn btn-primary">
            <FontAwesomeIcon icon="plus" className="me-2" />
            <Translate contentKey="langleague.teacher.books.actions.addNew"> Add New Book</Translate>
          </Button>
        </div>

        <div className="table-responsive">
          <DataTable
            data={filteredBooks}
            columns={columns}
            keyExtractor={book => book.id}
            emptyMessage={translate('langleague.teacher.books.management.noBooks')}
            className="table table-striped table-hover teacher-table"
          />
        </div>
      </Container>

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
