import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { fetchGrammarsByUnitId } from 'app/shared/reducers/grammar.reducer';
import { fetchUnitById } from 'app/shared/reducers/unit.reducer';
import { UnitGrammar } from './unit-grammar';
import { LessonSkeleton } from 'app/shared/components';
import './unit-grammar.scss';
/**
 * Standalone Grammar Page - Wraps UnitGrammar component with data fetching
 */
export const UnitGrammarPage = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const grammars = useAppSelector(state => state.grammar.grammars);
  const loading = useAppSelector(state => state.grammar.loading);
  const unit = useAppSelector(state => state.unit.selectedUnit);
  useEffect(() => {
    if (unitId) {
      const id = Number(unitId);
      dispatch(fetchGrammarsByUnitId(id));
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
    <div className="page-unit-grammar-wrapper">
      <div className="unit-grammar-page">
        <div className="grammar-page-header">
          <Button onClick={handleBack} className="back-btn">
            <FontAwesomeIcon icon="arrow-left" className="me-2" />
            <Translate contentKey="entity.action.back">Back</Translate>
          </Button>
          <div className="header-info">
            <div className="breadcrumb">
              <Translate contentKey="langleague.student.grammar.title">Grammar</Translate>
            </div>
            <h2>{unit?.title || 'Unit Grammar'}</h2>
          </div>
        </div>
        <div className="grammar-content">
          {grammars && grammars.length > 0 ? (
            <UnitGrammar data={grammars} />
          ) : (
            <div className="empty-state">
              <p>
                <Translate contentKey="langleague.student.grammar.noGrammar">No grammar lessons available for this unit</Translate>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default UnitGrammarPage;
