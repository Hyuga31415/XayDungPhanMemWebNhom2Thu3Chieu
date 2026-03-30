import React from 'react';

const formatVnd = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const PayrollReports = ({ reportData, quickInsights }) => {
  return (
    <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-sky-600">Báo cáo lương</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Payroll Reports</h1>
            <p className="mt-2 text-sm text-slate-600">Tổng hợp số liệu chi phí lương, phụ cấp và hiệu suất thanh toán.</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 px-6 py-5 text-center">
            <p className="text-sm text-slate-500">Dữ liệu</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">Tháng gần nhất</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {reportData.map((item) => (
          <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm uppercase tracking-[0.2em] text-slate-500">{item.title}</h2>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{formatVnd(item.value)}</p>
            <p className={`mt-3 text-sm font-semibold ${item.color}`}>{item.trend} so với tháng trước</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Phân tích chi phí</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">TPM</span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Chênh lệch lương</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">+8%</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Phụ cấp</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{formatVnd(4200000)}</p>
            </div>
          </div>
          <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-900">Xu hướng</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Số bảng lương xác nhận tăng nhẹ.</li>
              <li>• Khoản chi phụ cấp ổn định trong quý.</li>
              <li>• Tỷ lệ phát hiện sai sót giảm 12%.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Insights nhanh</h2>
          <div className="mt-6 space-y-4">
            {quickInsights.map((insight) => (
              <div key={insight} className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
                {insight}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">Xuất báo cáo PDF</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PayrollReports;
