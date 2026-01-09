import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { translate } from 'react-jhipster';
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
      toast.error('Failed to send reset email. Please try again.');
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
            <h2>Check Your Email</h2>
            <p>
              We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your email and follow the instructions to
              reset your password.
            </p>

            <div className="info-box">
              <i className="bi bi-info-circle"></i>
              Can&apos;t find it? Check your spam or junk folder.
            </div>

            <Link to="/login" className="btn-primary">
              <i className="bi bi-arrow-left"></i> Back to Login
            </Link>

            <button
              className="btn-link"
              onClick={() => {
                setEmailSent(false);
                dispatch(reset());
              }}
            >
              Try a different email
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
          <h2>Forgot Password?</h2>
          <p>Please enter your email address to receive a verification code.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper">
                <i className="bi bi-envelope"></i>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Send Code
            </button>
          </form>

          <Link to="/login" className="btn-link">
            <i className="bi bi-arrow-left"></i> Back to Login
          </Link>
        </div>

        <div className="footer-text">© {new Date().getFullYear()} LangLeague. All rights reserved.</div>
      </div>
    </div>
  );
};

export default PasswordResetInit;
