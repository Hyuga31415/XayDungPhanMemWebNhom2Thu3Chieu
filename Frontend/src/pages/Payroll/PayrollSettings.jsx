import React, { useEffect, useMemo, useState } from 'react';
import { Save, Settings, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import systemConfigService from '../../api/systemConfigService';

const importantKeys = [
  'STANDARD_WORK_DAYS',
  'STANDARD_WORK_HOURS',
  'LATE_PENALTY_AMOUNT',
  'BHXH_RATE_EMPLOYEE',
  'LUNCH_ALLOWANCE_PER_DAY',
  'TRANSPORT_ALLOWANCE_PER_MONTH',
  'ATTENDANCE_BONUS_AMOUNT',
  'OVERTIME_RATE_MULTIPLIER'
];

function PayrollSettings() {
  const [configs, setConfigs] = useState([]);
  const [draft, setDraft] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadConfigs = async () => {
    setIsLoading(true);
    try {
      const rows = await systemConfigService.getAll();
      const list = Array.isArray(rows) ? rows : [];
      setConfigs(list);

      const nextDraft = list.reduce((acc, item) => {
        acc[item.config_key] = item.config_value ?? '';
        return acc;
      }, {});
      setDraft(nextDraft);
    } catch (error) {
      toast.error(error.message || 'Không thể tải cấu hình hệ thống.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const sortedConfigs = useMemo(() => {
    const clone = [...configs];
    clone.sort((a, b) => {
      const indexA = importantKeys.indexOf(a.config_key);
      const indexB = importantKeys.indexOf(b.config_key);
      const rankA = indexA === -1 ? 999 : indexA;
      const rankB = indexB === -1 ? 999 : indexB;
      if (rankA !== rankB) return rankA - rankB;
      return a.config_key.localeCompare(b.config_key);
    });
    return clone;
  }, [configs]);

  const handleChange = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const items = sortedConfigs.map((item) => ({
        config_key: item.config_key,
        config_value: draft[item.config_key] ?? '',
        description: item.description || null
      }));

      await systemConfigService.updateMany(items);
      toast.success('Đã cập nhật cấu hình hệ thống.');
      await loadConfigs();
    } catch (error) {
      toast.error(error.message || 'Cập nhật cấu hình thất bại.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div className="card-premium" style={{ padding: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--brand-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>Cấu hình hệ thống lương</h1>
            <p style={{ color: 'var(--text-muted)' }}>Dynamic Form lấy dữ liệu trực tiếp từ bảng system_configs.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" icon={RefreshCw} onClick={loadConfigs} loading={isLoading}>Tải lại</Button>
          <Button icon={Save} onClick={handleSave} loading={isSaving}>Lưu cấu hình</Button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 'var(--space-5)' }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải cấu hình...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            {sortedConfigs.map((item) => (
              <div key={item.id} style={{ padding: 'var(--space-4)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)' }}>
                <p style={{ marginBottom: 8, fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>{item.config_key}</p>
                <Input
                  value={draft[item.config_key] ?? ''}
                  onChange={(e) => handleChange(item.config_key, e.target.value)}
                  placeholder="Nhập giá trị"
                />
                <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  {item.description || 'Không có mô tả'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PayrollSettings;
