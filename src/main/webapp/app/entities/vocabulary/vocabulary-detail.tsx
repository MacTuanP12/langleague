import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './vocabulary.reducer';

export const VocabularyDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const vocabularyEntity = useAppSelector(state => state.vocabulary.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="vocabularyDetailsHeading">
          <Translate contentKey="langleagueApp.vocabulary.detail.title">Vocabulary</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{vocabularyEntity.id}</dd>
          <dt>
            <span id="word">
              <Translate contentKey="langleagueApp.vocabulary.word">Word</Translate>
            </span>
          </dt>
          <dd>{vocabularyEntity.word}</dd>
          <dt>
            <span id="phonetic">
              <Translate contentKey="langleagueApp.vocabulary.phonetic">Phonetic</Translate>
            </span>
          </dt>
          <dd>{vocabularyEntity.phonetic}</dd>
          <dt>
            <span id="meaning">
              <Translate contentKey="langleagueApp.vocabulary.meaning">Meaning</Translate>
            </span>
          </dt>
          <dd>{vocabularyEntity.meaning}</dd>
          <dt>
            <span id="example">
              <Translate contentKey="langleagueApp.vocabulary.example">Example</Translate>
            </span>
          </dt>
          <dd>{vocabularyEntity.example}</dd>
          <dt>
            <span id="imageUrl">
              <Translate contentKey="langleagueApp.vocabulary.imageUrl">Image Url</Translate>
            </span>
          </dt>
          <dd>{vocabularyEntity.imageUrl}</dd>
          <dt>
            <span id="orderIndex">
              <Translate contentKey="langleagueApp.vocabulary.orderIndex">Order Index</Translate>
            </span>
          </dt>
          <dd>{vocabularyEntity.orderIndex}</dd>
          <dt>
            <Translate contentKey="langleagueApp.vocabulary.unit">Unit</Translate>
          </dt>
          <dd>{vocabularyEntity.unit ? vocabularyEntity.unit.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/vocabulary" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/vocabulary/${vocabularyEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default VocabularyDetail;
