import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { activateAction, reset } from './activate.reducer';
import './activate-verify.scss';

export const ActivateVerify = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [activationKey, setActivationKey] = useState(searchParams.get('key') || '');

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, []);

  const activationSuccess = useAppSelector(state => state.activate.activationSuccess);
  const activationFailure = useAppSelector(state => state.activate.activationFailure);

  const handleActivate = () => {
    if (activationKey) {
      dispatch(activateAction(activationKey));
    }
  };

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

  if (activationFailure) {
    return (
      <div className="activate-verify-container">
        <div className="activate-card">
          <div className="logo-header">
            <div className="logo-icon">◆</div>
            <span className="logo-text">LangLeague</span>
          </div>

          <div className="content-card">
            <div className="icon-circle error">
              <i className="bi bi-x-circle"></i>
            </div>
            <h2>
              <Translate contentKey="activate.messages.error.title">Activation Failed</Translate>
            </h2>
            <p>
              <Translate contentKey="activate.messages.error.description">The activation key is invalid or has expired.</Translate>
            </p>

            <div className="form-group mt-4">
              <label htmlFor="activationKey" className="form-label text-start w-100">
                <Translate contentKey="activate.form.label">Enter Activation Key</Translate>
              </label>
              <input
                type="text"
                id="activationKey"
                className="form-control"
                value={activationKey}
                onChange={e => setActivationKey(e.target.value)}
                placeholder={translate('activate.form.placeholder')}
              />
            </div>

            <button className="btn-primary mt-3" onClick={handleActivate}>
              <Translate contentKey="activate.actions.retry">Retry Activation</Translate>
            </button>

            <Link to="/login" className="btn-link mt-3">
              <Translate contentKey="activate.actions.login">Log In</Translate>
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

  // Default view: Manual Activation
  return (
    <div className="activate-verify-container">
      <div className="activate-card">
        <div className="logo-header">
          <div className="logo-icon">◆</div>
          <span className="logo-text">LangLeague</span>
        </div>

        <div className="content-card">
          <div className="icon-circle">
            <i className="bi bi-key"></i>
          </div>
          <h2>
            <Translate contentKey="activate.messages.info.title">Activate Account</Translate>
          </h2>
          <p>
            <Translate contentKey="activate.messages.info.description">
              Please confirm your activation key to activate your account.
            </Translate>
          </p>

          <div className="form-group mt-4">
            <input
              type="text"
              className="form-control text-center"
              value={activationKey}
              onChange={e => setActivationKey(e.target.value)}
              placeholder={translate('activate.form.keyPlaceholder')}
              style={{ letterSpacing: '2px', fontWeight: 'bold' }}
            />
          </div>

          <button className="btn-primary mt-3" onClick={handleActivate} disabled={!activationKey}>
            <Translate contentKey="activate.actions.activate">Activate Now</Translate>
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
