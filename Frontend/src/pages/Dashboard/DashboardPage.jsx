import React, { useEffect } from 'react';
import { Users, Building2, UserPlus, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import useEmployeeStore from '../../store/useEmployeeStore';
import Badge, { STATUS_MAP } from '../../components/ui/Badge';

// ============================================================
// Dashboard Page
// ============================================================

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, change, changeLabel, color, gradient }) {
  const isPositive = change >= 0;
  return (
    <div
      className="glass-card animate-fade-in"
      style={{ padding: 'var(--space-6)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Gradient blob */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 100, height: 100, borderRadius: '50%',
        background: gradient, opacity: 0.12, filter: 'blur(20px)',
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {label}
          </p>
          <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {value}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
            {isPositive
              ? <ArrowUpRight size={13} color="var(--color-success)" />
              : <ArrowDownRight size={13} color="var(--color-danger)" />}
            <span style={{ fontSize: 'var(--font-size-xs)', color: isPositive ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
              {Math.abs(change)}%
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{changeLabel}</span>
          </div>
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: 'var(--radius-lg)',
          background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 16px ${color}40`,
        }}>
          <Icon size={22} color="white" />
        </div>
      </div>
    </div>
  );
}

// ── Chart Card ─────────────────────────────────────────────
function ChartCard({ title, subtitle, children }) {
  return (
    <div className="glass-card animate-fade-in" style={{ padding: 'var(--space-6)' }}>
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginTop: 3 }}>{subtitle}</p>}
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
      background: 'var(--bg-elevated)', border: '1px solid var(--border-normal)',
      borderRadius: 'var(--radius-md)', padding: '10px 14px', boxShadow: 'var(--shadow-md)',
    }}>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ fontSize: 13, fontWeight: 600, color: p.color || 'var(--text-primary)' }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const PIE_COLORS = ['var(--chart-1)', 'var(--chart-4)'];

function DashboardPage() {
  const { stats, fetchStats, employees, fetchEmployees, isLoading } = useEmployeeStore();

  useEffect(() => {
    fetchStats();
    fetchEmployees();
  }, []);

  if (!stats) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <span style={{ width: 32, height: 32, border: '3px solid var(--border-normal)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', display: 'inline-block' }} className="animate-spin" />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        {statCards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <ChartCard title="Nhân viên theo phòng ban" subtitle="Phân bổ headcount hiện tại">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.byDepartment} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff0a' }} />
              <Bar dataKey="count" name="Nhân viên" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Xu hướng tuyển dụng" subtitle="6 tháng gần nhất">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.recruitmentTrend} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="count" name="Tuyển dụng" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-4)' }}>
        <ChartCard title="Phân bổ giới tính" subtitle="Tỷ lệ nam / nữ">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stats.byGender} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {stats.byGender.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(v) => <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{v}</span>}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recent Employees Table */}
        <ChartCard title="Nhân viên mới nhất" subtitle="5 nhân viên gần đây nhất">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Nhân viên', 'Phòng ban', 'Chức vụ', 'Ngày vào', 'Trạng thái'].map((h) => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1px solid var(--border-subtle)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map((emp) => {
                  const s = STATUS_MAP[emp.status] || { variant: 'default', label: emp.status };
                  return (
                    <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-glass-hover)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                    >
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 'var(--radius-md)',
                            background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
                          }}>{emp.avatar}</div>
                          <div>
                            <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{emp.fullName}</p>
                            {/* emp_code từ HRM.sql */}
                            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.emp_code}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{emp.departmentName}</td>
                      <td style={{ padding: '10px 12px', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{emp.position}</td>
                      {/* hire_date từ HRM.sql */}
                      <td style={{ padding: '10px 12px', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>{emp.hire_date}</td>
                      <td style={{ padding: '10px 12px' }}>
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
  );
}

export default DashboardPage;
