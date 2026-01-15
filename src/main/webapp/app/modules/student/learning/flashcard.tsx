import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchUnitById } from 'app/shared/reducers/unit.reducer';
import { fetchVocabulariesByUnitId } from 'app/shared/reducers/vocabulary.reducer';
import { LoadingSpinner, ErrorDisplay } from 'app/shared/components';
import { Translate } from 'react-jhipster';
import '../student.scss';
import './flashcard.scss';
import FloatingNoteWidget from './floating-note-widget';

export const Flashcard = () => {
  const dispatch = useAppDispatch();
  const { selectedUnit } = useAppSelector(state => state.unit);
  const { vocabularies: initialVocabularies, loading, errorMessage } = useAppSelector(state => state.vocabulary);
  const [vocabularies, setVocabularies] = useState(initialVocabularies);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();

  // Fixed: Already correct - has all dependencies
  useEffect(() => {
    if (unitId) {
      dispatch(fetchUnitById(unitId));
      dispatch(fetchVocabulariesByUnitId(unitId));
    }
  }, [dispatch, unitId]);

  // Fixed: Sync local state with Redux state
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

  // Language detection
  const detectLanguage = (text: string): string => {
    if (!text) return 'en-US';
    const hasChinese = /[\u4e00-\u9fff]/.test(text);
    const hasJapanese = /[\u3040-\u309f\u30a0-\u30ff]/.test(text);
    const hasKorean = /[\uac00-\ud7af]/.test(text);
    const hasVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);

    if (hasChinese) return 'zh-CN';
    if (hasJapanese) return 'ja-JP';
    if (hasKorean) return 'ko-KR';
    if (hasVietnamese) return 'vi-VN';
    return 'en-US';
  };

  // Text-to-Speech
  const speakWord = (word: string, vocabId: number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }

    window.speechSynthesis.cancel();

    if ('speechSynthesis' in window) {
      const detectedLang = detectLanguage(word);
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = detectedLang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      setSpeakingId(vocabId);

      utterance.onend = () => {
        setSpeakingId(null);
      };

      utterance.onerror = () => {
        setSpeakingId(null);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleExitStudyMode = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsStudyMode(false);
      setIsExiting(false);
    }, 300); // Match animation duration
  };

  if (loading) {
    return (
      <Container fluid className="student-page-container">
        <LoadingSpinner message="Loading flashcards..." />
      </Container>
    );
  }

  if (errorMessage) {
    return (
      <Container fluid className="student-page-container">
        <ErrorDisplay
          message={errorMessage}
          onRetry={() => {
            if (unitId) {
              dispatch(fetchUnitById(unitId));
              dispatch(fetchVocabulariesByUnitId(unitId));
            }
          }}
        />
      </Container>
    );
  }

  if (!vocabularies || vocabularies.length === 0) {
    return (
      <Container fluid className="student-page-container">
        <div className="student-header mb-4">
          <Button onClick={() => navigate(-1)} color="link" className="p-0">
            <FontAwesomeIcon icon="arrow-left" className="me-2" />
            <Translate contentKey="langleague.student.learning.flashcard.back">Back</Translate>
          </Button>
          <h1>{selectedUnit?.title || 'Flashcards'}</h1>
        </div>
        <div className="empty-state-student">
          <div className="empty-icon">
            <FontAwesomeIcon icon="layer-group" />
          </div>
          <h3>
            <Translate contentKey="langleague.student.learning.flashcard.noCards">No flashcards available</Translate>
          </h3>
          <p>
            <Translate contentKey="langleague.student.learning.flashcard.noCardsDescription">
              Flashcards will appear here once vocabulary is added
            </Translate>
          </p>
        </div>
      </Container>
    );
  }

  const currentVocab = vocabularies[currentIndex];

  return (
    <Container fluid className="student-page-container">
      {/* Header */}
      <div className="student-header mb-4">
        <div className="header-content">
          <Button onClick={() => navigate(-1)} color="link" className="p-0 mb-2">
            <FontAwesomeIcon icon="arrow-left" className="me-2" />
            <Translate contentKey="langleague.student.learning.flashcard.back">Back</Translate>
          </Button>
          <div className="d-flex align-items-center gap-2 mb-2">
            <Badge color="primary">
              <Translate contentKey="langleague.student.learning.flashcard.learning">Learning</Translate>
            </Badge>
            <FontAwesomeIcon icon="chevron-right" />
            <Badge color="secondary">
              <Translate contentKey="langleague.student.learning.flashcard.title">Flashcards</Translate>
            </Badge>
            {selectedUnit && (
              <>
                <FontAwesomeIcon icon="chevron-right" />
                <Badge color="info">{selectedUnit.title}</Badge>
              </>
            )}
          </div>
        </div>
        <div className="header-actions d-flex gap-2">
          <Button onClick={handleShuffle} color="secondary" outline>
            <FontAwesomeIcon icon="random" className="me-2" />
            <Translate contentKey="langleague.student.learning.flashcard.shuffle">Shuffle</Translate>
          </Button>
          <Button onClick={() => setIsStudyMode(!isStudyMode)} color={isStudyMode ? 'warning' : 'secondary'} outline>
            <FontAwesomeIcon icon="star" className="me-2" />
            <Translate contentKey="langleague.student.learning.flashcard.studyMode">Study Mode</Translate>
          </Button>
          <Button onClick={() => setShowNotes(!showNotes)} color={showNotes ? 'info' : 'secondary'} outline>
            <FontAwesomeIcon icon="sticky-note" className="me-2" />
            <Translate contentKey="langleague.student.learning.flashcard.notes">Notes</Translate>
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small className="text-muted">
            <Translate contentKey="langleague.student.learning.flashcard.card">Card</Translate> {currentIndex + 1}{' '}
            <Translate contentKey="langleague.student.learning.flashcard.of">of</Translate> {vocabularies.length}
          </small>
          <small className="text-muted">{Math.round(((currentIndex + 1) / vocabularies.length) * 100)}%</small>
        </div>
        <div className="student-progress-bar large">
          <div className="progress-fill" style={{ width: `${((currentIndex + 1) / vocabularies.length) * 100}%` }} />
        </div>
      </div>

      {/* Flashcard */}
      {isStudyMode ? (
        <div className={`study-mode-overlay ${isExiting ? 'exiting' : ''}`}>
          <button className="close-study-mode" onClick={handleExitStudyMode}>
            <FontAwesomeIcon icon="times" />
          </button>
          <div className={`study-mode-content ${isExiting ? 'exiting' : ''}`}>
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
              <div className="flashcard-card-inner">
                <div className="flashcard-card-front">
                  <div className="card-label">
                    <Translate contentKey="langleague.student.learning.flashcard.definition">DEFINITION</Translate>
                  </div>
                  <div className="card-content">
                    <h2 className="main-text">{currentVocab.meaning}</h2>
                    {currentVocab.example && (
                      <p className="example-text">
                        <FontAwesomeIcon icon="quote-left" className="me-2" />
                        {currentVocab.example}
                      </p>
                    )}
                  </div>
                  <div className="flip-hint">
                    <FontAwesomeIcon icon="sync-alt" className="me-2" />
                    <Translate contentKey="langleague.student.learning.flashcard.clickToFlip">Click to Flip</Translate>
                  </div>
                </div>

                <div className="flashcard-card-back">
                  <div className="card-label">
                    <Translate contentKey="langleague.student.learning.flashcard.answer">ANSWER</Translate>
                  </div>
                  <div className="card-content">
                    <h2 className="main-text">{currentVocab.word}</h2>
                    {currentVocab.pronunciation && <p className="pronunciation">/{currentVocab.pronunciation}/</p>}
                    <button
                      className={`speak-btn-flashcard ${speakingId === currentVocab.id ? 'speaking' : ''}`}
                      onClick={e => speakWord(currentVocab.word, currentVocab.id, e)}
                      title="Listen to pronunciation"
                    >
                      <FontAwesomeIcon icon={speakingId === currentVocab.id ? 'volume-up' : 'volume-high'} />
                    </button>
                  </div>
                  <div className="flip-hint">
                    <FontAwesomeIcon icon="sync-alt" className="me-2" />
                    <Translate contentKey="langleague.student.learning.flashcard.clickToFlip">Click to Flip</Translate>
                  </div>
                </div>
              </div>
            </div>
            <div className="flashcard-controls">
              <button className="btn-back" onClick={handleExitStudyMode}>
                <FontAwesomeIcon icon="arrow-left" className="me-2" />
                Back to Flashcard
              </button>
              <button className="btn-prev" onClick={handlePrevious} disabled={vocabularies.length <= 1}>
                <FontAwesomeIcon icon="chevron-left" className="me-2" />
                Previous
              </button>
              <button className="btn-next" onClick={handleNext} disabled={vocabularies.length <= 1}>
                Next
                <FontAwesomeIcon icon="chevron-right" className="ms-2" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flashcard-main">
          <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
            <div className="flashcard-card-inner">
              <div className="flashcard-card-front">
                <div className="card-label">
                  <Translate contentKey="langleague.student.learning.flashcard.definition">DEFINITION</Translate>
                </div>
                <div className="card-content">
                  <h2 className="main-text">{currentVocab.meaning}</h2>
                  {currentVocab.example && (
                    <p className="example-text">
                      <FontAwesomeIcon icon="quote-left" className="me-2" />
                      {currentVocab.example}
                    </p>
                  )}
                </div>
                <div className="flip-hint">
                  <FontAwesomeIcon icon="sync-alt" className="me-2" />
                  <Translate contentKey="langleague.student.learning.flashcard.clickToFlip">Click to Flip</Translate>
                </div>
              </div>

              <div className="flashcard-card-back">
                <div className="card-label">
                  <Translate contentKey="langleague.student.learning.flashcard.answer">ANSWER</Translate>
                </div>
                <div className="card-content">
                  <h2 className="main-text">{currentVocab.word}</h2>
                  {currentVocab.pronunciation && <p className="pronunciation">/{currentVocab.pronunciation}/</p>}
                  <button
                    className={`speak-btn-flashcard ${speakingId === currentVocab.id ? 'speaking' : ''}`}
                    onClick={e => speakWord(currentVocab.word, currentVocab.id, e)}
                    title="Listen to pronunciation"
                  >
                    <FontAwesomeIcon icon={speakingId === currentVocab.id ? 'volume-up' : 'volume-high'} />
                  </button>
                </div>
                <div className="flip-hint">
                  <FontAwesomeIcon icon="sync-alt" className="me-2" />
                  <Translate contentKey="langleague.student.learning.flashcard.clickToFlip">Click to Flip</Translate>
                </div>
              </div>
            </div>
          </div>

          <div className="flashcard-controls">
            <button className="btn-prev" onClick={handlePrevious} disabled={vocabularies.length <= 1}>
              <FontAwesomeIcon icon="chevron-left" className="me-2" />
              Previous
            </button>
            <button className="btn-next" onClick={handleNext} disabled={vocabularies.length <= 1}>
              Next
              <FontAwesomeIcon icon="chevron-right" className="ms-2" />
            </button>
          </div>
        </div>
      )}

      {/* Terminology List */}
      <div className="flashcard-vocab-list">
        <h3>
          <FontAwesomeIcon icon="book" className="me-2" />
          <Translate contentKey="langleague.student.learning.flashcard.terminology">Terminology in this section</Translate>
        </h3>
        <div className="vocab-grid">
          {vocabularies.map((vocab, index) => (
            <div
              key={vocab.id}
              className="vocab-card"
              onClick={() => {
                setCurrentIndex(index);
                setIsFlipped(false);
              }}
            >
              <div className="vocab-word">
                {vocab.word}
                <button
                  className={`speak-btn ${speakingId === vocab.id ? 'speaking' : ''}`}
                  onClick={e => speakWord(vocab.word, vocab.id, e)}
                  title="Listen"
                  style={{
                    width: '32px',
                    height: '32px',
                    border: 'none',
                    background: 'transparent',
                    color: '#667eea',
                    cursor: 'pointer',
                  }}
                >
                  <FontAwesomeIcon icon={speakingId === vocab.id ? 'volume-up' : 'volume-high'} />
                </button>
              </div>
              {vocab.pronunciation && <div className="vocab-pronunciation">/{vocab.pronunciation}/</div>}
              <div className="vocab-meaning">{vocab.meaning}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fab-notes-button" onClick={() => setShowNotes(true)} title="Open Notes">
        <FontAwesomeIcon icon="sticky-note" />
      </button>

      {/* Floating Notes Widget */}
      {unitId && <FloatingNoteWidget unitId={parseInt(unitId, 10)} isOpen={showNotes} onClose={() => setShowNotes(false)} />}
    </Container>
  );
};

export default Flashcard;
