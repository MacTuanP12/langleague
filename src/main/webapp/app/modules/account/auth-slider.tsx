import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, message, Checkbox } from 'antd';
import { FaFacebookF, FaGoogle, FaGithub } from 'react-icons/fa';
import { ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'app/config/store';
import { authenticate } from 'app/shared/services/account.service';
import { register } from 'app/shared/services/account.service';
import { getSession } from 'app/shared/auth/auth.reducer';
import { TOKEN_KEY } from 'app/config/constants';
import { getRouteByAuthorities } from 'app/shared/utils/role-routes';
import LanguageSwitch from './LanguageSwitch';
import './auth-slider.scss';

interface CaptchaData {
  captchaImage: string;
  captchaId: string;
}

const AuthSlider = () => {
  const { t } = useTranslation(['login', 'register']);
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

  useEffect(() => {
    setIsSignUp(location.pathname === '/register');
  }, [location]);

  const loadCaptcha = async () => {
    setIsLoadingCaptcha(true);
    try {
      const response = await fetch('/api/captcha');

      if (!response.ok) {
        console.log('Captcha API not available, using mock captcha');
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
        console.log('Invalid captcha data received');
        setCaptchaData(null);
      }
    } catch (err) {
      console.log('Captcha feature not available, using mock captcha', err);
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

  /**
   * Hàm redirect user đến trang tương ứng dựa trên role
   * Ưu tiên: ROLE_ADMIN > ROLE_STAFF > ROLE_USER
   */
  const redirectUserByRole = (authorities: string) => {
    console.log('=== redirectUserByRole called ===');
    console.log('Input authorities:', authorities);

    const targetRoute = getRouteByAuthorities(authorities);

    console.log('Target route:', targetRoute);
    console.log('Navigating to:', targetRoute);

    navigate(targetRoute, { replace: true });

    console.log('Navigate called successfully');
  };

  const handleLoginSubmit = async (values: any) => {
    setLoginLoading(true);
    try {
      // Xóa token cũ trước khi đăng nhập
      localStorage.removeItem('authToken');
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);

      console.log('=== Starting Login Process ===');
      console.log('Username:', values.email);

      // Gọi API đăng nhập
      const result = await dispatch(
        authenticate({
          username: values.email,
          password: values.password,
          rememberMe: values.remember || false,
          captchaId: captchaData?.captchaId || '',
          captchaValue: values.captchaAnswer,
        }),
      ).unwrap();

      const token = result.id_token;

      if (!token) {
        throw new Error('No token received from server');
      }

      console.log('=== Login Success ===');
      console.log('Token received:', token.substring(0, 50) + '...');

      // Lưu token vào localStorage
      localStorage.setItem(TOKEN_KEY, token);

      // Giải mã JWT token để lấy thông tin user và roles
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const authorities = payload.auth || '';

      console.log('Token payload:', payload);
      console.log('Authorities:', authorities);

      // Fetch user session để set isAuthenticated = true
      console.log('Fetching user session...');
      const sessionResult = await dispatch(getSession()).unwrap();
      console.log('Session fetched successfully:', sessionResult);

      // Hiển thị thông báo thành công
      message.success(t('login:login.success'));

      // Đợi một chút để đảm bảo state được cập nhật
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect user dựa trên role
      console.log('Redirecting user by role...');
      redirectUserByRole(authorities);
    } catch (err: any) {
      console.error('=== Login Error ===', err);

      // Better error handling for different error types
      let errorMessage = t('login:login.error.generic');

      if (err.response?.data) {
        const errorData = err.response.data;

        // Check for specific error types
        if (errorData.title === 'Invalid captcha' || errorData.message?.includes('captcha')) {
          errorMessage = t('login:login.error.captchaInvalid') || 'Invalid captcha. Please try again.';
        } else if (errorData.title === 'Bad credentials' || errorData.message?.includes('credentials')) {
          errorMessage = t('login:login.error.invalidCredentials') || 'Invalid username or password.';
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      message.error(errorMessage);

      // Reload captcha nếu đăng nhập thất bại
      if (captchaData) {
        loadCaptcha();
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (values: any) => {
    setRegisterLoading(true);
    try {
      await dispatch(
        register({
          login: values.email,
          email: values.email,
          password: values.password,
          firstName: values.name.split(' ')[0] || values.name,
          lastName: values.name.split(' ').slice(1).join(' ') || '',
          langKey: 'vi',
        }),
      ).unwrap();

      message.success(t('register:register.success'));
      setTimeout(() => {
        setIsSignUp(false);
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMsg = error?.message || 'Registration failed. Please try again.';
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
        <div className="language-switch-wrapper">
          <LanguageSwitch />
        </div>
        {/* SIGN UP FORM */}
        <div className="form-container sign-up-container">
          <Form form={registerForm} onFinish={handleRegisterSubmit} className="auth-form">
            <h1>{t('register:register.title')}</h1>
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
            <span>{t('register:register.orUseEmail')}</span>
            <Form.Item
              name="name"
              rules={[{ required: true, message: t('register:register.validation.nameRequired') }]}
              style={{ marginBottom: '10px' }}
            >
              <Input placeholder={t('register:register.name')} size="large" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: t('register:register.validation.emailRequired') },
                { type: 'email', message: t('register:register.validation.emailInvalid') },
              ]}
              style={{ marginBottom: '10px' }}
            >
              <Input placeholder={t('register:register.email')} size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: t('register:register.validation.passwordRequired') },
                { min: 8, message: t('register:register.validation.passwordMin') },
              ]}
              style={{ marginBottom: '10px' }}
            >
              <Input.Password placeholder={t('register:register.password')} size="large" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: t('register:register.validation.confirmRequired') },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('register:register.validation.passwordMatch')));
                  },
                }),
              ]}
              style={{ marginBottom: '15px' }}
            >
              <Input.Password placeholder={t('register:register.confirmPassword')} size="large" />
            </Form.Item>
            <button type="submit" disabled={registerLoading} className="submit-btn">
              {registerLoading ? t('register:register.registering') : t('register:register.registerButton')}
            </button>
          </Form>
        </div>

        {/* SIGN IN FORM */}
        <div className="form-container sign-in-container">
          <Form form={loginForm} onFinish={handleLoginSubmit} className="auth-form">
            <h1>{t('login:login.title')}</h1>
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
            <span>{t('login:login.orUseAccount')}</span>
            <Form.Item
              name="email"
              rules={[{ required: true, message: t('login:login.validation.emailRequired') }]}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder={t('login:login.email')} size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: t('login:login.validation.passwordRequired') }]}
              style={{ marginBottom: '12px' }}
            >
              <Input.Password placeholder={t('login:login.password')} size="large" />
            </Form.Item>

            {captchaData && (
              <div className="captcha-container">
                <div className="captcha-image-wrapper">
                  {isLoadingCaptcha ? (
                    <span className="captcha-loading">{t('login:common.loading')}</span>
                  ) : (
                    <img src={captchaData.captchaImage} alt="Captcha" className="captcha-image" />
                  )}
                  <button type="button" className="captcha-refresh" onClick={loadCaptcha} disabled={isLoadingCaptcha}>
                    <ReloadOutlined />
                  </button>
                </div>
                <Form.Item
                  name="captchaAnswer"
                  rules={[{ required: true, message: t('login:login.validation.captchaRequired') }]}
                  style={{ marginBottom: '8px' }}
                >
                  <Input placeholder={t('login:login.captcha')} size="large" />
                </Form.Item>
              </div>
            )}

            <div className="form-footer">
              <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Checkbox>{t('login:login.rememberMe')}</Checkbox>
              </Form.Item>
              <a href="/forgot-password" className="forgot-pass">
                {t('login:login.forgotPassword')}
              </a>
            </div>

            <button type="submit" disabled={loginLoading} className="submit-btn">
              {loginLoading ? t('login:login.signingIn') : t('login:login.loginButton')}
            </button>
          </Form>
        </div>

        {/* OVERLAY CONTAINER */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>{t('login:login.welcomeBack')}</h1>
              <p>{t('login:login.welcomeBackMessage')}</p>
              <button className="ghost" onClick={() => setIsSignUp(false)}>
                {t('login:login.title')}
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>{t('register:register.helloFriend')}</h1>
              <p>{t('register:register.helloFriendMessage')}</p>
              <button className="ghost" onClick={() => setIsSignUp(true)}>
                {t('register:register.title')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSlider;
