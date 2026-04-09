import { useMemo, useState } from 'react';
import { login } from '../../services/authApi';
import { createInitialLoginForm, validateLoginForm } from './login.model';

export default function useLoginController() {
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

      localStorage.setItem('orbitAuthToken', result.data.token);
      localStorage.setItem('orbitWorker', JSON.stringify(result.data.worker || {}));

      window.location.href = '1.1_dashboard.html';
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
