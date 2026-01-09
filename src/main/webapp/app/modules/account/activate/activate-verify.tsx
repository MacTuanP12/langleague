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
            <h2>Verifying your account...</h2>
            <p>Please wait while we verify your email address.</p>
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
            <h2>Your Account is Activated!</h2>
            <p>You are now ready to begin your learning journey with BookFlow. Log in now to explore our vast library and tools.</p>

            <Link to="/login" className="btn-primary">
              Log In Now
            </Link>

            <Link to="/" className="btn-secondary">
              Go to Homepage
            </Link>
          </div>

          <div className="footer-link">
            Need help? <Link to="/contact">Contact Support</Link>
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
          <h2>Verify your email address</h2>
          <p>
            We have sent a verification link to <strong>student@university.edu</strong>. Please click the link in that email to secure your
            account.
          </p>

          <div className="info-box">
            <i className="bi bi-info-circle"></i>
            Can&apos;t find it? Check your spam or junk folder.
          </div>

          <Link to="/login" className="btn-primary">
            Log In
          </Link>

          <button className="btn-link">Resend confirmation email</button>
        </div>

        <div className="footer-link">
          Need help? <Link to="/contact">Contact Support</Link>
        </div>

        <div className="footer-text">© {new Date().getFullYear()} LangLeague. All rights reserved.</div>
      </div>
    </div>
  );
};

export default ActivateVerify;
