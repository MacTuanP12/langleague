import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { translate, Translate, TextFormat } from 'react-jhipster';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, CardBody, Button, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/book/book.reducer';
import { fetchUnitsByBookId, deleteUnit, reorderUnits } from 'app/shared/reducers/unit.reducer';
import { APP_DATE_FORMAT } from 'app/config/constants';
import TeacherLayout from 'app/modules/teacher/teacher-layout';
import { LoadingSpinner, ConfirmModal } from 'app/shared/components';
import '../teacher.scss';
import './book-detail.scss';

export const BookDetail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const book = useAppSelector(state => state.book.entity);
  const units = useAppSelector(state => state.unit.units);
  const bookLoading = useAppSelector(state => state.book.loading);

  const [draggedUnitIndex, setDraggedUnitIndex] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<number | null>(null);
  // Local state for optimistic UI updates during drag and drop
  const [localUnits, setLocalUnits] = useState(units);

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
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
    <TeacherLayout title={book.title} subtitle={book.description} showBackButton={false}>
      <Container fluid className="teacher-page-container">
        {/* Page Header */}
        <div className="teacher-header mb-4">
          <div className="header-content">
            <Button color="link" className="p-0 mb-3 text-decoration-none" onClick={() => navigate('/teacher/books')}>
              <FontAwesomeIcon icon="arrow-left" className="me-2" />
              <Translate contentKey="langleague.teacher.books.detail.backToBooks">Back to Books</Translate>
            </Button>
          </div>
          <div className="header-actions">
            <Button tag={Link} to={`/teacher/books/${id}/edit`} color="secondary" outline className="me-2">
              <FontAwesomeIcon icon="pencil-alt" className="me-2" />
              <Translate contentKey="langleague.teacher.books.detail.editBook">Edit Book</Translate>
            </Button>
            <Button tag={Link} to={`/teacher/units/${id}/new`} color="primary">
              <FontAwesomeIcon icon="plus-circle" className="me-2" />
              <Translate contentKey="langleague.teacher.books.detail.addUnit">Add Unit</Translate>
            </Button>
          </div>
        </div>

        {/* Book Info Card */}
        <Row className="mb-4">
          <Col md="12">
            <Card className="stat-card">
              <CardBody>
                <Row>
                  <Col md="3" className="text-center">
                    <img
                      src={book.coverImageUrl || 'https://placehold.co/400x600?text=No+Cover'}
                      alt={book.title}
                      className="img-fluid rounded"
                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                  </Col>
                  <Col md="9">
                    <Row>
                      <Col md="4">
                        <div className="stat-item mb-3">
                          <small className="text-muted">
                            <Translate contentKey="langleague.teacher.books.detail.meta.totalUnits">Total Units:</Translate>
                          </small>
                          <h4>{localUnits.length}</h4>
                        </div>
                      </Col>
                      <Col md="4">
                        <div className="stat-item mb-3">
                          <small className="text-muted">
                            <Translate contentKey="langleague.teacher.books.detail.meta.created">Created:</Translate>
                          </small>
                          <h6>{book.createdAt ? <TextFormat value={book.createdAt} type="date" format={APP_DATE_FORMAT} /> : 'N/A'}</h6>
                        </div>
                      </Col>
                      <Col md="4">
                        <div className="stat-item mb-3">
                          <small className="text-muted">
                            <Translate contentKey="langleague.teacher.books.detail.meta.public">Public:</Translate>
                          </small>
                          <h6>
                            <Badge color={book.isPublic ? 'success' : 'secondary'}>
                              {book.isPublic ? (
                                <Translate contentKey="langleague.teacher.books.detail.meta.yes">Yes</Translate>
                              ) : (
                                <Translate contentKey="langleague.teacher.books.detail.meta.no">No</Translate>
                              )}
                            </Badge>
                          </h6>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Units Section */}
        <Card className="content-section">
          <CardBody>
            <div className="section-header">
              <h2>
                <FontAwesomeIcon icon="list-ol" className="me-2" />
                <Translate contentKey="langleague.teacher.books.detail.units.title">Units</Translate>
              </h2>
              <p className="text-muted mb-0">
                <FontAwesomeIcon icon="grip-vertical" className="me-2" />
                <Translate contentKey="langleague.teacher.books.detail.units.hint">Drag and drop to reorder units</Translate>
              </p>
            </div>

            {localUnits.length === 0 ? (
              <div className="text-center py-5">
                <FontAwesomeIcon icon="inbox" size="3x" className="text-muted mb-3" />
                <h3 className="text-muted">
                  <Translate contentKey="langleague.teacher.books.detail.units.empty.title">No units yet</Translate>
                </h3>
                <p className="text-muted mb-4">
                  <Translate contentKey="langleague.teacher.books.detail.units.empty.description">
                    Start by adding your first unit to this book
                  </Translate>
                </p>
                <Button tag={Link} to={`/teacher/units/${id}/new`} color="primary">
                  <FontAwesomeIcon icon="plus-circle" className="me-2" />
                  <Translate contentKey="langleague.teacher.books.detail.units.empty.addFirst">Add First Unit</Translate>
                </Button>
              </div>
            ) : (
              <div className="units-list mt-4">
                {localUnits.map((unit, index) => (
                  <Card
                    key={unit.id}
                    className={`mb-3 unit-card ${draggedUnitIndex === index ? 'dragging' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={e => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: draggedUnitIndex === index ? 'grabbing' : 'grab',
                    }}
                  >
                    <CardBody>
                      <Row className="align-items-center">
                        <Col xs="auto">
                          <div className="drag-handle" style={{ cursor: 'grab' }}>
                            <FontAwesomeIcon icon="grip-vertical" size="lg" className="text-muted" />
                          </div>
                        </Col>
                        <Col xs="auto">
                          <Badge color="primary" pill className="px-3 py-2">
                            {index + 1}
                          </Badge>
                        </Col>
                        <Col>
                          <h5 className="mb-1">{unit.title}</h5>
                          <p className="text-muted mb-2">{unit.summary}</p>
                          <div className="d-flex gap-3">
                            <small className="text-muted">
                              <FontAwesomeIcon icon="book" className="me-1" />
                              <Translate contentKey="langleague.teacher.books.detail.units.stats.vocabulary">Vocabulary:</Translate>{' '}
                              <strong>{unit.vocabularyCount || 0}</strong>
                            </small>
                            <small className="text-muted">
                              <FontAwesomeIcon icon="book-open" className="me-1" />
                              <Translate contentKey="langleague.teacher.books.detail.units.stats.grammar">Grammar:</Translate>{' '}
                              <strong>{unit.grammarCount || 0}</strong>
                            </small>
                            <small className="text-muted">
                              <FontAwesomeIcon icon="question-circle" className="me-1" />
                              <Translate contentKey="langleague.teacher.books.detail.units.stats.exercises">Exercises:</Translate>{' '}
                              <strong>{unit.exerciseCount || 0}</strong>
                            </small>
                          </div>
                        </Col>
                        <Col xs="auto">
                          <div className="d-flex gap-2">
                            <Button
                              tag={Link}
                              to={`/teacher/units/${unit.id}/content`}
                              color="primary"
                              size="sm"
                              title={translate('langleague.teacher.books.detail.units.actions.manageContent')}
                            >
                              <FontAwesomeIcon icon="folder-open" className="me-1" />
                              <Translate contentKey="langleague.teacher.books.detail.units.actions.manageContent">Manage Content</Translate>
                            </Button>
                            <Button
                              tag={Link}
                              to={`/teacher/units/${unit.id}/edit`}
                              color="secondary"
                              size="sm"
                              outline
                              title={translate('langleague.teacher.books.detail.units.actions.edit')}
                            >
                              <FontAwesomeIcon icon="pencil-alt" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteUnitClick(unit.id)}
                              color="danger"
                              size="sm"
                              outline
                              title={translate('langleague.teacher.books.detail.units.actions.delete')}
                            >
                              <FontAwesomeIcon icon="trash" />
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </Container>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="langleague.teacher.books.unit.confirmDeleteTitle"
        message="langleague.teacher.books.unit.confirmDelete"
        confirmText="langleague.teacher.common.delete"
        cancelText="langleague.teacher.common.cancel"
        onConfirm={handleDeleteUnitConfirm}
        onCancel={handleDeleteUnitCancel}
        isI18nKey
        variant="danger"
      />
    </TeacherLayout>
  );
};

export default BookDetail;
