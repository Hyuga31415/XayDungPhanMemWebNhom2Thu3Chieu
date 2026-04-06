import React from 'react';
import AppRouter from './router/AppRouter';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="hrm-dashboard-root">
      <Toaster position="top-right" />
      <AppRouter />
    </div>
  );
}

export default App;