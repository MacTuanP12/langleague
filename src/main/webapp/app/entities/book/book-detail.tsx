import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { fetchBookById } from 'app/shared/reducers/book.reducer';

export const BookDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(Number(id)));
    }
  }, [id]);

  const bookEntity = useAppSelector(state => state.book.selectedBook);

  if (!bookEntity) {
    return null;
  }

  return (
    <Row>
      <Col md="8">
        <h2 data-cy="bookDetailsHeading">
          <Translate contentKey="langleagueApp.book.detail.title">Book</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{bookEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="langleagueApp.book.title">Title</Translate>
            </span>
          </dt>
          <dd>{bookEntity.title}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="langleagueApp.book.description">Description</Translate>
            </span>
          </dt>
          <dd>{bookEntity.description}</dd>
          <dt>
            <span id="coverImageUrl">
              <Translate contentKey="langleagueApp.book.coverImageUrl">Cover Image Url</Translate>
            </span>
          </dt>
          <dd>{bookEntity.coverImageUrl}</dd>
          <dt>
            <span id="isPublic">
              <Translate contentKey="langleagueApp.book.isPublic">Is Public</Translate>
            </span>
          </dt>
          <dd>{bookEntity.isPublic ? 'true' : 'false'}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="langleagueApp.book.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{bookEntity.createdAt ? <TextFormat value={bookEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="langleagueApp.book.teacherProfile">Teacher Profile</Translate>
          </dt>
          <dd>{bookEntity.teacherProfile ? bookEntity.teacherProfile.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/book" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/book/${bookEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default BookDetail;
