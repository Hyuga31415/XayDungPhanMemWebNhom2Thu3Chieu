import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Building2, UserPlus, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Calendar, Plus, Clock 
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
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-2)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Chào mừng trở lại, <span className="text-gradient">{userName}</span>! 👋
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
            <Calendar size={14} />
            <span>{formatDate(time)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--brand-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
            <Clock size={14} />
            <span>{formatTime(time)}</span>
          </div>
        </div>
      </div>
      <Button 
        variant="primary" 
        icon={Plus} 
        onClick={() => navigate('/employees/add')}
        style={{ padding: '10px 20px' }}
      >
        Thêm nhân viên
      </Button>
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
          <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
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
          fontSize: 'var(--font-size-xs)', fontWeight: 700
        }}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(change)}%
        </div>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{changeLabel}</span>
      </div>
    </div>
  );
}

// ── Chart Card ─────────────────────────────────────────────
function ChartCard({ title, subtitle, children, icon: Icon }) {
  return (
    <div className="card-premium animate-fade-in" style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
        <div>
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
          {subtitle && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 4 }}>{subtitle}</p>}
        </div>
        {Icon && <div style={{ color: 'var(--text-muted)', opacity: 0.5 }}><Icon size={20} /></div>}
      </div>
      {children}
    </div>
  );
}

// ── Custom Tooltip ──────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ 
      background: 'var(--bg-surface)', border: '1px solid var(--border-normal)',
      borderRadius: 'var(--radius-md)', padding: '12px', boxShadow: 'var(--shadow-lg)',
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.04em' }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {p.name}: <span style={{ fontWeight: 800 }}>{p.value}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

const PIE_COLORS = ['var(--chart-1)', 'var(--chart-4)', 'var(--chart-2)', 'var(--chart-3)'];

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
    { icon: Users, label: 'Tổng nhân viên', value: stats.total, change: 5.2, changeLabel: 'so tháng trước', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { icon: Building2, label: 'Phòng ban', value: 5, change: 0, changeLabel: 'không đổi', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
    { icon: UserPlus, label: 'Mới tháng này', value: stats.newThisMonth, change: 50, changeLabel: 'so tháng trước', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    { icon: TrendingUp, label: 'Tỷ lệ giữ chân', value: `${stats.retentionRate}%`, change: 1.8, changeLabel: 'so quý trước', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  ];

  const recentEmployees = employees.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-8)' }}>
      <WelcomeHeader />

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        {statCards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-4)' }}>
        
        {/* Recruitment Trend - Wide */}
        <div style={{ gridColumn: 'span 8' }}>
          <ChartCard title="Xu hướng tuyển dụng" subtitle="Biến động nhân sự 6 tháng gần nhất" icon={TrendingUp}>
            <ResponsiveContainer width="100%" height={260}>
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

        {/* Gender Distribution - Narrow */}
        <div style={{ gridColumn: 'span 4' }}>
          <ChartCard title="Cơ cấu giới tính" subtitle="Tỷ lệ nam / nữ hiện tại" icon={Users}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={stats.byGender} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                  {stats.byGender.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Department Distribution - Medium */}
        <div style={{ gridColumn: 'span 5' }}>
          <ChartCard title="Nhân viên theo phòng ban" subtitle="Phân bổ nhân sự các khối" icon={Building2}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.byDepartment} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-elevated)', opacity: 0.4 }} />
                <Bar dataKey="count" name="Nhân viên" fill="url(#barGradient)" radius={[4, 4, 0, 0]} barSize={32} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-primary)" />
                    <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent Employees Table - Medium-Wide */}
        <div style={{ gridColumn: 'span 7' }}>
          <ChartCard title="Nhân viên mới gia nhập" subtitle="Hồ sơ 5 nhân sự gần đây nhất">
            <div style={{ overflowX: 'auto', marginTop: -8 }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead>
                  <tr>
                    {['Họ tên', 'Phòng ban / Chức vụ', 'Ngày vào', 'Trạng thái'].map((h) => (
                      <th key={h} style={{ padding: '0 12px 8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentEmployees.map((emp) => {
                    const s = STATUS_MAP[emp.status] || { variant: 'default', label: emp.status };
                    return (
                      <tr 
                        key={emp.id} 
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/employees/edit/${emp.id}`)}
                      >
                        <td style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ 
                              width: 36, height: 36, borderRadius: 'var(--radius-md)', 
                              background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', 
                              justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' 
                            }}>
                              {emp.avatar || emp.fullName?.charAt(0)}
                            </div>
                            <div>
                              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{emp.fullName}</p>
                              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.emp_code}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px', background: 'var(--bg-elevated)' }}>
                          <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>{emp.departmentName}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.position}</p>
                        </td>
                        <td style={{ padding: '12px', background: 'var(--bg-elevated)', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
                          {emp.hire_date}
                        </td>
                        <td style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
                          <Badge variant={s.variant}>{s.label}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
