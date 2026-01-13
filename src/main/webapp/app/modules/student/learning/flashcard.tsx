import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchUnitById } from 'app/shared/reducers/unit.reducer';
import { fetchVocabulariesByUnitId } from 'app/shared/reducers/vocabulary.reducer';
import { LoadingSpinner, ErrorDisplay } from 'app/shared/components';
import { Translate } from 'react-jhipster';
import './flashcard.module.scss';
import FloatingNoteWidget from './floating-note-widget';

export const Flashcard = () => {
  const dispatch = useAppDispatch();
  const { selectedUnit } = useAppSelector(state => state.unit);
  const { vocabularies: initialVocabularies, loading, errorMessage } = useAppSelector(state => state.vocabulary);
  const [vocabularies, setVocabularies] = useState(initialVocabularies);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [showNotes, setShowNotes] = useState(false); // State để bật tắt Notes
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (unitId) {
      dispatch(fetchUnitById(unitId));
      dispatch(fetchVocabulariesByUnitId(unitId));
    }
  }, [dispatch, unitId]);

  useEffect(() => {
    setVocabularies(initialVocabularies);
  }, [initialVocabularies]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % vocabularies.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + vocabularies.length) % vocabularies.length);
  };

  const handleShuffle = () => {
    const shuffled = [...vocabularies].sort(() => Math.random() - 0.5);
    setVocabularies(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (loading) {
    return <LoadingSpinner message="Loading flashcards..." />;
  }

  if (errorMessage) {
    return (
      <ErrorDisplay
        message={errorMessage}
        onRetry={() => {
          if (unitId) {
            dispatch(fetchUnitById(unitId));
            dispatch(fetchVocabulariesByUnitId(unitId));
          }
        }}
      />
    );
  }

  if (!vocabularies || vocabularies.length === 0) {
    return (
      <div className="flashcard-container">
        <div className="flashcard-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <i className="bi bi-arrow-left"></i> Back
          </button>
          <h2>{selectedUnit?.title || 'Flashcards'}</h2>
        </div>
        <div className="empty-state">
          <i className="bi bi-card-text"></i>
          <p>No flashcards available</p>
        </div>
      </div>
    );
  }

  const currentVocab = vocabularies[currentIndex];

  return (
    <div className="flashcard-container">
      <div className="flashcard-header">
        <div className="header-left">
          <button onClick={() => navigate(-1)} className="back-btn">
            <i className="bi bi-arrow-left"></i>
          </button>
          <div className="breadcrumb">
            <span>Learning</span>
            <i className="bi bi-chevron-right"></i>
            <span>
              <Translate contentKey="langleague.student.learning.flashcard.title">Flashcards</Translate>
            </span>
            {selectedUnit && (
              <>
                <i className="bi bi-chevron-right"></i>
                <span className="current">{selectedUnit.title}</span>
              </>
            )}
          </div>
        </div>
        <div className="header-actions">
          <button onClick={handleShuffle} className="shuffle-btn">
            <i className="bi bi-shuffle"></i> Shuffle
          </button>
          <button onClick={() => setIsStudyMode(!isStudyMode)} className={`mode-btn ${isStudyMode ? 'active' : ''}`}>
            <i className="bi bi-star"></i> Study Mode
          </button>
          {/* Nút mở Notes */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`mode-btn ${showNotes ? 'active' : ''}`}
            style={{ marginLeft: '10px' }}
          >
            <i className="bi bi-journal-text"></i> Notes
          </button>
        </div>
      </div>

      <div className="flashcard-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentIndex + 1) / vocabularies.length) * 100}%` }} />
        </div>
        <span className="progress-text">
          <Translate contentKey="langleague.student.learning.flashcard.card">Card</Translate> {currentIndex + 1}{' '}
          <Translate contentKey="langleague.student.learning.flashcard.of">of</Translate> {vocabularies.length}
        </span>
      </div>

      <div className="flashcard-main">
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <div className="card-label">DEFINITION</div>
              <div className="card-content">
                <h2 className="main-text">{currentVocab.meaning}</h2>
                {currentVocab.example && (
                  <p className="example-text">
                    <i className="bi bi-quote"></i>
                    {currentVocab.example}
                  </p>
                )}
              </div>
              <div className="flip-hint">
                <span>Click to Flip</span>
              </div>
            </div>

            <div className="flashcard-back">
              <div className="card-label">ANSWER</div>
              <div className="card-content">
                <h2 className="main-text">{currentVocab.word}</h2>
                {currentVocab.phonetic && <p className="pronunciation">/{currentVocab.phonetic}/</p>}
                {currentVocab.imageUrl && (
                  <div className="card-image">
                    <img src={currentVocab.imageUrl} alt={currentVocab.word} />
                  </div>
                )}
              </div>
              <div className="flip-hint">
                <span>Click to Flip</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flashcard-controls">
          <button onClick={handlePrevious} className="control-btn nav-btn" disabled={vocabularies.length <= 1}>
            <i className="bi bi-chevron-left"></i>
          </button>

          <button className="control-btn play-btn">
            <i className="bi bi-play-fill"></i>
          </button>

          <button onClick={handleNext} className="control-btn nav-btn" disabled={vocabularies.length <= 1}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Terminology Section */}
      <div className="terminology-section">
        <div className="terminology-header">
          <i className="bi bi-book"></i>
          <h3>Terminology in this section</h3>
        </div>
        <div className="terminology-list">
          {vocabularies.map((vocab, index) => (
            <div
              key={vocab.id}
              className={`terminology-item ${index === currentIndex ? 'active' : ''}`}
              onClick={() => {
                setCurrentIndex(index);
                setIsFlipped(false);
              }}
            >
              <div className="term-header">
                <span className="term-word">{vocab.word}</span>
              </div>
              <div className="term-meaning">{vocab.meaning}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget Notes Draggable */}
      {unitId && <FloatingNoteWidget unitId={parseInt(unitId, 10)} isOpen={showNotes} onClose={() => setShowNotes(false)} />}
    </div>
  );
};

export default Flashcard;
