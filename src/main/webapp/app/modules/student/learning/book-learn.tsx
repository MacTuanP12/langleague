import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchBookById } from 'app/shared/reducers/book.reducer';
import { fetchUnitsByBookId } from 'app/shared/reducers/unit.reducer';
import { fetchVocabulariesByUnitId } from 'app/shared/reducers/vocabulary.reducer';
import { fetchGrammarsByUnitId } from 'app/shared/reducers/grammar.reducer';
import { fetchExercisesByUnitId } from 'app/shared/reducers/exercise.reducer';
import { fetchMyProgresses } from 'app/shared/reducers/progress.reducer';
import { IUnit } from 'app/shared/model/unit.model';
import { LessonSkeleton } from 'app/shared/components';
import FloatingNoteWidget from './floating-note-widget';
import { UnitVocabulary } from './unit-vocabulary';
import { UnitGrammar } from './unit-grammar';
import { UnitExercise } from './unit-exercise';
import './book-learn.scss';
import '../student.scss';

export const BookLearn = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // Redux state
  const selectedBook = useAppSelector(state => state.book.selectedBook);
  const bookLoading = useAppSelector(state => state.book.loading);
  const units = useAppSelector(state => state.unit.units);
  const unitsLoading = useAppSelector(state => state.unit.loading);
  const vocabularies = useAppSelector(state => state.vocabulary.vocabularies);
  const grammars = useAppSelector(state => state.grammar.grammars);
  const exercises = useAppSelector(state => state.exercise.exercises);

  // Local UI state
  const [expandedUnits, setExpandedUnits] = useState<Set<number>>(new Set());
  const [selectedUnit, setSelectedUnit] = useState<IUnit | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  // Fetch book and units on mount
  useEffect(() => {
    if (id) {
      const bookId = Number(id);
      dispatch(fetchBookById(bookId));
      dispatch(fetchUnitsByBookId(bookId));
      dispatch(fetchMyProgresses());
    }
  }, [id, dispatch]);

  // Auto-scroll to top when selectedUnit changes
  useEffect(() => {
    if (selectedUnit) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [selectedUnit?.id]);

  const toggleUnitExpansion = (unitId: number) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  const handleUnitClick = (unit: IUnit) => {
    setSelectedUnit(unit);
    // Load content for the selected unit
    dispatch(fetchVocabulariesByUnitId(unit.id));
    dispatch(fetchGrammarsByUnitId(unit.id));
    dispatch(fetchExercisesByUnitId(unit.id));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100; // Offset to account for header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Loading state
  if (bookLoading || (unitsLoading && units.length === 0)) {
    return (
      <Container fluid className="student-page-container">
        <div className="student-header mb-4">
          <Button tag={Link} to={`/student/books/${id}`} color="link" className="p-0">
            <FontAwesomeIcon icon="arrow-left" className="me-2" />
            <Translate contentKey="langleague.student.learning.backToBook">Back to Book</Translate>
          </Button>
        </div>
        <LessonSkeleton />
      </Container>
    );
  }

  if (!selectedBook) {
    return null;
  }

  return (
    <div className="book-learn-container">
      {/* Header */}
      <div className="book-learn-header">
        <Link to={`/student/books/${id}`} className="back-link">
          <FontAwesomeIcon icon="arrow-left" className="me-2" />
          <Translate contentKey="langleague.student.learning.backToBook">Back to Book</Translate>
        </Link>
        <h1>
          <FontAwesomeIcon icon="book-open" className="me-3" />
          {selectedBook.title}
        </h1>
      </div>

      {/* Main Content */}
      <div className="book-learn-body">
        {/* Sidebar */}
        <div className={`book-learn-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            {!sidebarCollapsed && (
              <h5>
                <FontAwesomeIcon icon="list" className="me-2" />
                <Translate contentKey="langleague.student.learning.bookContent">Book Content</Translate>
              </h5>
            )}
            <button className="collapse-btn" onClick={toggleSidebar} title={sidebarCollapsed ? 'Expand' : 'Collapse'}>
              <FontAwesomeIcon icon={sidebarCollapsed ? 'angles-right' : 'angles-left'} />
            </button>
          </div>

          <div className="units-list">
            {units.map((unit, index) => (
              <div key={unit.id} className="unit-item">
                <div
                  className={`unit-header ${selectedUnit?.id === unit.id ? 'active' : ''}`}
                  onClick={() => {
                    handleUnitClick(unit);
                    toggleUnitExpansion(unit.id);
                  }}
                >
                  <span className="unit-number">{index + 1}</span>
                  {!sidebarCollapsed && (
                    <>
                      <span className="unit-title">{unit.title}</span>
                      <FontAwesomeIcon icon={expandedUnits.has(unit.id) ? 'chevron-down' : 'chevron-right'} className="expand-icon" />
                    </>
                  )}
                </div>

                {expandedUnits.has(unit.id) && !sidebarCollapsed && selectedUnit?.id === unit.id && (
                  <div className="unit-sections">
                    <div className="section-item vocabulary" onClick={() => scrollToSection('vocabulary-section')}>
                      <FontAwesomeIcon icon="book" className="section-icon" />
                      <span>Vocabulary</span>
                    </div>
                    <div className="section-item grammar" onClick={() => scrollToSection('grammar-section')}>
                      <FontAwesomeIcon icon="book-open" className="section-icon" />
                      <span>Grammar</span>
                    </div>
                    <div className="section-item exercise" onClick={() => scrollToSection('exercise-section')}>
                      <FontAwesomeIcon icon="pencil-square" className="section-icon" />
                      <span>Exercise</span>
                    </div>
                    <Link
                      to={`/student/learn/unit/${unit.id}/flashcard`}
                      className="section-item flashcard"
                      onClick={e => e.stopPropagation()}
                    >
                      <FontAwesomeIcon icon="clone" className="section-icon" />
                      <span>Flashcard</span>
                    </Link>
                    <div className="section-item note" onClick={() => setShowNotes(true)}>
                      <FontAwesomeIcon icon="sticky-note" className="section-icon" />
                      <span>Note</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className={`book-learn-content ${sidebarCollapsed ? 'expanded' : ''}`}>
          {!selectedUnit ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>
                <Translate contentKey="langleague.student.learning.selectUnit">Select a unit to start learning</Translate>
              </h3>
              <p>Choose a unit from the sidebar to view its content</p>
            </div>
          ) : (
            <div className="unit-content-display">
              <div className="unit-content-header">
                <h2>{selectedUnit.title}</h2>
                {selectedUnit.summary && <p className="unit-summary">{selectedUnit.summary}</p>}
              </div>

              {/* Vocabulary Section - Component Composition */}
              {vocabularies && vocabularies.length > 0 && (
                <div id="vocabulary-section" className="content-section vocabulary-section">
                  <div className="section-title">
                    <h3>
                      <FontAwesomeIcon icon="book" className="me-2" />
                      Vocabulary
                    </h3>
                    <span className="count">{vocabularies.length}</span>
                  </div>
                  <UnitVocabulary data={vocabularies} />
                </div>
              )}

              {/* Grammar Section - Component Composition */}
              {grammars && grammars.length > 0 && (
                <div id="grammar-section" className="content-section grammar-section">
                  <div className="section-title">
                    <h3>
                      <FontAwesomeIcon icon="book-open" className="me-2" />
                      Grammar
                    </h3>
                    <span className="count">{grammars.length}</span>
                  </div>
                  <UnitGrammar data={grammars} />
                  <div className="section-actions">
                    <Link to={`/student/learn/unit/${selectedUnit.id}/flashcard-grammar`} className="action-link grammar-flashcard-link">
                      <FontAwesomeIcon icon="clone" className="me-2" />
                      <Translate contentKey="langleague.student.learning.grammar.practiceFlashcard">
                        Practice Grammar with Flashcards
                      </Translate>
                    </Link>
                  </div>
                </div>
              )}

              {/* Exercise Section - Component Composition */}
              {exercises && exercises.length > 0 && (
                <div id="exercise-section" className="content-section exercise-section">
                  <div className="section-title">
                    <h3>
                      <FontAwesomeIcon icon="pencil-square" className="me-2" />
                      Exercises
                    </h3>
                    <span className="count">{exercises.length}</span>
                  </div>
                  <UnitExercise data={exercises} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedUnit && <FloatingNoteWidget unitId={selectedUnit.id} isOpen={showNotes} onClose={() => setShowNotes(false)} />}
    </div>
  );
};

export default BookLearn;
