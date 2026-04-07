
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginBackground from '../../components/ui/LoginBackground';
import LoginCardHeader from '../../components/ui/LoginCardHeader';
import LoginFormFields from '../../components/ui/LoginFormFields';
import LoginCardFooter from '../../components/ui/LoginCardFooter';
import useAuthStore from '../../store/useAuthStore';
import '../../styles/login-page.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(username, password);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      if (error.status === 401) {
        passwordRef.current?.focus();
      }
    }
  };

  const handleFieldChange = (field, value) => {
    if (field === 'username') {
      setUsername(value);
      if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
    } else if (field === 'password') {
      setPassword(value);
      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <div className="login-container">
      <LoginBackground />

      <div className="login-card">
        <LoginCardHeader />

        <LoginFormFields
          username={username}
          password={password}
          errors={errors}
          isLoading={isLoading}
          usernameRef={usernameRef}
          passwordRef={passwordRef}
          onFieldChange={handleFieldChange}
          onKeyDown={handleKeyDown}
          onSubmit={handleLogin}
        />

        <LoginCardFooter />
      </div>
    </div>
  );
}

export default LoginPage;
