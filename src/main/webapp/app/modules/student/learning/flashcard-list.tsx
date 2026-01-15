import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardBody, Row, Col, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchEnrolledBooks } from 'app/shared/reducers/book.reducer';
import { LoadingSpinner, ErrorDisplay } from 'app/shared/components';
import { Translate } from 'react-jhipster';
import '../student.scss';
import './flashcard-list.scss';

export const FlashcardList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { books, loading, errorMessage } = useAppSelector(state => state.book);
  const [expandedBooks, setExpandedBooks] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    dispatch(fetchEnrolledBooks());
  }, [dispatch]);

  const toggleBookExpand = (bookId: number) => {
    setExpandedBooks(prev => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  const handleUnitClick = (unitId: number) => {
    navigate(`/student/flashcards/unit/${unitId}`);
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
        <ErrorDisplay message={errorMessage} onRetry={() => dispatch(fetchEnrolledBooks())} />
      </Container>
    );
  }

  if (!books || books.length === 0) {
    return (
      <Container fluid className="student-page-container">
        <div className="student-header mb-4">
          <h1>
            <FontAwesomeIcon icon="layer-group" className="me-2" />
            <Translate contentKey="langleague.student.learning.flashcardList.title">Flashcards</Translate>
          </h1>
        </div>
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
      </Container>
    );
  }

  return (
    <Container fluid className="student-page-container">
      <div className="student-header mb-4">
        <h1>
          <FontAwesomeIcon icon="layer-group" className="me-2" />
          <Translate contentKey="langleague.student.learning.flashcardList.title">Flashcards</Translate>
        </h1>
        <p className="text-muted">
          <Translate contentKey="langleague.student.learning.flashcardList.description">Select a unit to study flashcards</Translate>
        </p>
      </div>

      <Row>
        {books.map(book => (
          <Col key={book.id} lg="12" className="mb-4">
            <Card className="learning-card">
              <CardBody>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <h4 className="mb-0">{book.title}</h4>
                      <Badge color="primary">{book.level}</Badge>
                    </div>
                    {book.description && <p className="text-muted mb-0 small">{book.description}</p>}
                  </div>
                  <button className="btn btn-link p-0" onClick={() => toggleBookExpand(book.id)}>
                    <FontAwesomeIcon icon={expandedBooks[book.id] ? 'chevron-up' : 'chevron-down'} size="lg" />
                  </button>
                </div>

                {expandedBooks[book.id] && book.units && book.units.length > 0 && (
                  <Row className="mt-3">
                    {book.units.map(unit => (
                      <Col key={unit.id} md="6" lg="4" className="mb-3">
                        <Card className="h-100 unit-card-clickable" onClick={() => handleUnitClick(unit.id)} style={{ cursor: 'pointer' }}>
                          <CardBody>
                            <div className="d-flex align-items-start gap-3">
                              <div className="unit-icon">
                                <FontAwesomeIcon icon="layer-group" />
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="fw-bold mb-1">{unit.title}</h6>
                                {unit.description && <p className="text-muted mb-2 small">{unit.description}</p>}
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
                )}

                {expandedBooks[book.id] && (!book.units || book.units.length === 0) && (
                  <div className="text-center text-muted py-3">
                    <FontAwesomeIcon icon="folder-open" size="2x" className="mb-2" />
                    <p className="mb-0">
                      <Translate contentKey="langleague.student.learning.flashcardList.noUnits">No units available in this book</Translate>
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FlashcardList;
