import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Button, Card, CardBody, Container, Row, Col, Alert, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';
import { useGameData, GameVocabulary } from './hooks/useGameData';
import { GameResultModal } from './game-result-modal';
import { LoadingSpinner } from 'app/shared/components';
import './speed-quiz.scss';

interface QuizOption {
  id: number | string;
  text: string;
  isCorrect: boolean;
}

interface SpeedQuizProps {
  unitId?: number;
  unitIds?: number[];
  onBack: () => void;
}

const TIME_PER_QUESTION = 15; // seconds
const MAX_QUESTIONS_PER_ROUND = 20;

export const SpeedQuiz: React.FC<SpeedQuizProps> = ({ unitId, unitIds, onBack }) => {
  const idsToUse = useMemo(() => (unitIds && unitIds.length > 0 ? unitIds : unitId), [unitIds, unitId]);
  const { vocabularies, loading, error } = useGameData(idsToUse, !idsToUse);

  const [roundVocabularies, setRoundVocabularies] = useState<GameVocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<QuizOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showQuestionType, setShowQuestionType] = useState<'word' | 'meaning'>('meaning');

  // Track if component is mounted to prevent setState on unmounted component
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const currentVocab = roundVocabularies[currentIndex];

  const generateOptions = useCallback(() => {
    if (!currentVocab || vocabularies.length < 2) return;

    const questionType = Math.random() > 0.5 ? 'word' : 'meaning';
    setShowQuestionType(questionType);

    const correctAnswer = questionType === 'word' ? currentVocab.meaning : currentVocab.word;

    // Filter and deduplicate to ensure unique options
    const wrongAnswers: string[] = [];
    const seenAnswers = new Set([correctAnswer.toLowerCase().trim()]);

    // Optimization: Pick random wrong answers without sorting the whole array
    const potentialIndices = Array.from({ length: vocabularies.length }, (_, i) => i).filter(i => vocabularies[i].id !== currentVocab.id);

    let attempts = 0;
    while (wrongAnswers.length < 3 && attempts < 20 && potentialIndices.length > 0) {
      const randomIndex = Math.floor(Math.random() * potentialIndices.length);
      const vocabIndex = potentialIndices[randomIndex];
      const vocab = vocabularies[vocabIndex];

      const answer = questionType === 'word' ? vocab.meaning : vocab.word;
      const answerLower = answer.toLowerCase().trim();

      if (!seenAnswers.has(answerLower)) {
        wrongAnswers.push(answer);
        seenAnswers.add(answerLower);
        // Remove used index by swapping with last and popping (O(1))
        potentialIndices[randomIndex] = potentialIndices[potentialIndices.length - 1];
        potentialIndices.pop();
      }
      attempts++;
    }

    // If not enough unique answers, skip this question
    if (wrongAnswers.length < 3) {
      // Move to next question
      setCurrentIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex < roundVocabularies.length) {
          return nextIndex;
        } else {
          setShowResult(true);
          return prev;
        }
      });
      return;
    }

    const allOptions = [
      { id: currentVocab.id, text: correctAnswer, isCorrect: true },
      ...wrongAnswers.map((text, idx) => ({
        id: `wrong_${currentVocab.id}_${idx}`,
        text,
        isCorrect: false,
      })),
    ].sort(() => Math.random() - 0.5);

    setOptions(allOptions);
  }, [currentVocab, vocabularies, roundVocabularies.length]);

  // Initialize round
  const initializeRound = useCallback(() => {
    if (vocabularies.length === 0) return;

    // Shuffle and slice
    const shuffled = [...vocabularies].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, MAX_QUESTIONS_PER_ROUND);

    setRoundVocabularies(selected);
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
      generateOptions();
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(TIME_PER_QUESTION);
    }
  }, [currentVocab, generateOptions]);

  // Timer effect with proper cleanup and functional updates
  useEffect(() => {
    if (isAnswered || showResult || !currentVocab) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Use functional updates to avoid stale closure
          if (isMountedRef.current) {
            setCurrentIndex(prevIndex => {
              const nextIndex = prevIndex + 1;
              if (nextIndex < roundVocabularies.length) {
                return nextIndex;
              } else {
                setShowResult(true);
                return prevIndex;
              }
            });
          }
          return TIME_PER_QUESTION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, showResult, currentVocab, roundVocabularies.length]);

  const handleNextQuestion = useCallback(
    (wasCorrect: boolean) => {
      if (currentIndex + 1 < roundVocabularies.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    },
    [currentIndex, roundVocabularies.length],
  );

  const handleOptionClick = useCallback(
    (option: QuizOption) => {
      if (isAnswered) return;

      setSelectedOption(option.id);
      setIsAnswered(true);

      if (option.isCorrect) {
        setCorrectAnswers(prev => prev + 1);
      }

      setTimeout(() => {
        if (isMountedRef.current) {
          handleNextQuestion(option.isCorrect);
        }
      }, 1500);
    },
    [isAnswered, handleNextQuestion],
  );

  const handleRetry = useCallback(() => {
    initializeRound(); // Start new round
  }, [initializeRound]);

  const handleExit = useCallback(() => {
    onBack();
  }, [onBack]);

  const getTimeTaken = useCallback(() => {
    return Math.floor((Date.now() - gameStartTime) / 1000);
  }, [gameStartTime]);

  const getOptionClass = useCallback(
    (option: QuizOption) => {
      if (!isAnswered) return 'option-button';

      if (option.id === selectedOption) {
        return option.isCorrect ? 'option-button correct' : 'option-button incorrect';
      }

      if (option.isCorrect) {
        return 'option-button correct-answer';
      }

      return 'option-button';
    },
    [isAnswered, selectedOption],
  );

  const getTimerColor = useCallback(() => {
    if (timeLeft <= 5) return 'danger';
    if (timeLeft <= 10) return 'warning';
    return 'success';
  }, [timeLeft]);

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

  if (!currentVocab || vocabularies.length < 4) {
    return (
      <Container className="py-5">
        <Alert color="warning">
          <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
          <Translate contentKey="langleague.student.games.speedQuiz.notEnoughWords">Need at least 4 words to play Speed Quiz</Translate>
        </Alert>
        <Button color="secondary" onClick={onBack}>
          <FontAwesomeIcon icon="arrow-left" className="me-2" />
          <Translate contentKey="langleague.student.games.backToMenu">Back to Menu</Translate>
        </Button>
      </Container>
    );
  }

  const progress = ((currentIndex + 1) / roundVocabularies.length) * 100;
  const timeProgress = (timeLeft / TIME_PER_QUESTION) * 100;

  return (
    <Container fluid className="speed-quiz-game">
      <div className="game-header mb-4">
        <Button color="link" onClick={onBack} className="back-button">
          <FontAwesomeIcon icon="arrow-left" className="me-2" />
          <Translate contentKey="langleague.student.games.backToMenu">Back to Menu</Translate>
        </Button>
        <h2 className="text-center mb-2">
          ⚡ <Translate contentKey="langleague.student.games.speedQuiz.title">Speed Quiz</Translate>
        </h2>
        <p className="text-center text-muted">
          <Translate contentKey="langleague.student.games.speedQuiz.instructions">
            Choose the correct answer before time runs out!
          </Translate>
        </p>
      </div>

      <div className="mb-4">
        <div className="d-flex justify-content-between mb-2">
          <span>
            <Translate contentKey="langleague.student.games.question">Question</Translate>: {currentIndex + 1} / {roundVocabularies.length}
          </span>
          <span>
            <Translate contentKey="langleague.student.games.score">Score</Translate>: {correctAnswers}
          </span>
        </div>
        <Progress value={progress} color="info" style={{ height: '10px' }} />
      </div>

      <Row className="justify-content-center">
        <Col md="10" lg="8">
          <div className="timer-section mb-4">
            <div className="timer-display">
              <FontAwesomeIcon icon="clock" className="me-2" />
              <span className="timer-value">{timeLeft}s</span>
            </div>
            <Progress value={timeProgress} color={getTimerColor()} className="timer-bar" />
          </div>

          <Card className="question-card mb-4">
            <CardBody className="text-center">
              <div className="question-type mb-3">
                <Translate
                  contentKey={
                    showQuestionType === 'word'
                      ? 'langleague.student.games.speedQuiz.selectMeaning'
                      : 'langleague.student.games.speedQuiz.selectWord'
                  }
                >
                  {showQuestionType === 'word' ? 'Select the meaning of:' : 'Select the word for:'}
                </Translate>
              </div>
              <h3 className="question-text">{showQuestionType === 'word' ? currentVocab.word : currentVocab.meaning}</h3>
              {showQuestionType === 'word' && currentVocab.phonetic && <p className="phonetic-text">{currentVocab.phonetic}</p>}
            </CardBody>
          </Card>

          <Row className="options-grid">
            {options.map((option, index) => (
              <Col key={option.id} xs="12" sm="6" className="mb-3">
                <Button
                  color="primary"
                  className={getOptionClass(option)}
                  onClick={() => handleOptionClick(option)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOptionClick(option);
                    }
                  }}
                  disabled={isAnswered}
                  block
                  aria-label={`Option ${String.fromCharCode(65 + index)}: ${option.text}`}
                  aria-pressed={selectedOption === option.id}
                  role="button"
                  tabIndex={isAnswered ? -1 : 0}
                >
                  <span className="option-letter" aria-hidden="true">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="option-text">{option.text}</span>
                  {isAnswered && option.isCorrect && <FontAwesomeIcon icon="check-circle" className="ms-2" />}
                  {isAnswered && option.id === selectedOption && !option.isCorrect && (
                    <FontAwesomeIcon icon="times-circle" className="ms-2" />
                  )}
                </Button>
              </Col>
            ))}
          </Row>
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

export default SpeedQuiz;
