import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './enrollment.reducer';

export const EnrollmentDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const enrollmentEntity = useAppSelector(state => state.enrollment.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="enrollmentDetailsHeading">
          <Translate contentKey="langleagueApp.enrollment.detail.title">Enrollment</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{enrollmentEntity.id}</dd>
          <dt>
            <span id="enrolledAt">
              <Translate contentKey="langleagueApp.enrollment.enrolledAt">Enrolled At</Translate>
            </span>
          </dt>
          <dd>
            {enrollmentEntity.enrolledAt ? <TextFormat value={enrollmentEntity.enrolledAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="status">
              <Translate contentKey="langleagueApp.enrollment.status">Status</Translate>
            </span>
          </dt>
          <dd>{enrollmentEntity.status}</dd>
          <dt>
            <Translate contentKey="langleagueApp.enrollment.userProfile">User Profile</Translate>
          </dt>
          <dd>{enrollmentEntity.userProfile ? enrollmentEntity.userProfile.id : ''}</dd>
          <dt>
            <Translate contentKey="langleagueApp.enrollment.book">Book</Translate>
          </dt>
          <dd>{enrollmentEntity.book ? enrollmentEntity.book.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/enrollment" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/enrollment/${enrollmentEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default EnrollmentDetail;
