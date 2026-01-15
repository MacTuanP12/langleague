import React, { useState, useEffect, useRef } from 'react';
import { ExerciseType } from 'app/shared/model/enumerations/exercise-type.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IExercise } from 'app/shared/model/exercise.model';
import './unit-exercise-widget.scss';

interface UnitExerciseProps {
  data: IExercise[];
}

export const UnitExercise: React.FC<UnitExerciseProps> = ({ data }) => {
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number | string | number[] }>({});
  const [checkedExercises, setCheckedExercises] = useState<{ [key: number]: boolean }>({});
  const [results, setResults] = useState<{ [key: number]: boolean | null }>({});
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

  // Audio playback
  const playAudio = (audioUrl: string | null | undefined) => {
    if (!audioUrl) return;
    if (audioRef.current) audioRef.current.pause();
    audioRef.current = new Audio(audioUrl);
    audioRef.current.play().catch(e => console.error('Error playing audio:', e));
  };

  // Handle option selection (single choice)
  const handleSelectOption = (exerciseId: number, optionId: number) => {
    setUserAnswers({ ...userAnswers, [exerciseId]: optionId });
    // Reset check status when changing answer
    if (checkedExercises[exerciseId]) {
      setCheckedExercises({ ...checkedExercises, [exerciseId]: false });
      setResults({ ...results, [exerciseId]: null });
    }
  };

  // Handle multi-choice selection
  const handleMultiChoiceSelect = (exerciseId: number, optionId: number) => {
    const currentSelected = (userAnswers[exerciseId] as number[]) || [];
    let newSelected;
    if (currentSelected.includes(optionId)) {
      newSelected = currentSelected.filter(id => id !== optionId);
    } else {
      newSelected = [...currentSelected, optionId];
    }
    setUserAnswers({ ...userAnswers, [exerciseId]: newSelected });
    // Reset check status
    if (checkedExercises[exerciseId]) {
      setCheckedExercises({ ...checkedExercises, [exerciseId]: false });
      setResults({ ...results, [exerciseId]: null });
    }
  };

  // Handle text input
  const handleTextChange = (exerciseId: number, text: string) => {
    setUserAnswers({ ...userAnswers, [exerciseId]: text });
    // Reset check status
    if (checkedExercises[exerciseId]) {
      setCheckedExercises({ ...checkedExercises, [exerciseId]: false });
      setResults({ ...results, [exerciseId]: null });
    }
  };

  // Check answer for specific exercise
  const handleCheckAnswer = (exerciseId: number) => {
    const exercise = data.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const userAnswer = userAnswers[exerciseId];

    // Validate answer exists
    if (userAnswer === undefined || userAnswer === '' || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
      return;
    }

    let isCorrect = false;

    // Check answer based on exercise type
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

    setResults({ ...results, [exerciseId]: isCorrect });
    setCheckedExercises({ ...checkedExercises, [exerciseId]: true });
  };

  // Get option class based on state
  const getOptionClass = (exercise: IExercise, optionId: number | undefined, isSelected: boolean) => {
    if (!exercise.id || !optionId) return 'exercise-option';

    const isChecked = checkedExercises[exercise.id];
    const result = results[exercise.id];
    const option = exercise.options?.find(opt => opt.id === optionId);

    let className = 'exercise-option';

    if (isSelected) {
      className += ' selected';
    }

    if (isChecked) {
      if (isSelected && result === true) {
        className += ' correct';
      } else if (isSelected && result === false) {
        className += ' incorrect';
      } else if (option?.isCorrect) {
        className += ' correct-hint';
      }
    }

    return className;
  };

  if (data.length === 0) {
    return (
      <div className="exercise-empty">
        <FontAwesomeIcon icon="file-circle-question" size="3x" />
        <p>No exercises available</p>
      </div>
    );
  }

  return (
    <div className="exercise-widget">
      {data.map((exercise, index) => {
        const isChecked = exercise.id ? checkedExercises[exercise.id] : false;
        const result = exercise.id ? results[exercise.id] : null;
        const hasAnswer = exercise.id ? userAnswers[exercise.id] !== undefined : false;

        return (
          <div key={exercise.id} className="exercise-card">
            {/* Exercise Header */}
            <div className="exercise-header">
              <span className="exercise-number">Question {index + 1}</span>
              {exercise.exerciseType && <span className="exercise-type">{exercise.exerciseType}</span>}
            </div>

            {/* Question */}
            <div className="exercise-question">
              <h4>{exercise.exerciseText}</h4>

              {/* Audio */}
              {exercise.audioUrl && (
                <button className="audio-btn" onClick={() => playAudio(exercise.audioUrl)} type="button">
                  <FontAwesomeIcon icon="volume-up" />
                  <span>Play Audio</span>
                </button>
              )}

              {/* Image */}
              {exercise.imageUrl && (
                <div className="exercise-image">
                  <img src={exercise.imageUrl} alt="Exercise" />
                </div>
              )}
            </div>

            {/* Single Choice Options */}
            {exercise.exerciseType === ExerciseType.SINGLE_CHOICE && (
              <div className="exercise-options">
                {(exercise.options || []).map((option, optIndex) => {
                  const isSelected = exercise.id && userAnswers[exercise.id] === option.id;
                  const optionClass = getOptionClass(exercise, option.id, isSelected || false);

                  return (
                    <div
                      key={option.id}
                      className={optionClass}
                      onClick={() => !isChecked && exercise.id && option.id && handleSelectOption(exercise.id, option.id)}
                    >
                      <span className="option-label">{String.fromCharCode(65 + optIndex)}</span>
                      <span className="option-text">{option.optionText}</span>
                      {isChecked && option.isCorrect && <FontAwesomeIcon icon="check-circle" className="option-icon correct-icon" />}
                      {isChecked && isSelected && !option.isCorrect && (
                        <FontAwesomeIcon icon="times-circle" className="option-icon incorrect-icon" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Multi Choice Options */}
            {exercise.exerciseType === ExerciseType.MULTI_CHOICE && (
              <div className="exercise-options">
                {(exercise.options || []).map((option, optIndex) => {
                  const selectedIds = (exercise.id && (userAnswers[exercise.id] as number[])) || [];
                  const isSelected = option.id && selectedIds.includes(option.id);
                  const optionClass = getOptionClass(exercise, option.id, isSelected || false);

                  return (
                    <div
                      key={option.id}
                      className={optionClass}
                      onClick={() => !isChecked && exercise.id && option.id && handleMultiChoiceSelect(exercise.id, option.id)}
                    >
                      <input type="checkbox" checked={isSelected || false} readOnly />
                      <span className="option-text">{option.optionText}</span>
                      {isChecked && option.isCorrect && <FontAwesomeIcon icon="check-circle" className="option-icon correct-icon" />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Fill in Blank */}
            {exercise.exerciseType === ExerciseType.FILL_IN_BLANK && (
              <div className="fill-blank-input">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your answer"
                  value={(exercise.id && (userAnswers[exercise.id] as string)) || ''}
                  onChange={e => exercise.id && handleTextChange(exercise.id, e.target.value)}
                  disabled={isChecked}
                />
              </div>
            )}

            {/* Feedback */}
            {isChecked && (
              <div className={`exercise-feedback ${result ? 'feedback-correct' : 'feedback-incorrect'}`}>
                <FontAwesomeIcon icon={result ? 'check-circle' : 'times-circle'} />
                <span>{result ? 'Correct!' : 'Try again'}</span>
              </div>
            )}

            {/* Check Button */}
            {!isChecked && (
              <div className="exercise-actions">
                <button
                  className="check-btn"
                  onClick={() => exercise.id && handleCheckAnswer(exercise.id)}
                  disabled={!hasAnswer}
                  type="button"
                >
                  <FontAwesomeIcon icon="check" />
                  <span>Check Answer</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UnitExercise;
