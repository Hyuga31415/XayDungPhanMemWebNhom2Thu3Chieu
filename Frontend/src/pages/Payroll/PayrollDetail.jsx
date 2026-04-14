import React from 'react';
import { Receipt, Download, Building2, Briefcase, Calendar } from 'lucide-react';
import { formatVnd } from '../../utils/payrollUtils';
import Button from '../../components/ui/Button';

function PayrollDetail({ employee }) {
  // Dữ liệu mock (có thể ghi đè bằng prop truyền vào)
  const data = employee ?? {
    name: 'Nguyễn Văn A', emp_code: 'NV-001', position: 'Chuyên viên Backend', department: 'Phòng IT',
    period: '03/2026', baseSalary: 20000000,
    allowances: [{ label: 'Phụ cấp ăn trưa', amount: 800000 }, { label: 'Phụ cấp dự án', amount: 2000000 }],
    deductions: [{ label: 'Bảo hiểm xã hội', amount: 1600000 }, { label: 'Thuế TNCN', amount: 450000 }],
  };

  const totalAllowance = data.allowances.reduce((s, i) => s + i.amount, 0);
  const totalDeduction = data.deductions.reduce((s, i) => s + i.amount, 0);
  const grossSalary = data.baseSalary + totalAllowance;
  const netSalary = grossSalary - totalDeduction;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', maxWidth: 1000, margin: '0 auto' }}>
      
      {/* Header Info */}
      <div className="card-premium" style={{ padding: 'var(--space-6)', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--brand-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, boxShadow: 'var(--shadow-md)' }}>
              {data.name.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>{data.name}</h1>
              <p style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{data.emp_code}</p>
            </div>
          </div>
          <Button icon={Download} variant="secondary">Lưu Phiếu PDF</Button>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-6)', marginTop: 'var(--space-5)', paddingTop: 'var(--space-5)', borderTop: '1px dashed var(--border-normal)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}><Calendar size={16}/> Kỳ lương: <span style={{ fontWeight: 700, color: 'var(--text-primary)'}}>{data.period}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}><Building2 size={16}/> Phòng: <span style={{ fontWeight: 700, color: 'var(--text-primary)'}}>{data.department}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}><Briefcase size={16}/> Chức vụ: <span style={{ fontWeight: 700, color: 'var(--text-primary)'}}>{data.position}</span></div>
        </div>
      </div>

      {/* Tóm tắt lương */}
      <div className="glass-card" style={{ padding: 'var(--space-6)', textAlign: 'center', background: 'linear-gradient(180deg, var(--bg-elevated) 0%, rgba(99, 102, 241, 0.05) 100%)' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Thực lĩnh kỳ {data.period}</p>
        <p style={{ fontSize: 48, fontWeight: 900, color: 'var(--brand-primary)', margin: '8px 0', textShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}>{formatVnd(netSalary)}</p>
        <p style={{ fontSize: 13, color: 'var(--color-success)', fontWeight: 600 }}>Đã thanh toán vào tài khoản NH</p>
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