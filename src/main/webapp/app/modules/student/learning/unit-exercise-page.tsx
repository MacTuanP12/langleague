import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchExercisesByUnitId } from 'app/shared/reducers/exercise.reducer';
import { fetchUnitById } from 'app/shared/reducers/unit.reducer';
import { UnitExercise } from './unit-exercise';
import { LessonSkeleton } from 'app/shared/components';
import './unit-exercise.scss';
/**
 * Standalone Exercise Page - Wraps UnitExercise component with data fetching
 */
export const UnitExercisePage = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const exercises = useAppSelector(state => state.exercise.exercises);
  const loading = useAppSelector(state => state.exercise.loading);
  const unit = useAppSelector(state => state.unit.selectedUnit);
  useEffect(() => {
    if (unitId) {
      const id = Number(unitId);
      dispatch(fetchExercisesByUnitId(id));
      dispatch(fetchUnitById(id));
    }
  }, [unitId, dispatch]);
  const handleBack = () => {
    navigate(-1);
  };
  if (loading) {
    return (
      <Container className="py-4">
        <LessonSkeleton />
      </Container>
    );
  }
  return (
    <div className="unit-exercise">
      <div className="exercise-header">
        <Button onClick={handleBack} className="back-btn">
          <FontAwesomeIcon icon="arrow-left" className="me-2" />
          <Translate contentKey="entity.action.back">Back</Translate>
        </Button>
        <div className="header-info">
          <div className="breadcrumb">
            <Translate contentKey="langleague.student.exercise.title">Exercises</Translate>
          </div>
          <h2>{unit?.title || 'Unit Exercises'}</h2>
        </div>
      </div>
      <div className="exercise-content">
        {exercises && exercises.length > 0 ? (
          <UnitExercise data={exercises} />
        ) : (
          <div className="empty-state">
            <p>
              <Translate contentKey="langleague.student.exercise.noExercises">No exercises available for this unit</Translate>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default UnitExercisePage;
