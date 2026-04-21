import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import attendanceService from '../../api/attendanceService';

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const formatTime = (date) =>
  date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

const getMonthDays = (year, month) => {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

const WORK_START_MINUTES = 9 * 60;
const WORK_END_MINUTES = 17 * 60 + 30;
const OT_THRESHOLD_MINUTES = 18 * 60;

const parseTimeToMinutes = (time) => {
  if (!time) return null;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const initialMockAttendance = [
  { date: formatDateKey(new Date(Date.now() - 86400000)), checkIn: '09:10:00', checkOut: '17:25:00', status: 'late' },
  { date: formatDateKey(new Date(Date.now() - 2 * 86400000)), checkIn: '09:05:00', checkOut: '18:05:00', status: 'ot' },
  { date: formatDateKey(new Date(Date.now() - 3 * 86400000)), checkIn: null, checkOut: null, status: 'absent' },
];

const getStatusBadge = (status) => {
  if (status === 'present') return 'bg-success';
  if (status === 'late') return 'bg-warning text-dark';
  if (status === 'early') return 'bg-info text-dark';
  if (status === 'ot') return 'bg-primary';
  return 'bg-danger';
};

const getStatusText = (status) => {
  if (status === 'present') return 'Đi làm';
  if (status === 'late') return 'Đi trễ';
  if (status === 'early') return 'Về sớm';
  if (status === 'ot') return 'Tăng ca';
  return 'Nghỉ không phép';
};

const getStatusShort = (status) => {
  if (status === 'present') return 'P';
  if (status === 'late') return 'L';
  if (status === 'early') return 'E';
  if (status === 'ot') return 'O';
  return 'A';
};

const getDayRemark = (record) => {
  if (!record || record.status === 'absent') return 'Nghỉ không phép';
  const checkInMinutes = parseTimeToMinutes(record.checkIn);
  const checkOutMinutes = parseTimeToMinutes(record.checkOut);
  const remarks = [];

  if (checkInMinutes && checkInMinutes > WORK_START_MINUTES) {
    remarks.push('Đi muộn');
  }
  if (checkOutMinutes && checkOutMinutes < WORK_END_MINUTES) {
    remarks.push('Về sớm');
  }
  if (checkOutMinutes && checkOutMinutes >= OT_THRESHOLD_MINUTES) {
    remarks.push('Tăng ca');
  }

  return remarks.length > 0 ? remarks.join(' • ') : 'Bình thường';
};

function AttendancePage() {
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendance, setAttendance] = useState([]);
  const [todayRecord, setTodayRecord] = useState({
    checkIn: null,
    checkOut: null,
    status: 'absent',
  });
  const [clock, setClock] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const todayKey = formatDateKey(new Date());

  // Load mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      setAttendance(initialMockAttendance);

      const today = initialMockAttendance.find((i) => i.date === todayKey);

      setTodayRecord(
        today ?? {
          date: todayKey,
          checkIn: null,
          checkOut: null,
          status: 'absent',
        }
      );

      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [todayKey]);

  // Clock realtime
  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const recordToday = useMemo(
    () => attendance.find((i) => i.date === todayKey),
    [attendance, todayKey]
  );

  useEffect(() => {
    if (recordToday) setTodayRecord(recordToday);
  }, [recordToday]);

  const isCheckedIn = !!todayRecord.checkIn;
  const isCheckedOut = !!todayRecord.checkOut;

  const handleCheckIn = () => {
    if (isCheckedIn) return;

    const now = new Date();
    const time = formatTime(now);
    const status = now.getHours() >= 9 ? 'late' : 'present';

    setLoading(true);

    setTimeout(() => {
      const updated = {
        ...todayRecord,
        date: todayKey,
        checkIn: time,
        status,
      };

      setTodayRecord(updated);
      setAttendance((prev) => [
        updated,
        ...prev.filter((i) => i.date !== todayKey),
      ]);

      toast.success(`Check-in thành công lúc ${time}`);
      setLoading(false);
    }, 700);
  };

  const handleCheckOut = () => {
    if (!isCheckedIn || isCheckedOut) return;

    const now = new Date();
    const time = formatTime(now);
    const checkOutMinutes = now.getHours() * 60 + now.getMinutes();

    setLoading(true);

    setTimeout(() => {
      const updated = {
        ...todayRecord,
        date: todayKey,
        checkOut: time,
        status:
          checkOutMinutes >= OT_THRESHOLD_MINUTES
            ? 'ot'
            : checkOutMinutes < WORK_END_MINUTES
            ? 'early'
            : todayRecord.status,
      };

      setTodayRecord(updated);
      setAttendance((prev) => [
        updated,
        ...prev.filter((i) => i.date !== todayKey),
      ]);

      toast.success(`Check-out thành công lúc ${time}`);
      setLoading(false);
    }, 700);
  };

  const monthDays = useMemo(
    () => getMonthDays(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth]
  );

  const selectedDetail = selectedDate
    ? attendance.find((i) => i.date === formatDateKey(selectedDate))
    : null;

  // ⭐ FIX CORE LOGIC
  const getDayData = (key) => {
    if (key === todayKey) return todayRecord;

    const found = attendance.find((i) => i.date === key);
    if (found) return found;

    if (key > todayKey) return null;

    return { status: 'absent', checkIn: null };
  };

  return (
    <div className="attendance-page container py-4">
      <div className="page-header">
        <h2 className="mb-1">Chấm công</h2>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3">
        <div className="d-flex flex-wrap gap-2">
          <span className="badge bg-warning text-dark">Đi muộn: {attendance.filter((item) => item.status === 'late').length}</span>
          <span className="badge bg-info text-dark">Về sớm: {attendance.filter((item) => item.status === 'early').length}</span>
          <span className="badge bg-danger">Nghỉ không phép: {attendance.filter((item) => item.status === 'absent').length}</span>
          <span className="badge bg-primary">Tăng ca: {attendance.filter((item) => item.status === 'ot').length}</span>
        </div>

        <span className="badge bg-secondary fs-6">
          Giờ hiện tại: {formatTime(clock)}
        </span>
      </div>

      {loading && (
        <div className="alert alert-info rounded-3">
          Đang tải dữ liệu chấm công ...
        </div>
      )}

      <div className="row gy-3">
        {/* LEFT */}
        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Trạng thái hôm nay</h5>
              <p className="text-muted">
                {new Date().toLocaleDateString('vi-VN')}
              </p>

              <div className="mb-3">
                <strong>Trạng thái: </strong>
                <span className={`badge ${getStatusBadge(todayRecord.status)}`}>
                  {getStatusText(todayRecord.status)}
                </span>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-primary"
                  onClick={handleCheckIn}
                  disabled={loading || isCheckedIn}
                >
                  <CheckCircle size={16} className="me-1" />
                  Check-in
                </button>

                <button
                  className="btn btn-success"
                  onClick={handleCheckOut}
                  disabled={loading || !isCheckedIn || isCheckedOut}
                >
                  <XCircle size={16} className="me-1" />
                  Check-out
                </button>
              </div>

              {isCheckedOut && (
                <div className="mt-3">
                  <small className="text-success">
                    Bạn đã check-out, cảm ơn bạn đã hoàn thành ngày làm việc.
                  </small>
                </div>
              )}
            </div>
          </div>

          <div className="card mt-3 shadow-sm">
            <div className="card-body">
              <h6>Ghi chú</h6>
              <ul className="small">
                <li>Check-in trước 09:00 = đúng giờ</li>
                <li>Check-in sau 09:00 = đi trễ</li>
                <li>Check-out trước 17:30 = về sớm</li>
                <li>Check-out sau 18:00 = tăng ca</li>
                <li>Không check-in = nghỉ không phép</li>
                <li>P = Có mặt, L = Trễ, E = Về sớm, O = OT, A = Nghỉ không phép</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <h5 className="mb-0">
                  <CalendarDays className="me-2" />
                  Lịch chấm công
                </h5>

                <div className="btn-group">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() - 1,
                          1
                        )
                      )
                    }
                  >
                    Tháng trước
                  </button>

                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setCurrentMonth(new Date())}
                  >
                    Hôm nay
                  </button>

                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() + 1,
                          1
                        )
                      )
                    }
                  >
                    Tháng sau
                  </button>
                </div>
              </div>

              <div className="mb-2 fw-bold">
                {currentMonth.toLocaleDateString('vi-VN', {
                  month: 'long',
                  year: 'numeric',
                })}
              </div>

              <div className="row text-center g-2 small fw-bold">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
                  <div key={d} className="col p-1 border bg-light">
                    {d}
                  </div>
                ))}
              </div>

              <div className="row g-2">
                {monthDays.map((day) => {
                  const key = formatDateKey(day);
                  const isCurrent =
                    day.getMonth() === currentMonth.getMonth();

                  const data = getDayData(key);

                  return (
                    <div key={key} className="col p-0">
                      <button
                        className={`btn w-100 text-start p-2 border ${
                          isCurrent ? '' : 'text-muted opacity-50'
                        }`}
                        style={{ minHeight: 70 }}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className="d-flex justify-content-between">
                          <span>{day.getDate()}</span>

                          {data ? (
                            <span
                              className={`badge ${getStatusBadge(
                                data.status
                              )}`}
                            >
                              {getStatusShort(data.status)}
                            </span>
                          ) : (
                            <span className="badge bg-secondary">-</span>
                          )}
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
        <div
          className="modal fade show d-block"
          style={{ background: 'rgba(0,0,0,.45)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>
                  Chi tiết ngày{' '}
                  {selectedDate.toLocaleDateString('vi-VN')}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedDate(null)}
                />
              </div>

              <div className="modal-body">
                <p>
                  <strong>Trạng thái:</strong>{' '}
                  {getStatusText(selectedDetail?.status)}
                </p>
                <p>
                  <strong>Check-in:</strong>{' '}
                  {selectedDetail?.checkIn || 'Chưa có'}
                </p>
                <p>
                  <strong>Check-out:</strong>{' '}
                  {selectedDetail?.checkOut || 'Chưa có'}
                </p>
                <p>
                  <strong>Ghi chú:</strong>{' '}
                  {getDayRemark(selectedDetail)}
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedDate(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendancePage;