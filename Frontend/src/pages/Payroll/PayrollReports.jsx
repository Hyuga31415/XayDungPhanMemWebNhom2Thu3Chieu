import React from 'react';
import { BarChart3, Download, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { formatVnd } from '../../utils/payrollUtils';
import Button from '../../components/ui/Button';

function PayrollReports({ reportData, quickInsights }) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>Báo cáo Tài chính Nhân sự</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Tổng hợp số liệu chi phí lương và phụ cấp toàn hệ thống.</p>
        </div>
        <Button icon={Download}>Xuất PDF</Button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
        {reportData.map((item) => {
          const isUp = item.trend.includes('+');
          return (
            <div key={item.title} className="glass-card" style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart3 size={24} color={item.color} />
                </div>
                <div style={{ padding: '4px 8px', background: isUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: isUp ? 'var(--color-success)' : 'var(--color-danger)', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {item.trend}
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: 'var(--space-5)' }}>{item.title}</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>{formatVnd(item.value)}</p>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-5)' }}>
        {/* Phân tích Chart Placeholder */}
        <div className="card-premium" style={{ padding: 'var(--space-6)', minHeight: 300, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--text-primary)' }}>Phân tích cơ cấu chi phí (Tháng này)</h2>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            <div style={{ textAlign: 'center' }}>
              <BarChart3 size={48} style={{ opacity: 0.2, margin: '0 auto 12px' }} />
              <p>Khu vực hiển thị biểu đồ phân bổ (Recharts)</p>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-5)' }}>
            <Info size={18} color="var(--brand-primary)" /> Đánh giá nhanh
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {quickInsights.map((insight, idx) => (
              <div key={idx} style={{ padding: '12px 16px', background: 'var(--bg-base)', borderLeft: '3px solid var(--brand-primary)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {insight}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayrollReports;