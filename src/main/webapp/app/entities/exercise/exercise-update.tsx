import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, FormText, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getUnits } from 'app/entities/unit/unit.reducer';
import { ExerciseType } from 'app/shared/model/enumerations/exercise-type.model';
import { createEntity, getEntity, reset, updateEntity } from './exercise.reducer';

export const ExerciseUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const units = useAppSelector(state => state.unit.entities);
  const exerciseEntity = useAppSelector(state => state.exercise.entity);
  const loading = useAppSelector(state => state.exercise.loading);
  const updating = useAppSelector(state => state.exercise.updating);
  const updateSuccess = useAppSelector(state => state.exercise.updateSuccess);
  const exerciseTypeValues = Object.keys(ExerciseType);

  const handleClose = () => {
    navigate(`/exercise${location.search}`);
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
      ...exerciseEntity,
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
          exerciseType: 'SINGLE_CHOICE',
          ...exerciseEntity,
          unit: exerciseEntity?.unit?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="langleagueApp.exercise.home.createOrEditLabel" data-cy="ExerciseCreateUpdateHeading">
            <Translate contentKey="langleagueApp.exercise.home.createOrEditLabel">Create or edit a Exercise</Translate>
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
                  id="exercise-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('langleagueApp.exercise.exerciseText')}
                id="exercise-exerciseText"
                name="exerciseText"
                data-cy="exerciseText"
                type="textarea"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('langleagueApp.exercise.exerciseType')}
                id="exercise-exerciseType"
                name="exerciseType"
                data-cy="exerciseType"
                type="select"
              >
                {exerciseTypeValues.map(exerciseType => (
                  <option value={exerciseType} key={exerciseType}>
                    {translate(`langleagueApp.ExerciseType.${exerciseType}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('langleagueApp.exercise.correctAnswerRaw')}
                id="exercise-correctAnswerRaw"
                name="correctAnswerRaw"
                data-cy="correctAnswerRaw"
                type="textarea"
              />
              <ValidatedField
                label={translate('langleagueApp.exercise.audioUrl')}
                id="exercise-audioUrl"
                name="audioUrl"
                data-cy="audioUrl"
                type="text"
              />
              <ValidatedField
                label={translate('langleagueApp.exercise.imageUrl')}
                id="exercise-imageUrl"
                name="imageUrl"
                data-cy="imageUrl"
                type="text"
              />
              <ValidatedField
                label={translate('langleagueApp.exercise.orderIndex')}
                id="exercise-orderIndex"
                name="orderIndex"
                data-cy="orderIndex"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                id="exercise-unit"
                name="unit"
                data-cy="unit"
                label={translate('langleagueApp.exercise.unit')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/exercise" replace color="info">
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

export default ExerciseUpdate;
