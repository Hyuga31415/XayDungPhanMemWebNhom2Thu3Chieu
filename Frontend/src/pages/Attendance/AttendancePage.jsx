import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import attendanceService from '../../api/attendanceService';

function formatDateKey(date) {
  return date.toISOString().split('T')[0];
}

function formatTime(date) {
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getMonthDays(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstOfMonth.getDay();
  const start = new Date(firstOfMonth);
  start.setDate(start.getDate() - firstDayOfWeek);

  const list = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    list.push(day);
  }
  return list;
}

function AttendancePage() {
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendance, setAttendance] = useState([]);
  const [todayRecord, setTodayRecord] = useState({ checkIn: null, checkOut: null, status: 'Absent' });
  const [clock, setClock] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const load = async () => {
        const rows = await attendanceService.getAll();
        setAttendance(rows);
        const todayKey = formatDateKey(new Date());
        const today = rows.find((item) => item.date === todayKey);
        setTodayRecord(today ?? { date: todayKey, checkIn: null, checkOut: null, status: 'Absent' });
        setLoading(false);
      };
      load();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const todaysKey = formatDateKey(new Date());
  const recordInList = useMemo(() => attendance.find((item) => item.date === todaysKey), [attendance, todaysKey]);

  useEffect(() => {
    if (recordInList) {
      setTodayRecord(recordInList);
    }
  }, [recordInList]);

  const isCheckedIn = Boolean(todayRecord.checkIn || todayRecord.check_in);
  const isCheckedOut = Boolean(todayRecord.checkOut);

  const handleCheckIn = () => {
    if (isCheckedIn) return;

    setLoading(true);
    setTimeout(async () => {
      const updatedToday = await attendanceService.checkIn(6, todaysKey);
      setTodayRecord(updatedToday);
      setAttendance((prev) => {
        const base = prev.filter((item) => item.date !== todaysKey);
        return [updatedToday, ...base];
      });
      toast.success(`Check-in thanh cong luc ${updatedToday.checkIn}`);
      setLoading(false);
    }, 700);
  };

  const handleCheckOut = () => {
    if (!isCheckedIn || isCheckedOut) return;

    setLoading(true);
    setTimeout(async () => {
      const updatedToday = await attendanceService.checkOut(6, todaysKey);
      setTodayRecord(updatedToday);
      setAttendance((prev) => {
        const base = prev.filter((item) => item.date !== todaysKey);
        return [updatedToday, ...base];
      });
      toast.success(`Check-out thanh cong luc ${updatedToday.checkOut}`);
      setLoading(false);
    }, 700);
  };

  const monthDays = useMemo(() => getMonthDays(currentMonth.getFullYear(), currentMonth.getMonth()), [currentMonth]);

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const handleGoToday = () => setCurrentMonth(new Date());

  const selectedDetail = selectedDate
    ? attendance.find((item) => item.date === formatDateKey(selectedDate))
    : null;

  return (
    <div className="attendance-page container py-4">
      <div className="page-header">
        <h2 className="mb-1">Chấm công</h2>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div></div>
        <div>
          <span className="badge bg-secondary fs-6">Giờ hiện tại: {formatTime(clock)}</span>
        </div>
      </div>

      {loading && (
        <div className="alert alert-info rounded-3">Đang tải dữ liệu chấm công ...</div>
      )}

      <div className="row gy-3">
        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Trạng thái hôm nay</h5>
              <p className="text-muted">{new Date().toLocaleDateString('vi-VN')}</p>

              <div className="mb-3">
                <strong>Trạng thái:</strong>{' '}
                <span className={`badge ${todayRecord.status === 'Present' ? 'bg-success' : todayRecord.status === 'Late' ? 'bg-warning' : 'bg-danger'}`}>
                  {todayRecord.status === 'Present' ? 'Di lam' : todayRecord.status === 'Late' ? 'Di tre' : 'Vang'}
                </span>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-primary" onClick={handleCheckIn} disabled={loading || isCheckedIn}>
                  <CheckCircle className="me-1" size={16} /> Check-in
                </button>
                <button className="btn btn-success" onClick={handleCheckOut} disabled={loading || !isCheckedIn || isCheckedOut}>
                  <XCircle className="me-1" size={16} /> Check-out
                </button>
              </div>

              {isCheckedOut && (
                <div className="mt-3"><small className="text-success">Bạn đã check-out, cảm ơn bạn đã hoàn thành ngày làm việc.</small></div>
              )}
            </div>
          </div>

          <div className="card mt-3 shadow-sm">
            <div className="card-body">
              <h6>Ghi chú</h6>
              <ul className="small">
                <li>Check-in trước 09:00 được tính là Có mặt đúng giờ.</li>
                <li>Check-in sau 09:00 được tính là Trễ.</li>
                <li>Nếu không có check-in sẽ là Vắng.</li>
                <li>Trong lịch, ký hiệu trạng thái:
                  <ul>
                    <li><strong>P</strong> = Có mặt</li>
                    <li><strong>L</strong> = Đi trễ</li>
                    <li><strong>A</strong> = Vắng</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="card-title mb-0"><CalendarDays className="me-2" /> Lịch chấm công</h5>
                <div className="btn-group" role="group">
                  <button className="btn btn-outline-secondary btn-sm" onClick={handlePrevMonth}>Tháng trước</button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={handleGoToday}>Hôm nay</button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={handleNextMonth}>Tháng sau</button>
                </div>
              </div>

              <div className="mb-2"><strong>{currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}</strong></div>

              <div className="row text-center g-2 small text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((wd) => (
                  <div key={wd} className="col p-1 border bg-light">{wd}</div>
                ))}
              </div>

              <div className="row g-2">
                {monthDays.map((day) => {
                  const key = formatDateKey(day);
                  const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                  const dayData = attendance.find((item) => item.date === key) ?? { status: 'Absent', checkIn: null, checkOut: null };
                  const today = formatDateKey(new Date()) === key;

                  return (
                    <div key={key} className="col p-0">
                      <button
                        type="button"
                        className={`btn w-100 text-start p-2 border ${isCurrentMonth ? '' : 'text-muted opacity-50'} ${today ? 'border-primary' : ''}`}
                        style={{ minHeight: '70px', fontSize: '0.8rem', whiteSpace: 'normal' }}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <span>{day.getDate()}</span>
                          <span
                            className={`badge ${dayData.status === 'Present' ? 'bg-success' : dayData.status === 'Late' ? 'bg-warning text-dark' : 'bg-danger'}`}
                          >
                            {dayData.status === 'Present' ? 'P' : dayData.status === 'Late' ? 'L' : 'A'}
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,.45)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết ngày {selectedDate.toLocaleDateString('vi-VN')}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedDate(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Trang thai:</strong> {selectedDetail ? (selectedDetail.status === 'Present' ? 'Di lam' : selectedDetail.status === 'Late' ? 'Di tre' : 'Vang') : 'Vang'}</p>
                <p><strong>Check-in:</strong> {selectedDetail?.checkIn ?? 'Chưa có'}</p>
                <p><strong>Check-out:</strong> {selectedDetail?.checkOut ?? 'Chưa có'}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedDate(null)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendancePage;