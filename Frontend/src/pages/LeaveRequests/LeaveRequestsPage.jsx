import React, { useEffect, useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_LEAVE_REQUESTS = [
  { id: 1, employee: 'Nguyễn Văn A', type: 'Nghỉ phép năm', startDate: '2025-12-01', endDate: '2025-12-03', reason: 'Du lịch', status: 'approved' },
  { id: 2, employee: 'Trần Thị B', type: 'Nghỉ ốm', startDate: '2025-12-10', endDate: '2025-12-10', reason: 'Cảm cúm', status: 'pending' },
  { id: 3, employee: 'Lê Văn C', type: 'Nghỉ không lương', startDate: '2025-12-20', endDate: '2025-12-22', reason: 'Việc riêng', status: 'rejected' },
];

const LEAVE_TYPES = ['Nghỉ phép năm', 'Nghỉ ốm', 'Nghỉ không lương'];

function LeaveRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({ type: '', startDate: '', endDate: '', reason: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRequests(MOCK_LEAVE_REQUESTS);
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const statusBadgeClass = (status) => {
    if (status === 'approved') return 'badge bg-success';
    if (status === 'rejected') return 'badge bg-danger';
    if (status === 'pending') return 'badge bg-warning text-dark';
    return 'badge bg-secondary';
  };

  const getStatusLabel = (status) => {
    if (status === 'approved') return 'Đã duyệt';
    if (status === 'rejected') return 'Từ chối';
    if (status === 'pending') return 'Chờ duyệt';
    return 'Không xác định';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.type || !formData.startDate || !formData.endDate || !formData.reason) {
      toast.error('Vui lòng điền đủ thông tin.');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.');
      return;
    }

    setFormLoading(true);
    setTimeout(() => {
      const newRequest = {
        id: Date.now(),
        employee: 'Bạn',
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        status: 'pending',
      };
      setRequests((prev) => [newRequest, ...prev]);
      setFormData({ type: '', startDate: '', endDate: '', reason: '' });
      toast.success('Yêu cầu đã gửi, đang chờ phê duyệt.');
      setFormLoading(false);
      setActiveTab('manage');
    }, 800);
  };

  const handleAction = (id, newStatus) => {
    if (!window.confirm(`Xác nhận ${newStatus} yêu cầu?`)) return;

    setActionLoadingId(id);
    setTimeout(() => {
      setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
      toast.success(`Đã ${newStatus === 'approved' ? 'phê duyệt' : 'từ chối'} yêu cầu.`);
      setActionLoadingId(null);
    }, 700);
  };

  const pendingRequests = requests.filter((item) => item.status === 'pending');
  const myRequests = requests.filter((item) => item.employee === 'Bạn');

  return (
    <div className="leave-requests-page container py-4">
      <div className="page-header">
        <h2 className="mb-1">Xin nghỉ phép</h2>
      </div>
      <div className="d-flex justify-content-between align-items-start mb-3">
      </div>

      {loading && <div className="alert alert-info">Đang tải dữ liệu ...</div>}

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>Yêu cầu của tôi</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => setActiveTab('manage')}>Duyệt yêu cầu</button>
        </li>
      </ul>

      {activeTab === 'requests' && (
        <div className="row g-3">
          <div className="col-lg-5">
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Form xin nghỉ</h5>
                <span className="badge bg-secondary">Employee</span>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Loại nghỉ</label>
                    <select className="form-select" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                      <option value="">Chọn</option>
                      {LEAVE_TYPES.map((type) => (<option key={type} value={type}>{type}</option>))}
                    </select>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col">
                      <label className="form-label">Từ ngày</label>
                      <input type="date" className="form-control" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                    </div>
                    <div className="col">
                      <label className="form-label">Đến ngày</label>
                      <input type="date" className="form-control" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Lý do</label>
                    <textarea className="form-control" rows={3} value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading ? 'Đang gửi...' : <><Plus size={16} className="me-1" /> Gửi yêu cầu</>}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Danh sách yêu cầu của bạn</h5>

                {myRequests.length === 0 ? (
                  <div className="text-muted">Chưa có yêu cầu nào.</div>
                ) : (
                  <div className="list-group">
                    {myRequests.map((item) => (
                      <div key={item.id} className="list-group-item list-group-item-action">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6>{item.type}</h6>
                            <small>{item.startDate} → {item.endDate}</small>
                            <p className="mb-0">{item.reason}</p>
                          </div>
                          <span className={statusBadgeClass(item.status)}>{getStatusLabel(item.status)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Danh sách yêu cầu chờ duyệt</h5>
            <span className="badge bg-secondary">Manager</span>
          </div>
          <div className="card-body">
            {pendingRequests.length === 0 ? (
              <div className="alert alert-secondary">Không có đơn chờ duyệt.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Nhân viên</th>
                      <th>Loại</th>
                      <th>Thời gian</th>
                      <th>Lý do</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((item) => (
                      <tr key={item.id}>
                        <td>{item.employee}</td>
                        <td>{item.type}</td>
                        <td>{item.startDate} → {item.endDate}</td>
                        <td>{item.reason}</td>
                        <td><span className={statusBadgeClass(item.status)}>{getStatusLabel(item.status)}</span></td>
                        <td>
                          <button className="btn btn-sm btn-success me-1" onClick={() => handleAction(item.id, 'approved')} disabled={actionLoadingId === item.id}>
                            <Check size={14} /> Duyệt
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleAction(item.id, 'rejected')} disabled={actionLoadingId === item.id}>
                            <X size={14} /> Từ chối
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveRequestsPage;