import React, { useState } from 'react';

const formatVnd = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const PayrollSettings = ({ initialSalaryLevels, initialAllowances, initialRules }) => {
  const [salaryLevels, setSalaryLevels] = useState(initialSalaryLevels ?? []);
  const [allowances, setAllowances] = useState(initialAllowances ?? []);
  const [rules, setRules] = useState(initialRules ?? []);
  const [maxSalaryId, setMaxSalaryId] = useState(Math.max(0, ...(initialSalaryLevels?.map((i) => i.id) ?? [0])));
  const [maxAllowanceId, setMaxAllowanceId] = useState(Math.max(0, ...(initialAllowances?.map((i) => i.id) ?? [0])));
  const [maxRuleId, setMaxRuleId] = useState(Math.max(0, ...(initialRules?.map((i) => i.id) ?? [0])));

  const [newSalaryLabel, setNewSalaryLabel] = useState('');
  const [newSalaryValue, setNewSalaryValue] = useState('');
  const [newAllowanceLabel, setNewAllowanceLabel] = useState('');
  const [newAllowanceRate, setNewAllowanceRate] = useState('');
  const [newRuleName, setNewRuleName] = useState('');
  const [newRulePenalty, setNewRulePenalty] = useState('');

  const handleAddSalaryLevel = (e) => {
    e.preventDefault();
    if (!newSalaryLabel.trim() || !newSalaryValue) return;
    const salary = Number(newSalaryValue);
    if (isNaN(salary) || salary <= 0) return;
    setSalaryLevels((prev) => [
      ...prev,
      { id: maxSalaryId + 1, level: newSalaryLabel, monthly: salary },
    ]);
    setMaxSalaryId(maxSalaryId + 1);
    setNewSalaryLabel('');
    setNewSalaryValue('');
  };

  const handleAddAllowance = (e) => {
    e.preventDefault();
    if (!newAllowanceLabel.trim() || !newAllowanceRate.trim()) return;
    setAllowances((prev) => [
      ...prev,
      { id: maxAllowanceId + 1, name: newAllowanceLabel, rate: newAllowanceRate },
    ]);
    setMaxAllowanceId(maxAllowanceId + 1);
    setNewAllowanceLabel('');
    setNewAllowanceRate('');
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newRuleName.trim() || !newRulePenalty.trim()) return;
    setRules((prev) => [
      ...prev,
      { id: maxRuleId + 1, name: newRuleName, penalty: newRulePenalty },
    ]);
    setMaxRuleId(maxRuleId + 1);
    setNewRuleName('');
    setNewRulePenalty('');
  };

  const handleDeleteSalaryLevel = (id) => {
    setSalaryLevels((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteAllowance = (id) => {
    setAllowances((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteRule = (id) => {
    setRules((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="px-4 py-5">
      <section className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center gy-3">
            <div className="col-md">
              <p className="text-uppercase fw-semibold small text-secondary mb-1">Cấu hình bảng lương</p>
              <h1 className="h4 mb-2">Thiết lập lương & phụ cấp</h1>
              <p className="text-secondary mb-0">Quản lý mức lương, loại phụ cấp và quy tắc chấm công.</p>
            </div>
            <div className="col-md-auto">
              <div className="card bg-light border-0 shadow-sm text-center">
                <div className="card-body py-3 px-4">
                  <p className="text-secondary mb-1">Mức lương hiện có</p>
                  <p className="h3 mb-0">{salaryLevels.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h5">Mức lương</h2>
              <p className="text-secondary">Thêm cấp bậc và mức lương tháng.</p>
              <form onSubmit={handleAddSalaryLevel} className="mt-4">
                <div className="mb-3">
                  <label className="form-label">Cấp bậc</label>
                  <input
                    value={newSalaryLabel}
                    onChange={(e) => setNewSalaryLabel(e.target.value)}
                    placeholder="Junior, Senior..."
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Lương tháng (VND)</label>
                  <input
                    type="number"
                    value={newSalaryValue}
                    onChange={(e) => setNewSalaryValue(e.target.value)}
                    placeholder="18000000"
                    className="form-control"
                  />
                </div>
                <button className="btn btn-primary w-100">Thêm mức lương</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h5">Loại phụ cấp</h2>
              <p className="text-secondary">Tạo phụ cấp mới và quản lý tỷ lệ.</p>
              <form onSubmit={handleAddAllowance} className="mt-4">
                <div className="mb-3">
                  <label className="form-label">Tên phụ cấp</label>
                  <input
                    value={newAllowanceLabel}
                    onChange={(e) => setNewAllowanceLabel(e.target.value)}
                    placeholder="Phụ cấp chuyên cần"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tỷ lệ / số tiền</label>
                  <input
                    value={newAllowanceRate}
                    onChange={(e) => setNewAllowanceRate(e.target.value)}
                    placeholder="10% hoặc 1,000,000"
                    className="form-control"
                  />
                </div>
                <button className="btn btn-primary w-100">Thêm phụ cấp</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h5">Quy tắc chấm công</h2>
              <p className="text-secondary">Thiết lập mức phạt và quy tắc tính lương.</p>
              <form onSubmit={handleAddRule} className="mt-4">
                <div className="mb-3">
                  <label className="form-label">Tên quy tắc</label>
                  <input
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    placeholder="Đi muộn 1 lần"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mức phạt</label>
                  <input
                    value={newRulePenalty}
                    onChange={(e) => setNewRulePenalty(e.target.value)}
                    placeholder="100,000 VND"
                    className="form-control"
                  />
                </div>
                <button className="btn btn-primary w-100">Thêm quy tắc</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="h6">Danh sách mức lương</h3>
              <div className="list-group list-group-flush mt-4">
                {salaryLevels.map((item) => (
                  <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 fw-semibold">{item.level}</p>
                      <small className="text-secondary">{formatVnd(item.monthly)} / tháng</small>
                    </div>
                    <button onClick={() => handleDeleteSalaryLevel(item.id)} className="btn btn-sm btn-outline-danger">Xóa</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="h6">Loại phụ cấp</h3>
              <div className="list-group list-group-flush mt-4">
                {allowances.map((item) => (
                  <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 fw-semibold">{item.name}</p>
                      <small className="text-secondary">{item.rate}</small>
                    </div>
                    <button onClick={() => handleDeleteAllowance(item.id)} className="btn btn-sm btn-outline-danger">Xóa</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="h6">Quy tắc chấm công</h3>
              <div className="list-group list-group-flush mt-4">
                {rules.map((item) => (
                  <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1 fw-semibold">{item.name}</p>
                      <small className="text-secondary">{item.penalty}</small>
                    </div>
                    <button onClick={() => handleDeleteRule(item.id)} className="btn btn-sm btn-outline-danger">Xóa</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PayrollSettings;
