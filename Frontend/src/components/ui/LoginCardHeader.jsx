import React from 'react';
import { Briefcase } from 'lucide-react';

function LoginCardHeader() {
  return (
    <div className="login-header">
      <div className="login-logo">
        <Briefcase size={28} color="#fff" strokeWidth={2.5} />
      </div>
      <h1 className="login-title">HRM System</h1>
      <p className="login-subtitle">Quản lý Nhân sự</p>
    </div>
  );
}

export default LoginCardHeader;
