import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, FormText, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getUsersAsAdmin } from 'app/modules/admin/user-management/user-management.reducer';
import { ThemeMode } from 'app/shared/model/enumerations/theme-mode.model';
import { createEntity, getEntity, reset, updateEntity } from './user-profile.reducer';

export const UserProfileUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const users = useAppSelector(state => state.userManagement.users);
  const userProfileEntity = useAppSelector(state => state.userProfile.entity);
  const loading = useAppSelector(state => state.userProfile.loading);
  const updating = useAppSelector(state => state.userProfile.updating);
  const updateSuccess = useAppSelector(state => state.userProfile.updateSuccess);
  const themeModeValues = Object.keys(ThemeMode);

  const handleClose = () => {
    navigate('/user-profile');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getUsersAsAdmin({}));
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
    if (values.streakCount !== undefined && typeof values.streakCount !== 'number') {
      values.streakCount = Number(values.streakCount);
    }
    values.lastLearningDate = convertDateTimeToServer(values.lastLearningDate);

    const entity = {
      ...userProfileEntity,
      ...values,
      user: users.find(it => it.id.toString() === values.user?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          lastLearningDate: displayDefaultDateTime(),
        }
      : {
          theme: 'LIGHT',
          ...userProfileEntity,
          lastLearningDate: convertDateTimeFromServer(userProfileEntity.lastLearningDate),
          user: userProfileEntity?.user?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="langleagueApp.userProfile.home.createOrEditLabel" data-cy="UserProfileCreateUpdateHeading">
            <Translate contentKey="langleagueApp.userProfile.home.createOrEditLabel">Create or edit a UserProfile</Translate>
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
                  id="user-profile-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('langleagueApp.userProfile.streakCount')}
                id="user-profile-streakCount"
                name="streakCount"
                data-cy="streakCount"
                type="text"
              />
              <ValidatedField
                label={translate('langleagueApp.userProfile.lastLearningDate')}
                id="user-profile-lastLearningDate"
                name="lastLearningDate"
                data-cy="lastLearningDate"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('langleagueApp.userProfile.bio')}
                id="user-profile-bio"
                name="bio"
                data-cy="bio"
                type="textarea"
              />
              <ValidatedField
                label={translate('langleagueApp.userProfile.theme')}
                id="user-profile-theme"
                name="theme"
                data-cy="theme"
                type="select"
              >
                {themeModeValues.map(themeMode => (
                  <option value={themeMode} key={themeMode}>
                    {translate(`langleagueApp.ThemeMode.${themeMode}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                id="user-profile-user"
                name="user"
                data-cy="user"
                label={translate('langleagueApp.userProfile.user')}
                type="select"
                required
              >
                <option value="" key="0" />
                {users
                  ? users.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.login}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <FormText>
                <Translate contentKey="entity.validation.required">This field is required.</Translate>
              </FormText>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/user-profile" replace color="info">
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

export default UserProfileUpdate;
