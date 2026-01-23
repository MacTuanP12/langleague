import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity as fetchBookById } from 'app/entities/book/book.reducer';
import { fetchUnitsByBookId } from 'app/shared/reducers/unit.reducer';
import { fetchVocabulariesByUnitId } from 'app/shared/reducers/vocabulary.reducer';
import { fetchGrammarsByUnitId } from 'app/shared/reducers/grammar.reducer';
import { fetchExercisesByUnitId } from 'app/shared/reducers/exercise.reducer';
import { fetchMyProgresses, markUnitComplete } from 'app/shared/reducers/progress.reducer';
import { IUnit } from 'app/shared/model/unit.model';
import { LessonSkeleton } from 'app/shared/components';
import FloatingNoteWidget from './floating-note-widget';
import { UnitVocabulary } from './unit-vocabulary';
import { UnitGrammar } from './unit-grammar';
import { UnitExercise } from './unit-exercise';
import './book-learn.scss';
// Removed redundant import: '../student.scss' to avoid style conflicts

export const BookLearn = () => {
  const { bookId, unitId } = useParams<{ bookId: string; unitId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux state
  const selectedBook = useAppSelector(state => state.book.entity);
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
    if (bookId) {
      const id = Number(bookId);
      dispatch(fetchBookById(id));
      dispatch(fetchUnitsByBookId(id));
      dispatch(fetchMyProgresses());
    }
  }, [bookId, dispatch]);

  // Handle unit selection from URL or default
  useEffect(() => {
    if (units && units.length > 0) {
      let unitToSelect: IUnit | undefined;
      if (unitId) {
        unitToSelect = units.find(u => u.id === Number(unitId));
      } else {
        // Default to first unit if no unitId in URL
        unitToSelect = units[0];
      }

      if (unitToSelect && unitToSelect.id !== selectedUnit?.id) {
        setSelectedUnit(unitToSelect);
        // Expand the selected unit
        setExpandedUnits(prev => new Set(prev).add(unitToSelect.id));

        // Load content
        dispatch(fetchVocabulariesByUnitId(unitToSelect.id));
        dispatch(fetchGrammarsByUnitId(unitToSelect.id));
        dispatch(fetchExercisesByUnitId(unitToSelect.id));
      }
    }
  }, [unitId, units, dispatch]);

  // Auto-scroll to top when selectedUnit changes (but track previous unit to avoid scrolling on same unit)
  const [previousUnitId, setPreviousUnitId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedUnit && selectedUnit.id !== previousUnitId) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setPreviousUnitId(selectedUnit.id);
    }
  }, [selectedUnit?.id, previousUnitId]);

  const toggleUnitExpansion = (uId: number) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(uId)) {
      newExpanded.delete(uId);
    } else {
      newExpanded.add(uId);
    }
    setExpandedUnits(newExpanded);
  };

  const handleUnitClick = (unit: IUnit) => {
    // Navigate to the unit URL
    navigate(`/student/learn/book/${bookId}/unit/${unit.id}`);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const scrollToSection = (sectionId: string) => {
    // Retry mechanism to handle async rendering
    const attemptScroll = (attempt = 0) => {
      const element = document.getElementById(sectionId);
      if (element) {
        // Use scrollIntoView with offset for better UX
        const yOffset = -100; // Offset to account for header
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

        window.scrollTo({
          top: y,
          behavior: 'smooth',
        });

        // Optional: Add visual feedback
        element.classList.add('highlight-section');
        setTimeout(() => {
          element.classList.remove('highlight-section');
        }, 2000);

        console.warn(`[book-learn] ✅ Scrolled to section: ${sectionId}`);
      } else {
        console.warn(`[book-learn] ⚠️ Section not found: ${sectionId}, attempt: ${attempt + 1}`);

        // Retry up to 3 times with delay (for async rendering)
        if (attempt < 3) {
          setTimeout(() => attemptScroll(attempt + 1), 100);
        } else {
          console.error(`[book-learn] ❌ Failed to find section after 3 attempts: ${sectionId}`);
        }
      }
    };

    attemptScroll();
  };

  const handleUnitComplete = () => {
    if (!selectedUnit) return;

    // Mark unit as complete
    dispatch(markUnitComplete(selectedUnit.id));

    // Find current unit index
    const currentIndex = units.findIndex(u => u.id === selectedUnit.id);

    if (currentIndex !== -1 && currentIndex < units.length - 1) {
      // Go to next unit
      const nextUnit = units[currentIndex + 1];
      toast.success(translate('langleague.student.learning.messages.unitCompleted'));
      navigate(`/student/learn/book/${bookId}/unit/${nextUnit.id}`);
    } else {
      // Last unit -> Book Detail
      toast.success(translate('langleague.student.learning.messages.bookCompleted'));
      navigate(`/student/learn/book/${bookId}`);
    }
  };

  // Loading state
  if (bookLoading || (unitsLoading && units.length === 0)) {
    return (
      <Container fluid className="student-page-container">
        <div className="student-header mb-4">
          <Button tag={Link} to={`/student/learn/book/${bookId}`} color="link" className="p-0">
            <FontAwesomeIcon icon="arrow-left" className="me-2" />
            <Translate contentKey="langleague.student.learning.backToBook">Back to Book</Translate>
          </Button>
        </div>
        <LessonSkeleton />
      </Container>
    );
  }

  if (!selectedBook || !selectedBook.id) {
    return null;
  }

  return (
    <div className="page-book-learn-wrapper">
      <div className="book-learn-container">
        {/* Header */}
        <div className="book-learn-header">
          <Link to={`/student/learn/book/${bookId}`} className="back-link">
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
                        <span>
                          <Translate contentKey="langleague.student.learning.sections.vocabulary">Vocabulary</Translate>
                        </span>
                      </div>
                      <div className="section-item grammar" onClick={() => scrollToSection('grammar-section')}>
                        <FontAwesomeIcon icon="book-open" className="section-icon" />
                        <span>
                          <Translate contentKey="langleague.student.learning.sections.grammar">Grammar</Translate>
                        </span>
                      </div>
                      <div className="section-item exercise" onClick={() => scrollToSection('exercise-section')}>
                        <FontAwesomeIcon icon="pencil-square" className="section-icon" />
                        <span>
                          <Translate contentKey="langleague.student.learning.sections.exercise">Exercise</Translate>
                        </span>
                      </div>
                      <Link
                        to={`/student/learn/unit/${unit.id}/flashcard`}
                        className="section-item flashcard"
                        onClick={e => e.stopPropagation()}
                      >
                        <FontAwesomeIcon icon="clone" className="section-icon" />
                        <span>
                          <Translate contentKey="langleague.student.learning.sections.flashcard">Flashcard</Translate>
                        </span>
                      </Link>
                      <div className="section-item note" onClick={() => setShowNotes(true)}>
                        <FontAwesomeIcon icon="sticky-note" className="section-icon" />
                        <span>
                          <Translate contentKey="langleague.student.learning.sections.note">Note</Translate>
                        </span>
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
                        <Translate contentKey="langleague.student.learning.sections.vocabulary">Vocabulary</Translate>
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
                        <Translate contentKey="langleague.student.learning.sections.grammar">Grammar</Translate>
                      </h3>
                      <span className="count">{grammars.length}</span>
                    </div>
                    <UnitGrammar data={grammars} />
                  </div>
                )}

                {/* Exercise Section - Component Composition */}
                {exercises && exercises.length > 0 && (
                  <div id="exercise-section" className="content-section exercise-section">
                    <div className="section-title">
                      <h3>
                        <FontAwesomeIcon icon="pencil-square" className="me-2" />
                        <Translate contentKey="langleague.student.learning.sections.exercise">Exercises</Translate>
                      </h3>
                      <span className="count">{exercises.length}</span>
                    </div>
                    <UnitExercise data={exercises} onFinish={handleUnitComplete} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {selectedUnit && <FloatingNoteWidget unitId={selectedUnit.id} isOpen={showNotes} onClose={() => setShowNotes(false)} />}
      </div>
    </div>
  );
};

export default BookLearn;
