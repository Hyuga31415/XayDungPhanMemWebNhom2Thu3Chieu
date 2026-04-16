-- Tạo database (nếu chưa có)
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'hrm_system')
BEGIN
    CREATE DATABASE hrm_system;
END
GO

-- Sử dụng database vừa tạo
USE hrm_system;
GO

-- 1. Bảng Phòng ban (Departments)
CREATE TABLE departments (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT GETDATE()
);

-- 2. Bảng Chức vụ & Lương cơ bản (Positions)
CREATE TABLE positions (
  id INT IDENTITY(1,1) PRIMARY KEY,
  title NVARCHAR(100) NOT NULL,
  base_salary DECIMAL(15,2) NOT NULL,
  created_at DATETIME DEFAULT GETDATE()
);

-- 3. Bảng Nhân viên (Employees)
CREATE TABLE employees (
  id INT IDENTITY(1,1) PRIMARY KEY,
  emp_code VARCHAR(20) UNIQUE NOT NULL,
  full_name NVARCHAR(100) NOT NULL,
  department_id INT,
  position_id INT,
  status VARCHAR(10) CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
  created_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE SET NULL
);

-- 4. Bảng Lịch sử Phiếu lương (Payroll Records)
CREATE TABLE payroll_records (
  id INT IDENTITY(1,1) PRIMARY KEY,
  emp_id INT NOT NULL,
  month INT NOT NULL,
  year INT NOT NULL,
  base_salary DECIMAL(15,2) NOT NULL,
  total_allowance DECIMAL(15,2) DEFAULT 0,
  total_deduction DECIMAL(15,2) DEFAULT 0,
  net_salary DECIMAL(15,2) NOT NULL,
  status VARCHAR(10) CHECK (status IN ('Draft', 'Paid', 'Cancelled')) DEFAULT 'Draft',
  created_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- ==========================================
-- THÊM DỮ LIỆU MẪU ĐỂ TEST API TÍNH LƯƠNG
-- ==========================================

INSERT INTO departments (name) VALUES 
(N'Phòng Giám đốc'), 
(N'Phòng IT'), 
(N'Phòng Nhân sự');

INSERT INTO positions (title, base_salary) VALUES 
(N'Giám đốc', 50000000),
(N'Trưởng phòng', 30000000),
(N'Lập trình viên Backend', 20000000),
(N'Chuyên viên Nhân sự', 12000000);

INSERT INTO employees (emp_code, full_name, department_id, position_id, status) VALUES 
('EMP001', N'Nguyễn Trùm Cuối', 1, 1, 'Active'),
('EMP002', N'Trần Lập Trình', 2, 3, 'Active'),
('EMP003', N'Lê Kỹ Sư', 2, 3, 'Active'),
('EMP004', N'Phạm Nhân Sự', 3, 4, 'Active'),
('EMP005', N'Hoàng Đã Nghỉ Việc', 2, 3, 'Inactive');
