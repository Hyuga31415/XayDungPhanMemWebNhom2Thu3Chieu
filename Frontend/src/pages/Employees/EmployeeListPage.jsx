import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Pencil, Trash2, Users, RefreshCw } from 'lucide-react';
import useEmployeeStore from '../../store/useEmployeeStore';
import useDepartmentStore from '../../store/useDepartmentStore';
import useUIStore from '../../store/useUIStore';
import { Table, Pagination } from '../../components/ui/Table';
import Badge, { STATUS_MAP } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import EmployeeFormModal from './EmployeeFormModal';

// ============================================================
// Employee List Page
// ============================================================

function EmployeeListPage() {
  const {
    employees, total, totalPages, currentPage, isLoading, isSubmitting,
    filters, fetchEmployees, setFilters, setPage, createEmployee, updateEmployee, deleteEmployee,
  } = useEmployeeStore();

  const { departments, fetchDepartments } = useDepartmentStore();
  const { openConfirm } = useUIStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setFilters({ search: localSearch }), 400);
    return () => clearTimeout(t);
  }, [localSearch]);

  const openAdd = () => { setEditingEmployee(null); setModalOpen(true); };
  const openEdit = (emp) => { setEditingEmployee(emp); setModalOpen(true); };

  const handleDelete = (emp) => {
    openConfirm({
      title: 'Xóa nhân viên',
      // Dùng emp_code từ HRM.sql
      message: `Bạn có chắc muốn xóa nhân viên "${emp.full_name || emp.fullName}" (${emp.emp_code})? Hành động này không thể hoàn tác.`,
      onConfirm: () => deleteEmployee(emp.id),
    });
  };

  const handleFormSubmit = async (data) => {
    const success = editingEmployee
      ? await updateEmployee(editingEmployee.id, data)
      : await createEmployee(data);
    if (success) setModalOpen(false);
  };

  // Table columns – ánh xạ từ HRM.sql fields
  const columns = [
    {
      key: 'full_name', title: 'Nhân viên', width: 220,
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 'var(--radius-md)',
            background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>{row.avatar}</div>
          <div>
            <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{val}</p>
            {/* emp_code từ HRM.sql */}
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{row.emp_code}</p>
          </div>
        </div>
      ),
    },
    { key: 'departmentName', title: 'Phòng ban', width: 180 },
    { key: 'position', title: 'Chức vụ', width: 200 },
    {
      key: 'email', title: 'Email', width: 180,
      render: (val) => <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{val}</span>,
    },
    {
      key: 'hire_date', title: 'Ngày vào làm', width: 120,
      render: (val) => {
        if (!val) return '';
        const date = new Date(val);
        // toLocaleDateString('vi-VN') sẽ tự động xuất ra định dạng dd/mm/yyyy
        return <span style={{ fontSize: 'var(--font-size-sm)' }}>{date.toLocaleDateString('vi-VN')}</span>;
      }
    },
    {
      // status ENUM('Active', 'Resigned') từ HRM.sql
      key: 'status', title: 'Trạng thái', width: 110, align: 'center',
      render: (val) => {
        const s = STATUS_MAP[val] || { variant: 'default', label: val };
        return <Badge variant={s.variant}>{s.label}</Badge>;
      },
    },
    {
      key: 'id', title: 'Thao tác', width: 100, align: 'center',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          <button
            onClick={() => openEdit(row)}
            style={{ width: 30, height: 30, borderRadius: 'var(--radius-md)', background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
            title="Chỉnh sửa"
            onMouseEnter={(e) => { e.currentTarget.style.background = '#6366f126'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-glass)'; }}
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            style={{ width: 30, height: 30, borderRadius: 'var(--radius-md)', background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
            title="Xóa"
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-danger-bg)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-glass)'; }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-brand)' }}>
            <Users size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>Danh sách nhân viên</h1>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>Tổng cộng {total} nhân viên</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="secondary" icon={RefreshCw} onClick={fetchEmployees} size="sm">Làm mới</Button>
          <Button icon={Plus} onClick={openAdd}>Thêm nhân viên</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <Input
            icon={Search}
            placeholder="Tìm theo tên, mã NV, email..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        <div style={{ minWidth: 180 }}>
          {/* filter theo department_id – SQL field name */}
          <Select
            value={filters.departmentId}
            onChange={(e) => setFilters({ departmentId: e.target.value })}
          >
            <option value="">Tất cả phòng ban</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Select>
        </div>
        <div style={{ minWidth: 160 }}>
          {/* filter theo ENUM('Active', 'Resigned') trong HRM.sql */}
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value })}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Active">Đang làm</option>
            <option value="Resigned">Đã nghỉ</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
        <Table
          columns={columns}
          data={employees}
          loading={isLoading}
          rowKey="id"
          emptyText="Không tìm thấy nhân viên nào phù hợp"
        />
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          total={total}
          limit={8}
          onPageChange={setPage}
        />
      </div>

      {/* Form Modal */}
      <EmployeeFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        employee={editingEmployee}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default EmployeeListPage;
