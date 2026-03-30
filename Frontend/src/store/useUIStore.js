import { create } from 'zustand';

// Global UI state (sidebar, modals, theme, etc.)
const useUIStore = create((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),

  // Confirm dialog
  confirmDialog: null,
  openConfirm: (config) => set({ confirmDialog: config }),
  closeConfirm: () => set({ confirmDialog: null }),
}));

export default useUIStore;
