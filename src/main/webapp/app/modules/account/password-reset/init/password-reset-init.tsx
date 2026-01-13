import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { translate, Translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { handlePasswordResetInit, reset } from '../password-reset.reducer';
import './password-reset-init.scss';

export const PasswordResetInit = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const successMessage = useAppSelector(state => state.passwordReset.successMessage);
  const resetPasswordFailure = useAppSelector(state => state.passwordReset.resetPasswordFailure);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (successMessage) {
      setEmailSent(true);
      toast.success(translate(successMessage));
    }
  }, [successMessage]);

  useEffect(() => {
    if (resetPasswordFailure) {
      toast.error(translate('reset.request.messages.error', 'Failed to send reset email. Please try again.'));
    }
  }, [resetPasswordFailure]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      dispatch(handlePasswordResetInit(email));
    }
  };

  if (emailSent) {
    return (
      <div className="password-reset-container">
        <div className="reset-card">
          <div className="logo-header">
            <div className="logo-icon">◆</div>
            <span className="logo-text">LangLeague</span>
          </div>

          <div className="content-card">
            <div className="icon-circle success">
              <i className="bi bi-envelope-check"></i>
            </div>
            <h2>
              <Translate contentKey="reset.request.messages.checkEmail">Check Your Email</Translate>
            </h2>
            <p>
              <Translate contentKey="reset.request.messages.emailSent" interpolate={{ email: <strong>{email}</strong> }}>
                We&apos;ve sent a password reset link to your email. Please check your email and follow the instructions to reset your
                password.
              </Translate>
            </p>

            <div className="info-box">
              <i className="bi bi-info-circle"></i>
              <Translate contentKey="reset.request.messages.checkSpam">Can&apos;t find it? Check your spam or junk folder.</Translate>
            </div>

            <Link to="/login" className="btn-primary">
              <i className="bi bi-arrow-left"></i> <Translate contentKey="reset.request.actions.backToLogin">Back to Login</Translate>
            </Link>

            <button
              className="btn-link"
              onClick={() => {
                setEmailSent(false);
                dispatch(reset());
              }}
            >
              <Translate contentKey="reset.request.actions.tryDifferent">Try a different email</Translate>
            </button>
          </div>

          <div className="footer-text">© {new Date().getFullYear()} LangLeague. All rights reserved.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="password-reset-container">
      <div className="reset-card">
        <div className="logo-header">
          <div className="logo-icon">◆</div>
          <span className="logo-text">LangLeague</span>
        </div>

        <div className="content-card">
          <div className="icon-circle">
            <i className="bi bi-key"></i>
          </div>
          <h2>
            <Translate contentKey="reset.request.title">Forgot Password?</Translate>
          </h2>
          <p>
            <Translate contentKey="reset.request.messages.info">Please enter your email address to receive a verification code.</Translate>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper">
                <i className="bi bi-envelope"></i>
                <input
                  type="email"
                  placeholder={translate('global.form.email.placeholder', 'Email')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              <Translate contentKey="reset.request.form.button">Send Code</Translate>
            </button>
          </form>

          <Link to="/login" className="btn-link">
            <i className="bi bi-arrow-left"></i> <Translate contentKey="reset.request.actions.backToLogin">Back to Login</Translate>
          </Link>
        </div>

        <div className="footer-text">© {new Date().getFullYear()} LangLeague. All rights reserved.</div>
      </div>
    </div>
  );
};

export default PasswordResetInit;
