import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, FileText, User } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { employeeService } from '../../api/employeeService';
import { formatVnd } from '../../utils/payrollUtils';

const TAB_KEYS = {
  PROFILE: 'profile',
  HISTORY: 'history',
  CONTRACT: 'contract'
};

function EmployeeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState(TAB_KEYS.PROFILE);
  const [employee, setEmployee] = useState(null);
  const [jobHistory, setJobHistory] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [emp, historyRes, contractRes] = await Promise.all([
          employeeService.getById(id),
          employeeService.getJobHistory(id),
          employeeService.getContracts(id)
        ]);

        setEmployee(emp);
        setJobHistory(Array.isArray(historyRes) ? historyRes : []);
        setContracts(Array.isArray(contractRes) ? contractRes : []);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải hồ sơ nhân viên...</div>;
  }

  if (!employee) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Không tìm thấy nhân viên.</div>;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/employees')}>Quay lại</Button>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>{employee.full_name || employee.fullName}</h1>
            <p style={{ color: 'var(--text-muted)' }}>{employee.emp_code} • {employee.email}</p>
          </div>
        </div>
        <Badge variant={employee.status === 'Active' ? 'success' : 'default'}>
          {employee.status === 'Active' ? 'Đang làm' : 'Đã nghỉ'}
        </Badge>
      </div>

      <div className="glass-card" style={{ padding: 'var(--space-4)', display: 'flex', gap: 8 }}>
        <button onClick={() => setActiveTab(TAB_KEYS.PROFILE)} style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: activeTab === TAB_KEYS.PROFILE ? 'var(--brand-primary)' : 'var(--bg-elevated)', color: activeTab === TAB_KEYS.PROFILE ? '#fff' : 'var(--text-secondary)', cursor: 'pointer' }}>
          <User size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Thông tin cơ bản
        </button>
        <button onClick={() => setActiveTab(TAB_KEYS.HISTORY)} style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: activeTab === TAB_KEYS.HISTORY ? 'var(--brand-primary)' : 'var(--bg-elevated)', color: activeTab === TAB_KEYS.HISTORY ? '#fff' : 'var(--text-secondary)', cursor: 'pointer' }}>
          <Briefcase size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Lịch sử công tác
        </button>
        <button onClick={() => setActiveTab(TAB_KEYS.CONTRACT)} style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: activeTab === TAB_KEYS.CONTRACT ? 'var(--brand-primary)' : 'var(--bg-elevated)', color: activeTab === TAB_KEYS.CONTRACT ? '#fff' : 'var(--text-secondary)', cursor: 'pointer' }}>
          <FileText size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Hợp đồng & Lương
        </button>
      </div>

      {activeTab === TAB_KEYS.PROFILE && (
        <div className="glass-card" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div><p style={{ color: 'var(--text-muted)' }}>Phòng ban</p><p style={{ fontWeight: 700 }}>{employee.departmentName || '-'}</p></div>
            <div><p style={{ color: 'var(--text-muted)' }}>Chức vụ</p><p style={{ fontWeight: 700 }}>{employee.position || '-'}</p></div>
            <div><p style={{ color: 'var(--text-muted)' }}>Ngày vào làm</p><p style={{ fontWeight: 700 }}>{employee.hire_date || '-'}</p></div>
            <div><p style={{ color: 'var(--text-muted)' }}>Giới tính</p><p style={{ fontWeight: 700 }}>{employee.gender === 'female' ? 'Nữ' : 'Nam'}</p></div>
          </div>
        </div>
      )}

      {activeTab === TAB_KEYS.HISTORY && (
        <div className="glass-card" style={{ padding: 'var(--space-5)' }}>
          {jobHistory.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Chưa có bản ghi lịch sử công tác.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid var(--border-normal)' }}>Ngày hiệu lực</th>
                    <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid var(--border-normal)' }}>Phòng ban</th>
                    <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid var(--border-normal)' }}>Chức vụ</th>
                    <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid var(--border-normal)' }}>Lý do</th>
                  </tr>
                </thead>
                <tbody>
                  {jobHistory.map((item) => (
                    <tr key={item.id}>
                      <td style={{ padding: 10, borderBottom: '1px dashed var(--border-subtle)' }}>{item.effective_date}</td>
                      <td style={{ padding: 10, borderBottom: '1px dashed var(--border-subtle)' }}>{item.old_department_name || '-'} → {item.new_department_name || '-'}</td>
                      <td style={{ padding: 10, borderBottom: '1px dashed var(--border-subtle)' }}>{item.old_position_title || '-'} → {item.new_position_title || '-'}</td>
                      <td style={{ padding: 10, borderBottom: '1px dashed var(--border-subtle)' }}>{item.reason || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === TAB_KEYS.CONTRACT && (
        <div className="glass-card" style={{ padding: 'var(--space-5)' }}>
          {contracts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Nhân viên chưa có hợp đồng trong hệ thống.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid var(--border-normal)' }}>Mã hợp đồng</th>
                    <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid var(--border-normal)' }}>Thời hạn</th>
                    <th style={{ textAlign: 'right', padding: 10, borderBottom: '1px solid var(--border-normal)' }}>Lương cơ bản</th>
                    <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid var(--border-normal)' }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((item) => (
                    <tr key={item.id}>
                      <td style={{ padding: 10, borderBottom: '1px dashed var(--border-subtle)' }}>{item.contract_code}</td>
                      <td style={{ padding: 10, borderBottom: '1px dashed var(--border-subtle)' }}>{item.start_date} - {item.end_date || 'Không thời hạn'}</td>
                      <td style={{ padding: 10, textAlign: 'right', borderBottom: '1px dashed var(--border-subtle)', fontWeight: 700 }}>{formatVnd(item.base_salary)}</td>
                      <td style={{ padding: 10, borderBottom: '1px dashed var(--border-subtle)' }}>
                        <Badge variant={item.status === 'Active' ? 'success' : 'default'}>{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EmployeeDetailPage;
