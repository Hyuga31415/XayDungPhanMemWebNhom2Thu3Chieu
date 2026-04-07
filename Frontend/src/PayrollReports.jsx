import React from 'react';

const formatVnd = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const PayrollReports = ({ reportData, quickInsights }) => {
  return (
    <div className="px-4 py-5">
      <section className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center gy-3">
            <div className="col-md">
              <p className="text-uppercase fw-semibold small text-primary mb-1">Báo cáo lương</p>
              <h1 className="h4 mb-2 text-dark">Báo Cáo Payroll</h1>
              <p className="text-muted mb-0">Tổng hợp số liệu chi phí lương, phụ cấp và hiệu suất thanh toán.</p>
            </div>
            <div className="col-md-auto">
              <div className="card bg-light border-0 shadow-sm text-center">
                <div className="card-body py-3 px-4">
                  <p className="text-secondary mb-1">Dữ liệu</p>
                  <p className="h4 mb-0">Tháng gần nhất</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="row g-4 mb-4">
        {reportData.map((item) => (
          <div key={item.title} className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <p className="text-uppercase fw-semibold small text-secondary">{item.title}</p>
                <p className="h3 fw-semibold mt-3">{formatVnd(item.value)}</p>
                <span className={`badge bg-${item.color} text-dark mt-3 fw-bold`}>{item.trend} so với tháng trước</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="row g-4">
        <div className="col-xl-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h5 mb-0 text-dark">Phân tích chi phí</h2>
                <span className="badge bg-light text-dark">TPM</span>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body">
                      <p className="text-muted mb-1 small">Chênh lệch lương</p>
                      <p className="h4 mb-0 text-dark fw-bold">+8%</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body">
                      <p className="text-muted mb-1 small">Phụ cấp</p>
                      <p className="h4 mb-0 text-dark fw-bold">{formatVnd(4200000)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-light border-0 mt-4">
                <div className="card-body">
                  <p className="fw-semibold mb-2 text-dark">Xu hướng</p>
                  <ul className="mb-0 text-dark">
                    <li>Số bảng lương xác nhận tăng nhẹ.</li>
                    <li>Khoản chi phụ cấp ổn định trong quý.</li>
                    <li>Tỷ lệ phát hiện sai sót giảm 12%.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
                <h2 className="h5 text-dark">Insights nhanh</h2>
              <div className="mt-4">
                {quickInsights.map((insight) => (
                  <div key={insight} className="card bg-light border-0 mb-3">
                    <div className="card-body p-3 text-secondary">{insight}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary">Xuất báo cáo PDF</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PayrollReports;
