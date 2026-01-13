import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, FormText, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getExercises } from 'app/entities/exercise/exercise.reducer';
import { createEntity, getEntity, reset, updateEntity } from './exercise-option.reducer';

export const ExerciseOptionUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const exercises = useAppSelector(state => state.exercise.entities);
  const exerciseOptionEntity = useAppSelector(state => state.exerciseOption.entity);
  const loading = useAppSelector(state => state.exerciseOption.loading);
  const updating = useAppSelector(state => state.exerciseOption.updating);
  const updateSuccess = useAppSelector(state => state.exerciseOption.updateSuccess);

  const handleClose = () => {
    navigate('/exercise-option');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getExercises({}));
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
      ...exerciseOptionEntity,
      ...values,
      exercise: exercises.find(it => it.id.toString() === values.exercise?.toString()),
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
          ...exerciseOptionEntity,
          exercise: exerciseOptionEntity?.exercise?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="langleagueApp.exerciseOption.home.createOrEditLabel" data-cy="ExerciseOptionCreateUpdateHeading">
            <Translate contentKey="langleagueApp.exerciseOption.home.createOrEditLabel">Create or edit a ExerciseOption</Translate>
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
                  id="exercise-option-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('langleagueApp.exerciseOption.optionText')}
                id="exercise-option-optionText"
                name="optionText"
                data-cy="optionText"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('langleagueApp.exerciseOption.isCorrect')}
                id="exercise-option-isCorrect"
                name="isCorrect"
                data-cy="isCorrect"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('langleagueApp.exerciseOption.orderIndex')}
                id="exercise-option-orderIndex"
                name="orderIndex"
                data-cy="orderIndex"
                type="text"
              />
              <ValidatedField
                id="exercise-option-exercise"
                name="exercise"
                data-cy="exercise"
                label={translate('langleagueApp.exerciseOption.exercise')}
                type="select"
                required
              >
                <option value="" key="0" />
                {exercises
                  ? exercises.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <FormText>
                <Translate contentKey="entity.validation.required">This field is required.</Translate>
              </FormText>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/exercise-option" replace color="info">
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

export default ExerciseOptionUpdate;
