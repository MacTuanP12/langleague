import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardBody, Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEnrolledBooks } from 'app/entities/book/book.reducer';
import { fetchUnitsByBookId } from 'app/shared/reducers/unit.reducer';
import { LoadingSpinner, ErrorDisplay } from 'app/shared/components';
import { Translate } from 'react-jhipster';
import { IUnit } from 'app/shared/model/unit.model';
import { DataSourceSelector } from 'app/modules/student/games/components/DataSourceSelector';
import '../student.scss';
import './flashcard-list.scss';

export const FlashcardList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const bookList = useAppSelector(state => state.book.entities);
  const loading = useAppSelector(state => state.book.loading);
  const errorMessage = useAppSelector(state => state.book.errorMessage);

  const [expandedBooks, setExpandedBooks] = useState<{ [key: number]: boolean }>({});
  const [bookUnits, setBookUnits] = useState<{ [key: number]: IUnit[] }>({});
  const [loadingUnits, setLoadingUnits] = useState<{ [key: number]: boolean }>({});
  const [showDataSourceSelector, setShowDataSourceSelector] = useState(false);

  useEffect(() => {
    dispatch(getEnrolledBooks({}));
  }, [dispatch]);

  const toggleBookExpand = async (bookId: number) => {
    const isExpanded = !expandedBooks[bookId];
    setExpandedBooks(prev => ({
      ...prev,
      [bookId]: isExpanded,
    }));

    if (isExpanded && !bookUnits[bookId]) {
      setLoadingUnits(prev => ({ ...prev, [bookId]: true }));
      try {
        const result = await dispatch(fetchUnitsByBookId(bookId)).unwrap();
        setBookUnits(prev => ({ ...prev, [bookId]: result }));
      } catch (error) {
        console.error('Failed to load units', error);
      } finally {
        setLoadingUnits(prev => ({ ...prev, [bookId]: false }));
      }
    }
  };

  const handleUnitClick = (unitId: number) => {
    navigate(`/student/learn/unit/${unitId}/flashcard`);
  };

  const handleStartCustomSession = (unitIds: number[]) => {
    // Navigate to Flashcard page with multiple unit IDs
    // We use the same route but pass query params
    // Since the route is defined as /student/learn/unit/:unitId/flashcard, we might need a dummy ID or a new route
    // Let's use a special ID 'review' and pass real IDs in query
    const idsParam = unitIds.join(',');
    navigate(`/student/learn/unit/review/flashcard?unitIds=${idsParam}`);
  };

  if (loading) {
    return (
      <Container fluid className="student-page-container">
        <LoadingSpinner message="Loading flashcard sets..." />
      </Container>
    );
  }

  if (errorMessage) {
    return (
      <Container fluid className="student-page-container">
        <ErrorDisplay message={errorMessage} onRetry={() => dispatch(getEnrolledBooks({}))} />
      </Container>
    );
  }

  return (
    <div className="page-flashcard-list-wrapper">
      <Container fluid className="student-page-container">
        <div className="student-header mb-4">
          <div className="header-content">
            <h1>
              <FontAwesomeIcon icon="layer-group" className="me-2" />
              <Translate contentKey="langleague.student.learning.flashcardList.title">Flashcards</Translate>
            </h1>
            <p className="text-muted">
              <Translate contentKey="langleague.student.learning.flashcardList.description">Select a unit to study flashcards</Translate>
            </p>
          </div>
          <div className="header-actions">
            <Button color="primary" onClick={() => setShowDataSourceSelector(true)}>
              <FontAwesomeIcon icon="sliders-h" className="me-2" />
              <Translate contentKey="langleague.student.learning.flashcardList.customSession">Custom Session</Translate>
            </Button>
          </div>
        </div>

        {!bookList || bookList.length === 0 ? (
          <div className="empty-state-student">
            <div className="empty-icon">
              <FontAwesomeIcon icon="book" />
            </div>
            <h3>
              <Translate contentKey="langleague.student.learning.flashcardList.noSets">No books available</Translate>
            </h3>
            <p>
              <Translate contentKey="langleague.student.learning.flashcardList.enrollDescription">
                Enroll in books to start studying with flashcards
              </Translate>
            </p>
          </div>
        ) : (
          <Row>
            {bookList.map(book => (
              <Col key={book.id} lg="12" className="mb-4">
                <Card className="learning-card">
                  <CardBody>
                    <div
                      className="d-flex justify-content-between align-items-start mb-3"
                      onClick={() => toggleBookExpand(book.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <h4 className="mb-0">{book.title}</h4>
                        </div>
                        {book.description && <p className="text-muted mb-0 small">{book.description}</p>}
                      </div>
                      <button className="btn btn-link p-0">
                        <FontAwesomeIcon icon={expandedBooks[book.id] ? 'chevron-up' : 'chevron-down'} size="lg" />
                      </button>
                    </div>

                    {expandedBooks[book.id] && (
                      <>
                        {loadingUnits[book.id] ? (
                          <div className="text-center py-3">Loading units...</div>
                        ) : bookUnits[book.id] && bookUnits[book.id].length > 0 ? (
                          <Row className="mt-3">
                            {bookUnits[book.id].map(unit => (
                              <Col key={unit.id} md="6" lg="4" className="mb-3">
                                <Card
                                  className="h-100 unit-card-clickable"
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleUnitClick(unit.id);
                                  }}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <CardBody>
                                    <div className="d-flex align-items-start gap-3">
                                      <div className="unit-icon">
                                        <FontAwesomeIcon icon="layer-group" />
                                      </div>
                                      <div className="flex-grow-1">
                                        <h6 className="fw-bold mb-1">{unit.title}</h6>
                                        {unit.summary && <p className="text-muted mb-2 small">{unit.summary}</p>}
                                        <div className="d-flex align-items-center gap-2 text-muted small">
                                          <FontAwesomeIcon icon="book-open" />
                                          <span>
                                            <Translate contentKey="langleague.student.learning.flashcardList.studyFlashcards">
                                              Study Flashcards
                                            </Translate>
                                          </span>
                                        </div>
                                      </div>
                                      <FontAwesomeIcon icon="chevron-right" className="text-muted" />
                                    </div>
                                  </CardBody>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        ) : (
                          <div className="text-center text-muted py-3">
                            <FontAwesomeIcon icon="folder-open" size="2x" className="mb-2" />
                            <p className="mb-0">
                              <Translate contentKey="langleague.student.learning.flashcardList.noUnits">
                                No units available in this book
                              </Translate>
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <DataSourceSelector
          isOpen={showDataSourceSelector}
          toggle={() => setShowDataSourceSelector(!showDataSourceSelector)}
          onStartGame={handleStartCustomSession}
        />
      </Container>
    </div>
  );
};

export default FlashcardList;
