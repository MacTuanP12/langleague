import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './exercise.reducer';

export const ExerciseDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const exerciseEntity = useAppSelector(state => state.exercise.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="exerciseDetailsHeading">
          <Translate contentKey="langleagueApp.exercise.detail.title">Exercise</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{exerciseEntity.id}</dd>
          <dt>
            <span id="exerciseText">
              <Translate contentKey="langleagueApp.exercise.exerciseText">Exercise Text</Translate>
            </span>
          </dt>
          <dd>{exerciseEntity.exerciseText}</dd>
          <dt>
            <span id="exerciseType">
              <Translate contentKey="langleagueApp.exercise.exerciseType">Exercise Type</Translate>
            </span>
          </dt>
          <dd>{exerciseEntity.exerciseType}</dd>
          <dt>
            <span id="correctAnswerRaw">
              <Translate contentKey="langleagueApp.exercise.correctAnswerRaw">Correct Answer Raw</Translate>
            </span>
          </dt>
          <dd>{exerciseEntity.correctAnswerRaw}</dd>
          <dt>
            <span id="audioUrl">
              <Translate contentKey="langleagueApp.exercise.audioUrl">Audio Url</Translate>
            </span>
          </dt>
          <dd>{exerciseEntity.audioUrl}</dd>
          <dt>
            <span id="imageUrl">
              <Translate contentKey="langleagueApp.exercise.imageUrl">Image Url</Translate>
            </span>
          </dt>
          <dd>{exerciseEntity.imageUrl}</dd>
          <dt>
            <span id="orderIndex">
              <Translate contentKey="langleagueApp.exercise.orderIndex">Order Index</Translate>
            </span>
          </dt>
          <dd>{exerciseEntity.orderIndex}</dd>
          <dt>
            <Translate contentKey="langleagueApp.exercise.unit">Unit</Translate>
          </dt>
          <dd>{exerciseEntity.unit ? exerciseEntity.unit.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/exercise" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/exercise/${exerciseEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ExerciseDetail;
