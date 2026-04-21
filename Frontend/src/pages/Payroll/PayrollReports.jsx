import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, Download, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { formatVnd } from '../../utils/payrollUtils';
import Button from '../../components/ui/Button';
import payrollService from '../../api/payrollService';

const defaultReportData = [
  { title: 'Tổng quỹ lương', value: 0, color: 'var(--color-success)', bg: 'rgba(16, 185, 129, 0.1)', trend: '+0.0%' },
  { title: 'Tổng phụ cấp', value: 0, color: 'var(--color-info)', bg: 'rgba(59, 130, 246, 0.1)', trend: '+0.0%' },
  { title: 'Tổng khấu trừ', value: 0, color: 'var(--color-warning)', bg: 'rgba(245, 158, 11, 0.1)', trend: '+0.0%' },
];

const defaultQuickInsights = [
  'Chưa có đủ dữ liệu để sinh insight tự động.',
];

function PayrollReports({ reportData, quickInsights }) {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadPayrollReportData = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const res = await payrollService.getAll();
        const list = Array.isArray(res) ? res : (res?.data || []);
        setRows(list);
      } catch (error) {
        setErrorMessage(error.message || 'Không thể tải dữ liệu báo cáo lương.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPayrollReportData();
  }, []);

  const analytics = useMemo(() => {
    if (!rows.length) {
      return {
        reportData: defaultReportData,
        quickInsights: defaultQuickInsights,
      };
    }

    const totalPayrollFund = rows.reduce((sum, row) => sum + Number(row.net_salary || 0), 0);
    const totalAllowance = rows.reduce((sum, row) => sum + Number(row.total_allowance || 0), 0);
    const totalDeduction = rows.reduce((sum, row) => sum + Number(row.total_deduction || 0), 0);
    const paidCount = rows.filter((row) => row.status === 'Paid').length;
    const draftCount = rows.filter((row) => row.status === 'Draft').length;

    const safeReportData = [
      { title: 'Tổng quỹ lương', value: totalPayrollFund, color: 'var(--color-success)', bg: 'rgba(16, 185, 129, 0.1)', trend: rows.length > 0 ? '+100%' : '+0.0%' },
      { title: 'Tổng phụ cấp', value: totalAllowance, color: 'var(--color-info)', bg: 'rgba(59, 130, 246, 0.1)', trend: totalPayrollFund > 0 ? `+${((totalAllowance / totalPayrollFund) * 100).toFixed(1)}%` : '+0.0%' },
      { title: 'Tổng khấu trừ', value: totalDeduction, color: 'var(--color-warning)', bg: 'rgba(245, 158, 11, 0.1)', trend: totalPayrollFund > 0 ? `-${((totalDeduction / totalPayrollFund) * 100).toFixed(1)}%` : '+0.0%' },
    ];

    const safeQuickInsights = [
      `Đã tổng hợp ${rows.length} phiếu lương từ dữ liệu hệ thống.`,
      `Số phiếu đã thanh toán: ${paidCount}, bản nháp/chờ duyệt: ${draftCount}.`,
      `Tỷ lệ khấu trừ trên quỹ lương: ${totalPayrollFund > 0 ? ((totalDeduction / totalPayrollFund) * 100).toFixed(2) : '0.00'}%.`,
    ];

    return { reportData: safeReportData, quickInsights: safeQuickInsights };
  }, [rows]);

  const safeReportData = Array.isArray(reportData) && reportData.length > 0 ? reportData : defaultReportData;
  const safeQuickInsights = Array.isArray(quickInsights) && quickInsights.length > 0 ? quickInsights : defaultQuickInsights;

  const finalReportData = Array.isArray(reportData) && reportData.length > 0 ? reportData : analytics.reportData;
  const finalQuickInsights = Array.isArray(quickInsights) && quickInsights.length > 0 ? quickInsights : analytics.quickInsights;

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
      {errorMessage && (
        <div className="glass-card" style={{ padding: 'var(--space-4)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
          {errorMessage}
        </div>
      )}

      {isLoading && (
        <div className="glass-card" style={{ padding: 'var(--space-4)', color: 'var(--text-muted)' }}>
          Đang tải dữ liệu báo cáo lương...
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
        {finalReportData.map((item) => {
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
            {finalQuickInsights.map((insight, idx) => (
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