import React, { useMemo, useState } from 'react';

const historyItems = [
  { month: '02/2026', status: 'Hoàn thành', totalPaid: 19800000, employees: 23 },
  { month: '01/2026', status: 'Hoàn thành', totalPaid: 21000000, employees: 22 },
  { month: '12/2025', status: 'Chờ phê duyệt', totalPaid: 20500000, employees: 24 },
  { month: '11/2025', status: 'Hoàn thành', totalPaid: 19350000, employees: 21 },
];

const statusStyles = {
  'Hoàn thành': 'bg-emerald-100 text-emerald-800',
  'Chờ phê duyệt': 'bg-amber-100 text-amber-800',
};

const formatVnd = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const PayrollHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState(historyItems[0].month);

  const selectedItem = useMemo(
    () => historyItems.find((item) => item.month === selectedMonth) || historyItems[0],
    [selectedMonth]
  );

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-sky-600">Lịch sử bảng lương</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Payroll History</h1>
            <p className="mt-2 text-sm text-slate-600">Theo dõi lịch sử các kỳ lương và trạng thái chi trả từ trước tới nay.</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 px-6 py-5 text-center">
            <p className="text-sm text-slate-500">Kỳ đã chọn</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{selectedItem.month}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Chọn kỳ lương</h2>
          <p className="mt-2 text-sm text-slate-500">Xem nhanh các kỳ lương đã phát hành.</p>
          <div className="mt-6 space-y-4">
            {historyItems.map((item) => (
              <button
                key={item.month}
                onClick={() => setSelectedMonth(item.month)}
                className={`w-full rounded-3xl border px-5 py-4 text-left transition ${
                  item.month === selectedMonth ? 'border-sky-500 bg-sky-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-900">Kỳ {item.month}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>{item.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Tổng chi trả {formatVnd(item.totalPaid)} cho {item.employees} nhân viên.</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Tóm tắt kỳ lương</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Kỳ</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{selectedItem.month}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Tổng nhân viên</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{selectedItem.employees}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Tổng chi trả</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{formatVnd(selectedItem.totalPaid)}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Trạng thái</p>
              <p className="mt-3 inline-flex rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm">{selectedItem.status}</p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-slate-100 p-6">
            <h3 className="text-base font-semibold text-slate-900">Ghi chú</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">Lịch sử này hỗ trợ HR kiểm tra lại các kỳ phát lương đã hoàn thành hoặc chờ duyệt. Hồ sơ chi tiết giúp tránh sai sót thanh toán.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PayrollHistory;
