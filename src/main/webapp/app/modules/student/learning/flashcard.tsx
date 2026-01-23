import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Button, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchUnitById } from 'app/shared/reducers/unit.reducer';
import { fetchVocabulariesByUnitId } from 'app/shared/reducers/vocabulary.reducer';
import { LoadingSpinner, ErrorDisplay } from 'app/shared/components';
import { Translate, translate } from 'react-jhipster';
import { useGameData } from 'app/modules/student/games/hooks/useGameData';
import { IVocabulary } from 'app/shared/model/vocabulary.model';
import '../student.scss';
import './flashcard.scss';
import FloatingNoteWidget from './floating-note-widget';

const MAX_FLASHCARDS_PER_SESSION = 100;

export const Flashcard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { unitId } = useParams<{ unitId: string }>();

  // Determine mode: Learning (single unit) or Review (multiple units)
  const unitIdsParam = searchParams.get('unitIds');
  const reviewUnitIds = useMemo(() => (unitIdsParam ? unitIdsParam.split(',').map(Number) : undefined), [unitIdsParam]);
  const isReviewMode = !!reviewUnitIds;

  // Redux state for Learning Mode
  const { selectedUnit } = useAppSelector(state => state.unit);
  const { vocabularies: reduxVocabularies, loading: reduxLoading, errorMessage: reduxError } = useAppSelector(state => state.vocabulary);

  // Custom hook for Review Mode
  const { vocabularies: gameVocabularies, loading: gameLoading, error: gameError } = useGameData(reviewUnitIds, !isReviewMode);

  // Local state
  const [vocabularies, setVocabularies] = useState<IVocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  // Effect for Learning Mode (Single Unit)
  useEffect(() => {
    if (unitId && !isReviewMode) {
      dispatch(fetchUnitById(unitId));
      dispatch(fetchVocabulariesByUnitId(unitId));
    }
  }, [dispatch, unitId, isReviewMode]);

  // Effect to set vocabularies based on mode
  useEffect(() => {
    if (isReviewMode) {
      if (gameVocabularies.length > 0) {
        // Shuffle and slice for review mode
        const shuffled = [...gameVocabularies].sort(() => Math.random() - 0.5);
        // Map GameVocabulary to IVocabulary
        const mappedVocabularies: IVocabulary[] = shuffled.slice(0, MAX_FLASHCARDS_PER_SESSION).map(v => ({
          id: v.id,
          word: v.word,
          meaning: v.meaning,
          phonetic: v.phonetic,
          example: v.example,
          imageUrl: v.imageUrl,
        }));
        setVocabularies(mappedVocabularies);
      }
    } else {
      setVocabularies(reduxVocabularies);
    }
  }, [isReviewMode, gameVocabularies, reduxVocabularies]);

  const loading = isReviewMode ? gameLoading : reduxLoading;
  const errorMessage = isReviewMode ? gameError : reduxError;

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % vocabularies.length);
  }, [vocabularies.length]);

  const handlePrevious = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + vocabularies.length) % vocabularies.length);
  }, [vocabularies.length]);

  const handleShuffle = useCallback(() => {
    setVocabularies(prev => {
      const shuffled = [...prev].sort(() => Math.random() - 0.5);
      return shuffled;
    });
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  // Language detection
  const detectLanguage = useCallback((text: string): string => {
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
  }, []);

  // Text-to-Speech
  const speakWord = useCallback(
    (word: string, vocabId: number, event?: React.MouseEvent) => {
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
    },
    [detectLanguage],
  );

  const handleExitStudyMode = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsStudyMode(false);
      setIsExiting(false);
    }, 300); // Match animation duration
  }, []);

  if (loading) {
    return (
      <Container fluid className="student-page-container">
        <LoadingSpinner message="langleague.student.learning.flashcard.loading" isI18nKey />
      </Container>
    );
  }

  if (errorMessage) {
    return (
      <Container fluid className="student-page-container">
        <ErrorDisplay
          message={errorMessage}
          onRetry={() => {
            if (unitId && !isReviewMode) {
              dispatch(fetchUnitById(unitId));
              dispatch(fetchVocabulariesByUnitId(unitId));
            } else if (isReviewMode) {
              // Retry logic for review mode is handled by hook re-render
              window.location.reload();
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
          <h1>
            {isReviewMode
              ? translate('langleague.student.learning.flashcard.reviewSession')
              : selectedUnit?.title || translate('langleague.student.learning.flashcard.title')}
          </h1>
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
    <div className="page-flashcard-wrapper">
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
              {isReviewMode ? (
                <Badge color="warning">
                  {translate('langleague.student.learning.flashcard.reviewMode', { count: vocabularies.length })}
                </Badge>
              ) : (
                selectedUnit && (
                  <>
                    <FontAwesomeIcon icon="chevron-right" />
                    <Badge color="info">{selectedUnit.title}</Badge>
                  </>
                )
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
            {!isReviewMode && (
              <Button onClick={() => setShowNotes(!showNotes)} color={showNotes ? 'info' : 'secondary'} outline>
                <FontAwesomeIcon icon="sticky-note" className="me-2" />
                <Translate contentKey="langleague.student.learning.flashcard.notes">Notes</Translate>
              </Button>
            )}
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
                      {currentVocab.phonetic && <p className="pronunciation">/{currentVocab.phonetic}/</p>}
                      <button
                        className={`speak-btn-flashcard ${speakingId === currentVocab.id ? 'speaking' : ''}`}
                        onClick={e => speakWord(currentVocab.word || '', currentVocab.id || 0, e)}
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
                  <Translate contentKey="entity.action.back">Back</Translate>
                </button>
                <button className="btn-prev" onClick={handlePrevious} disabled={vocabularies.length <= 1}>
                  <FontAwesomeIcon icon="chevron-left" className="me-2" />
                  <Translate contentKey="langleague.student.learning.vocabulary.navigation.previous">Previous</Translate>
                </button>
                <button className="btn-next" onClick={handleNext} disabled={vocabularies.length <= 1}>
                  <Translate contentKey="langleague.student.learning.vocabulary.navigation.next">Next</Translate>
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
                    {currentVocab.phonetic && <p className="pronunciation">/{currentVocab.phonetic}/</p>}
                    <button
                      className={`speak-btn-flashcard ${speakingId === currentVocab.id ? 'speaking' : ''}`}
                      onClick={e => speakWord(currentVocab.word || '', currentVocab.id || 0, e)}
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
                <Translate contentKey="langleague.student.learning.vocabulary.navigation.previous">Previous</Translate>
              </button>
              <button className="btn-next" onClick={handleNext} disabled={vocabularies.length <= 1}>
                <Translate contentKey="langleague.student.learning.vocabulary.navigation.next">Next</Translate>
                <FontAwesomeIcon icon="chevron-right" className="ms-2" />
              </button>
            </div>
          </div>
        )}

        {/* Terminology List - Only show in normal mode (not Study Mode) */}
        {!isStudyMode && (
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
                      onClick={e => speakWord(vocab.word || '', vocab.id || 0, e)}
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
                  {vocab.phonetic && <div className="vocab-pronunciation">/{vocab.phonetic}/</div>}
                  <div className="vocab-meaning">{vocab.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floating Action Button - Only in Learning Mode and not Study Mode */}
        {!isReviewMode && !isStudyMode && (
          <button className="fab-notes-button" onClick={() => setShowNotes(true)} title="Open Notes">
            <FontAwesomeIcon icon="sticky-note" />
          </button>
        )}

        {/* Floating Notes Widget - Only in Learning Mode */}
        {!isReviewMode && unitId && (
          <FloatingNoteWidget unitId={parseInt(unitId, 10)} isOpen={showNotes} onClose={() => setShowNotes(false)} />
        )}
      </Container>
    </div>
  );
};

export default Flashcard;
