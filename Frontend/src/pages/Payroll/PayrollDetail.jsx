import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Receipt, Download, Building2, Briefcase, Calendar, ArrowLeft, AlertCircle } from 'lucide-react';
import { formatVnd } from '../../utils/payrollUtils';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import usePayrollStore from '../../store/usePayrollStore';
import useAuthStore from '../../store/useAuthStore';
import payrollService from '../../api/payrollService';

function PayrollDetail() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  
  const { currentDetail: data, isLoading, fetchDetail } = usePayrollStore();
  const { user } = useAuthStore();
  
  // State để hiển thị thông báo lỗi thân thiện thay vì dùng alert
  const [noDataMessage, setNoDataMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchDetail(id).catch(() => {
         setNoDataMessage('Không tìm thấy phiếu lương hoặc bạn không có quyền xem!');
      });
    } else {
      // ĐÃ FIX LỖI: Xử lý khi click từ Sidebar (không có ID trên URL)
      if (user?.role === 'Staff') {
          // Nếu là Staff, tự động gọi API lịch sử để tìm phiếu mới nhất
          payrollService.getHistory().then(res => {
              const historyData = Array.isArray(res) ? res : (res?.data || []);
              if (historyData.length > 0 && historyData[0].recordId) {
                  // Chuyển hướng âm thầm (replace) sang phiếu lương mới nhất
                  navigate(`/payroll/detail?id=${historyData[0].recordId}`, { replace: true });
              } else {
                  setNoDataMessage('Bạn chưa có phiếu lương nào trong hệ thống.');
              }
          }).catch(() => setNoDataMessage('Lỗi khi lấy dữ liệu lương cá nhân.'));
      } else {
          // Nếu là Admin/HR, bắt buộc phải chọn từ bảng
          setNoDataMessage('Vui lòng chọn một phiếu lương cụ thể từ màn hình Quản lý Bảng lương.');
      }
    }
  }, [id, fetchDetail, navigate, user]);

  // Hiển thị màn hình lỗi thân thiện nếu bị chặn
  if (noDataMessage) {
    return (
      <div style={{ padding: 80, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
        <AlertCircle size={48} color="var(--text-muted)" />
        <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)', fontWeight: 700 }}>Thông báo</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{noDataMessage}</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <Button variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>
            {user?.role !== 'Staff' && (
                <Button onClick={() => navigate('/payroll/management')}>Về Quản lý bảng lương</Button>
            )}
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải chi tiết phiếu lương...</div>;
  }

  const detailLines = Array.isArray(data.payroll_details) ? data.payroll_details : [];
  const totalAllowance = detailLines
    .filter((item) => item.component_type === 'Allowance')
    .reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalDeduction = detailLines
    .filter((item) => item.component_type === 'Deduction')
    .reduce((s, i) => s + Number(i.amount || 0), 0);
  
  const grossSalary = Number(data.baseSalary || 0) + totalAllowance;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', maxWidth: 1000, margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: 'var(--text-muted)', width: 'fit-content' }} onClick={() => navigate(-1)}>
         <ArrowLeft size={16} /> <span style={{ fontSize: 14, fontWeight: 600 }}>Quay lại</span>
      </div>

      {/* Header Info */}
      <div className="card-premium" style={{ padding: 'var(--space-6)', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--brand-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, boxShadow: 'var(--shadow-md)' }}>
              {data.name.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>{data.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                 <p style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>{data.emp_code}</p>
                 <Badge variant={data.status === 'Draft' ? 'warning' : 'success'}>{data.status === 'Draft' ? 'Bản nháp' : data.status}</Badge>
              </div>
            </div>
          </div>
          <Button icon={Download} variant="secondary">Lưu Phiếu PDF</Button>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-6)', marginTop: 'var(--space-5)', paddingTop: 'var(--space-5)', borderTop: '1px dashed var(--border-normal)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}><Calendar size={16}/> Kỳ lương: <span style={{ fontWeight: 700, color: 'var(--text-primary)'}}>{data.period}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}><Building2 size={16}/> Phòng: <span style={{ fontWeight: 700, color: 'var(--text-primary)'}}>{data.department || 'Chưa xếp phòng'}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}><Briefcase size={16}/> Chức vụ: <span style={{ fontWeight: 700, color: 'var(--text-primary)'}}>{data.position || 'Chưa có chức vụ'}</span></div>
        </div>
      </div>

      {/* Tóm tắt lương */}
      <div className="glass-card" style={{ padding: 'var(--space-6)', textAlign: 'center', background: 'linear-gradient(180deg, var(--bg-elevated) 0%, rgba(99, 102, 241, 0.05) 100%)' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Thực lĩnh kỳ {data.period}</p>
        <p style={{ fontSize: 48, fontWeight: 900, color: 'var(--brand-primary)', margin: '8px 0', textShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}>{formatVnd(data.netSalary)}</p>
        <p style={{ fontSize: 13, color: 'var(--color-success)', fontWeight: 600 }}>
          {data.status === 'Draft' ? 'Đang chờ kế toán phê duyệt' : 'Đã thanh toán vào tài khoản NH'}
        </p>
      </div>

      {/* Bảng chi tiết phiếu lương theo payroll_details */}
      <div className="glass-card" style={{ padding: 'var(--space-5)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>CHI TIẾT CÁC KHOẢN CỘNG/TRỪ</h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid var(--border-normal)', fontSize: 12, color: 'var(--text-muted)' }}>Khoản mục</th>
                <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid var(--border-normal)', fontSize: 12, color: 'var(--text-muted)' }}>Loại</th>
                <th style={{ textAlign: 'right', padding: 10, borderBottom: '1px solid var(--border-normal)', fontSize: 12, color: 'var(--text-muted)' }}>Số tiền</th>
                <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid var(--border-normal)', fontSize: 12, color: 'var(--text-muted)' }}>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: 10, borderBottom: '1px dashed var(--border-subtle)', color: 'var(--text-secondary)' }}>Lương cơ bản</td>
                <td style={{ padding: 10, borderBottom: '1px dashed var(--border-subtle)' }}><Badge variant="default">Base</Badge></td>
                <td style={{ padding: 10, textAlign: 'right', borderBottom: '1px dashed var(--border-subtle)', fontWeight: 700 }}>{formatVnd(data.baseSalary)}</td>
                <td style={{ padding: 10, borderBottom: '1px dashed var(--border-subtle)', color: 'var(--text-muted)' }}>Theo hợp đồng</td>
              </tr>

              {detailLines.map((line) => (
                <tr key={line.id}>
                  <td style={{ padding: 10, borderBottom: '1px dashed var(--border-subtle)', color: 'var(--text-secondary)' }}>{line.component_name}</td>
                  <td style={{ padding: 10, borderBottom: '1px dashed var(--border-subtle)' }}>
                    <Badge variant={line.component_type === 'Allowance' ? 'success' : 'danger'}>
                      {line.component_type === 'Allowance' ? 'Cộng' : 'Trừ'}
                    </Badge>
                  </td>
                  <td style={{ padding: 10, textAlign: 'right', borderBottom: '1px dashed var(--border-subtle)', fontWeight: 700, color: line.component_type === 'Allowance' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {line.component_type === 'Allowance' ? '+' : '-'} {formatVnd(line.amount)}
                  </td>
                  <td style={{ padding: 10, borderBottom: '1px dashed var(--border-subtle)', color: 'var(--text-muted)' }}>{line.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(160px, 1fr))', gap: 12 }}>
          <div style={{ padding: 12, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tổng thu nhập</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{formatVnd(grossSalary)}</p>
          </div>
          <div style={{ padding: 12, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tổng khấu trừ</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-danger)' }}>{formatVnd(totalDeduction)}</p>
          </div>
          <div style={{ padding: 12, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.08)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Thực lĩnh</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-success)' }}>{formatVnd(data.netSalary)}</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default PayrollDetail;