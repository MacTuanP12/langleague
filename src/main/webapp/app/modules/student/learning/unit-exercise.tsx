import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IUnit } from 'app/shared/model/unit.model';
import { IExercise } from 'app/shared/model/exercise.model';
import { ExerciseType } from 'app/shared/model';

export const UnitExercise = () => {
  const [unit, setUnit] = useState<IUnit | null>(null);
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (unitId) {
      loadUnit();
      loadExercises();
    }
  }, [unitId]);

  const loadUnit = async () => {
    try {
      const response = await axios.get<IUnit>(`/api/units/${unitId}`);
      setUnit(response.data);
    } catch (error) {
      console.error('Error loading unit:', error);
    }
  };

  const loadExercises = async () => {
    try {
      const response = await axios.get<IExercise[]>(`/api/units/${unitId}/exercises`);
      setExercises(response.data);
    } catch (error) {
      console.error('Error loading exercises:', error);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleAnswerSelect = (exerciseId: number, answer: string) => {
    setUserAnswers({
      ...userAnswers,
      [exerciseId]: answer,
    });
  };

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <div className="unit-exercise">
      <div className="exercise-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back to Book List
        </button>
        <div className="header-info">
          <div className="breadcrumb">
            <span>UNIT 1 - EXERCISE</span>
          </div>
          <h2>{unit?.title || 'Exercise'}</h2>
        </div>
      </div>

      <div className="exercise-content">
        {currentExercise && (
          <div className="exercise-card">
            <div className="exercise-question">
              <h3>{currentExercise.exerciseText}</h3>

              {currentExercise.audioUrl && (
                <div className="audio-player">
                  <button className="audio-play-btn" onClick={() => playAudio(currentExercise.audioUrl)}>
                    🔊 Play Audio
                  </button>
                  <audio controls src={currentExercise.audioUrl}>
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

            {String(currentExercise.exerciseType) === 'SINGLE_CHOICE' && (
              <div className="exercise-options">
                <p>Select one answer:</p>
                {/* Options will be loaded from ExerciseOption entity */}
              </div>
            )}

            {String(currentExercise.exerciseType) === 'MULTI_CHOICE' && (
              <div className="exercise-options">
                <p>Select all correct answers:</p>
                {/* Options will be loaded from ExerciseOption entity */}
              </div>
            )}

            {currentExercise.exerciseType === ExerciseType.FILL_IN_BLANK && (
              <div className="fill-blank-input">
                <input
                  type="text"
                  placeholder="Type your answer here..."
                  value={userAnswers[currentExercise.id] || ''}
                  onChange={e => handleAnswerSelect(currentExercise.id, e.target.value)}
                />
                <small>Correct answer: {currentExercise.correctAnswerRaw}</small>
              </div>
            )}
          </div>
        )}

        {exercises.length === 0 && (
          <div className="empty-state">
            <p>No exercises added yet for this unit.</p>
          </div>
        )}

        {exercises.length > 0 && (
          <div className="exercise-navigation">
            <button
              className="nav-btn"
              onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
              disabled={currentExerciseIndex === 0}
            >
              ← Previous
            </button>
            <span className="exercise-counter">
              {currentExerciseIndex + 1} / {exercises.length}
            </span>
            <button
              className="nav-btn"
              onClick={() => setCurrentExerciseIndex(Math.min(exercises.length - 1, currentExerciseIndex + 1))}
              disabled={currentExerciseIndex === exercises.length - 1}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitExercise;
