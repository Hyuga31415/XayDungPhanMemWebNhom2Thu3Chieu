import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Bổ sung useNavigate
import { Search, CheckCircle2, Eye, Play, Download, Clock, Wallet } from 'lucide-react';
import { formatVnd } from '../../utils/payrollUtils';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Table } from '../../components/ui/Table';
import usePayrollStore from '../../store/usePayrollStore';

const STATUS_MAP = {
  'Đã xác nhận': { variant: 'success', label: 'Đã xác nhận' },
  'Chờ duyệt': { variant: 'warning', label: 'Chờ duyệt' },
  'Draft': { variant: 'warning', label: 'Bản nháp' }, 
  'Đã chuyển khoản': { variant: 'info', label: 'Đã thanh toán' },
  'Paid': { variant: 'info', label: 'Đã thanh toán' }, 
};

function PayrollManagement() {
  const { payrolls, isLoading, isRunning, fetchPayrolls, runPayroll } = usePayrollStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate(); // Khởi tạo navigate
  
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [runMonth, setRunMonth] = useState(currentMonth);
  const [runYear, setRunYear] = useState(currentYear);

  useEffect(() => {
    fetchPayrolls();
  }, [fetchPayrolls]);

  const handleRunPayroll = async () => {
    try {
      await runPayroll(Number(runMonth), Number(runYear));
      alert(`Đã chốt lương tháng ${runMonth}/${runYear} thành công!`);
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Có lỗi xảy ra trong quá trình chốt lương');
    } finally {
      fetchPayrolls();
    }
  };

  const filteredPayrolls = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return payrolls.filter((item) =>
      (item.name || '').toLowerCase().includes(lowerQuery) ||
      (item.id || '').toLowerCase().includes(lowerQuery) ||
      (item.period || '').toLowerCase().includes(lowerQuery)
    );
  }, [query, payrolls]);

  const totalPayroll = useMemo(() => payrolls.reduce((sum, item) => sum + Number(item.netSalary || 0), 0), [payrolls]);
  const approvedCount = useMemo(() => payrolls.filter((item) => item.status !== 'Draft' && item.status !== 'Chờ duyệt').length, [payrolls]);
  const paidAmount = useMemo(() => payrolls.reduce((sum, item) => {
    const isPaid = ['Paid', 'Đã chuyển khoản', 'Đã thanh toán'].includes(item.status);
    return isPaid ? sum + Number(item.netSalary || 0) : sum;
  }, 0), [payrolls]);
  const unpaidAmount = totalPayroll - paidAmount;

  // ĐÃ FIX LỖI: Thêm onClick={...} vào nút Chi tiết
  const columns = [
    { key: 'id', title: 'Mã Phiếu', width: 120, render: (val) => <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>{val}</span> },
    { key: 'name', title: 'Nhân viên', width: 200, render: (val) => <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{val}</span> },
    { key: 'period', title: 'Kỳ lương', width: 120 },
    { key: 'netSalary', title: 'Thực lĩnh', width: 150, render: (val) => <span style={{ fontWeight: 700, color: 'var(--color-success)' }}>{formatVnd(val)}</span> },
    { key: 'status', title: 'Trạng thái', width: 150, render: (val) => <Badge variant={STATUS_MAP[val]?.variant || 'default'}>{STATUS_MAP[val]?.label || val}</Badge> },
    { key: 'actions', title: 'Thao tác', width: 120, align: 'center', render: (_, record) => (
      <Button 
        variant="ghost" 
        size="sm" 
        icon={Eye} 
        onClick={() => navigate(`/payroll/detail?id=${record.dbId}`)}
      >
        Chi tiết
      </Button>
    )}
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        
        <div className="card-premium" style={{ padding: 'var(--space-5)', background: 'var(--brand-gradient)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h1 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800 }}>Chốt bảng lương</h1>
          </div>
          
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: 'var(--radius-md)', display: 'flex', gap: 4 }}>
              <input 
                type="number" min="1" max="12" value={runMonth} onChange={(e) => setRunMonth(e.target.value)}
                style={{ width: 45, background: 'transparent', color: 'white', border: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: 16, outline: 'none' }} 
              />
              <span style={{ opacity: 0.5 }}>/</span>
              <input 
                type="number" min="2000" max="2100" value={runYear} onChange={(e) => setRunYear(e.target.value)}
                style={{ width: 60, background: 'transparent', color: 'white', border: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: 16, outline: 'none' }} 
              />
            </div>
            
            <Button variant="secondary" icon={Play} onClick={handleRunPayroll} loading={isRunning} style={{ flex: 1, color: 'var(--brand-primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              Chạy dữ liệu
            </Button>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', fontWeight: 600 }}>Phiếu đã duyệt / Tổng</p>
            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>{approvedCount} <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/ {payrolls.length}</span></p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={24} />
          </div>
          <div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', fontWeight: 600 }}>Tiền đã thanh toán</p>
            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>{formatVnd(paidAmount)}</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', fontWeight: 600 }}>Tiền chờ thanh toán</p>
            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>{formatVnd(unpaidAmount)}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Tổng quỹ: <span style={{fontWeight: 700}}>{formatVnd(totalPayroll)}</span></p>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--text-primary)' }}>Danh sách bảng lương</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Dữ liệu chi tiết của từng nhân viên</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 250 }}>
              <Input icon={Search} placeholder="Tìm mã NV, tên..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Button variant="outline" icon={Download}>Xuất Excel</Button>
          </div>
        </div>

        <Table 
          columns={columns} 
          data={filteredPayrolls} 
          loading={isLoading} 
          rowKey="id" 
          emptyText={isLoading ? "Đang tải dữ liệu..." : "Chưa có bảng lương nào. Hãy chọn tháng và bấm Chạy dữ liệu."} 
        />
      </div>
    </div>
  );
}

export default PayrollManagement;