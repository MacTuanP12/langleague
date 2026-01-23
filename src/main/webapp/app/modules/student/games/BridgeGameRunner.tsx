/**
 * The Broken Bridge - Endless Runner Game
 * A Cloze Test game disguised as an endless runner
 *
 * Key Features:
 * - Treadmill effect: Avatar stays at left: 20%, bridge scrolls
 * - Multi-language support via Intl.Segmenter
 * - Layered Z-Index for realistic falling animation
 * - Framer Motion for avatar animations
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { translate } from 'react-jhipster';
import axios from 'axios';
import { Spinner } from 'reactstrap';
import { buildVocabularyPool, generateQuestion, detectLanguage } from './utils/bridge-utils';
import { BridgeGameQuestion } from './types/bridge-game.types';
import './bridge-game.scss';

type AvatarState = 'running' | 'idle' | 'jump' | 'fall';
type GamePhase = 'playing' | 'gameover' | 'review';

interface BridgeGameProps {
  unitIds: number[];
  onBack: () => void;
}

interface GrammarDTO {
  id: number;
  title: string;
  exampleUsage: string;
}

interface AnswerHistory {
  question: BridgeGameQuestion;
  userAnswer: string;
  isCorrect: boolean;
  questionNumber: number;
}

export const BridgeGame: React.FC<BridgeGameProps> = ({ unitIds, onBack }) => {
  // Game State
  const [gamePhase, setGamePhase] = useState<GamePhase>('playing');
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  // Bridge State
  const [isBridgeMoving, setIsBridgeMoving] = useState(true);
  const [showGap, setShowGap] = useState(false);

  // Avatar State
  const [avatarState, setAvatarState] = useState<AvatarState>('running');

  // Question State
  const [questions, setQuestions] = useState<BridgeGameQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<BridgeGameQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  // Visual Effects
  const [showSplash, setShowSplash] = useState(false);

  // Answer History for Review Screen
  const [answerHistory, setAnswerHistory] = useState<AnswerHistory[]>([]);

  // Loading State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch questions from API
  useEffect(() => {
    const abortController = new AbortController();

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use Promise.all for parallel requests instead of sequential
        const responses = await Promise.all(
          unitIds.map(unitId =>
            axios.get<GrammarDTO[]>(`/api/grammars/by-unit/${unitId}`, {
              signal: abortController.signal,
            }),
          ),
        );

        if (abortController.signal.aborted || !isMounted.current) return;

        // Combine all grammars from responses
        const allGrammars: GrammarDTO[] = [];
        responses.forEach(response => {
          allGrammars.push(...response.data);
        });

        // Extract sentences from exampleUsage field
        const allSentences: Array<{ grammarId: number; sentence: string; grammarTitle: string }> = [];
        allGrammars.forEach(grammar => {
          if (grammar.exampleUsage && grammar.exampleUsage.trim()) {
            // Split by newlines to get individual sentences
            const sentences = grammar.exampleUsage
              .split(/\r?\n/)
              .map(s => s.trim())
              .filter(s => s.length >= 10);

            sentences.forEach(sentence => {
              allSentences.push({
                grammarId: grammar.id,
                sentence,
                grammarTitle: grammar.title,
              });
            });
          }
        });

        if (allSentences.length === 0) {
          if (isMounted.current) {
            setError(translate('langleague.student.games.bridge.noSentences'));
          }
          return;
        }

        // Shuffle and limit to 10 questions
        const shuffled = [...allSentences].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 10);

        // Build vocabulary pool from all sentences
        const sentenceTexts = selected.map(q => q.sentence);
        const vocabPool = buildVocabularyPool(sentenceTexts);

        // Generate questions with distractors
        const generatedQuestions = selected
          .map(raw => {
            const lang = detectLanguage(raw.sentence);
            return generateQuestion(raw.grammarId, raw.sentence, raw.grammarTitle, vocabPool, lang);
          })
          .filter((q): q is BridgeGameQuestion => q !== null);

        if (generatedQuestions.length === 0) {
          if (isMounted.current) {
            setError(translate('langleague.student.games.bridge.noQuestions'));
          }
          return;
        }

        if (isMounted.current) {
          setQuestions(generatedQuestions);
          setCurrentQuestion(generatedQuestions[0]);
        }
      } catch (err) {
        // Check if error is due to request cancellation
        if (axios.isCancel(err) || abortController.signal.aborted) {
          return;
        }

        if (isMounted.current) {
          console.error('Error fetching questions:', err);
          setError(translate('langleague.student.games.bridge.loadError'));
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    void fetchQuestions();

    return () => {
      abortController.abort();
    };
  }, [unitIds]);

  // Game Loop - Stop bridge and show question every 3 seconds
  useEffect(() => {
    if (gamePhase !== 'playing' || !currentQuestion) return;

    const timer = setTimeout(() => {
      if (isBridgeMoving && isMounted.current) {
        // Stop bridge and show question
        setIsBridgeMoving(false);
        setShowGap(true);
        setAvatarState('idle');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isBridgeMoving, gamePhase, currentQuestion]);

  // Handle Answer Selection
  const handleAnswerSelect = useCallback(
    async (answer: string) => {
      if (isAnswering || !currentQuestion) return;

      setIsAnswering(true);
      setSelectedAnswer(answer);

      const isCorrect = answer === currentQuestion.correctAnswer;

      // Record answer in history
      setAnswerHistory(prev => [
        ...prev,
        {
          question: currentQuestion,
          userAnswer: answer,
          isCorrect,
          questionNumber: questionIndex + 1,
        },
      ]);

      if (isCorrect) {
        // Correct: Avatar jumps
        setAvatarState('jump');

        await new Promise(resolve => setTimeout(resolve, 800));
        if (!isMounted.current) return;

        // Resume bridge movement
        setShowGap(false);
        setIsBridgeMoving(true);
        setAvatarState('running');
        setScore(prev => prev + 100);

        // Load next question
        const nextIndex = questionIndex + 1;
        if (nextIndex < questions.length) {
          setCurrentQuestion(questions[nextIndex]);
          setQuestionIndex(nextIndex);
        } else {
          // Game won!
          setGamePhase('gameover');
        }
      } else {
        // Wrong: Avatar falls
        setAvatarState('fall');
        setShowSplash(true);

        await new Promise(resolve => setTimeout(resolve, 1500));
        if (!isMounted.current) return;

        const newLives = lives - 1;
        setLives(newLives);
        setShowSplash(false);

        if (newLives <= 0) {
          setGamePhase('gameover');
        } else {
          // Reset for next question
          setShowGap(false);
          setIsBridgeMoving(true);
          setAvatarState('running');

          const nextIndex = questionIndex + 1;
          if (nextIndex < questions.length) {
            setCurrentQuestion(questions[nextIndex]);
            setQuestionIndex(nextIndex);
          } else {
            setGamePhase('gameover');
          }
        }
      }

      if (isMounted.current) {
        setIsAnswering(false);
        setSelectedAnswer(null);
      }
    },
    [isAnswering, currentQuestion, lives, questionIndex, questions],
  );

  // Restart Game
  const handleRestart = useCallback(() => {
    setGamePhase('playing');
    setLives(3);
    setScore(0);
    setQuestionIndex(0);
    setCurrentQuestion(questions[0]);
    setIsBridgeMoving(true);
    setShowGap(false);
    setAvatarState('running');
    setSelectedAnswer(null);
    setIsAnswering(false);
    setAnswerHistory([]);
  }, [questions]);

  // Avatar Animation Variants
  const avatarVariants: Variants = useMemo(
    () => ({
      running: {
        y: 0,
        rotate: 0,
        opacity: 1,
        transition: {
          duration: 0.3,
        },
      },
      idle: {
        y: 0,
        rotate: 0,
        opacity: 1,
      },
      jump: {
        y: [-120, 0],
        rotate: [0, -15, 0],
        opacity: 1,
        transition: {
          duration: 0.8,
          times: [0, 0.5, 1],
        },
      },
      fall: {
        y: [0, 200],
        rotate: [0, 180],
        opacity: [1, 0.5],
        transition: {
          duration: 1.5,
          ease: 'easeIn',
        },
      },
    }),
    [],
  );

  // Loading State
  if (loading) {
    return (
      <div className="bridge-game-wrapper d-flex justify-content-center align-items-center">
        <div className="text-center">
          <Spinner color="light" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-white">{translate('langleague.student.games.bridge.loading')}</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bridge-game-wrapper">
        <div className="game-over-screen">
          <div className="game-over-content">
            <h2>{translate('entity.action.error')}</h2>
            <p>{error}</p>
            <button className="restart-button" onClick={onBack}>
              <FontAwesomeIcon icon="arrow-left" className="me-2" />
              {translate('langleague.student.games.backToMenu')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game Over Screen
  if (gamePhase === 'gameover') {
    return (
      <div className="bridge-game-wrapper">
        <div className="game-over-screen">
          <div className="game-over-content">
            <div className="game-over-title">
              {lives > 0 ? translate('langleague.student.games.bridge.victory') : translate('langleague.student.games.bridge.gameOver')}
            </div>
            <div className="final-score">
              <div>
                {translate('langleague.student.games.score')}: {score}
              </div>
              <div>
                {translate('langleague.student.games.question')}: {questionIndex}/{questions.length}
              </div>
              <div>
                {translate('langleague.student.games.bridge.correctAnswers')}: {answerHistory.filter(h => h.isCorrect).length}/
                {answerHistory.length}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button className="restart-button" onClick={() => setGamePhase('review')}>
                <FontAwesomeIcon icon="list-check" className="me-2" />
                {translate('langleague.student.games.bridge.viewReview')}
              </button>
              <button className="restart-button" onClick={handleRestart}>
                <FontAwesomeIcon icon="redo" className="me-2" />
                {translate('langleague.student.games.bridge.playAgain')}
              </button>
              <button className="restart-button secondary" onClick={onBack}>
                <FontAwesomeIcon icon="arrow-left" className="me-2" />
                {translate('langleague.student.games.backToMenu')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Review Screen
  if (gamePhase === 'review') {
    return (
      <div className="bridge-game-wrapper">
        <div className="review-screen">
          <div className="review-container">
            <div className="review-header">
              <h2>
                <FontAwesomeIcon icon="clipboard-list" className="me-2" />
                {translate('langleague.student.games.bridge.reviewTitle')}
              </h2>
              <p className="review-summary">
                {translate('langleague.student.games.bridge.reviewSummary', {
                  correct: answerHistory.filter(h => h.isCorrect).length,
                  total: answerHistory.length,
                })}
              </p>
            </div>

            <div className="review-list">
              {answerHistory.map((history, index) => (
                <div key={index} className={`review-item ${history.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="review-item-header">
                    <span className="question-number">
                      {translate('langleague.student.games.bridge.questionNum', { num: history.questionNumber })}
                    </span>
                    <span className={`result-badge ${history.isCorrect ? 'correct' : 'incorrect'}`}>
                      {history.isCorrect ? (
                        <>
                          <FontAwesomeIcon icon="check-circle" /> {translate('langleague.student.games.bridge.correct')}
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon="times-circle" /> {translate('langleague.student.games.bridge.incorrect')}
                        </>
                      )}
                    </span>
                  </div>

                  <div className="review-question">
                    {history.question.tokens.map((token, idx) =>
                      idx === history.question.missingWordIndex ? (
                        <span key={idx} className="highlighted-word">
                          {history.question.correctAnswer}
                        </span>
                      ) : (
                        <span key={idx}>{token}</span>
                      ),
                    )}
                  </div>

                  <div className="review-answers">
                    <div className="answer-row">
                      <span className="answer-label">{translate('langleague.student.games.bridge.yourAnswer')}:</span>
                      <span className={`answer-value ${history.isCorrect ? 'correct' : 'incorrect'}`}>
                        {history.userAnswer}
                        {history.isCorrect ? ' ✓' : ' ✗'}
                      </span>
                    </div>
                    {!history.isCorrect && (
                      <div className="answer-row">
                        <span className="answer-label">{translate('langleague.student.games.bridge.correctAnswer')}:</span>
                        <span className="answer-value correct">{history.question.correctAnswer} ✓</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="review-actions">
              <button className="restart-button" onClick={handleRestart}>
                <FontAwesomeIcon icon="redo" className="me-2" />
                {translate('langleague.student.games.bridge.playAgain')}
              </button>
              <button className="restart-button secondary" onClick={onBack}>
                <FontAwesomeIcon icon="arrow-left" className="me-2" />
                {translate('langleague.student.games.backToMenu')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Game Render
  return (
    <div className="bridge-game-wrapper">
      {/* Sky Layer (Z-Index: 0) */}
      <div className="sky-layer">
        <div className="clouds" />
      </div>

      {/* Water Layer (Z-Index: 10) - BELOW bridge */}
      <div className="water-layer">
        <div className="water-waves" />
        <div className={`splash-effect ${showSplash ? 'active' : ''}`} />
      </div>

      {/* World/Bridge Layer (Z-Index: 15) - ABOVE water */}
      <div className="world-layer">
        <div className={`scrolling-container ${isBridgeMoving ? '' : 'paused'}`}>
          <div className="map-segment">
            <div className="ground-strip" />
            {showGap && (
              <div className="gap-zone">
                <div className="warning-sign">⚠️</div>
              </div>
            )}
          </div>
          <div className="map-segment">
            <div className="ground-strip" />
          </div>
        </div>
      </div>

      {/* Avatar (Z-Index: 30) - NO flipping, naturally faces LEFT */}
      <div className="avatar-container">
        <motion.div className="avatar" variants={avatarVariants} animate={avatarState}>
          {avatarState === 'fall' ? '😱' : '🏃‍♂️'}
        </motion.div>
      </div>

      {/* HUD (Z-Index: 100) */}
      <div className="game-hud">
        <div className="hud-item">
          <FontAwesomeIcon icon="star" className="text-warning" />
          <span>{score}</span>
        </div>
        <div className="hud-item">
          <span>Lives:</span>
          <div className="lives-display">
            {Array.from({ length: lives }).map((_, i) => (
              <span key={i}>❤️</span>
            ))}
          </div>
        </div>
        <div className="hud-item">
          <FontAwesomeIcon icon="list-ol" />
          <span>
            {questionIndex + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* Question Box (Z-Index: 30) */}
      {showGap && currentQuestion && (
        <AnimatePresence>
          <motion.div
            className="question-container"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="question-sentence">
              {currentQuestion.tokens.map((token, idx) =>
                idx === currentQuestion.missingWordIndex ? (
                  <span key={idx} className="missing-word">
                    ___
                  </span>
                ) : (
                  <span key={idx}>{token}</span>
                ),
              )}
            </div>
            <div className="options-grid">
              {currentQuestion.options.map(option => (
                <button
                  key={option}
                  className={`option-button ${selectedAnswer === option ? (option === currentQuestion.correctAnswer ? 'correct' : 'wrong') : ''}`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswering}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
