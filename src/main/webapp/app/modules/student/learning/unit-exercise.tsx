import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchUnitById } from 'app/shared/reducers/unit.reducer';
import { getExercisesByUnit } from 'app/entities/exercise/exercise.reducer';
import { ExerciseType } from 'app/shared/model/enumerations/exercise-type.model';
import { Translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { Alert } from 'reactstrap';
import AiTutorButton from './components/AiTutorButton';
import './unit-exercise.scss';

export const UnitExercise = () => {
  const dispatch = useAppDispatch();
  const { selectedUnit } = useAppSelector(state => state.unit);
  const exerciseList = useAppSelector(state => state.exercise.entities);
  const loading = useAppSelector(state => state.exercise.loading);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number | string | number[] }>({});
  const [results, setResults] = useState<{ [key: number]: boolean | null }>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (unitId) {
      dispatch(fetchUnitById(unitId));
      dispatch(getExercisesByUnit(Number(unitId)));
    }

    return () => {
      setCurrentExerciseIndex(0);
      setUserAnswers({});
      setResults({});
      setShowFeedback(false);
    };
  }, [dispatch, unitId]);

  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.error('Error playing audio:', e));
    }
  };

  const handleSingleChoiceSelect = (exerciseId: number, optionId: number) => {
    setUserAnswers({
      ...userAnswers,
      [exerciseId]: optionId,
    });
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

    setUserAnswers({
      ...userAnswers,
      [exerciseId]: newSelected,
    });
    resetFeedback(exerciseId);
  };

  const handleTextChange = (exerciseId: number, text: string) => {
    setUserAnswers({
      ...userAnswers,
      [exerciseId]: text,
    });
    resetFeedback(exerciseId);
  };

  const resetFeedback = (exerciseId: number) => {
    if (results[exerciseId] !== null) {
      setResults({
        ...results,
        [exerciseId]: null,
      });
      setShowFeedback(false);
    }
  };

  const handleCheckAnswer = () => {
    const exercise = exerciseList[currentExerciseIndex];
    if (!exercise || !exercise.id) return;

    const userAnswer = userAnswers[exercise.id];

    if (userAnswer === undefined || userAnswer === '' || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
      toast.warning('Please select or type an answer first!');
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

      // Compare arrays
      isCorrect = selectedIds.length === correctIds.length && selectedIds.every((value, index) => value === correctIds[index]);
    } else if (exercise.exerciseType === ExerciseType.FILL_IN_BLANK) {
      const normalizedUserAnswer = String(userAnswer).trim().toLowerCase();
      const normalizedCorrectAnswer = (exercise.correctAnswerRaw || '').trim().toLowerCase();
      isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
    }

    setResults({
      ...results,
      [exercise.id]: isCorrect,
    });
    setShowFeedback(true);

    if (isCorrect) {
      toast.success('Correct!');
    } else {
      toast.error('Incorrect, try again or check the answer.');
    }
  };

  const handleNext = () => {
    if (currentExerciseIndex < exerciseList.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setShowFeedback(false);
    }
  };

  const handlePrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setShowFeedback(false);
    }
  };

  const currentExercise = exerciseList[currentExerciseIndex];
  const currentOptions = currentExercise?.options || [];
  const isCorrectResult = currentExercise?.id ? results[currentExercise.id] === true : false;

  // Helper to get correct answer text for display
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

  // Helper to get user answer text for AI context
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

  return (
    <div className="unit-exercise">
      <div className="exercise-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back to Book List
        </button>
        <div className="header-info">
          <div className="breadcrumb">
            <span>UNIT {selectedUnit?.id} - EXERCISE</span>
          </div>
          <h2>{selectedUnit?.title || 'Exercise'}</h2>
        </div>
      </div>

      <div className="exercise-content">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading exercises...</p>
          </div>
        ) : currentExercise ? (
          <div className="exercise-card">
            <div className="exercise-progress mb-3">
              <div className="d-flex justify-content-between text-muted small mb-1">
                <span>
                  Question {currentExerciseIndex + 1} of {exerciseList.length}
                </span>
                <span>{Math.round(((currentExerciseIndex + 1) / exerciseList.length) * 100)}%</span>
              </div>
              <div className="progress" style={{ height: '6px' }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${((currentExerciseIndex + 1) / exerciseList.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="exercise-question">
              <h3>{currentExercise.exerciseText}</h3>

              {currentExercise.audioUrl && (
                <div className="audio-player">
                  <button className="audio-play-btn" onClick={() => playAudio(currentExercise.audioUrl)}>
                    🔊 Play Audio
                  </button>
                  <audio controls src={currentExercise.audioUrl} className="d-none">
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {currentExercise.imageUrl && (
                <div className="exercise-image">
                  <img src={currentExercise.imageUrl} alt="Exercise" />
                </div>
              )}
            </div>

            {/* Feedback Alert */}
            {showFeedback && (
              <Alert color={isCorrectResult ? 'success' : 'danger'} className="mt-3 mb-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div>
                    <h5 className="alert-heading mb-1">
                      {isCorrectResult ? (
                        <>
                          <i className="bi bi-check-circle-fill"></i> Correct!
                        </>
                      ) : (
                        <>
                          <i className="bi bi-x-circle-fill"></i> Incorrect
                        </>
                      )}
                    </h5>
                    {!isCorrectResult && (
                      <p className="mb-0">
                        The correct answer is: <strong>{getCorrectAnswerText()}</strong>
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

            {currentExercise.exerciseType === ExerciseType.SINGLE_CHOICE && (
              <div className="exercise-options">
                {currentOptions.map(option => {
                  const isSelected = currentExercise.id && userAnswers[currentExercise.id] === option.id;
                  let optionClass = 'option-item';

                  if (isSelected) {
                    optionClass += ' selected';
                    if (showFeedback) {
                      optionClass += isCorrectResult ? ' correct' : ' incorrect';
                    }
                  } else if (showFeedback && !isCorrectResult && option.isCorrect) {
                    optionClass += ' correct-hint';
                  }

                  return (
                    <div
                      key={option.id}
                      className={optionClass}
                      onClick={() =>
                        !showFeedback && currentExercise.id && option.id && handleSingleChoiceSelect(currentExercise.id, option.id)
                      }
                    >
                      <input type="radio" name={`exercise-${currentExercise.id}`} checked={isSelected || false} readOnly />
                      <label>{option.optionText}</label>
                      {isSelected && showFeedback && isCorrectResult && <i className="bi bi-check-circle-fill text-success ms-2"></i>}
                      {isSelected && showFeedback && !isCorrectResult && <i className="bi bi-x-circle-fill text-danger ms-2"></i>}
                    </div>
                  );
                })}
              </div>
            )}

            {currentExercise.exerciseType === ExerciseType.MULTI_CHOICE && (
              <div className="exercise-options">
                <p className="text-muted small mb-2">Select all correct answers:</p>
                {currentOptions.map(option => {
                  const selectedIds = (currentExercise.id && (userAnswers[currentExercise.id] as number[])) || [];
                  const isSelected = option.id && selectedIds.includes(option.id);

                  let optionClass = 'option-item';
                  if (isSelected) {
                    optionClass += ' selected';
                    if (showFeedback) {
                      // For multi-choice, individual option feedback is complex, simplifying to overall result color
                      optionClass += isCorrectResult ? ' correct' : ' incorrect';
                    }
                  }

                  return (
                    <div
                      key={option.id}
                      className={optionClass}
                      onClick={() =>
                        !showFeedback && currentExercise.id && option.id && handleMultiChoiceSelect(currentExercise.id, option.id)
                      }
                    >
                      <input type="checkbox" name={`exercise-${currentExercise.id}`} checked={isSelected || false} readOnly />
                      <label>{option.optionText}</label>
                    </div>
                  );
                })}
              </div>
            )}

            {currentExercise.exerciseType === ExerciseType.FILL_IN_BLANK && (
              <div className="fill-blank-input">
                <input
                  type="text"
                  className={`form-control ${showFeedback ? (isCorrectResult ? 'is-valid' : 'is-invalid') : ''}`}
                  placeholder="Type your answer here..."
                  value={(currentExercise.id && (userAnswers[currentExercise.id] as string)) || ''}
                  onChange={e => {
                    if (currentExercise.id && !showFeedback) {
                      handleTextChange(currentExercise.id, e.target.value);
                    }
                  }}
                  disabled={showFeedback}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <p>
              <Translate contentKey="langleague.student.learning.exercise.noExercises">No exercises added yet for this unit.</Translate>
            </p>
          </div>
        )}

        {exerciseList.length > 0 && (
          <div className="exercise-navigation">
            <button className="nav-btn" onClick={handlePrevious} disabled={currentExerciseIndex === 0}>
              ← <Translate contentKey="langleague.student.learning.vocabulary.navigation.previous">Previous</Translate>
            </button>

            {!showFeedback ? (
              <button className="check-btn" onClick={handleCheckAnswer}>
                Check Answer
              </button>
            ) : (
              <button className="check-btn" onClick={handleNext} disabled={currentExerciseIndex === exerciseList.length - 1}>
                {currentExerciseIndex === exerciseList.length - 1 ? 'Finish' : 'Next Question →'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitExercise;
