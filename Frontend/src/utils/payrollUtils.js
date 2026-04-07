/**
 * Format currency to VND format
 * @param {number} value - Value to format
 * @returns {string} Formatted VND string
 */
export const formatVnd = (value) => {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(safeValue);
};

/**
 * Status badge color mapping
 */
export const statusStyles = {
  'Hoàn thành': 'success',
  'Chờ phê duyệt': 'warning',
  'Đã xác nhận': 'success',
  'Chờ duyệt': 'warning',
  'Đã chuyển khoản': 'info',
};

/**
 * Get status badge color
 * @param {string} status - Status text
 * @returns {string} Badge color class
 */
export const getStatusColor = (status) => statusStyles[status] || 'secondary';

/**
 * Safe toast notification (requires react-hot-toast or similar)
 * @param {string} message - Message to show
 * @param {string} type - 'success', 'error', 'info'
 */
export const showToast = (message, type = 'success') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
};
