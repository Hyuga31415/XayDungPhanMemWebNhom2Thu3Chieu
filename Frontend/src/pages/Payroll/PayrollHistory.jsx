import React, { useMemo, useState } from 'react';
import { History, Calendar, Users, DollarSign, ArrowRight } from 'lucide-react';
import { formatVnd } from '../../utils/payrollUtils';
import Badge from '../../components/ui/Badge';

function PayrollHistory({ historyItems }) {
  const [selectedMonth, setSelectedMonth] = useState(historyItems[0]?.month ?? '');

  const selectedItem = useMemo(
    () => historyItems.find((item) => item.month === selectedMonth) || historyItems[0] || {},
    [selectedMonth, historyItems]
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>Lịch sử chi trả</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Theo dõi lịch sử các kỳ lương từ trước tới nay.</p>
        </div>
        <div className="glass-card" style={{ padding: 'var(--space-3) var(--space-5)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Calendar color="var(--brand-primary)" />
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Kỳ đang xem</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{selectedItem.month}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-5)', alignItems: 'start' }}>
        
        {/* Lịch sử List */}
        <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Các kỳ đã phát hành</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {historyItems.map((item) => (
              <div 
                key={item.month}
                onClick={() => setSelectedMonth(item.month)}
                style={{
                  padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  border: `1px solid ${item.month === selectedMonth ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                  background: item.month === selectedMonth ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-elevated)',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Kỳ {item.month}</span>
                  <Badge variant={item.status === 'Hoàn thành' ? 'success' : 'warning'}>{item.status}</Badge>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tổng chi trả: <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{formatVnd(item.totalPaid)}</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* Chi tiết kỳ lương */}
        <div className="card-premium" style={{ padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-6)' }}>Tóm tắt kỳ {selectedItem.month}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
            <div style={{ padding: 'var(--space-5)', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-normal)' }}>
              <Users size={20} color="var(--brand-primary)" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Tổng nhân viên nhận lương</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>{selectedItem.employees}</p>
            </div>
            
            <div style={{ padding: 'var(--space-5)', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-normal)' }}>
              <DollarSign size={20} color="var(--color-success)" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Tổng chi trả</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-success)', marginTop: 4 }}>{formatVnd(selectedItem.totalPaid)}</p>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-5)', background: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-info)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Ghi chú hệ thống</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Kỳ lương này đã được chuyển khoản tới {selectedItem.employees} nhân sự. Lịch sử này hỗ trợ HR đối soát lại các khoản chi trả khi có khiếu nại. Không thể chỉnh sửa sau khi đã đóng kỳ.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PayrollHistory;