import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Translate, translate } from 'react-jhipster';
import { toast } from 'react-toastify';
import { useUserManagement } from 'app/shared/reducers/user-management.hook';
import './user-management-create.scss';

interface FormErrors {
  username?: string;
  email?: string;
  fullName?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}

interface FieldError {
  field: string;
  message: string;
}

interface ErrorResponse {
  fieldErrors?: FieldError[];
  message?: string;
  detail?: string;
  title?: string;
}

export const UserManagementCreate = () => {
  const { createUser } = useUserManagement();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    role: '',
    status: 'active',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Username validation with regex pattern matching backend (Constants.LOGIN_REGEX)
    const loginRegex = /^[_.@A-Za-z0-9-]+$/;

    if (!formData.username) {
      newErrors.username = translate('userManagement.create.validation.loginRequired');
    } else if (!loginRegex.test(formData.username)) {
      newErrors.username = translate('userManagement.create.validation.loginPattern');
    }

    if (!formData.email) {
      newErrors.email = translate('userManagement.create.validation.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = translate('userManagement.create.validation.emailInvalid');
    }

    if (!formData.fullName) {
      newErrors.fullName = translate('userManagement.create.validation.fullNameRequired');
    }

    if (!formData.role) {
      newErrors.role = translate('userManagement.create.validation.roleRequired');
    }

    if (!formData.password) {
      newErrors.password = translate('userManagement.create.validation.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = translate('userManagement.create.validation.passwordMinLength');
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = translate('userManagement.create.validation.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const [firstName, ...lastNameParts] = formData.fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      const userData = {
        login: formData.username,
        email: formData.email,
        firstName,
        lastName,
        authorities: [formData.role],
        activated: formData.status === 'active',
        password: formData.password,
      };

      await createUser(userData);
      toast.success(translate('langleague.admin.userManagement.messages.createSuccess'));
      navigate('/admin/user-management');
    } catch (error: unknown) {
      console.error('Error creating user:', error);

      // Handle backend validation errors
      const axiosError = error as { response?: { data?: ErrorResponse } };
      if (axiosError?.response?.data) {
        const responseData = axiosError.response.data;

        // Handle field errors from backend
        if (responseData.fieldErrors) {
          const backendErrors: FormErrors = {};
          responseData.fieldErrors.forEach((fieldError: FieldError) => {
            if (fieldError.field === 'login') {
              backendErrors.username = fieldError.message || translate('userManagement.create.validation.loginPattern');
            } else if (fieldError.field === 'email') {
              backendErrors.email = fieldError.message || translate('userManagement.create.validation.emailInvalid');
            }
          });
          setErrors(backendErrors);
          return;
        }

        // Handle specific error messages
        const errorMsg = responseData.message || responseData.detail || responseData.title;
        if (errorMsg) {
          if (errorMsg.toLowerCase().includes('login')) {
            setErrors({ username: translate('userManagement.create.validation.loginPattern') });
            toast.error(translate('userManagement.create.validation.loginPattern'));
          } else if (errorMsg.toLowerCase().includes('email')) {
            setErrors({ email: translate('userManagement.create.validation.emailInvalid') });
            toast.error(translate('userManagement.create.validation.emailInvalid'));
          } else {
            toast.error(errorMsg);
          }
          return;
        }
      }

      toast.error(translate('langleague.admin.userManagement.messages.createError'));
      setErrors({ submit: translate('userManagement.create.validation.submitError') });
    }
  };

  return (
    <div className="user-management-create">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/admin/user-management">
            <Translate contentKey="userManagement.detail.breadcrumb">User Management</Translate>
          </Link>
          <span className="separator">›</span>
          <span className="current">
            <Translate contentKey="userManagement.create.breadcrumb">Add New User</Translate>
          </span>
        </div>
        <h1>
          <Translate contentKey="userManagement.create.title">Add New User</Translate>
        </h1>
        <p>
          <Translate contentKey="userManagement.create.subtitle">Enter the user details below to create a new account.</Translate>
        </p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>
                <Translate contentKey="userManagement.create.fields.login">Username</Translate>{' '}
                <span className="required">
                  <Translate contentKey="userManagement.create.required">*</Translate>
                </span>
              </label>
              <input
                type="text"
                name="username"
                placeholder={translate('userManagement.create.fields.loginPlaceholder')}
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'error' : ''}
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label>
                <Translate contentKey="userManagement.create.fields.email">Email</Translate>{' '}
                <span className="required">
                  <Translate contentKey="userManagement.create.required">*</Translate>
                </span>
              </label>
              <input
                type="email"
                name="email"
                placeholder={translate('userManagement.create.fields.emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <Translate contentKey="userManagement.create.fields.fullName">Full Name</Translate>{' '}
                <span className="required">
                  <Translate contentKey="userManagement.create.required">*</Translate>
                </span>
              </label>
              <input
                type="text"
                name="fullName"
                placeholder={translate('userManagement.create.fields.fullNamePlaceholder')}
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>
                <Translate contentKey="userManagement.create.fields.role">Role</Translate>{' '}
                <span className="required">
                  <Translate contentKey="userManagement.create.required">*</Translate>
                </span>
              </label>
              <select name="role" value={formData.role} onChange={handleChange} className={errors.role ? 'error' : ''}>
                <option value="">{translate('userManagement.create.fields.roleSelect')}</option>
                <option value="ROLE_STUDENT">{translate('userManagement.create.roles.student')}</option>
                <option value="ROLE_TEACHER">{translate('userManagement.create.roles.teacher')}</option>
                <option value="ROLE_ADMIN">{translate('userManagement.create.roles.admin')}</option>
              </select>
              {errors.role && <span className="error-message">{errors.role}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <Translate contentKey="userManagement.create.fields.status">Status</Translate>
              </label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="active">{translate('userManagement.create.status.active')}</option>
                <option value="inactive">{translate('userManagement.create.status.inactive')}</option>
                <option value="pending">{translate('userManagement.create.status.pending')}</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <Translate contentKey="userManagement.create.fields.password">Password</Translate>{' '}
                <span className="required">
                  <Translate contentKey="userManagement.create.required">*</Translate>
                </span>
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder={translate('userManagement.create.fields.passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  <i className={`fa fa-eye${showPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>
                <Translate contentKey="userManagement.create.fields.confirmPassword">Confirm Password</Translate>{' '}
                <span className="required">
                  <Translate contentKey="userManagement.create.required">*</Translate>
                </span>
              </label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder={translate('userManagement.create.fields.passwordPlaceholder')}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <i className={`fa fa-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/admin/user-management')}>
              <Translate contentKey="userManagement.create.buttons.cancel">Cancel</Translate>
            </button>
            <button type="submit" className="btn-submit">
              <i className="fa fa-check"></i>
              <Translate contentKey="userManagement.create.buttons.addUser">Add User</Translate>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagementCreate;
