import React, { useState } from 'react';
import { Settings, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { formatVnd } from '../../utils/payrollUtils';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';

function PayrollSettings({ initialSalaryLevels, initialAllowances, initialRules }) {
  const [salaryLevels, setSalaryLevels] = useState(initialSalaryLevels ?? []);
  const [allowances, setAllowances] = useState(initialAllowances ?? []);
  const [rules, setRules] = useState(initialRules ?? []);

  const [newSalaryLabel, setNewSalaryLabel] = useState('');
  const [newSalaryValue, setNewSalaryValue] = useState('');

  const handleAddSalaryLevel = (e) => {
    e.preventDefault();
    if (!newSalaryLabel.trim() || !newSalaryValue) return;
    setSalaryLevels(prev => [...prev, { id: Date.now(), level: newSalaryLabel, monthly: Number(newSalaryValue) }]);
    setNewSalaryLabel(''); setNewSalaryValue('');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div className="card-premium" style={{ padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center', background: 'var(--bg-surface)' }}>
        <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--brand-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings size={28} />
        </div>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>Thiết lập Quy tắc Lương</h1>
          <p style={{ color: 'var(--text-muted)' }}>Cấu hình cấp bậc, phụ cấp và các khoản khấu trừ hệ thống.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)' }}>
        
        {/* Cột 1: Mức lương */}
        <div className="glass-card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>Bậc lương chuẩn</h2>
          
          <form onSubmit={handleAddSalaryLevel} style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)' }}>
            <Input placeholder="Tên bậc (VD: Senior)" value={newSalaryLabel} onChange={e => setNewSalaryLabel(e.target.value)} />
            <Input type="number" placeholder="Lương cơ bản (VND)" value={newSalaryValue} onChange={e => setNewSalaryValue(e.target.value)} />
            <Button type="submit" icon={Plus} size="sm" style={{ width: '100%' }}>Thêm bậc</Button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, overflowY: 'auto' }}>
            {salaryLevels.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{item.level}</p>
                  <p style={{ fontSize: 12, color: 'var(--brand-primary)', fontWeight: 600 }}>{formatVnd(item.monthly)}</p>
                </div>
                <button onClick={() => setSalaryLevels(p => p.filter(i => i.id !== item.id))} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 4 }}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Cột 2: Phụ cấp */}
        <div className="glass-card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>Danh mục Phụ cấp</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {allowances.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 600 }}>{item.rate}</p>
                </div>
                <button onClick={() => setAllowances(p => p.filter(i => i.id !== item.id))} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 4 }}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <Button variant="secondary" icon={Plus} style={{ marginTop: 'auto' }}>Thêm phụ cấp mới</Button>
        </div>

        {/* Cột 3: Khấu trừ */}
        <div className="glass-card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>Quy tắc Khấu trừ</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rules.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-warning)', fontWeight: 600 }}>{item.penalty}</p>
                </div>
                <button onClick={() => setRules(p => p.filter(i => i.id !== item.id))} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 4 }}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <Button variant="secondary" icon={Plus} style={{ marginTop: 'auto' }}>Thêm quy tắc mới</Button>
        </div>

      </div>
    </div>
  );
}

export default PayrollSettings;