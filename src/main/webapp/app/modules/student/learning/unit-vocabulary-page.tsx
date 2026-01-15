import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchVocabulariesByUnitId } from 'app/shared/reducers/vocabulary.reducer';
import { fetchUnitById } from 'app/shared/reducers/unit.reducer';
import { UnitVocabulary } from './unit-vocabulary';
import { LessonSkeleton } from 'app/shared/components';
import './unit-vocabulary.scss';
/**
 * Standalone Vocabulary Page - Wraps UnitVocabulary component with data fetching
 */
export const UnitVocabularyPage = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const vocabularies = useAppSelector(state => state.vocabulary.vocabularies);
  const loading = useAppSelector(state => state.vocabulary.loading);
  const unit = useAppSelector(state => state.unit.selectedUnit);
  useEffect(() => {
    if (unitId) {
      const id = Number(unitId);
      dispatch(fetchVocabulariesByUnitId(id));
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
    <div className="unit-vocabulary-page">
      <div className="vocabulary-page-header">
        <Button onClick={handleBack} className="back-btn">
          <FontAwesomeIcon icon="arrow-left" className="me-2" />
          <Translate contentKey="entity.action.back">Back</Translate>
        </Button>
        <div className="header-info">
          <div className="breadcrumb">
            <Translate contentKey="langleague.student.vocabulary.title">Vocabulary</Translate>
          </div>
          <h2>{unit?.title || 'Unit Vocabulary'}</h2>
        </div>
      </div>
      <div className="vocabulary-content">
        {vocabularies && vocabularies.length > 0 ? (
          <UnitVocabulary data={vocabularies} />
        ) : (
          <div className="empty-state">
            <p>
              <Translate contentKey="langleague.student.vocabulary.noVocabulary">No vocabulary available for this unit</Translate>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default UnitVocabularyPage;
