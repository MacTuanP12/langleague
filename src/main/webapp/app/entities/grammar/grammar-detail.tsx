import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './grammar.reducer';

export const GrammarDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const grammarEntity = useAppSelector(state => state.grammar.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="grammarDetailsHeading">
          <Translate contentKey="langleagueApp.grammar.detail.title">Grammar</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{grammarEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="langleagueApp.grammar.title">Title</Translate>
            </span>
          </dt>
          <dd>{grammarEntity.title}</dd>
          <dt>
            <span id="contentMarkdown">
              <Translate contentKey="langleagueApp.grammar.contentMarkdown">Content Markdown</Translate>
            </span>
          </dt>
          <dd>{grammarEntity.contentMarkdown}</dd>
          <dt>
            <span id="exampleUsage">
              <Translate contentKey="langleagueApp.grammar.exampleUsage">Example Usage</Translate>
            </span>
          </dt>
          <dd>{grammarEntity.exampleUsage}</dd>
          <dt>
            <span id="orderIndex">
              <Translate contentKey="langleagueApp.grammar.orderIndex">Order Index</Translate>
            </span>
          </dt>
          <dd>{grammarEntity.orderIndex}</dd>
          <dt>
            <Translate contentKey="langleagueApp.grammar.unit">Unit</Translate>
          </dt>
          <dd>{grammarEntity.unit ? grammarEntity.unit.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/grammar" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/grammar/${grammarEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default GrammarDetail;
