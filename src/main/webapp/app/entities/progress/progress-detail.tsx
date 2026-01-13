import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './progress.reducer';

export const ProgressDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const progressEntity = useAppSelector(state => state.progress.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="progressDetailsHeading">
          <Translate contentKey="langleagueApp.progress.detail.title">Progress</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{progressEntity.id}</dd>
          <dt>
            <span id="isCompleted">
              <Translate contentKey="langleagueApp.progress.isCompleted">Is Completed</Translate>
            </span>
          </dt>
          <dd>{progressEntity.isCompleted ? 'true' : 'false'}</dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="langleagueApp.progress.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>{progressEntity.updatedAt ? <TextFormat value={progressEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="langleagueApp.progress.userProfile">User Profile</Translate>
          </dt>
          <dd>{progressEntity.userProfile ? progressEntity.userProfile.id : ''}</dd>
          <dt>
            <Translate contentKey="langleagueApp.progress.unit">Unit</Translate>
          </dt>
          <dd>{progressEntity.unit ? progressEntity.unit.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/progress" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/progress/${progressEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ProgressDetail;
