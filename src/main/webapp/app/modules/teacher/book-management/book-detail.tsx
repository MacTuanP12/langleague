import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { translate, Translate, TextFormat } from 'react-jhipster';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchBookById } from 'app/shared/reducers/book.reducer';
import { fetchUnitsByBookId, deleteUnit, reorderUnits } from 'app/shared/reducers/unit.reducer';
import { APP_DATE_FORMAT } from 'app/config/constants';
import TeacherLayout from 'app/modules/teacher/layout/teacher-layout';
import { LoadingSpinner, ConfirmModal } from 'app/shared/components';
import './book-detail.scss';

export const BookDetail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const book = useAppSelector(state => state.book.selectedBook);
  const units = useAppSelector(state => state.unit.units);
  const bookLoading = useAppSelector(state => state.book.loading);
  const unitsLoading = useAppSelector(state => state.unit.loading);

  const [draggedUnitIndex, setDraggedUnitIndex] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<number | null>(null);
  // Local state for optimistic UI updates during drag and drop
  const [localUnits, setLocalUnits] = useState(units);

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(Number(id)));
      dispatch(fetchUnitsByBookId(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    setLocalUnits(units);
  }, [units]);

  const handleDragStart = (index: number) => {
    setDraggedUnitIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedUnitIndex === null || draggedUnitIndex === index) return;

    const items = [...localUnits];
    const draggedItem = items[draggedUnitIndex];
    items.splice(draggedUnitIndex, 1);
    items.splice(index, 0, draggedItem);

    setLocalUnits(items);
    setDraggedUnitIndex(index);
  };

  const handleDragEnd = async () => {
    setDraggedUnitIndex(null);

    if (!id) return;

    // Update orderIndex for all units
    const updatedUnits = localUnits.map((unit, idx) => ({
      ...unit,
      orderIndex: idx + 1,
    }));

    setLocalUnits(updatedUnits);

    // Save the new order to backend
    try {
      await dispatch(
        reorderUnits({
          bookId: id,
          unitIds: updatedUnits.map(u => u.id),
        }),
      ).unwrap();
    } catch (error) {
      console.error('Error saving unit order:', error);
      // Revert to original order from Redux store on error
      setLocalUnits(units);
    }
  };

  const handleDeleteUnitClick = (unitId: number) => {
    setUnitToDelete(unitId);
    setDeleteModalOpen(true);
  };

  const handleDeleteUnitConfirm = async () => {
    if (unitToDelete) {
      try {
        await dispatch(deleteUnit(unitToDelete)).unwrap();
        toast.success(translate('langleague.teacher.books.unit.deleteSuccess'));
      } catch (error) {
        console.error('Error deleting unit:', error);
        toast.error(translate('langleague.teacher.books.unit.deleteFailed'));
      }
    }
    setDeleteModalOpen(false);
    setUnitToDelete(null);
  };

  const handleDeleteUnitCancel = () => {
    setDeleteModalOpen(false);
    setUnitToDelete(null);
  };

  if (bookLoading || !book) {
    return (
      <TeacherLayout>
        <LoadingSpinner message="langleague.teacher.books.detail.loading" isI18nKey />
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="teacher-book-detail">
        <div className="detail-header">
          <button onClick={() => navigate('/teacher/books')} className="back-btn">
            <i className="bi bi-arrow-left"></i> Back to Books
          </button>
          <div className="header-info">
            <h1>{book.title}</h1>
            <p>{book.description}</p>
          </div>
          <div className="header-actions">
            <Link to={`/teacher/books/${id}/edit`} className="btn-secondary">
              <i className="bi bi-pencil"></i> Edit Book
            </Link>
            <Link to={`/teacher/units/${id}/new`} className="btn-primary">
              <i className="bi bi-plus-circle"></i> Add Unit
            </Link>
          </div>
        </div>

        <div className="book-info-card">
          <img src={book.coverImageUrl || '/content/images/default-book.png'} alt={book.title} className="book-cover" />
          <div className="book-meta">
            <div className="meta-item">
              <span className="label">Total Units:</span>
              <span className="value">{localUnits.length}</span>
            </div>
            <div className="meta-item">
              <span className="label">Created:</span>
              <span className="value">
                {book.createdAt ? <TextFormat value={book.createdAt.toDate()} type="date" format={APP_DATE_FORMAT} /> : 'N/A'}
              </span>
            </div>
            <div className="meta-item">
              <span className="label">Public:</span>
              <span className="value">{book.isPublic ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        <div className="units-section">
          <div className="section-header">
            <h2>
              <i className="bi bi-list-ol"></i> Units
            </h2>
            <p className="hint">
              <i className="bi bi-grip-vertical"></i> Drag and drop to reorder units
            </p>
          </div>

          <div className="units-list">
            {localUnits.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-inbox"></i>
                <h3>No units yet</h3>
                <p>Start by adding your first unit to this book</p>
                <Link to={`/teacher/units/${id}/new`} className="btn-primary">
                  <i className="bi bi-plus-circle"></i> Add First Unit
                </Link>
              </div>
            ) : (
              localUnits.map((unit, index) => (
                <div
                  key={unit.id}
                  className={`unit-card ${draggedUnitIndex === index ? 'dragging' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={e => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="drag-handle">
                    <i className="bi bi-grip-vertical"></i>
                  </div>
                  <div className="unit-number">{index + 1}</div>
                  <div className="unit-content">
                    <h3>{unit.title}</h3>
                    <p>{unit.summary}</p>
                    <div className="unit-stats">
                      <span>
                        <i className="bi bi-book"></i>{' '}
                        <Translate contentKey="langleague.teacher.books.detail.units.stats.vocabulary">Vocabulary:</Translate>{' '}
                        {unit.vocabularies?.length || 0}
                      </span>
                      <span>
                        <i className="bi bi-journal-text"></i>{' '}
                        <Translate contentKey="langleague.teacher.books.detail.units.stats.grammar">Grammar:</Translate>{' '}
                        {unit.grammars?.length || 0}
                      </span>
                      <span>
                        <i className="bi bi-question-circle"></i>{' '}
                        <Translate contentKey="langleague.teacher.books.detail.units.stats.exercises">Exercises:</Translate>{' '}
                        {unit.exercises?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="unit-actions">
                    <Link to={`/teacher/units/${unit.id}/content`} className="btn-icon" title="Manage Content">
                      <i className="bi bi-folder2-open"></i>
                    </Link>
                    <Link
                      to={`/teacher/units/${unit.id}/edit`}
                      className="btn-icon"
                      title={translate('langleague.teacher.books.detail.units.actions.edit')}
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <button
                      onClick={() => handleDeleteUnitClick(unit.id)}
                      className="btn-icon btn-danger"
                      title={translate('langleague.teacher.books.detail.units.actions.delete')}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="langleague.teacher.books.unit.confirmDeleteTitle"
        message="langleague.teacher.books.unit.confirmDelete"
        confirmText="langleague.common.delete"
        cancelText="langleague.common.cancel"
        onConfirm={handleDeleteUnitConfirm}
        onCancel={handleDeleteUnitCancel}
        isI18nKey
        variant="danger"
      />
    </TeacherLayout>
  );
};

export default BookDetail;
