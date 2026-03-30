import React, { useMemo, useState } from 'react';

const statusStyles = {
  'Đã xác nhận': 'success',
  'Chờ duyệt': 'warning',
  'Đã chuyển khoản': 'info',
};

const formatVnd = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const PayrollManagement = ({ payrollList }) => {
  const [query, setQuery] = useState('');

  const filteredPayrolls = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return payrollList.filter((item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.id.toLowerCase().includes(lowerQuery) ||
      item.period.toLowerCase().includes(lowerQuery)
    );
  }, [query, payrollList]);

  const totalPayroll = useMemo(
    () => payrollList.reduce((sum, item) => sum + item.netSalary, 0),
    [payrollList]
  );

  const approvedCount = useMemo(
    () => payrollList.filter((item) => item.status === 'Đã xác nhận' || item.status === 'Đã chuyển khoản').length,
    [payrollList]
  );

  return (
    <div className="px-4 py-5">
      <section className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row gy-3 align-items-center">
            <div className="col-md">
              <p className="text-uppercase fw-semibold small text-info mb-1">Bảng lương HR</p>
              <h1 className="h4 mb-2">Tổng quan lương</h1>
              <p className="text-secondary mb-0">Cập nhật nhanh trạng thái duyệt, tổng chi trả và số lượng bảng lương.</p>
            </div>

            <div className="col-md-8">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="card bg-light border-0 text-center shadow-sm h-100">
                    <div className="card-body py-3">
                      <p className="text-secondary mb-1">Bảng lương</p>
                      <p className="h4 mb-0">{payrollList.length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light border-0 text-center shadow-sm h-100">
                    <div className="card-body py-3">
                      <p className="text-secondary mb-1">Đã duyệt</p>
                      <p className="h4 mb-0 text-success">{approvedCount}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light border-0 text-center shadow-sm h-100">
                    <div className="card-body py-3">
                      <p className="text-secondary mb-1">Tổng chi trả</p>
                      <p className="h4 mb-0">{formatVnd(totalPayroll)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card shadow-sm">
        <div className="card-body">
          <div className="row align-items-center gy-3 mb-4">
            <div className="col-md">
              <h2 className="h5 mb-1">Danh sách bảng lương</h2>
              <p className="text-secondary mb-0">Tìm kiếm và theo dõi trạng thái chi tiết.</p>
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">🔍</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm kiếm mã hoặc tên..."
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Mã</th>
                  <th>Nhân viên</th>
                  <th>Kỳ lương</th>
                  <th>Thực lĩnh</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayrolls.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-semibold">{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.period}</td>
                    <td className="fw-semibold">{formatVnd(item.netSalary)}</td>
                    <td>
                      <span className={`badge bg-${statusStyles[item.status]} text-uppercase`}>{item.status}</span>
                    </td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm">Xem chi tiết</button>
                    </td>
                  </tr>
                ))}
                {filteredPayrolls.length === 0 && (
                  <tr>
                    <td className="text-center text-secondary" colSpan="6">Không tìm thấy dữ liệu phù hợp.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PayrollManagement;
