import React from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';

function LoginFormFields({
  username,
  password,
  errors,
  isLoading,
  usernameRef,
  passwordRef,
  onFieldChange,
  onKeyDown,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="login-form">
      <Input
        ref={usernameRef}
        label="Tên đăng nhập"
        type="text"
        placeholder="Nhập tên đăng nhập"
        value={username}
        onChange={(e) => onFieldChange('username', e.target.value)}
        onKeyDown={onKeyDown}
        error={errors.username}
        icon={Mail}
        required
        containerStyle={{ marginBottom: 16 }}
        disabled={isLoading}
      />

      <Input
        ref={passwordRef}
        label="Mật khẩu"
        type="password"
        placeholder="Nhập mật khẩu"
        value={password}
        onChange={(e) => onFieldChange('password', e.target.value)}
        onKeyDown={onKeyDown}
        error={errors.password}
        icon={Lock}
        required
        containerStyle={{ marginBottom: 8 }}
        disabled={isLoading}
      />

      <div className="login-extras">
        <label className="remember-checkbox">
          <input type="checkbox" />
          <span>Ghi nhớ đăng nhập</span>
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        icon={LogIn}
        style={{ marginTop: 24 }}
      >
        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>
    </form>
  );
}

export default LoginFormFields;
