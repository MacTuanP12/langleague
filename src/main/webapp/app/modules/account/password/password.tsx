import React, { useEffect, useState } from 'react';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { Button } from 'reactstrap';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { reset, savePassword } from './password.reducer';
import './password.scss';

export const PasswordPage = () => {
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(reset());
    dispatch(getSession());
    return () => {
      dispatch(reset());
    };
  }, []);

  const handleValidSubmit = ({ currentPassword, newPassword }) => {
    dispatch(savePassword({ currentPassword, newPassword }));
  };

  const updatePassword = event => setPassword(event.target.value);

  const account = useAppSelector(state => state.authentication.account);
  const successMessage = useAppSelector(state => state.password.successMessage);
  const errorMessage = useAppSelector(state => state.password.errorMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    } else if (errorMessage) {
      toast.error(translate(errorMessage));
    }
    dispatch(reset());
  }, [successMessage, errorMessage]);

  // Regex for password strength validation
  // Min 8 chars, 1 uppercase, 1 number, 1 special char
  const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,}$/;

  return (
    <div className="password-page-wrapper">
      <div className="password-content">
        {/* Password Card - Using Golden Standard Layout */}
        <div className="password-card">
          <div className="password-header">
            <div className="header-icon">
              <i className="bi bi-key"></i>
            </div>
            <div className="header-text">
              <h2>
                <Translate contentKey="password.title" interpolate={{ username: account?.login || 'User' }}>
                  Change Your Password
                </Translate>
              </h2>
              <p className="header-description">
                <Translate contentKey="password.messages.info">Please enter your current password and then create a new one.</Translate>
              </p>
            </div>
          </div>

          <ValidatedForm id="password-form" className="password-form" onSubmit={handleValidSubmit}>
            <div className="form-group">
              <ValidatedField
                name="currentPassword"
                label={translate('global.form.currentpassword.label')}
                placeholder={translate('global.form.currentpassword.placeholder')}
                type="password"
                validate={{
                  required: { value: true, message: translate('global.messages.validate.newpassword.required') },
                }}
                data-cy="currentPassword"
              />
            </div>

            <div className="form-group">
              <ValidatedField
                name="newPassword"
                label={translate('global.form.newpassword.label')}
                placeholder={translate('global.form.newpassword.placeholder')}
                type="password"
                validate={{
                  required: { value: true, message: translate('global.messages.validate.newpassword.required') },
                  minLength: { value: 8, message: translate('global.messages.validate.newpassword.minlength') },
                  maxLength: { value: 100, message: translate('global.messages.validate.newpassword.maxlength') },
                  pattern: {
                    value: passwordPattern,
                    message: translate('global.messages.validate.newpassword.strength') || 'Password is too weak',
                  },
                }}
                onChange={updatePassword}
                data-cy="newPassword"
              />
              <PasswordStrengthBar password={password} />
              <div className="password-requirements">
                <p className="requirements-title">
                  <Translate contentKey="global.messages.validate.newpassword.strength">Password strength requirements:</Translate>
                </p>
                <ul className="requirements-list">
                  <li className={password.length >= 8 ? 'met' : ''}>
                    <i className={`bi ${password.length >= 8 ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                    <Translate contentKey="global.messages.validate.newpassword.minlength">Minimum 8 characters</Translate>
                  </li>
                  <li className={/[A-Z]/.test(password) ? 'met' : ''}>
                    <i className={`bi ${/[A-Z]/.test(password) ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                    <Translate contentKey="global.messages.validate.newpassword.uppercase">At least one uppercase letter</Translate>
                  </li>
                  <li className={/[0-9]/.test(password) ? 'met' : ''}>
                    <i className={`bi ${/[0-9]/.test(password) ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                    <Translate contentKey="global.messages.validate.newpassword.number">At least one number</Translate>
                  </li>
                  <li className={/[$-/:-?{-~!"^_`[\]]/.test(password) ? 'met' : ''}>
                    <i className={`bi ${/[$-/:-?{-~!"^_`[\]]/.test(password) ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                    <Translate contentKey="global.messages.validate.newpassword.special">At least one special character</Translate>
                  </li>
                </ul>
              </div>
            </div>

            <div className="form-group">
              <ValidatedField
                name="confirmPassword"
                label={translate('global.form.confirmpassword.label')}
                placeholder={translate('global.form.confirmpassword.placeholder')}
                type="password"
                validate={{
                  required: { value: true, message: translate('global.messages.validate.confirmpassword.required') },
                  minLength: { value: 8, message: translate('global.messages.validate.confirmpassword.minlength') },
                  maxLength: { value: 100, message: translate('global.messages.validate.confirmpassword.maxlength') },
                  validate: v => v === password || translate('global.messages.error.dontmatch'),
                }}
                data-cy="confirmPassword"
              />
            </div>

            <div className="form-actions">
              <Button color="primary" type="submit" className="save-password-btn" data-cy="submit">
                <i className="bi bi-check-circle"></i>
                <Translate contentKey="password.form.button">Save</Translate>
              </Button>
            </div>
          </ValidatedForm>
        </div>
      </div>
    </div>
  );
};

export default PasswordPage;
