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

// Ép kiểu Number() cẩn thận cho tất cả phép cộng
  const totalAllowance = data.allowances.reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalDeduction = data.deductions.reduce((s, i) => s + Number(i.amount || 0), 0);
  
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

      {/* Chi tiết 2 cột */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
        {/* Thu nhập */}
        <div className="glass-card" style={{ padding: 'var(--space-5)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', borderBottom: '2px solid var(--color-success)', paddingBottom: 12, marginBottom: 16 }}>THU NHẬP</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px dashed var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Lương cơ bản</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatVnd(data.baseSalary)}</span>
          </div>
          {data.allowances.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px dashed var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
              <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>+ {formatVnd(item.amount)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', marginTop: 8 }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Tổng cộng thu nhập</span>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 18 }}>{formatVnd(grossSalary)}</span>
          </div>
        </div>

        {/* Khấu trừ */}
        <div className="glass-card" style={{ padding: 'var(--space-5)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', borderBottom: '2px solid var(--color-danger)', paddingBottom: 12, marginBottom: 16 }}>KHẤU TRỪ</h2>
          {data.deductions.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px dashed var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
              <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>- {formatVnd(item.amount)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', marginTop: 8 }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Tổng cộng khấu trừ</span>
            <span style={{ fontWeight: 800, color: 'var(--color-danger)', fontSize: 18 }}>{formatVnd(totalDeduction)}</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default PayrollDetail;