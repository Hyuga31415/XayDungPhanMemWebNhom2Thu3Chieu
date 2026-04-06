import React from 'react';

const formatVnd = (value) => {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(safeValue);
};

const PayrollDetail = ({ employee }) => {
  const data = employee ?? {
    name: 'Nguyễn Văn A',
    id: 'NV-001',
    position: 'Chuyên viên nhân sự',
    department: 'Payroll',
    period: 'Tháng 03/2026',
    baseSalary: 18000000,
    allowances: [
      { label: 'Phụ cấp trách nhiệm', amount: 2500000 },
      { label: 'Phụ cấp ăn trưa', amount: 800000 },
      { label: 'Phụ cấp xăng', amount: 900000 },
    ],
    deductions: [
      { label: 'Bảo hiểm xã hội', amount: 900000 },
      { label: 'Thuế TNCN', amount: 650000 },
      { label: 'Đi muộn 2 lần', amount: 150000 },
    ],
  };

  const allowances = Array.isArray(data.allowances) ? data.allowances : [];
  const deductions = Array.isArray(data.deductions) ? data.deductions : [];
  const baseSalary = Number.isFinite(Number(data.baseSalary)) ? Number(data.baseSalary) : 0;

  const totalAllowance = allowances.reduce((sum, item) => sum + (Number(item?.amount) || 0), 0);
  const totalDeduction = deductions.reduce((sum, item) => sum + (Number(item?.amount) || 0), 0);
  const grossSalary = baseSalary + totalAllowance;
  const netSalary = grossSalary - totalDeduction;

  return (
    <div className="px-4 py-5">
      <section className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center gy-3">
            <div className="col-md">
              <p className="text-uppercase fw-semibold small text-info">Lương cá nhân</p>
              <h1 className="mt-3 display-6 fw-bold text-dark">{data.name}</h1>
              <p className="text-secondary">Chi tiết bảng lương tháng, phụ cấp và khấu trừ cho nhân viên.</p>
            </div>
            <div className="col-md-6">
              <div className="row row-cols-1 row-cols-md-3 g-3">
                <div className="col">
                  <div className="card bg-light border-0 text-center shadow-sm">
                    <div className="card-body py-3">
                      <p className="text-secondary mb-1">Kỳ lương</p>
                      <p className="mb-0 fw-semibold">{data.period}</p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card bg-light border-0 text-center shadow-sm">
                    <div className="card-body py-3">
                      <p className="text-secondary mb-1">Phòng ban</p>
                      <p className="mb-0 fw-semibold">{data.department}</p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card bg-light border-0 text-center shadow-sm">
                    <div className="card-body py-3">
                      <p className="text-secondary mb-1">Chức vụ</p>
                      <p className="mb-0 fw-semibold">{data.position}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="row g-4">
        <div className="col-xl-7">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="card bg-light border-0 shadow-sm">
                    <div className="card-body">
                      <p className="text-secondary mb-1">Lương cơ bản</p>
                      <p className="h3 mb-0">{formatVnd(baseSalary)}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card bg-light border-0 shadow-sm">
                    <div className="card-body">
                      <p className="text-secondary mb-1">Tổng phụ cấp</p>
                      <p className="h3 mb-0 text-success">{formatVnd(totalAllowance)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-light border-0 mb-4 shadow-sm">
                <div className="card-body text-center py-4">
                  <p className="text-uppercase small text-secondary mb-2">Lương thực lĩnh</p>
                  <p className="display-6 fw-semibold mb-2">{formatVnd(netSalary)}</p>
                  <p className="text-secondary mb-0">Sau khấu trừ bảo hiểm, thuế và đi muộn.</p>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <p className="text-secondary mb-1">Tổng trước khấu trừ</p>
                      <p className="h5 mb-0">{formatVnd(grossSalary)}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <p className="text-secondary mb-1">Khấu trừ</p>
                      <p className="h5 mb-0 text-danger">{formatVnd(totalDeduction)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-5">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <p className="text-uppercase fw-semibold small text-info mb-3">Tổng quan nhanh</p>
              <ul className="list-unstyled mb-0">
                <li className="mb-2 text-secondary">• Phụ cấp được cộng trực tiếp vào lương cơ bản.</li>
                <li className="text-secondary">• Khấu trừ theo lương bảo hiểm và thuế chuẩn.</li>
              </ul>
            </div>
          </div>
          <div className="card bg-light shadow-sm">
            <div className="card-body">
              <p className="text-secondary mb-2">Tính năng nổi bật</p>
              <ul className="mb-0 text-secondary">
                <li>Báo cáo số liệu lương chi tiết cho từng nhân viên.</li>
                <li>Dễ so sánh phụ cấp và khoản khấu trừ.</li>
                <li>Giao diện sạch, đọc số liệu nhanh.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 gap-3">
            <div>
              <p className="text-uppercase fw-semibold small text-secondary mb-1">Chi tiết bảng lương</p>
              <h2 className="h4 mb-0">Phụ cấp và khấu trừ</h2>
            </div>
            <span className="badge bg-light text-dark py-2 px-3">Dữ liệu cập nhật theo kỳ lương</span>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="card bg-light border-0 shadow-sm h-100">
                <div className="card-body">
                  <h3 className="h6">Phụ cấp</h3>
                  {allowances.map((item, index) => (
                    <div key={`${item?.label ?? 'allowance'}-${index}`} className="d-flex justify-content-between align-items-center border-bottom py-3">
                      <span className="fw-semibold text-dark">{item.label}</span>
                      <span className="text-secondary">{formatVnd(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-light border-0 shadow-sm h-100">
                <div className="card-body">
                  <h3 className="h6">Khấu trừ</h3>
                  {deductions.map((item, index) => (
                    <div key={`${item?.label ?? 'deduction'}-${index}`} className="d-flex justify-content-between align-items-center border-bottom py-3">
                      <span className="fw-semibold text-dark">{item.label}</span>
                      <span className="text-secondary">{formatVnd(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PayrollDetail;
