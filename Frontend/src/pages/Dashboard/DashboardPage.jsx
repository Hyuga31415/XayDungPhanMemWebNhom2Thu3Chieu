import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Building2, UserPlus, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Calendar, Plus, Clock, 
  Search, Bell, MoreHorizontal, CheckCircle2, AlertCircle, 
  UserCheck, Briefcase, FileText, Zap, ChevronRight
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import useEmployeeStore from '../../store/useEmployeeStore';
import Badge, { STATUS_MAP } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

// ── Welcome Header ──────────────────────────────────────────
function WelcomeHeader({ userName = 'Admin' }) {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(date);
  };

  return (
    <div className="animate-fade-in" style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      marginBottom: 'var(--space-2)', background: 'var(--brand-gradient-soft)',
      padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--brand-primary)', marginBottom: 8, fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Zap size={14} fill="currentColor" />
          <span>Hệ thống quản lý HRM Pro</span>
        </div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>
          Chào buổi tối, <span className="text-gradient" style={{ animation: 'pulse-soft 3s infinite' }}>{userName}</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
          Hôm nay là {formatDate(time)}. Chúc bạn một ngày làm việc hiệu quả!
        </p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div style={{ textAlign: 'right', paddingRight: 'var(--space-4)', borderRight: '1px solid var(--border-normal)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)', fontSize: 'var(--font-size-xl)', fontWeight: 800, justifyContent: 'flex-end' }}>
            <Clock size={16} />
            <span>{formatTime(time)}</span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Thời gian thực tế</span>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => navigate('/employees/add')}>
          Thêm nhân sự
        </Button>
      </div>
    </div>
  );
}

// ── Action Card ─────────────────────────────────────────────
function ActionCard({ icon: Icon, title, desc, onClick, color }) {
  return (
    <div 
      className="card-premium animate-fade-in" 
      onClick={onClick}
      style={{ 
        padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', 
        cursor: 'pointer', borderLeft: `4px solid ${color}` 
      }}
    >
      <div style={{ 
        width: 40, height: 40, borderRadius: 'var(--radius-md)', 
        background: `${color}10`, color: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{desc}</p>
      </div>
      <ChevronRight size={14} color="var(--text-muted)" />
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, change, changeLabel, color, gradient }) {
  const isPositive = change >= 0;
  return (
    <div className="card-premium animate-fade-in" style={{ padding: 'var(--space-6)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            {label}
          </p>
          <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {value}
          </p>
        </div>
        <div style={{ 
          width: 44, height: 44, borderRadius: 'var(--radius-md)', 
          background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 16px ${color}25`,
        }}>
          <Icon size={20} color="white" />
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'var(--space-4)' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 2, 
          padding: '2px 8px', borderRadius: 'var(--radius-full)',
          background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: isPositive ? 'var(--color-success)' : 'var(--color-danger)',
          fontSize: 11, fontWeight: 700
        }}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(change)}%
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{changeLabel}</span>
      </div>
    </div>
  );
}

// ── Chart Card ─────────────────────────────────────────────
function ChartCard({ title, subtitle, children, icon: Icon, action }) {
  return (
    <div className="card-premium animate-fade-in" style={{ padding: 'var(--space-6)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
          {subtitle && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 4 }}>{subtitle}</p>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {action}
          {Icon && <div style={{ color: 'var(--text-muted)', opacity: 0.5 }}><Icon size={18} /></div>}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
}

// ── Activity Item ──────────────────────────────────────────
function ActivityItem({ type, text, time, isLast }) {
  const icons = {
    hire:   { icon: UserPlus,    color: 'var(--color-success)', bg: 'rgba(16, 185, 129, 0.1)' },
    dept:   { icon: Building2,   color: 'var(--color-info)',    bg: 'rgba(59, 130, 246, 0.1)' },
    leave:  { icon: Calendar,    color: 'var(--color-warning)', bg: 'rgba(245, 158, 11, 0.1)' },
    system: { icon: AlertCircle, color: 'var(--color-danger)',  bg: 'rgba(239, 68, 68, 0.1)' },
  };
  const config = icons[type] || icons.hire;

  return (
    <div style={{ display: 'flex', gap: 12, position: 'relative', paddingBottom: isLast ? 0 : 20 }}>
      {!isLast && <div style={{ position: 'absolute', left: 16, top: 24, bottom: 0, width: 1, background: 'var(--border-normal)' }} />}
      <div style={{ 
        width: 32, height: 32, borderRadius: '50%', background: config.bg, color: config.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, flexShrink: 0
      }}>
        <config.icon size={14} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.4 }}>{text}</p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{time}</p>
      </div>
    </div>
  );
}

// ── Custom Tooltip ──────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ 
      background: 'var(--bg-surface)', border: '1px solid var(--border-normal)',
      borderRadius: 'var(--radius-md)', padding: '10px', boxShadow: 'var(--shadow-lg)',
    }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.04em' }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
            {p.name}: <span style={{ fontWeight: 800 }}>{p.value}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

const PIE_COLORS = ['#6366f1', '#ec4899', '#0ea5e9', '#10b981', '#f59e0b'];

function DashboardPage() {
  const { stats, fetchStats, employees, fetchEmployees } = useEmployeeStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchEmployees();
  }, []);

  if (!stats) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="animate-spin" style={{ width: 40, height: 40, border: '4px solid var(--border-normal)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%' }} />
      </div>
    );
  }

  const statCards = [
    { icon: Users, label: 'Tổng nhân sự', value: stats.total, change: 5.2, changeLabel: 'so tháng trước', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { icon: Building2, label: 'Phòng ban', value: stats.byDepartment?.length || 0, change: 0, changeLabel: 'không đổi', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
    { icon: UserPlus, label: 'Mới tháng này', value: stats.newThisMonth, change: 50, changeLabel: 'so tháng trước', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    { icon: TrendingUp, label: 'Tỷ lệ ổn định', value: `${stats.retentionRate}%`, change: 1.8, changeLabel: 'so quý trước', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  ];

  const quickActions = [
    { icon: UserCheck, title: 'Chấm công', desc: 'Ghi nhận giờ công', color: '#6366f1' },
    { icon: Briefcase, title: 'Nghỉ phép', desc: 'Duyệt đơn nghỉ', color: '#10b981' },
    { icon: FileText, title: 'Báo cáo', desc: 'Xuất dữ liệu nhân sự', color: '#3b82f6' },
    { icon: AlertCircle, title: 'Khen thưởng', desc: 'Trao thưởng tháng', color: '#f59e0b' },
  ];

  const activities = [
    { type: 'hire', text: 'Nguyễn Văn A vừa được thăng chức Giám đốc', time: '10 phút trước' },
    { type: 'dept', text: 'Phòng IT vừa thêm 2 thành viên mới', time: '2 giờ trước' },
    { type: 'leave', text: 'Trần Thị B đã gửi yêu cầu nghỉ phép năm', time: '4 giờ trước' },
    { type: 'system', text: 'Cập nhật hệ thống HRM Pro v2.0 thành công', time: 'Hôm qua' },
  ];

  const recentEmployees = employees.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-8)' }}>
      
      {/* 1. Key Statistics (KPIs) - TOP PRIORITY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        {statCards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      {/* 2. Welcome & Global Status Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '7.5fr 4.5fr', gap: 'var(--space-6)', alignItems: 'stretch' }}>
        <WelcomeHeader />
        
        <div className="card-premium animate-fade-in" style={{ 
          padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-3)',
          background: 'var(--brand-primary)', color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700 }}>Lịch làm việc</p>
              <p style={{ fontSize: 11, opacity: 0.8 }}>3 sự kiện sắp tới</p>
            </div>
            <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: 'var(--space-1) 0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, fontWeight: 500 }}>
             <Clock size={12} />
             <span>Họp giao ban lúc 09:00 AM</span>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
        {quickActions.map((action, i) => <ActionCard key={i} {...action} />)}
      </div>

      {/* 4. Analytics Middle Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)' }}>
        
        {/* Recruitment Trend */}
        <div style={{ gridColumn: 'span 8' }}>
          <ChartCard title="Xu hướng biến động nhân sự" subtitle="Biển động tuyển dụng gần đây" icon={TrendingUp}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={stats.recruitmentTrend} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Tuyển mới" 
                  stroke="var(--brand-primary)" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: 'var(--brand-primary)', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Activity Feed */}
        <div style={{ gridColumn: 'span 4' }}>
          <ChartCard title="Hoạt động gần đây" subtitle="Nhật ký hệ thống mới nhất" icon={Bell}>
            <div style={{ padding: '4px 0' }}>
              {activities.map((act, i) => (
                <ActivityItem key={i} {...act} isLast={i === activities.length - 1} />
              ))}
            </div>
            <button className="btn-secondary-outline" style={{ 
              marginTop: 'auto', width: '100%', padding: '10px', 
              background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)', fontSize: 12, fontWeight: 700, 
              color: 'var(--text-primary)', cursor: 'pointer' 
            }}>
              Xem tất cả nhật ký
            </button>
          </ChartCard>
        </div>
      </div>

      {/* 5. Distribution & Table Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-6)' }}>
        
        {/* Department Distribution */}
        <div style={{ gridColumn: 'span 5' }}>
          <ChartCard title="Nhân viên theo phòng ban" subtitle="Phân bổ headcount hiện tại" icon={Building2}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.byDepartment} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="count" name="Nhân viên" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-primary)" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent Employees Table */}
        <div style={{ gridColumn: 'span 7' }}>
          <ChartCard title="Cập nhật nhân sự" subtitle="Hồ sơ nhân sự mới nhất">
            <div style={{ overflowX: 'auto', marginTop: -8 }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead>
                  <tr>
                    {['Nhân viên', 'Vị trí', 'Trạng thái'].map((h) => (
                      <th key={h} style={{ padding: '0 12px 8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentEmployees.map((emp) => {
                    const s = STATUS_MAP[emp.status] || { variant: 'default', label: emp.status };
                    return (
                      <tr key={emp.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/employees/edit/${emp.id}`)}>
                        <td style={{ padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ 
                              width: 32, height: 32, borderRadius: 'var(--radius-md)', 
                              background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', 
                              justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' 
                            }}>
                              {emp.fullName?.charAt(0)}
                            </div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{emp.fullName}</p>
                              <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{emp.emp_code}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', background: 'var(--bg-elevated)', fontSize: 13, color: 'var(--text-secondary)' }}>
                          {emp.position}
                        </td>
                        <td style={{ padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
                          <Badge variant={s.variant}>{s.label}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Button variant="secondary" size="sm" style={{ marginTop: 'auto' }} onClick={() => navigate('/employees')}>
              Xem tất cả danh sách
            </Button>
          </ChartCard>
        </div>
      </div>
    </div>
  );

}

export default DashboardPage;
