import React, { useMemo, useState } from 'react';

const statusStyles = {
  'Hoàn thành': 'success',
  'Chờ phê duyệt': 'warning',
};

const formatVnd = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const PayrollHistory = ({ historyItems }) => {
  const [selectedMonth, setSelectedMonth] = useState(historyItems[0]?.month ?? '');

  const selectedItem = useMemo(
    () => historyItems.find((item) => item.month === selectedMonth) || historyItems[0] || {},
    [selectedMonth, historyItems]
  );

  return (
    <div className="px-4 py-5">
      <section className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center gy-3">
            <div className="col-md">
              <p className="text-uppercase fw-semibold small text-primary mb-1">Lịch sử bảng lương</p>
              <h1 className="h4 mb-2 text-dark">Lịch sử Payroll</h1>
              <p className="text-muted mb-0">Theo dõi lịch sử các kỳ lương và trạng thái chi trả từ trước tới nay.</p>
            </div>
            <div className="col-md-auto">
              <div className="card bg-light border-0 shadow-sm text-center">
                <div className="card-body py-3 px-4">
                  <p className="text-muted mb-1 small">Kỳ đã chọn</p>
                  <p className="h4 mb-0 text-dark fw-bold">{selectedItem.month}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="row g-4">
        <div className="col-xl-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
                <h2 className="h5 text-dark">Chọn kỳ lương</h2>
                <p className="text-muted">Xem nhanh các kỳ lương đã phát hành.</p>
              <div className="list-group list-group-flush mt-4">
                {historyItems.map((item) => (
                  <button
                    key={item.month}
                    type="button"
                    onClick={() => setSelectedMonth(item.month)}
                    className={`list-group-item list-group-item-action ${item.month === selectedMonth ? 'active' : ''}`}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">Kỳ {item.month}</span>
                      <span className={`badge bg-${statusStyles[item.status]} text-uppercase`}>{item.status}</span>
                    </div>
                    <p className="mb-0 text-muted small">Tổng chi trả {formatVnd(item.totalPaid)} cho {item.employees} nhân viên.</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
                <h2 className="h5 text-dark">Tóm tắt kỳ lương</h2>
              <div className="row row-cols-1 row-cols-md-2 g-3 mt-3">
                <div className="col">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body">
                      <p className="text-muted mb-1 small">Kỳ</p>
                      <p className="h4 mb-0 text-dark fw-bold">{selectedItem.month}</p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body">
                      <p className="text-muted mb-1 small">Tổng nhân viên</p>
                      <p className="h4 mb-0 text-dark fw-bold">{selectedItem.employees}</p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body">
                      <p className="text-muted mb-1 small">Tổng chi trả</p>
                      <p className="h4 mb-0 text-success fw-bold">{formatVnd(selectedItem.totalPaid)}</p>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body">
                      <p className="text-muted mb-1 small">Trạng thái</p>
                      <p className="h4 mb-0 text-dark fw-bold">{selectedItem.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-light border-0 mt-4">
                <div className="card-body">
                  <h3 className="h6 text-dark">Ghi chú</h3>
                  <p className="text-muted mb-0">Lịch sử này hỗ trợ HR kiểm tra lại các kỳ phát lương đã hoàn thành hoặc chờ duyệt. Hồ sơ chi tiết giúp tránh sai sót thanh toán.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollHistory;
