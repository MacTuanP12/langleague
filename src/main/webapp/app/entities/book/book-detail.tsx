import React, { useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from 'app/entities/book/book.reducer';
import { createEntity as createEnrollment } from 'app/entities/enrollment/enrollment.reducer';
import { EnrollmentStatus } from 'app/shared/model/enumerations/enrollment-status.model';

export const BookDetail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams<'id'>();

  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const account = useAppSelector(state => state.authentication.account);
  const bookEntity = useAppSelector(state => state.book.entity);
  const loading = useAppSelector(state => state.book.loading);

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [id]);

  const handleEnrollment = () => {
    if (!isAuthenticated) {
      // Not logged in: redirect to login, saving the current location
      navigate('/login', { state: { from: location } });
    } else {
      // Logged in: check enrollment and act
      if (bookEntity.isEnrolled) {
        // Already enrolled: go to learning page
        navigate(`/student/learning/book/${bookEntity.id}`);
      } else {
        // Not enrolled: create enrollment
        dispatch(
          createEnrollment({
            book: { id: bookEntity.id },
            userProfile: { id: account.id }, // Assuming userProfile id is same as account id
            enrolledAt: dayjs(),
            status: EnrollmentStatus.ACTIVE,
          }),
        )
          .unwrap()
          .then(() => {
            // After successful enrollment, go to learning page
            navigate(`/student/learning/book/${bookEntity.id}`);
          })
          .catch(err => {
            console.error('Enrollment failed:', err);
            // Optionally, show an error toast or message
          });
      }
    }
  };

  const renderActionButton = () => {
    if (loading) {
      return null; // Don't show button while loading
    }

    if (!isAuthenticated) {
      return (
        <Button color="primary" onClick={handleEnrollment} data-cy="enroll-login-button">
          <Translate contentKey="global.messages.info.authenticated.enroll">Đăng ký khóa học</Translate>
        </Button>
      );
    }

    if (bookEntity.isEnrolled) {
      return (
        <Button color="success" onClick={handleEnrollment} data-cy="study-now-button">
          <Translate contentKey="langleagueApp.book.studyNow">Học ngay</Translate>
        </Button>
      );
    }

    return (
      <Button color="primary" onClick={handleEnrollment} data-cy="enroll-now-button">
        <Translate contentKey="langleagueApp.book.enrollNow">Đăng ký khóa học</Translate>
      </Button>
    );
  };

  if (!bookEntity) {
    return null;
  }

  return (
    <Row>
      <Col md="8">
        <h2 data-cy="bookDetailsHeading">{bookEntity.title}</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="description">
              <Translate contentKey="langleagueApp.book.description">Description</Translate>
            </span>
          </dt>
          <dd>{bookEntity.description}</dd>
          <dt>
            <Translate contentKey="langleagueApp.book.teacherProfile">Teacher</Translate>
          </dt>
          <dd>
            {bookEntity.teacherProfile ? `${bookEntity.teacherProfile.user.firstName} ${bookEntity.teacherProfile.user.lastName}` : ''}
          </dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="langleagueApp.book.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{bookEntity.createdAt ? <TextFormat value={bookEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
        </dl>

        {renderActionButton()}

        <Button tag={Link} to="/book" replace color="info" data-cy="entityDetailsBackButton" className="ms-2">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
      </Col>
      <Col md="4">
        <img src={bookEntity.coverImageUrl} alt={bookEntity.title} style={{ width: '100%', borderRadius: '8px' }} />
      </Col>
    </Row>
  );
};

export default BookDetail;
