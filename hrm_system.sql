-- Cơ sở dữ liệu: `hrm_system` (Đã tối ưu hóa)
CREATE DATABASE IF NOT EXISTS `hrm_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `hrm_system`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- 1. Bảng Phòng ban (Departments)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `departments` (`id`, `name`, `code`, `status`, `description`) VALUES
(1, 'Ban Giám Đốc', 'BOD', 1, 'Điều hành và định hướng chiến lược công ty'),
(2, 'Phòng Nhân Sự', 'HR', 1, 'Quản lý nguồn nhân lực, tuyển dụng và phúc lợi'),
(3, 'Phòng Công Nghệ Thông Tin', 'IT', 1, 'Phát triển phần mềm và hạ tầng công nghệ');

-- --------------------------------------------------------
-- 2. Bảng Vị trí / Chức vụ (Positions)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `positions`;
CREATE TABLE IF NOT EXISTS `positions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `base_salary` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `positions` (`id`, `title`, `base_salary`) VALUES
(1, 'Giám đốc', 50000000.00),
(2, 'Trưởng phòng HR', 30000000.00),
(3, 'Trưởng phòng IT', 35000000.00),
(4, 'Chuyên viên HR', 15000000.00),
(5, 'Lập trình viên Backend', 20000000.00),
(6, 'Lập trình viên Frontend', 20000000.00);

-- --------------------------------------------------------
-- 3. Bảng Nhân viên (Employees)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `employees`;
CREATE TABLE IF NOT EXISTS `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_code` varchar(20) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `gender` enum('male','female','other') DEFAULT 'male',
  `department_id` int DEFAULT NULL,
  `position_id` int DEFAULT NULL,
  `hire_date` date NOT NULL,
  `status` enum('Active','Resigned') DEFAULT 'Active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `emp_code` (`emp_code`),
  UNIQUE KEY `email` (`email`),
  KEY `department_id` (`department_id`),
  KEY `position_id` (`position_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `employees` (`id`, `emp_code`, `full_name`, `email`, `gender`, `department_id`, `position_id`, `hire_date`, `status`) VALUES
(1, 'BOD001', 'Nguyễn Văn A', 'admin@company.com', 'male', 1, 1, '2020-01-01', 'Active');

-- Cập nhật khóa ngoại manager_id cho departments sau khi có nhân viên
ALTER TABLE `departments`
  ADD CONSTRAINT `fk_dept_manager` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL;

-- --------------------------------------------------------
-- 4. Bảng Lịch sử chấm công (Attendance Logs)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `attendance_logs`;
CREATE TABLE IF NOT EXISTS `attendance_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `emp_id` int NOT NULL,
  `work_date` date NOT NULL,
  `check_in` datetime DEFAULT NULL,
  `check_out` datetime DEFAULT NULL,
  `status` enum('Present','Late','Absent') DEFAULT 'Present',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_daily_attendance` (`emp_id`, `work_date`), -- Tránh 1 người có 2 dòng log trong 1 ngày
  KEY `emp_id` (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 5. Bảng Đơn xin nghỉ phép (Leave Requests)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `leave_requests`;
CREATE TABLE IF NOT EXISTS `leave_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_id` int NOT NULL,
  `leave_type` enum('Annual','Sick','Unpaid') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `approved_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Tracking thời gian duyệt đơn
  PRIMARY KEY (`id`),
  KEY `emp_id` (`emp_id`),
  KEY `approved_by` (`approved_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 6. Bảng Bảng lương (Payroll Records)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `payroll_records`;
CREATE TABLE IF NOT EXISTS `payroll_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_id` int NOT NULL,
  `month` tinyint NOT NULL,
  `year` year NOT NULL,
  `base_salary` decimal(15,2) NOT NULL,
  `total_allowance` decimal(15,2) DEFAULT '0.00',
  `total_deduction` decimal(15,2) DEFAULT '0.00',
  `net_salary` decimal(15,2) NOT NULL,
  `status` enum('Draft','Paid') DEFAULT 'Draft',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Tracking thời gian trả lương
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_monthly_payroll` (`emp_id`, `month`, `year`), -- Đảm bảo không tính lương 2 lần cho 1 tháng
  KEY `emp_id` (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 7. Bảng Tài khoản Người dùng (Users)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('Admin','HR','Staff') DEFAULT 'Staff',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `emp_id` (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `emp_id`, `username`, `password_hash`, `role`) VALUES
(1, 1, 'admin', '$2b$10$Lg7zBsZtQCUeLo7wOuYsWOhbE4KY2o/DfcWXUYtimtYNcTRZ6KREG', 'Admin');

-- --------------------------------------------------------
-- CÁC RÀNG BUỘC KHÓA NGOẠI (FOREIGN KEYS)
-- --------------------------------------------------------
ALTER TABLE `attendance_logs`
  ADD CONSTRAINT `attendance_logs_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE RESTRICT;

ALTER TABLE `leave_requests`
  ADD CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `leave_requests_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL;

ALTER TABLE `payroll_records`
  ADD CONSTRAINT `payroll_records_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

COMMIT;
