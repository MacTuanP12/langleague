import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './unit.reducer';
import AIImportAssistant from 'app/modules/teacher/import/ai-import-assistant';
import { fetchExercisesByUnitId } from 'app/shared/reducers/exercise.reducer';
import { fetchVocabulariesByUnitId } from 'app/shared/reducers/vocabulary.reducer';
import { fetchGrammarsByUnitId } from 'app/shared/reducers/grammar.reducer';
import 'app/modules/teacher/import/ai-import-assistant.scss';

export const UnitDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const unitEntity = useAppSelector(state => state.unit.entity);

  const handleImportSuccess = () => {
    if (unitEntity.id) {
      dispatch(fetchExercisesByUnitId(unitEntity.id));
      dispatch(fetchVocabulariesByUnitId(unitEntity.id));
      dispatch(fetchGrammarsByUnitId(unitEntity.id));
    }
  };

  return (
    <Row>
      <Col md="8">
        <h2 data-cy="unitDetailsHeading">
          <Translate contentKey="langleagueApp.unit.detail.title">Unit</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{unitEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="langleagueApp.unit.title">Title</Translate>
            </span>
          </dt>
          <dd>{unitEntity.title}</dd>
          <dt>
            <span id="orderIndex">
              <Translate contentKey="langleagueApp.unit.orderIndex">Order Index</Translate>
            </span>
          </dt>
          <dd>{unitEntity.orderIndex}</dd>
          <dt>
            <span id="summary">
              <Translate contentKey="langleagueApp.unit.summary">Summary</Translate>
            </span>
          </dt>
          <dd>{unitEntity.summary}</dd>
          <dt>
            <Translate contentKey="langleagueApp.unit.book">Book</Translate>
          </dt>
          <dd>{unitEntity.book ? unitEntity.book.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/unit" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/unit/${unitEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
      {unitEntity.id && <AIImportAssistant unitId={String(unitEntity.id)} onSuccess={handleImportSuccess} />}
    </Row>
  );
};

export default UnitDetail;
