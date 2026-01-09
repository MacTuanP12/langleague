import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, message, Checkbox } from 'antd';
import { FaFacebookF, FaGoogle, FaGithub } from 'react-icons/fa';
import { ReloadOutlined } from '@ant-design/icons';
import { translate } from 'react-jhipster';
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
}

interface RegisterFormValues {
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

  useEffect(() => {
    setIsSignUp(location.pathname === '/register');
  }, [location]);

  const loadCaptcha = async () => {
    setIsLoadingCaptcha(true);
    try {
      const response = await fetch('/api/captcha');

      if (!response.ok) {
        // Captcha API not available, using mock captcha
        const mockCaptcha: CaptchaData = {
          captchaId: 'mock-' + Date.now(),
          captchaImage:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAyCAYAAAAZUZThAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNXG14zYAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDcvMTMvMTNJ6e0NAAACcklEQVR4nO3dz2rCQBQF8JtY/AtqFcSlIuLD+P4P4MaFYncuXLhQbP1D1SRzXbhw4cJNyPQuJmQyk5nkJjnwO5BFIJnJz0xCMgmEEEIIIYQQQgghhBBCCCGEEEIIIcS/S5R+gdYppQpgkKYphBBFg263izRNoes6dF1HnufI8xzbtm3z0nVJc86haZp1kiRJ27ZNAKh934/jOE7SNI3SNE3iOE6SJEniOI7jOE7a973Y973f9/04juM0TeM4juM0TWMAaF0XANq2bQpASZJA0zQkSYI0TaHrOizLQpZlyPMcZVlWJUlSKaUqAFWapjUA1LZt67Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27b/m+d5nmma5nmel/V9X9f3fV3f93V939f1fV/X931d3/d1XddVXddVXddVXddVXddVXddVXddVdd/Xdd/Xdd/Xdd/Xdd/Xdd/Xdd/Xdd/Xdd/Xdd/X9X1f1/d9Xd/3dX3f1/V9X9f3fV3f93Vd11Vd11Vd11Vd11Vd11Vd11V13dd13dd13dd13dd13dd13dd13dd13dd13dd13dd13dd1nd93Xfd93Xfd93Xfd93Xfd93Xfd93Xfd93Xfd9Xdf3VV3fVV3fVV3fVV3fVV3fVd33dd33dd33dd33dd33dd33dd33dd33dd33dd33dd33df/0fd/3fd/3fd/3fd/3fd/3fd/3fd/3fV/X9VVd31Vd31Vd31Vd31Vd33Xd13Xd13Xd13Xd13Xd13Xd13Xd13Xd13Xd13Xd13Xdd3XdV3XdV3XdV3XdV3XdV3XdV3XdV3XdX3f1/V9X9f3fV3f93V939f1fV/X931d3/d1fd/XdX1f1fVdVdd1VV3XVXX/n+d5XpbneSmlVJqmKQzDgGEYMAwDhmFACAFd12GaJkzThGmaEEIgiiJEUQRN06BpGnRdh67r0HUduq4jyzJkWYYsy5BlGbIsQ5qmSNMUaZoiTVMkSYIkSZAkCZIkQZIk0HUduq5D13XouY4sy5BlGbIsQ5qmSNMUaZoiSRIkSYIkSZAkCZIkQZIk0HUduq5D13XkSdJ+vw+lFIQQ0DQNmqZB0zRomgZN06DrOnRdh67rMAEIIYQQQgghhBBCCCGEEEIIIYQQ4u/5BbXh5sN9i7lsAAAAAElFTkSuQmCC',
        };
        setCaptchaData(mockCaptcha);
        loginForm.setFieldValue('captchaAnswer', '');
        return;
      }

      const data: CaptchaData = await response.json();

      if (data && data.captchaId && data.captchaImage) {
        setCaptchaData(data);
        loginForm.setFieldValue('captchaAnswer', '');
      } else {
        // Invalid captcha data received
        setCaptchaData(null);
      }
    } catch (err) {
      // Captcha feature not available, using mock captcha
      const mockCaptcha: CaptchaData = {
        captchaId: 'mock-' + Date.now(),
        captchaImage:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAyCAYAAAAZUZThAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNXG14zYAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDcvMTMvMTNJ6e0NAAACcklEQVR4nO3dz2rCQBQF8JtY/AtqFcSlIuLD+P4P4MaFYncuXLhQbP1D1SRzXbhw4cJNyPQuJmQyk5nkJjnwO5BFIJnJz0xCMgmEEEIIIYQQQgghhBBCCCGEEEIIIcS/S5R+gdYppQpgkKYphBBFg263izRNoes6dF1HnufI8xzbtm3z0nVJc86haZp1kiRJ27ZNAKh934/jOE7SNI3SNE3iOE6SJEniOI7jOE7a973Y973f9/04juM0TeM4juM0TWMAaF0XANq2bQpASZJA0zQkSYI0TaHrOizLQpZlyPMcZVlWJUlSKaUqAFWapjUA1LZt67Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27Zt27b/m+d5nmma5nmel/V9X9f3fV3f93V939f1fV/X931d3/d1XddVXddVXddVXddVXddVXddVXddVdd/Xdd/Xdd/Xdd/Xdd/Xdd/Xdd/Xdd/Xdd/Xdd/X9X1f1/d9Xd/3dX3f1/V9X9f3fV3f93Vd11Vd11Vd11Vd11Vd11Vd11V13dd13dd13dd13dd13dd13dd13dd13dd13dd13dd13dd1nd93Xfd93Xfd93Xfd93Xfd93Xfd93Xfd93Xfd9Xdf3VV3fVV3fVV3fVV3fVV3fVd33dd33dd33dd33dd33dd33dd33dd33dd33dd33dd33df/0fd/3fd/3fd/3fd/3fd/3fd/3fd/3fV/X9VVd31Vd31Vd31Vd31Vd33Xd13Xd13Xd13Xd13Xd13Xd13Xd13Xd13Xd13Xd13Xdd3XdV3XdV3XdV3XdV3XdV3XdV3XdV3XdX3f1/V9X9f3fV3f93V939f1fV/X931d3/d1fd/XdX1f1fVdVdd1VV3XVXX/n+d5XpbneSmlVJqmKQzDgGEYMAwDhmFACAFd12GaJkzThGmaEEIgiiJEUQRN06BpGnRdh67r0HUduq4jyzJkWYYsy5BlGbIsQ5qmSNMUaZoiTVMkSYIkSZAkCZIkQZIk0HUduq5D13XouY4sy5BlGbIsQ5qmSNMUaZoiSRIkSYIkSZAkCZIkQZIk0HUduq5D13XkSdJ+vw+lFIQQ0DQNmqZB0zRomgZN06DrOnRdh67rMAEIIYQQQgghhBBCCCGEEEIIIYQQ4u/5BbXh5sN9i7lsAAAAAElFTkSuQmCC',
      };
      setCaptchaData(mockCaptcha);
      loginForm.setFieldValue('captchaAnswer', '');
    } finally {
      setIsLoadingCaptcha(false);
    }
  };

  useEffect(() => {
    loadCaptcha();
    const interval = setInterval(loadCaptcha, 60000);
    return () => clearInterval(interval);
  }, []);

  // Redirect after successful authentication
  useEffect(() => {
    if (isAuthenticated && account) {
      const authorities = account.authorities || [];
      let targetRoute = '/';

      if (authorities.includes('ROLE_ADMIN')) {
        targetRoute = '/admin/dashboard';
      } else if (authorities.includes('ROLE_TEACHER')) {
        targetRoute = '/teacher/dashboard';
      } else if (authorities.includes('ROLE_STUDENT')) {
        targetRoute = '/student/dashboard';
      }

      navigate(targetRoute, { replace: true });
    }
  }, [isAuthenticated, account, navigate]);

  const handleLoginSubmit = (values: LoginFormValues) => {
    setLoginLoading(true);
    try {
      // Call login action
      dispatch(login(values.email, values.password, values.remember || false));

      message.success(translate('login.messages.success'));
    } catch (err: unknown) {
      // Login error handling
      const error = err as { response?: { data?: { title?: string; message?: string; detail?: string } }; message?: string };
      let errorMessage = translate('login.messages.error.authentication');

      if (error.response?.data) {
        const errorData = error.response.data;

        if (errorData.title === 'Invalid captcha' || errorData.message?.includes('captcha')) {
          errorMessage = translate('login.messages.error.captcha');
        } else if (errorData.title === 'Bad credentials' || errorData.message?.includes('credentials')) {
          errorMessage = translate('login.messages.error.authentication');
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      message.error(errorMessage);

      // Reload captcha on failure
      if (captchaData) {
        loadCaptcha();
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (values: RegisterFormValues) => {
    setRegisterLoading(true);
    try {
      await dispatch(
        handleRegister({
          login: values.email,
          email: values.email,
          password: values.password,
          langKey: 'en',
        }),
      ).unwrap();

      message.success(translate('register.messages.success'));
      setTimeout(() => {
        setIsSignUp(false);
        navigate('/login');
      }, 2000);
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const err = error as { message?: string };
      const errorMsg = err?.message || translate('register.messages.error.fail');
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
      <div className={`auth-container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
        {/* SIGN UP FORM */}
        <div className="form-container sign-up-container">
          <Form form={registerForm} onFinish={handleRegisterSubmit} className="auth-form">
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
              name="name"
              rules={[{ required: true, message: translate('register.messages.validate.name.required') }]}
              style={{ marginBottom: '10px' }}
            >
              <Input placeholder={translate('register.form.name')} size="large" />
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
          <Form form={loginForm} onFinish={handleLoginSubmit} className="auth-form">
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

            {captchaData && (
              <div className="captcha-container">
                <div className="captcha-image-wrapper">
                  {isLoadingCaptcha ? (
                    <span className="captcha-loading">{translate('login.form.captcha.loading')}</span>
                  ) : (
                    <img src={captchaData.captchaImage} alt="Captcha" className="captcha-image" />
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
            )}

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
