import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, FormText, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getUnits } from 'app/entities/unit/unit.reducer';
import { createEntity, getEntity, reset, updateEntity } from './vocabulary.reducer';

export const VocabularyUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const units = useAppSelector(state => state.unit.entities);
  const vocabularyEntity = useAppSelector(state => state.vocabulary.entity);
  const loading = useAppSelector(state => state.vocabulary.loading);
  const updating = useAppSelector(state => state.vocabulary.updating);
  const updateSuccess = useAppSelector(state => state.vocabulary.updateSuccess);

  const handleClose = () => {
    navigate(`/vocabulary${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getUnits({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    if (values.orderIndex !== undefined && typeof values.orderIndex !== 'number') {
      values.orderIndex = Number(values.orderIndex);
    }

    const entity = {
      ...vocabularyEntity,
      ...values,
      unit: units.find(it => it.id.toString() === values.unit?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...vocabularyEntity,
          unit: vocabularyEntity?.unit?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="langleagueApp.vocabulary.home.createOrEditLabel" data-cy="VocabularyCreateUpdateHeading">
            <Translate contentKey="langleagueApp.vocabulary.home.createOrEditLabel">Create or edit a Vocabulary</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="vocabulary-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('langleagueApp.vocabulary.word')}
                id="vocabulary-word"
                name="word"
                data-cy="word"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('langleagueApp.vocabulary.phonetic')}
                id="vocabulary-phonetic"
                name="phonetic"
                data-cy="phonetic"
                type="text"
              />
              <ValidatedField
                label={translate('langleagueApp.vocabulary.meaning')}
                id="vocabulary-meaning"
                name="meaning"
                data-cy="meaning"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('langleagueApp.vocabulary.example')}
                id="vocabulary-example"
                name="example"
                data-cy="example"
                type="textarea"
              />
              <ValidatedField
                label={translate('langleagueApp.vocabulary.imageUrl')}
                id="vocabulary-imageUrl"
                name="imageUrl"
                data-cy="imageUrl"
                type="text"
              />
              <ValidatedField
                label={translate('langleagueApp.vocabulary.orderIndex')}
                id="vocabulary-orderIndex"
                name="orderIndex"
                data-cy="orderIndex"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                id="vocabulary-unit"
                name="unit"
                data-cy="unit"
                label={translate('langleagueApp.vocabulary.unit')}
                type="select"
                required
              >
                <option value="" key="0" />
                {units
                  ? units.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <FormText>
                <Translate contentKey="entity.validation.required">This field is required.</Translate>
              </FormText>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/vocabulary" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default VocabularyUpdate;
