import React from 'react';

// --- Các Component Phụ ---

const Sidebar = () => (
  <div className="sidebar" style={{ width: '250px', backgroundColor: '#1e293b', color: 'white', height: '100vh', padding: '20px' }}>
    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px' }}>HRM System</h2>
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      <li style={{ padding: '15px 0', cursor: 'pointer', borderBottom: '1px solid #334155' }}>📊 Bảng điều khiển</li>
      <li style={{ padding: '15px 0', cursor: 'pointer', borderBottom: '1px solid #334155' }}>👥 Quản lý nhân viên</li>
      <li style={{ padding: '15px 0', cursor: 'pointer', borderBottom: '1px solid #334155' }}>⏰ Chấm công</li>
      <li style={{ padding: '15px 0', cursor: 'pointer', borderBottom: '1px solid #334155' }}>🏖️ Nghỉ phép</li>
      <li style={{ padding: '15px 0', cursor: 'pointer', borderBottom: '1px solid #334155' }}>💰 Lương thưởng</li>
      <li style={{ padding: '15px 0', cursor: 'pointer' }}>⚙️ Cài đặt</li>
    </ul>
  </div>
);

const Header = () => (
  <div className="header" style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
    <h1 style={{ margin: 0, fontSize: '20px' }}>Trang chủ Tổng quan</h1>
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <span>🔔 Thông báo (3)</span>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#cbd5e1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <strong>AD</strong>
      </div>
    </div>
  </div>
);

const StatCard = ({ title, value, icon, color }) => (
  <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', flex: 1, borderTop: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>{title}</h3>
        <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>{value}</p>
      </div>
      <span style={{ fontSize: '30px' }}>{icon}</span>
    </div>
  </div>
);

const RecentActivity = () => (
  <div style={{ marginTop: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
    <h3 style={{ marginBottom: '20px' }}>Hoạt động gần đây</h3>
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      <li style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>🟢 <strong>Nguyễn Văn A</strong> vừa được duyệt đơn xin nghỉ phép.</li>
      <li style={{ padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>🔵 <strong>Trần Thị B</strong> đã nộp báo cáo chấm công tuần.</li>
      <li style={{ padding: '10px 0' }}>🎉 Chúc mừng sinh nhật <strong>Lê Văn C</strong>!</li>
    </ul>
  </div>
);

// --- Component Chính (Main Layout) ---

const HrDashboard = () => {
  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Sidebar bên trái */}
      <Sidebar />

      {/* Khu vực nội dung chính */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        
        <div style={{ padding: '30px' }}>
          <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Chào buổi sáng, Admin! 👋</h2>
          
          {/* Hàng chứa các thẻ thống kê */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <StatCard title="Tổng nhân viên" value="124" icon="👥" color="#3b82f6" />
            <StatCard title="Đang nghỉ phép" value="12" icon="🏖️" color="#eab308" />
            <StatCard title="Tuyển dụng mới" value="5" icon="🚀" color="#22c55e" />
            <StatCard title="Yêu cầu cần duyệt" value="8" icon="⏳" color="#ef4444" />
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
            {/* Cột trái: Hoạt động gần đây */}
            <div style={{ flex: 2 }}>
              <RecentActivity />
            </div>
            
            {/* Cột phải: Thao tác nhanh */}
            <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginTop: '30px' }}>
              <h3 style={{ marginBottom: '20px' }}>Thao tác nhanh</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button style={{ padding: '10px', backgroundColor: '#eff6ff', color: '#1d4ed8', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>+ Thêm nhân viên</button>
                <button style={{ padding: '10px', backgroundColor: '#f0fdf4', color: '#15803d', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>✔️ Duyệt chấm công</button>
                <button style={{ padding: '10px', backgroundColor: '#fef2f2', color: '#b91c1c', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>📝 Tạo thông báo</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HrDashboard;