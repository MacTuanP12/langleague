import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button, Card, CardBody, Container, Row, Col, Alert, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';
import { useGameData, GameVocabulary } from './hooks/useGameData';
import { GameResultModal } from './game-result-modal';
import { LoadingSpinner } from 'app/shared/components';
import './word-scramble.scss';

interface WordScrambleProps {
  unitId?: number;
  unitIds?: number[];
  onBack: () => void;
}

const MAX_WORDS_PER_ROUND = 15;

export const WordScramble: React.FC<WordScrambleProps> = ({ unitId, unitIds, onBack }) => {
  const idsToUse = useMemo(() => (unitIds && unitIds.length > 0 ? unitIds : unitId), [unitIds, unitId]);
  const { vocabularies, loading, error } = useGameData(idsToUse, !idsToUse);

  const [roundVocabularies, setRoundVocabularies] = useState<GameVocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const currentVocab = roundVocabularies[currentIndex];

  // Helper to clean word (remove spaces and punctuation for checking)
  const cleanWord = useCallback((word: string) => {
    return word.replace(/\s+/g, '').replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
  }, []);

  const scrambleWord = useCallback((word: string) => {
    // Use Array.from to handle Unicode characters correctly (Chinese, Japanese, Korean, Emoji)
    // Also remove spaces for the scramble pool
    const cleanText = word.replace(/\s+/g, '').replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
    const letters = Array.from(cleanText);

    if (letters.length <= 1) return letters;

    const scrambled = [...letters];
    let attempts = 0;
    const maxAttempts = 10;

    // Keep shuffling until it's different or max attempts reached
    while (scrambled.join('') === cleanText && attempts < maxAttempts) {
      // Fisher-Yates shuffle
      for (let i = scrambled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
      }
      attempts++;
    }

    // If still the same after max attempts, force a change
    if (scrambled.join('') === cleanText && scrambled.length >= 2) {
      // Find two different characters to swap
      let swapped = false;
      for (let i = 0; i < scrambled.length - 1; i++) {
        if (scrambled[i] !== scrambled[i + 1]) {
          [scrambled[i], scrambled[i + 1]] = [scrambled[i + 1], scrambled[i]];
          swapped = true;
          break;
        }
      }

      // If all characters are the same (e.g., "aaa"), try swapping first and last
      if (!swapped && scrambled.length >= 2) {
        [scrambled[0], scrambled[scrambled.length - 1]] = [scrambled[scrambled.length - 1], scrambled[0]];
      }
    }

    return scrambled;
  }, []);

  // Initialize round
  const initializeRound = useCallback(() => {
    if (vocabularies.length === 0) return;

    // Filter out words that are too short (length < 2 after cleaning)
    // This is important for Chinese/Japanese where single characters are common
    const validVocabs = vocabularies.filter(v => {
      const cleaned = v.word.replace(/\s+/g, '').replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
      return cleaned.length >= 2;
    });

    if (validVocabs.length === 0) {
      // Handle edge case where all words are too short
      // Just use original list but game will be trivial for those words
      setRoundVocabularies(vocabularies.slice(0, MAX_WORDS_PER_ROUND));
    } else {
      // Shuffle and slice
      const shuffled = [...validVocabs].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, MAX_WORDS_PER_ROUND);
      setRoundVocabularies(selected);
    }

    setCurrentIndex(0);
    setCorrectAnswers(0);
    setShowResult(false);
    setGameStartTime(Date.now());
  }, [vocabularies]);

  useEffect(() => {
    if (vocabularies.length > 0) {
      initializeRound();
    }
  }, [vocabularies, initializeRound]);

  useEffect(() => {
    if (currentVocab) {
      setScrambledLetters(scrambleWord(currentVocab.word));
      setSelectedLetters([]);
      setShowHint(false);
      setIsCorrect(null);
    }
  }, [currentVocab, scrambleWord]);

  const handleLetterClick = useCallback(
    (index: number) => {
      if (selectedLetters.includes(index)) return;

      const newSelected = [...selectedLetters, index];
      setSelectedLetters(newSelected);

      // Check if word is complete
      if (newSelected.length === scrambledLetters.length) {
        const formedWord = newSelected.map(i => scrambledLetters[i]).join('');
        const targetWord = cleanWord(currentVocab.word);

        if (formedWord.toLowerCase() === targetWord.toLowerCase()) {
          // Correct!
          setIsCorrect(true);
          setCorrectAnswers(prev => prev + 1);

          // Move to next word after delay
          setTimeout(() => {
            if (isMountedRef.current) {
              if (currentIndex + 1 < roundVocabularies.length) {
                setCurrentIndex(prev => prev + 1);
              } else {
                // Game complete
                setShowResult(true);
              }
            }
          }, 1500);
        } else {
          // Wrong
          setIsCorrect(false);

          // Reset after delay
          setTimeout(() => {
            if (isMountedRef.current) {
              setSelectedLetters([]);
              setIsCorrect(null);
            }
          }, 1000);
        }
      }
    },
    [selectedLetters, scrambledLetters, currentVocab, cleanWord, currentIndex, roundVocabularies.length],
  );

  const handleRemoveLetter = useCallback(() => {
    setSelectedLetters(prev => prev.slice(0, -1));
  }, []);

  const handleSkip = useCallback(() => {
    if (currentIndex + 1 < roundVocabularies.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  }, [currentIndex, roundVocabularies.length]);

  const handleToggleHint = useCallback(() => {
    setShowHint(prev => !prev);
  }, []);

  const handleRetry = useCallback(() => {
    initializeRound(); // Start new round with potentially new words
  }, [initializeRound]);

  const handleExit = useCallback(() => {
    onBack();
  }, [onBack]);

  const getTimeTaken = useCallback(() => {
    return Math.floor((Date.now() - gameStartTime) / 1000);
  }, [gameStartTime]);

  const getFormedWord = useCallback(() => {
    return selectedLetters.map(i => scrambledLetters[i]).join('');
  }, [selectedLetters, scrambledLetters]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <LoadingSpinner message="langleague.student.games.loading" isI18nKey />
      </Container>
    );
  }

  if (error && vocabularies.length === 0) {
    return (
      <Container className="py-5">
        <Alert color="danger">
          <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
          {error}
        </Alert>
        <Button color="secondary" onClick={onBack}>
          <FontAwesomeIcon icon="arrow-left" className="me-2" />
          <Translate contentKey="langleague.student.games.backToMenu">Back to Menu</Translate>
        </Button>
      </Container>
    );
  }

  if (!currentVocab) {
    return null;
  }

  const progress = ((currentIndex + 1) / roundVocabularies.length) * 100;

  return (
    <Container fluid className="word-scramble-game">
      <div className="game-header mb-4">
        <Button color="link" onClick={onBack} className="back-button">
          <FontAwesomeIcon icon="arrow-left" className="me-2" />
          <Translate contentKey="langleague.student.games.backToMenu">Back to Menu</Translate>
        </Button>
        <h2 className="text-center mb-2">
          🔤 <Translate contentKey="langleague.student.games.wordScramble.title">Word Scramble</Translate>
        </h2>
        <p className="text-center text-muted">
          <Translate contentKey="langleague.student.games.wordScramble.instructions">
            Click the letters in the correct order to form the word
          </Translate>
        </p>
      </div>

      <div className="mb-4">
        <div className="d-flex justify-content-between mb-2">
          <span>
            <Translate contentKey="langleague.student.games.progress">Progress</Translate>: {currentIndex + 1} / {roundVocabularies.length}
          </span>
          <span>
            <Translate contentKey="langleague.student.games.score">Score</Translate>: {correctAnswers}
          </span>
        </div>
        <Progress value={progress} color="info" style={{ height: '10px' }} />
      </div>

      <Row className="justify-content-center">
        <Col md="8" lg="6">
          <Card className="meaning-card mb-4">
            <CardBody className="text-center">
              <h4 className="mb-2">
                <FontAwesomeIcon icon="question-circle" className="me-2" />
                <Translate contentKey="langleague.student.games.wordScramble.meaning">Meaning</Translate>
              </h4>
              <p className="lead mb-0">{currentVocab.meaning}</p>
            </CardBody>
          </Card>

          <div className="answer-area mb-4">
            <div className="answer-display">
              {selectedLetters.length === 0 ? (
                <span className="placeholder-text">
                  <Translate contentKey="langleague.student.games.wordScramble.tapLetters">Tap letters below...</Translate>
                </span>
              ) : (
                <span className={`formed-word ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}>
                  {getFormedWord()}
                </span>
              )}
            </div>
            {selectedLetters.length > 0 && (
              <Button color="danger" size="sm" outline onClick={handleRemoveLetter} className="mt-2">
                <FontAwesomeIcon icon="backspace" className="me-2" />
                <Translate contentKey="langleague.student.games.wordScramble.removeLetter">Remove Last</Translate>
              </Button>
            )}
          </div>

          <div className="scrambled-letters mb-4">
            {scrambledLetters.map((letter, index) => (
              <Button
                key={index}
                color="primary"
                className={`letter-button ${selectedLetters.includes(index) ? 'used' : ''}`}
                onClick={() => handleLetterClick(index)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLetterClick(index);
                  }
                }}
                disabled={selectedLetters.includes(index)}
                aria-label={`Letter ${letter}, position ${index + 1}`}
                aria-pressed={selectedLetters.includes(index)}
                role="button"
                tabIndex={selectedLetters.includes(index) ? -1 : 0}
              >
                {letter}
              </Button>
            ))}
          </div>

          {showHint && currentVocab.example && (
            <Alert color="info" className="hint-box">
              <FontAwesomeIcon icon="lightbulb" className="me-2" />
              <strong>
                <Translate contentKey="langleague.student.games.wordScramble.example">Example</Translate>:
              </strong>{' '}
              {currentVocab.example}
            </Alert>
          )}

          <div className="game-actions text-center">
            {currentVocab.example && (
              <Button color="info" outline onClick={handleToggleHint} className="me-2">
                <FontAwesomeIcon icon="lightbulb" className="me-2" />
                {showHint ? (
                  <Translate contentKey="langleague.student.games.wordScramble.hideHint">Hide Hint</Translate>
                ) : (
                  <Translate contentKey="langleague.student.games.wordScramble.showHint">Show Hint</Translate>
                )}
              </Button>
            )}
            <Button color="warning" outline onClick={handleSkip}>
              <FontAwesomeIcon icon="forward" className="me-2" />
              <Translate contentKey="langleague.student.games.wordScramble.skip">Skip</Translate>
            </Button>
          </div>

          {isCorrect === true && (
            <Alert color="success" className="mt-4 text-center feedback-alert">
              <FontAwesomeIcon icon="check-circle" size="2x" className="mb-2" />
              <h5>
                <Translate contentKey="langleague.student.games.wordScramble.correct">Correct!</Translate>
              </h5>
            </Alert>
          )}
          {isCorrect === false && (
            <Alert color="danger" className="mt-4 text-center feedback-alert">
              <FontAwesomeIcon icon="times-circle" size="2x" className="mb-2" />
              <h5>
                <Translate contentKey="langleague.student.games.wordScramble.incorrect">Try again!</Translate>
              </h5>
            </Alert>
          )}
        </Col>
      </Row>

      <GameResultModal
        isOpen={showResult}
        score={correctAnswers}
        total={roundVocabularies.length}
        timeTaken={getTimeTaken()}
        onRetry={handleRetry}
        onExit={handleExit}
      />
    </Container>
  );
};

export default WordScramble;
