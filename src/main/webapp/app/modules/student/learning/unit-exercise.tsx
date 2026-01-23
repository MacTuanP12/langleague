import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from 'app/entities/unit/unit.reducer';
import { ExerciseType } from 'app/shared/model/enumerations/exercise-type.model';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AiTutorButton from './components/AiTutorButton';
import { IExercise } from 'app/shared/model/exercise.model';
import { LoadingSpinner } from 'app/shared/components';
import './unit-exercise.scss'; // Pure widget styling

interface UnitExerciseProps {
  data?: IExercise[];
  onFinish?: () => void;
}

export const UnitExercise: React.FC<UnitExerciseProps> = ({ data, onFinish }) => {
  const dispatch = useAppDispatch();
  const { unitId } = useParams<'unitId'>();
  const unit = useAppSelector(state => state.unit.entity);
  const loading = useAppSelector(state => state.unit.loading);

  useEffect(() => {
    if (!data && unitId) {
      dispatch(getEntity(unitId));
    }
  }, [unitId, data, dispatch]);

  const exercises = useMemo(() => data || unit?.exercises || [], [data, unit]);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number | string | number[] }>({});
  const [results, setResults] = useState<{ [key: number]: boolean | null }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Fixed: Proper audio cleanup to prevent memory leaks
  const playAudio = (audioUrl: string | null | undefined) => {
    if (!audioUrl) return;
    if (audioRef.current) audioRef.current.pause();
    audioRef.current = new Audio(audioUrl);
    audioRef.current.play().catch(e => console.error('Error playing audio:', e));
  };

  const handleSingleChoiceSelect = (exerciseId: number, optionId: number) => {
    setUserAnswers({ ...userAnswers, [exerciseId]: optionId });
    resetFeedback(exerciseId);
  };

  const handleMultiChoiceSelect = (exerciseId: number, optionId: number) => {
    const currentSelected = (userAnswers[exerciseId] as number[]) || [];
    let newSelected;
    if (currentSelected.includes(optionId)) {
      newSelected = currentSelected.filter(id => id !== optionId);
    } else {
      newSelected = [...currentSelected, optionId];
    }
    setUserAnswers({ ...userAnswers, [exerciseId]: newSelected });
    resetFeedback(exerciseId);
  };

  const handleTextChange = (exerciseId: number, text: string) => {
    setUserAnswers({ ...userAnswers, [exerciseId]: text });
    resetFeedback(exerciseId);
  };

  const resetFeedback = (exerciseId: number) => {
    if (results[exerciseId] !== null) {
      setResults({ ...results, [exerciseId]: null });
      setShowFeedback(false);
    }
  };

  const handleCheckAnswer = () => {
    const exercise = exercises[currentExerciseIndex];
    if (!exercise || !exercise.id) return;

    const userAnswer = userAnswers[exercise.id];

    if (userAnswer === undefined || userAnswer === '' || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
      toast.warning(translate('langleague.student.learning.exercise.pleaseAnswer'));
      return;
    }

    let isCorrect = false;

    if (exercise.exerciseType === ExerciseType.SINGLE_CHOICE) {
      const selectedOption = exercise.options?.find(opt => opt.id === userAnswer);
      isCorrect = selectedOption?.isCorrect === true;
    } else if (exercise.exerciseType === ExerciseType.MULTI_CHOICE) {
      const selectedIds = (userAnswer as number[]).sort();
      const correctIds =
        exercise.options
          ?.filter(opt => opt.isCorrect)
          .map(opt => opt.id)
          .sort() || [];
      isCorrect = selectedIds.length === correctIds.length && selectedIds.every((value, index) => value === correctIds[index]);
    } else if (exercise.exerciseType === ExerciseType.FILL_IN_BLANK) {
      const normalizedUserAnswer = String(userAnswer).trim().toLowerCase();
      const normalizedCorrectAnswer = (exercise.correctAnswerRaw || '').trim().toLowerCase();
      isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
    }

    setResults({ ...results, [exercise.id]: isCorrect });
    setShowFeedback(true);

    if (isCorrect) {
      toast.success(translate('langleague.student.learning.exercise.correct'));
    } else {
      toast.error(translate('langleague.student.learning.exercise.incorrect'));
    }
  };

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setShowFeedback(false);
    } else {
      // Finished all exercises
      if (onFinish) {
        onFinish();
      }
    }
  };

  const handlePrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setShowFeedback(false);
    }
  };

  const currentExercise = exercises[currentExerciseIndex];
  const isCorrectResult = currentExercise?.id ? results[currentExercise.id] === true : false;

  const getCorrectAnswerText = () => {
    if (!currentExercise) return '';
    if (currentExercise.exerciseType === ExerciseType.SINGLE_CHOICE) {
      const correctOpt = currentExercise.options?.find(opt => opt.isCorrect);
      return correctOpt?.optionText || '';
    } else if (currentExercise.exerciseType === ExerciseType.MULTI_CHOICE) {
      const correctOpts = currentExercise.options?.filter(opt => opt.isCorrect);
      return correctOpts?.map(opt => opt.optionText).join(', ') || '';
    } else {
      return currentExercise.correctAnswerRaw || '';
    }
  };

  const getUserAnswerText = () => {
    if (!currentExercise || !currentExercise.id) return '';
    const answer = userAnswers[currentExercise.id];
    if (currentExercise.exerciseType === ExerciseType.SINGLE_CHOICE) {
      const selectedOpt = currentExercise.options?.find(opt => opt.id === answer);
      return selectedOpt?.optionText || '';
    } else if (currentExercise.exerciseType === ExerciseType.MULTI_CHOICE) {
      const selectedIds = (answer as number[]) || [];
      const selectedOpts = currentExercise.options?.filter(opt => opt.id && selectedIds.includes(opt.id));
      return selectedOpts?.map(opt => opt.optionText).join(', ') || '';
    } else {
      return String(answer || '');
    }
  };

  if (loading && !data) {
    return (
      <div className="p-4 text-center">
        <LoadingSpinner message="langleague.student.learning.exercise.loadingExercises" isI18nKey />
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="exercise-empty">
        <FontAwesomeIcon icon="file-circle-question" size="3x" className="text-muted mb-3" />
        <p>
          <Translate contentKey="langleague.student.learning.exercise.noExercises">No exercises available for this unit</Translate>
        </p>
      </div>
    );
  }

  return (
    <div className="exercise-list">
      {/* Render ONLY the current exercise */}
      {currentExercise && (
        <div key={currentExercise.id} className="exercise-card">
          <div className="exercise-header">
            <span className="exercise-number">
              <Translate contentKey="langleague.student.learning.exercise.defaultTitle">Exercise</Translate> {currentExerciseIndex + 1}{' '}
              <Translate contentKey="langleague.student.learning.exercise.of">of</Translate> {exercises.length}
            </span>
            <span className="exercise-type">{currentExercise.exerciseType}</span>
          </div>

          <div className="exercise-question">
            <h4>{currentExercise.exerciseText}</h4>

            {currentExercise.audioUrl && (
              <button className="audio-btn" onClick={() => playAudio(currentExercise.audioUrl)}>
                <FontAwesomeIcon icon="volume-up" className="me-2" />
                <Translate contentKey="langleague.student.learning.exercise.playAudio">Play Audio</Translate>
              </button>
            )}

            {currentExercise.imageUrl && (
              <div className="exercise-image">
                <img src={currentExercise.imageUrl} alt="Exercise" />
              </div>
            )}
          </div>

          {/* Feedback Alert */}
          {showFeedback && (
            <Alert
              color={isCorrectResult ? 'success' : 'danger'}
              className="mt-3"
              transition={{ timeout: 0, appear: false, enter: false, exit: false }}
            >
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h5 className="alert-heading mb-1">
                    {isCorrectResult ? (
                      <>
                        <FontAwesomeIcon icon="check-circle" className="me-2" />
                        <Translate contentKey="langleague.student.learning.exercise.correctAnswer">Correct!</Translate>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon="times-circle" className="me-2" />
                        <Translate contentKey="langleague.student.learning.exercise.incorrectAnswer">Incorrect</Translate>
                      </>
                    )}
                  </h5>
                  {!isCorrectResult && (
                    <p className="mb-0">
                      <Translate contentKey="langleague.student.learning.exercise.correctAnswerIs">The correct answer is:</Translate>{' '}
                      <strong>{getCorrectAnswerText()}</strong>
                    </p>
                  )}
                </div>
                {!isCorrectResult && (
                  <AiTutorButton
                    questionText={currentExercise.exerciseText || ''}
                    correctAnswer={getCorrectAnswerText()}
                    userContext={getUserAnswerText()}
                  />
                )}
              </div>
            </Alert>
          )}

          {/* Options */}
          {currentExercise.exerciseType === ExerciseType.SINGLE_CHOICE && (
            <div className="exercise-options">
              {(currentExercise.options || []).map(option => {
                const isSelected = currentExercise.id && userAnswers[currentExercise.id] === option.id;
                let optionClass = 'exercise-option';
                if (isSelected) optionClass += ' selected';
                if (showFeedback) {
                  if (isSelected && isCorrectResult) optionClass += ' correct';
                  else if (isSelected && !isCorrectResult) optionClass += ' incorrect';
                  else if (option.isCorrect) optionClass += ' correct-hint';
                }

                return (
                  <div
                    key={option.id}
                    className={optionClass}
                    onClick={() => currentExercise.id && option.id && handleSingleChoiceSelect(currentExercise.id, option.id)}
                  >
                    <span className="option-label">{String.fromCharCode(65 + (currentExercise.options?.indexOf(option) || 0))}</span>
                    <span className="option-text">{option.optionText}</span>
                  </div>
                );
              })}
            </div>
          )}

          {currentExercise.exerciseType === ExerciseType.MULTI_CHOICE && (
            <div className="exercise-options">
              {(currentExercise.options || []).map(option => {
                const selectedIds = (currentExercise.id && (userAnswers[currentExercise.id] as number[])) || [];
                const isSelected = option.id && selectedIds.includes(option.id);
                let optionClass = 'exercise-option';
                if (isSelected) optionClass += ' selected';

                return (
                  <div
                    key={option.id}
                    className={optionClass}
                    onClick={() => currentExercise.id && option.id && handleMultiChoiceSelect(currentExercise.id, option.id)}
                  >
                    <input type="checkbox" checked={isSelected || false} readOnly />
                    <span className="option-text">{option.optionText}</span>
                  </div>
                );
              })}
            </div>
          )}

          {currentExercise.exerciseType === ExerciseType.FILL_IN_BLANK && (
            <div className="fill-blank-input">
              <input
                type="text"
                className="form-control"
                placeholder={translate('langleague.student.learning.exercise.typeAnswer')}
                value={(currentExercise.id && (userAnswers[currentExercise.id] as string)) || ''}
                onChange={e => currentExercise.id && handleTextChange(currentExercise.id, e.target.value)}
              />
            </div>
          )}

          {/* Check Answer Button */}
          {!showFeedback && (
            <div className="exercise-actions">
              <button className="check-btn" onClick={handleCheckAnswer}>
                <Translate contentKey="langleague.student.learning.exercise.checkAnswer">Check Answer</Translate>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      {exercises.length > 0 && (
        <div className="exercise-navigation">
          <button className="nav-btn" onClick={handlePrevious} disabled={currentExerciseIndex === 0}>
            <FontAwesomeIcon icon="arrow-left" className="me-2" />
            <Translate contentKey="langleague.student.learning.exercise.previous">Previous</Translate>
          </button>

          {showFeedback && (
            <button className="nav-btn" onClick={handleNext}>
              {currentExerciseIndex === exercises.length - 1 ? (
                <Translate contentKey="langleague.student.learning.exercise.finish">Finish</Translate>
              ) : (
                <Translate contentKey="langleague.student.learning.exercise.nextQuestion">Next</Translate>
              )}
              <FontAwesomeIcon icon="arrow-right" className="ms-2" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UnitExercise;
