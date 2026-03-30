import React, { useMemo, useState } from 'react';

const statusStyles = {
  'Đã xác nhận': 'bg-emerald-100 text-emerald-800',
  'Chờ duyệt': 'bg-amber-100 text-amber-800',
  'Đã chuyển khoản': 'bg-sky-100 text-sky-800',
};

const formatVnd = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const PayrollManagement = ({ payrollList }) => {
  const [query, setQuery] = useState('');

  const filteredPayrolls = useMemo(() => {
    return payrollList.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.id.toLowerCase().includes(query.toLowerCase()) ||
      item.period.includes(query)
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
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-sky-600">Bảng lương HR</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Tổng quan lương</h1>
            <p className="mt-2 text-sm text-slate-600">Cập nhật nhanh trạng thái duyệt, tổng chi trả và số lượng bảng lương.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-500">Bảng lương</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{payrollList.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-500">Đã duyệt</p>
              <p className="mt-3 text-3xl font-semibold text-emerald-700">{approvedCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-500">Tổng chi trả</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{formatVnd(totalPayroll)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Danh sách bảng lương</h2>
            <p className="mt-2 text-sm text-slate-500">Tìm kiếm và theo dõi trạng thái chi tiết.</p>
          </div>
          <div className="form-control w-full max-w-sm">
            <label className="input-group">
              <span>🔍</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm mã hoặc tên..."
                className="input input-bordered w-full"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
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
              {filteredPayrolls.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-slate-50' : ''}>
                  <td className="px-4 py-4 font-medium text-slate-900">{item.id}</td>
                  <td className="px-4 py-4">{item.name}</td>
                  <td className="px-4 py-4">{item.period}</td>
                  <td className="px-4 py-4">{formatVnd(item.netSalary)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status] || 'bg-slate-100 text-slate-800'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-100">
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPayrolls.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-slate-500" colSpan="6">Không tìm thấy dữ liệu phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PayrollManagement;
