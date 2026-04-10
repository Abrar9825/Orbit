import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../../services/authApi';
import { setAuthSession } from '../../services/authStorage';
import { createInitialLoginForm, validateLoginForm } from './login.model';

export default function useLoginController() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState(createInitialLoginForm());
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ userName: '', password: '' });

  const canSubmit = useMemo(() => !isLoading, [isLoading]);

  const onChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    setSubmitError('');
  };

  const onTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validate = () => {
    const nextErrors = validateLoginForm(formData);
    setFieldErrors(nextErrors);

    return !nextErrors.userName && !nextErrors.password;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    const fromLocation = location.state?.from;
    const nextPath = fromLocation
      ? `${fromLocation.pathname || '/cards'}${fromLocation.search || ''}${fromLocation.hash || ''}`
      : '/cards';

    if (!validate()) {
      return;
    }

    try {
      setIsLoading(true);

      const result = await login({
        userName: formData.userName.trim(),
        password: formData.password
      });

      if (result?.status !== 'success' || !result?.data?.token) {
        throw new Error(result?.message || 'Unable to login');
      }

      setAuthSession({
        token: result.data.token,
        worker: result.data.worker || {}
      });

      navigate(nextPath, { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Login failed. Please try again.';
      setSubmitError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    fieldErrors,
    submitError,
    showPassword,
    isLoading,
    canSubmit,
    onChange,
    onSubmit,
    onTogglePassword
  };
}
