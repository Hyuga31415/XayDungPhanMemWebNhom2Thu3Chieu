import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router/AppRouter';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Nhúng toàn bộ file CSS (để giao diện không bị vỡ)
import './styles/variables.css'
import './styles/global.css'
import './styles/layout.css'
import './styles/login-page.css'
import './styles/login-layout.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="hrm-dashboard-root">
      <AppRouter />
    </div>
  </React.StrictMode>,
);