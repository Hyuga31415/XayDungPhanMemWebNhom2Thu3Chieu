import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, FileText } from 'lucide-react';
import { formatVnd } from '../../utils/payrollUtils';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import usePayrollStore from '../../store/usePayrollStore';
import useAuthStore from '../../store/useAuthStore';

function PayrollHistory() {
  const { history, isLoading, fetchHistory } = usePayrollStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [selectedMonthStr, setSelectedMonthStr] = useState('');

  const isStaff = user?.role === 'Staff';

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    if (history.length > 0 && !selectedMonthStr) {
      setSelectedMonthStr(history[0].monthStr);
    }
  }, [history, selectedMonthStr]);

  const selectedItem = useMemo(
    () => history.find((item) => item.monthStr === selectedMonthStr) || history[0] || {},
    [selectedMonthStr, history]
  );

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải lịch sử...</div>;
  }

  if (history.length === 0) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Chưa có lịch sử bảng lương nào.</div>;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>Lịch sử chi trả</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Theo dõi lịch sử các kỳ lương từ trước tới nay.</p>
        </div>
        <div className="glass-card" style={{ padding: 'var(--space-3) var(--space-5)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Calendar color="var(--brand-primary)" />
          <div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Kỳ đang xem</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{selectedItem.monthStr}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-5)', alignItems: 'start' }}>
        
        {/* Lịch sử List */}
        <div className="glass-card" style={{ padding: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Các kỳ đã phát hành</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '60vh', overflowY: 'auto' }}>
            {history.map((item) => (
              <div 
                key={item.monthStr}
                onClick={() => setSelectedMonthStr(item.monthStr)}
                style={{
                  padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  border: `1px solid ${item.monthStr === selectedMonthStr ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                  background: item.monthStr === selectedMonthStr ? 'rgba(99, 102, 241, 0.05)' : 'var(--bg-elevated)',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Kỳ {item.monthStr}</span>
                  <Badge variant={item.status === 'Draft' ? 'warning' : 'success'}>{item.status === 'Draft' ? 'Bản nháp' : item.status}</Badge>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tổng: <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{formatVnd(item.totalPaid)}</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* Chi tiết Summary của kỳ lương đó */}
        <div className="card-premium" style={{ padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-6)' }}>Tóm tắt kỳ {selectedItem.monthStr}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
            {!isStaff && (
              <div style={{ padding: 'var(--space-5)', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-normal)' }}>
                <Users size={20} color="var(--brand-primary)" style={{ marginBottom: 12 }} />
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Tổng nhân sự nhận lương</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>{selectedItem.employees}</p>
              </div>
            )}
            
            <div style={{ padding: 'var(--space-5)', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-normal)' }}>
              <DollarSign size={20} color="var(--color-success)" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                {isStaff ? 'Thực lĩnh của bạn' : 'Tổng chi trả'}
              </p>
              <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-success)', marginTop: 4 }}>{formatVnd(selectedItem.totalPaid)}</p>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-5)', background: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-info)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Ghi chú hệ thống</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {isStaff 
                ? 'Đây là số tiền tổng cộng bạn nhận được trong kỳ này. Nhấn nút bên dưới để xem chi tiết phụ cấp và khấu trừ.' 
                : `Kỳ lương này đã tổng hợp dữ liệu của ${selectedItem.employees} nhân sự. Lịch sử này hỗ trợ HR đối soát lại các khoản chi trả.`}
            </p>
            
            {isStaff && selectedItem.recordId && (
               <div style={{ marginTop: 16 }}>
                 <Button icon={FileText} onClick={() => navigate(`/payroll/detail?id=${selectedItem.recordId}`)}>
                   Xem phiếu lương chi tiết
                 </Button>
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default PayrollHistory;