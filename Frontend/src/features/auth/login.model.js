export function createInitialLoginForm() {
  return {
    userName: '',
    password: ''
  };
}

export function validateLoginForm(formData) {
  const errors = {
    userName: '',
    password: ''
  };

  if (!formData.userName.trim()) {
    errors.userName = 'Please enter your username';
  }

  if (!formData.password) {
    errors.password = 'Please enter your password';
  }

  return errors;
}
