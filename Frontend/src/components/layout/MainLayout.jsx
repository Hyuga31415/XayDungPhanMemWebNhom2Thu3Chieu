import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import useUIStore from '../../store/useUIStore';
import { ConfirmDialog } from '../ui/Modal';
import '../../styles/layout.css';

// ============================================================
// MainLayout – Wraps all authenticated pages
// ============================================================

function MainLayout() {
  const { isSidebarCollapsed, confirmDialog, closeConfirm } = useUIStore();

  return (
    <div className="app-wrapper">
      <Sidebar />

      <div className={`main-area ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header />
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {/* Global Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={!!confirmDialog}
          title={confirmDialog.title}
          message={confirmDialog.message}
          danger={confirmDialog.danger !== false}
          onConfirm={() => {
            confirmDialog.onConfirm?.();
            closeConfirm();
          }}
          onCancel={closeConfirm}
        />
      )}
    </div>
  );
}

export default MainLayout;
