import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import '../../styles/login-layout.css';

function LoginLayout() {
  const navigate = useNavigate();

  return (
    <div className="login-layout">
      <header className="login-layout-header">
        <div className="login-layout-container">
          <button
            onClick={() => navigate('/')}
            className="login-layout-logo"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              background: 'var(--brand-gradient)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-brand)',
            }}>
              <Briefcase size={20} color="#fff" />
            </div>
            <span style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}>
              HRM System
            </span>
          </button>
        </div>
      </header>

      <main className="login-layout-content">
        <Outlet />
      </main>

      <footer className="login-layout-footer">
        <div className="login-layout-container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
          }}>
            <p style={{
              margin: 0,
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-muted)',
            }}>
            </p>
            <div style={{
              display: 'flex',
              gap: 'var(--space-6)',
              fontSize: 'var(--font-size-xs)',
            }}>
              <a href="#" style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--text-secondary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              >
                Chính sách bảo mật
              </a>
              <a href="#" style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--text-secondary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              >
                Điều khoản sử dụng
              </a>
              <a href="#" style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--text-secondary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              >
                Liên hệ hỗ trợ
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LoginLayout;
