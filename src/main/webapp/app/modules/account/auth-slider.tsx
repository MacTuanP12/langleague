import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Form, Input, message, Checkbox } from 'antd';
import { FaFacebookF, FaGoogle, FaGithub } from 'react-icons/fa';
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons';
import { translate, Translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { login } from 'app/shared/reducers/authentication';
import { handleRegister } from 'app/modules/account/register/register.reducer';
import './auth-slider.scss';

interface CaptchaData {
  captchaImage: string;
  captchaId: string;
}

interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
  captchaAnswer?: string;
}

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

const AuthSlider = () => {
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/register');
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [isLoadingCaptcha, setIsLoadingCaptcha] = useState(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const account = useAppSelector(state => state.authentication.account);
  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  useEffect(() => {
    setIsSignUp(location.pathname === '/register');
  }, [location]);

  const loadCaptcha = async () => {
    setIsLoadingCaptcha(true);
    try {
      const response = await fetch('/api/captcha');

      if (!response.ok) {
        throw new Error('Captcha API not available');
      }

      const data: CaptchaData = await response.json();

      if (data && data.captchaId && data.captchaImage) {
        setCaptchaData(data);
        loginForm.setFieldValue('captchaAnswer', '');
      } else {
        setCaptchaData(null);
      }
    } catch (err) {
      setCaptchaData(null);
    } finally {
      setIsLoadingCaptcha(false);
    }
  };

  useEffect(() => {
    loadCaptcha();
    const interval = setInterval(loadCaptcha, 180000);
    return () => clearInterval(interval);
  }, []);

  const loginSuccess = useAppSelector(state => state.authentication.loginSuccess);

  useEffect(() => {
    if (loginSuccess) {
      message.success(translate('login.messages.success'));
    }
  }, [loginSuccess]);

  useEffect(() => {
    if (isAuthenticated && account && account.authorities) {
      // Check if there's a redirect location in state
      const state = location.state as { from?: Location };
      if (state && state.from) {
        navigate(state.from.pathname + state.from.search);
        return;
      }

      const authorities = account.authorities;
      let targetRoute = '/';

      if (authorities.includes('ROLE_ADMIN')) {
        targetRoute = '/admin/dashboard';
      } else if (authorities.includes('ROLE_TEACHER')) {
        targetRoute = '/teacher/dashboard';
      } else if (authorities.includes('ROLE_STUDENT')) {
        targetRoute = '/student/dashboard';
      }

      if (location.pathname === '/login' || location.pathname === '/register') {
        navigate(targetRoute, { replace: true });
      }
    }
  }, [isAuthenticated, account, navigate, location.pathname, location.state]);

  const handleLoginSubmit = (values: LoginFormValues) => {
    setLoginLoading(true);
    try {
      dispatch(login(values.email, values.password, values.remember || false, captchaData?.captchaId, values.captchaAnswer));
    } catch (err: unknown) {
      // Error handled in useEffect
    } finally {
      setLoginLoading(false);
    }
  };

  const loginError = useAppSelector(state => state.authentication.loginError);
  const errorMessage = useAppSelector(state => state.authentication.errorMessage);

  useEffect(() => {
    if (loginError && errorMessage) {
      let msg = '';
      const lowerMsg = errorMessage.toLowerCase();

      if (lowerMsg.includes('captcha')) {
        msg = translate('login.messages.error.captcha');
      } else if (lowerMsg.includes('bad credentials') || lowerMsg.includes('unauthorized')) {
        msg = translate('login.messages.error.badcredentials');
      } else if (lowerMsg.includes('user not found') || lowerMsg.includes('not found')) {
        msg = translate('login.messages.error.usernotfound');
      } else if (lowerMsg.includes('locked')) {
        msg = translate('login.messages.error.accountlocked');
      } else if (lowerMsg.includes('disabled') || lowerMsg.includes('not activated')) {
        msg = translate('login.messages.error.accountdisabled');
      } else {
        msg = translate('login.messages.error.authentication');
      }

      message.error(msg);
      loadCaptcha();
    }
  }, [loginError, errorMessage]);

  const handleRegisterSubmit = async (values: RegisterFormValues) => {
    setRegisterLoading(true);
    try {
      await dispatch(
        handleRegister({
          login: values.username,
          email: values.email,
          password: values.password,
          langKey: currentLocale,
        }),
      ).unwrap();

      message.success(translate('register.messages.success'));
      setTimeout(() => {
        setIsSignUp(false);
        navigate('/login');
      }, 2000);
    } catch (error: unknown) {
      const err = error as { message?: string };
      let errorMsg = translate('register.messages.error.fail');

      if (err?.message) {
        const lowerMsg = err.message.toLowerCase();
        if (lowerMsg.includes('login already') || lowerMsg.includes('username already') || lowerMsg.includes('login name already')) {
          errorMsg = translate('register.messages.error.userexists');
        } else if (lowerMsg.includes('email already') || lowerMsg.includes('email is already')) {
          errorMsg = translate('register.messages.error.emailexists');
        } else {
          errorMsg = err.message;
        }
      }
      message.error(errorMsg);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    window.location.href = `/oauth2/authorization/${provider}`;
  };

  return (
    <div className="auth-body">
      <Link to="/" className="back-to-home-btn">
        <HomeOutlined />
        <span>
          <Translate contentKey="global.menu.home">Home</Translate>
        </span>
      </Link>
      <div className={`auth-container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
        {/* SIGN UP FORM */}
        <div className="form-container sign-up-container">
          <Form form={registerForm} name="register" onFinish={handleRegisterSubmit} className="auth-form">
            <h1>{translate('register.title')}</h1>
            <div className="social-container">
              <a href="#" className="social" onClick={() => handleSocialLogin('facebook')}>
                <FaFacebookF />
              </a>
              <a href="#" className="social" onClick={() => handleSocialLogin('google')}>
                <FaGoogle />
              </a>
              <a href="#" className="social" onClick={() => handleSocialLogin('github')}>
                <FaGithub />
              </a>
            </div>
            <span>{translate('register.form.email.placeholder')}</span>
            <Form.Item
              name="username"
              rules={[{ required: true, message: translate('register.messages.validate.login.required') }]}
              style={{ marginBottom: '10px' }}
            >
              <Input placeholder={translate('global.form.username.placeholder')} size="large" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: translate('register.messages.validate.email.required') },
                { type: 'email', message: translate('register.messages.validate.email.invalid') },
              ]}
              style={{ marginBottom: '10px' }}
            >
              <Input placeholder={translate('global.form.email.placeholder')} size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: translate('register.messages.validate.newpassword.required') },
                { min: 4, message: translate('register.messages.validate.newpassword.minlength') },
              ]}
              style={{ marginBottom: '10px' }}
            >
              <Input.Password placeholder={translate('global.form.newpassword.placeholder')} size="large" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: translate('register.messages.validate.confirmpassword.required') },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(translate('register.messages.error.dontmatch')));
                  },
                }),
              ]}
              style={{ marginBottom: '15px' }}
            >
              <Input.Password placeholder={translate('global.form.confirmpassword.placeholder')} size="large" />
            </Form.Item>
            <button type="submit" disabled={registerLoading} className="submit-btn">
              {registerLoading ? translate('register.form.button.registering') : translate('register.form.button')}
            </button>
          </Form>
        </div>

        {/* SIGN IN FORM */}
        <div className="form-container sign-in-container">
          <Form form={loginForm} name="login" onFinish={handleLoginSubmit} className="auth-form">
            <h1>{translate('login.title')}</h1>
            <div className="social-container">
              <a href="#" className="social" onClick={() => handleSocialLogin('facebook')}>
                <FaFacebookF />
              </a>
              <a href="#" className="social" onClick={() => handleSocialLogin('google')}>
                <FaGoogle />
              </a>
              <a href="#" className="social" onClick={() => handleSocialLogin('github')}>
                <FaGithub />
              </a>
            </div>
            <span>{translate('login.form.username.placeholder')}</span>
            <Form.Item
              name="email"
              rules={[{ required: true, message: translate('login.messages.validate.username.required') }]}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder={translate('global.form.username.placeholder')} size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: translate('login.messages.validate.password.required') }]}
              style={{ marginBottom: '12px' }}
            >
              <Input.Password placeholder={translate('login.form.password.placeholder')} size="large" />
            </Form.Item>

            <div className="captcha-container">
              <div className="captcha-image-wrapper">
                {isLoadingCaptcha ? (
                  <span className="captcha-loading">{translate('login.form.captcha.loading')}</span>
                ) : captchaData ? (
                  <img src={captchaData.captchaImage} alt="Captcha" className="captcha-image" />
                ) : (
                  <span className="captcha-error" onClick={loadCaptcha} style={{ cursor: 'pointer', color: 'red', fontSize: '12px' }}>
                    {translate('login.form.captcha.error')}
                  </span>
                )}
                <button type="button" className="captcha-refresh" onClick={loadCaptcha} disabled={isLoadingCaptcha}>
                  <ReloadOutlined />
                </button>
              </div>
              <Form.Item
                name="captchaAnswer"
                rules={[{ required: true, message: translate('login.messages.validate.captcha.required') }]}
                style={{ marginBottom: '8px' }}
              >
                <Input placeholder={translate('login.form.captcha.placeholder')} size="large" />
              </Form.Item>
            </div>

            <div className="form-footer">
              <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Checkbox>{translate('login.form.rememberme')}</Checkbox>
              </Form.Item>
              <a href="/account/reset/request" className="forgot-pass">
                {translate('login.password.forgot')}
              </a>
            </div>

            <button type="submit" disabled={loginLoading} className="submit-btn">
              {loginLoading ? translate('login.form.button.signing') : translate('login.form.button')}
            </button>
          </Form>
        </div>

        {/* OVERLAY CONTAINER */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>{translate('login.title')}</h1>
              <p>{translate('login.messages.info.authenticated.prefix')}</p>
              <button className="ghost" onClick={() => setIsSignUp(false)}>
                {translate('global.messages.info.authenticated.link')}
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>{translate('register.title')}</h1>
              <p>{translate('global.messages.info.register.noaccount')}</p>
              <button className="ghost" onClick={() => setIsSignUp(true)}>
                {translate('global.messages.info.register.link')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSlider;
