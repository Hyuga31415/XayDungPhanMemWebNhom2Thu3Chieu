-- ==============================================================================
-- DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÂN SỰ (HRM)
-- DBMS: MySQL
-- MÔ TẢ: Script khởi tạo Database, Tables và Seed Data
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS hrm_system;
USE hrm_system;

-- ==============================================================================
-- PHẦN 1: TẠO CẤU TRÚC BẢNG (DDL)
-- ==============================================================================

-- 1. Bảng Chức vụ (Positions)
CREATE TABLE IF NOT EXISTS positions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    base_salary DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Phòng ban (Departments)
-- Lưu ý: manager_id sẽ được thêm Foreign Key sau để tránh lỗi tham chiếu vòng
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    manager_id INT NULL, 
    status TINYINT DEFAULT 1
);

-- 3. Bảng Nhân viên (Employees)
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emp_code VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department_id INT,
    position_id INT,
    hire_date DATE NOT NULL,
    status ENUM('Active', 'Resigned') DEFAULT 'Active',
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE RESTRICT
);

-- Cập nhật Foreign Key cho bảng departments
ALTER TABLE departments 
ADD CONSTRAINT fk_dept_manager FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL;

-- 4. Bảng Tài khoản người dùng (Users)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Trong thực tế sẽ lưu chuỗi bcrypt
    role ENUM('Admin', 'HR', 'Staff') DEFAULT 'Staff',
    FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 5. Bảng Nhật ký chấm công (Attendance Logs)
CREATE TABLE IF NOT EXISTS attendance_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT NOT NULL,
    work_date DATE NOT NULL,
    check_in DATETIME NULL,
    check_out DATETIME NULL,
    status ENUM('Present', 'Late', 'Absent') DEFAULT 'Present',
    FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 6. Bảng Đơn xin nghỉ phép (Leave Requests)
CREATE TABLE IF NOT EXISTS leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT NOT NULL,
    leave_type ENUM('Annual', 'Sick', 'Unpaid') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    approved_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES employees(id) ON DELETE SET NULL
);

-- 7. Bảng Lương (Payroll Records)
CREATE TABLE IF NOT EXISTS payroll_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT NOT NULL,
    month TINYINT NOT NULL,
    year YEAR NOT NULL,
    base_salary DECIMAL(15,2) NOT NULL,
    total_allowance DECIMAL(15,2) DEFAULT 0.00,
    total_deduction DECIMAL(15,2) DEFAULT 0.00,
    net_salary DECIMAL(15,2) NOT NULL,
    status ENUM('Draft', 'Paid') DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- ==============================================================================
-- PHẦN 2: CHÈN DỮ LIỆU MẪU (DML - SEED DATA)
-- ==============================================================================

-- Seed Data: Positions
INSERT INTO positions (title, base_salary) VALUES
('Giám đốc', 50000000.00),
('Trưởng phòng HR', 30000000.00),
('Trưởng phòng IT', 35000000.00),
('Chuyên viên HR', 15000000.00),
('Lập trình viên Backend', 20000000.00),
('Lập trình viên Frontend', 20000000.00);

-- Seed Data: Departments (Tạm thời manager_id = NULL)
INSERT INTO departments (name, manager_id, status) VALUES
('Ban Giám Đốc', NULL, 1),
('Phòng Nhân Sự', NULL, 1),
('Phòng Công Nghệ Thông Tin', NULL, 1);

-- Seed Data: Employees
INSERT INTO employees (emp_code, full_name, email, department_id, position_id, hire_date, status) VALUES
('BOD001', 'Nguyễn Văn A', 'nva@company.com', 1, 1, '2020-01-01', 'Active'), -- Giám đốc
('HR001', 'Trần Thị B', 'ttb@company.com', 2, 2, '2021-03-15', 'Active'),    -- TP HR
('IT001', 'Lê Văn C', 'lvc@company.com', 3, 3, '2021-06-01', 'Active'),      -- TP IT
('HR002', 'Phạm Thị D', 'ptd@company.com', 2, 4, '2022-08-10', 'Active'),    -- Nhân viên HR
('IT002', 'Hoàng Văn E', 'hve@company.com', 3, 5, '2023-02-20', 'Active'),    -- Dev BE
('IT003', 'Ngô Thị F', 'ntf@company.com', 3, 6, '2023-05-12', 'Active');      -- Dev FE

-- Cập nhật lại Quản lý cho các phòng ban
UPDATE departments SET manager_id = 1 WHERE id = 1; -- Nguyễn Văn A quản lý Ban GĐ
UPDATE departments SET manager_id = 2 WHERE id = 2; -- Trần Thị B quản lý HR
UPDATE departments SET manager_id = 3 WHERE id = 3; -- Lê Văn C quản lý IT

-- Seed Data: Users (Password mặc định là '123456' được hash giả lập, team BE cần dùng thư viện bcrypt thực tế sau này)
INSERT INTO users (emp_id, username, password_hash, role) VALUES
(1, 'admin', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGGa.ABC', 'Admin'),
(2, 'manager_hr', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGGa.ABC', 'HR'),
(3, 'manager_it', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGGa.ABC', 'Staff'),
(4, 'staff_hr', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGGa.ABC', 'HR'),
(5, 'dev_be', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGGa.ABC', 'Staff'),
(6, 'dev_fe', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGGa.ABC', 'Staff');

-- Seed Data: Attendance Logs (Dữ liệu mẫu cho vài ngày gần đây)
INSERT INTO attendance_logs (emp_id, work_date, check_in, check_out, status) VALUES
(5, '2024-03-25', '2024-03-25 08:25:00', '2024-03-25 17:35:00', 'Present'),
(6, '2024-03-25', '2024-03-25 08:45:00', '2024-03-25 17:30:00', 'Late'),
(5, '2024-03-26', '2024-03-26 08:20:00', '2024-03-26 17:40:00', 'Present'),
(6, '2024-03-26', NULL, NULL, 'Absent');

-- Seed Data: Leave Requests
INSERT INTO leave_requests (emp_id, leave_type, start_date, end_date, status, approved_by) VALUES
(6, 'Sick', '2024-03-26', '2024-03-26', 'Approved', 3), -- Dev FE xin nghỉ ốm, TP IT duyệt
(5, 'Annual', '2024-04-10', '2024-04-12', 'Pending', NULL); -- Dev BE xin nghỉ phép năm, đang chờ duyệt

-- Seed Data: Payroll Records (Bảng lương mẫu tháng 2/2024)
INSERT INTO payroll_records (emp_id, month, year, base_salary, total_allowance, total_deduction, net_salary, status) VALUES
(5, 2, 2024, 20000000.00, 1000000.00, 500000.00, 20500000.00, 'Paid'),
(6, 2, 2024, 20000000.00, 1000000.00, 0.00, 21000000.00, 'Paid');