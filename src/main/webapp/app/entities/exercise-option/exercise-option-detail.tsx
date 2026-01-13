import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './exercise-option.reducer';

export const ExerciseOptionDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const exerciseOptionEntity = useAppSelector(state => state.exerciseOption.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="exerciseOptionDetailsHeading">
          <Translate contentKey="langleagueApp.exerciseOption.detail.title">ExerciseOption</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{exerciseOptionEntity.id}</dd>
          <dt>
            <span id="optionText">
              <Translate contentKey="langleagueApp.exerciseOption.optionText">Option Text</Translate>
            </span>
          </dt>
          <dd>{exerciseOptionEntity.optionText}</dd>
          <dt>
            <span id="isCorrect">
              <Translate contentKey="langleagueApp.exerciseOption.isCorrect">Is Correct</Translate>
            </span>
          </dt>
          <dd>{exerciseOptionEntity.isCorrect ? 'true' : 'false'}</dd>
          <dt>
            <span id="orderIndex">
              <Translate contentKey="langleagueApp.exerciseOption.orderIndex">Order Index</Translate>
            </span>
          </dt>
          <dd>{exerciseOptionEntity.orderIndex}</dd>
          <dt>
            <Translate contentKey="langleagueApp.exerciseOption.exercise">Exercise</Translate>
          </dt>
          <dd>{exerciseOptionEntity.exercise ? exerciseOptionEntity.exercise.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/exercise-option" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/exercise-option/${exerciseOptionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ExerciseOptionDetail;
