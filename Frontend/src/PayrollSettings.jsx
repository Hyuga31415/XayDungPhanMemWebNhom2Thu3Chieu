import React, { useState } from 'react';

const initialSalaryLevels = [
  { id: 1, level: 'Junior', monthly: 10000000 },
  { id: 2, level: 'Senior', monthly: 18000000 },
  { id: 3, level: 'Lead', monthly: 24000000 },
];

const initialAllowances = [
  { id: 1, name: 'Phụ cấp trách nhiệm', rate: '15%' },
  { id: 2, name: 'Phụ cấp xăng', rate: '5%' },
  { id: 3, name: 'Phụ cấp ăn trưa', rate: '3%' },
];

const initialRules = [
  { id: 1, name: 'Đi muộn 1 lần', penalty: '100,000 VND' },
  { id: 2, name: 'Vắng không phép', penalty: '500,000 VND' },
  { id: 3, name: 'Quá 2 ngày phép', penalty: '200,000 VND/ngày' },
];

const formatVnd = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const PayrollSettings = () => {
  const [salaryLevels, setSalaryLevels] = useState(initialSalaryLevels);
  const [allowances, setAllowances] = useState(initialAllowances);
  const [rules, setRules] = useState(initialRules);

  const [newSalaryLabel, setNewSalaryLabel] = useState('');
  const [newSalaryValue, setNewSalaryValue] = useState('');
  const [newAllowanceLabel, setNewAllowanceLabel] = useState('');
  const [newAllowanceRate, setNewAllowanceRate] = useState('');
  const [newRuleName, setNewRuleName] = useState('');
  const [newRulePenalty, setNewRulePenalty] = useState('');

  const handleAddSalaryLevel = (e) => {
    e.preventDefault();
    if (!newSalaryLabel.trim() || !newSalaryValue) return;
    setSalaryLevels([...salaryLevels, {
      id: salaryLevels.length + 1,
      level: newSalaryLabel,
      monthly: Number(newSalaryValue),
    }]);
    setNewSalaryLabel('');
    setNewSalaryValue('');
  };

  const handleAddAllowance = (e) => {
    e.preventDefault();
    if (!newAllowanceLabel.trim() || !newAllowanceRate.trim()) return;
    setAllowances([...allowances, {
      id: allowances.length + 1,
      name: newAllowanceLabel,
      rate: newAllowanceRate,
    }]);
    setNewAllowanceLabel('');
    setNewAllowanceRate('');
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newRuleName.trim() || !newRulePenalty.trim()) return;
    setRules([...rules, {
      id: rules.length + 1,
      name: newRuleName,
      penalty: newRulePenalty,
    }]);
    setNewRuleName('');
    setNewRulePenalty('');
  };

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Cấu hình bảng lương</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Thiết lập lương & phụ cấp</h1>
            <p className="mt-2 text-sm text-slate-600">Quản lý mức lương, loại phụ cấp và quy tắc chấm công.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 text-center">
            <p className="text-sm text-slate-500">Mức lương hiện có</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{salaryLevels.length}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
          <h2 className="text-xl font-semibold text-slate-900">Mức lương</h2>
          <p className="mt-2 text-sm text-slate-500">Thêm / điều chỉnh cấp bậc lương.</p>
          <form onSubmit={handleAddSalaryLevel} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Cấp bậc</label>
              <input
                value={newSalaryLabel}
                onChange={(e) => setNewSalaryLabel(e.target.value)}
                placeholder="Junior, Senior..."
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Lương tháng (VND)</label>
              <input
                type="number"
                value={newSalaryValue}
                onChange={(e) => setNewSalaryValue(e.target.value)}
                placeholder="18000000"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <button className="w-full rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">Thêm mức lương</button>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
          <h2 className="text-xl font-semibold text-slate-900">Loại phụ cấp</h2>
          <p className="mt-2 text-sm text-slate-500">Tạo phụ cấp mới và quản lý tỷ lệ.</p>
          <form onSubmit={handleAddAllowance} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Tên phụ cấp</label>
              <input
                value={newAllowanceLabel}
                onChange={(e) => setNewAllowanceLabel(e.target.value)}
                placeholder="Phụ cấp chuyên cần"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Tỷ lệ / số tiền</label>
              <input
                value={newAllowanceRate}
                onChange={(e) => setNewAllowanceRate(e.target.value)}
                placeholder="10% hoặc 1,000,000"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <button className="w-full rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">Thêm phụ cấp</button>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
          <h2 className="text-xl font-semibold text-slate-900">Quy tắc chấm công</h2>
          <p className="mt-2 text-sm text-slate-500">Thiết lập mức phạt và quy tắc tính lương.</p>
          <form onSubmit={handleAddRule} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Tên quy tắc</label>
              <input
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                placeholder="Đi muộn 1 lần"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Mức phạt</label>
              <input
                value={newRulePenalty}
                onChange={(e) => setNewRulePenalty(e.target.value)}
                placeholder="100,000 VND"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <button className="w-full rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">Thêm quy tắc</button>
          </form>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
          <h3 className="text-lg font-semibold text-slate-900">Danh sách mức lương</h3>
          <div className="mt-5 space-y-3">
            {salaryLevels.map((item) => (
              <div key={item.id} className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{item.level}</p>
                <p className="mt-1 text-sm text-slate-600">{formatVnd(item.monthly)} / tháng</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
          <h3 className="text-lg font-semibold text-slate-900">Loại phụ cấp</h3>
          <div className="mt-5 space-y-3">
            {allowances.map((item) => (
              <div key={item.id} className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="mt-1 text-sm text-slate-600">{item.rate}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
          <h3 className="text-lg font-semibold text-slate-900">Quy tắc chấm công</h3>
          <div className="mt-5 space-y-3">
            {rules.map((item) => (
              <div key={item.id} className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="mt-1 text-sm text-slate-600">{item.penalty}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PayrollSettings;
