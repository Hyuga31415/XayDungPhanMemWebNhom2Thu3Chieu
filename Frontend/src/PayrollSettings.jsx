import React, { useState } from 'react';

const initialSalaryLevels = [
  { id: 1, level: 'Junior', monthly: 10000000 },
  { id: 2, level: 'Senior', monthly: 18000000 },
  { id: 3, level: 'Lead', monthly: 24000000 },
];

const initialAllowances = [
  { id: 1, name: 'Phu cap trach nhiem', rate: '15%' },
  { id: 2, name: 'Phu cap xang', rate: '5%' },
  { id: 3, name: 'Phu cap an trua', rate: '3%' },
];

const initialRules = [
  { id: 1, name: 'Di muon 1 lan', penalty: '100,000 VND' },
  { id: 2, name: 'Vang khong phep', penalty: '500,000 VND' },
  { id: 3, name: 'Qua 2 ngay phep', penalty: '200,000 VND/ngay' },
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
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Cau hinh bang luong</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Thiet lap luong & phu cap</h1>
            <p className="mt-2 text-sm text-slate-600">Quan ly muc luong, loai phu cap va quy tac cham cong.</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 px-6 py-5 text-center">
            <p className="text-sm text-slate-500">Muc luong hien co</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{salaryLevels.length}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Muc luong</h2>
              <p className="mt-2 text-sm text-slate-500">Them cap bac va muc luong thang.</p>
            </div>
          </div>
          <form onSubmit={handleAddSalaryLevel} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Cap bac</label>
              <input
                value={newSalaryLabel}
                onChange={(e) => setNewSalaryLabel(e.target.value)}
                placeholder="Junior, Senior..."
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Luong thang (VND)</label>
              <input
                type="number"
                value={newSalaryValue}
                onChange={(e) => setNewSalaryValue(e.target.value)}
                placeholder="18000000"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <button className="w-full rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">Them muc luong</button>
          </form>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Loai phu cap</h2>
          <p className="mt-2 text-sm text-slate-500">Tao phu cap moi va quan ly ty le.</p>
          <form onSubmit={handleAddAllowance} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Ten phu cap</label>
              <input
                value={newAllowanceLabel}
                onChange={(e) => setNewAllowanceLabel(e.target.value)}
                placeholder="Phu cap chuyen can"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Ty le / so tien</label>
              <input
                value={newAllowanceRate}
                onChange={(e) => setNewAllowanceRate(e.target.value)}
                placeholder="10% hoac 1,000,000"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <button className="w-full rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">Them phu cap</button>
          </form>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Quy tac cham cong</h2>
          <p className="mt-2 text-sm text-slate-500">Thiet lap muc phat va quy tac tinh luong.</p>
          <form onSubmit={handleAddRule} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Ten quy tac</label>
              <input
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                placeholder="Di muon 1 lan"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Muc phat</label>
              <input
                value={newRulePenalty}
                onChange={(e) => setNewRulePenalty(e.target.value)}
                placeholder="100,000 VND"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <button className="w-full rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">Them quy tac</button>
          </form>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Danh sach muc luong</h3>
          <div className="mt-5 space-y-3">
            {salaryLevels.map((item) => (
              <div key={item.id} className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="font-semibold text-slate-900">{item.level}</p>
                <p className="mt-1 text-sm text-slate-600">{formatVnd(item.monthly)} / thang</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Loai phu cap</h3>
          <div className="mt-5 space-y-3">
            {allowances.map((item) => (
              <div key={item.id} className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="mt-1 text-sm text-slate-600">{item.rate}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Quy tac cham cong</h3>
          <div className="mt-5 space-y-3">
            {rules.map((item) => (
              <div key={item.id} className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="mt-1 text-sm text-slate-600">{item.penalty}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default PayrollSettings;
