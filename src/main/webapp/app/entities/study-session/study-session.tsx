import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Progress } from 'reactstrap';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { startStudySession, updateProgress, completeStudySession } from 'app/shared/reducers/study-session.reducer';
import { getLesson } from 'app/shared/reducers/lesson.reducer';

export const StudySessionPage = () => {
  const dispatch = useAppDispatch();
  const { lessonId } = useParams<{ lessonId: string }>();
  const currentSession = useAppSelector(state => state.studySession.currentSession);
  const lesson = useAppSelector(state => state.lesson.lesson);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (lessonId) {
      dispatch(getLesson(parseInt(lessonId, 10)));
    }
  }, [lessonId]);

  const handleStartSession = () => {
    if (lessonId) {
      dispatch(startStudySession(parseInt(lessonId, 10)));
    }
  };

  const handleUpdateProgress = (newProgress: number) => {
    if (currentSession?.id) {
      setProgress(newProgress);
      dispatch(
        updateProgress({
          sessionId: currentSession.id,
          progress: {
            progressPercentage: newProgress,
            currentScore: 0,
            isCompleted: newProgress === 100,
          },
        }),
      );
    }
  };

  const handleComplete = () => {
    if (currentSession?.id) {
      dispatch(completeStudySession(currentSession.id));
    }
  };

  return (
    <div className="study-session-container">
      <h2>{lesson?.title}</h2>
      <div className="study-progress">
        <Progress value={progress}>{progress}%</Progress>
      </div>

      <div className="session-controls">
        {!currentSession ? (
          <Button color="primary" onClick={handleStartSession}>
            Start Session
          </Button>
        ) : (
          <>
            <Button color="info" onClick={() => handleUpdateProgress(Math.min(progress + 10, 100))} disabled={progress >= 100}>
              Progress
            </Button>
            <Button color="success" onClick={handleComplete} disabled={progress < 100}>
              Complete
            </Button>
          </>
        )}
      </div>

      {lesson?.description && <div className="lesson-content mt-4">{lesson.description}</div>}
    </div>
  );
};
