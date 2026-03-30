import React, { useMemo, useState } from 'react';

const statusStyles = {
  'Hoàn thành': 'bg-emerald-100 text-emerald-800',
  'Chờ phê duyệt': 'bg-amber-100 text-amber-800',
};

const formatVnd = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const PayrollHistory = ({ historyItems }) => {
  const [selectedMonth, setSelectedMonth] = useState(historyItems[0]?.month ?? '');

  const selectedItem = useMemo(
    () => historyItems.find((item) => item.month === selectedMonth) || historyItems[0] || {},
    [selectedMonth, historyItems]
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
                className={`btn btn-block justify-start rounded-3xl ${
                  item.month === selectedMonth ? 'btn-primary text-white' : 'btn-ghost text-slate-900'
                }`}
              >
                <div className="flex w-full flex-col gap-2 text-left">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold">Kỳ {item.month}</span>
                    <span className={`badge badge-sm ${statusStyles[item.status]}`}>{item.status}</span>
                  </div>
                  <p className="text-sm text-slate-600">Tổng chi trả {formatVnd(item.totalPaid)} cho {item.employees} nhân viên.</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Tóm tắt kỳ lương</h2>
          <div className="stats stats-vertical gap-4 sm:stats-horizontal">
            <div className="stat rounded-3xl bg-base-100 shadow-sm p-6">
              <div className="stat-title">Kỳ</div>
              <div className="stat-value text-3xl">{selectedItem.month}</div>
            </div>
            <div className="stat rounded-3xl bg-base-100 shadow-sm p-6">
              <div className="stat-title">Tổng nhân viên</div>
              <div className="stat-value text-3xl">{selectedItem.employees}</div>
            </div>
            <div className="stat rounded-3xl bg-base-100 shadow-sm p-6">
              <div className="stat-title">Tổng chi trả</div>
              <div className="stat-value text-3xl">{formatVnd(selectedItem.totalPaid)}</div>
            </div>
            <div className="stat rounded-3xl bg-base-100 shadow-sm p-6">
              <div className="stat-title">Trạng thái</div>
              <div className="stat-value text-slate-900">{selectedItem.status}</div>
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
