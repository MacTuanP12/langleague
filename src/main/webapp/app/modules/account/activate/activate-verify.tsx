import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { activateAction, reset } from './activate.reducer';
import './activate-verify.scss';

export const ActivateVerify = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const key = searchParams.get('key');
    if (key) {
      dispatch(activateAction(key));
      setIsVerifying(false);
    }
    return () => {
      dispatch(reset());
    };
  }, []);

  const activationSuccess = useAppSelector(state => state.activate.activationSuccess);
  const activationFailure = useAppSelector(state => state.activate.activationFailure);

  if (isVerifying && !activationSuccess && !activationFailure) {
    return (
      <div className="activate-verify-container">
        <div className="activate-card">
          <div className="logo-header">
            <div className="logo-icon">◆</div>
            <span className="logo-text">LangLeague</span>
          </div>

          <div className="content-card verifying">
            <div className="icon-circle">
              <i className="bi bi-hourglass-split"></i>
            </div>
            <h2>
              <Translate contentKey="activate.messages.verifying.title">Verifying your account...</Translate>
            </h2>
            <p>
              <Translate contentKey="activate.messages.verifying.description">Please wait while we verify your email address.</Translate>
            </p>
          </div>

          <div className="footer-text">© {new Date().getFullYear()} LangLeague. All rights reserved.</div>
        </div>
      </div>
    );
  }

  if (activationSuccess) {
    return (
      <div className="activate-verify-container">
        <div className="activate-card">
          <div className="logo-header">
            <div className="logo-icon">◆</div>
            <span className="logo-text">LangLeague</span>
          </div>

          <div className="content-card success">
            <div className="icon-circle success">
              <i className="bi bi-check-circle"></i>
            </div>
            <h2>
              <Translate contentKey="activate.messages.success.title">Your Account is Activated!</Translate>
            </h2>
            <p>
              <Translate contentKey="activate.messages.success.description">
                You are now ready to begin your learning journey with LangLeague. Log in now to explore our vast library and tools.
              </Translate>
            </p>

            <Link to="/login" className="btn-primary">
              <Translate contentKey="activate.actions.loginNow">Log In Now</Translate>
            </Link>

            <Link to="/" className="btn-secondary">
              <Translate contentKey="activate.actions.goHome">Go to Homepage</Translate>
            </Link>
          </div>

          <div className="footer-link">
            <Translate contentKey="activate.footer.needHelp">Need help?</Translate>{' '}
            <Link to="/contact">
              <Translate contentKey="activate.footer.contactSupport">Contact Support</Translate>
            </Link>
          </div>

          <div className="footer-text">© {new Date().getFullYear()} LangLeague. All rights reserved.</div>
        </div>
      </div>
    );
  }

  // Activation failure - show email verification page
  return (
    <div className="activate-verify-container">
      <div className="activate-card">
        <div className="logo-header">
          <div className="logo-icon">◆</div>
          <span className="logo-text">LangLeague</span>
        </div>

        <div className="content-card">
          <div className="icon-circle">
            <i className="bi bi-envelope-check"></i>
          </div>
          <h2>
            <Translate contentKey="activate.messages.failure.title">Verify your email address</Translate>
          </h2>
          <p>
            <Translate contentKey="activate.messages.failure.description">
              We have sent a verification link to your email. Please click the link in that email to secure your account.
            </Translate>
          </p>

          <div className="info-box">
            <i className="bi bi-info-circle"></i>
            <Translate contentKey="activate.messages.failure.checkSpam">Can&apos;t find it? Check your spam or junk folder.</Translate>
          </div>

          <Link to="/login" className="btn-primary">
            <Translate contentKey="activate.actions.login">Log In</Translate>
          </Link>

          <button className="btn-link">
            <Translate contentKey="activate.actions.resend">Resend confirmation email</Translate>
          </button>
        </div>

        <div className="footer-link">
          <Translate contentKey="activate.footer.needHelp">Need help?</Translate>{' '}
          <Link to="/contact">
            <Translate contentKey="activate.footer.contactSupport">Contact Support</Translate>
          </Link>
        </div>

        <div className="footer-text">© {new Date().getFullYear()} LangLeague. All rights reserved.</div>
      </div>
    </div>
  );
};

export default ActivateVerify;
