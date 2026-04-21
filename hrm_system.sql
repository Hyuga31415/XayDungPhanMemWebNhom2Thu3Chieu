-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th4 21, 2026 lúc 02:00 AM
-- Phiên bản máy phục vụ: 9.1.0
-- Phiên bản PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `hrm_system`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attendance_logs`
--

DROP TABLE IF EXISTS `attendance_logs`;
CREATE TABLE IF NOT EXISTS `attendance_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `emp_id` int NOT NULL,
  `work_date` date NOT NULL,
  `check_in` datetime DEFAULT NULL,
  `check_out` datetime DEFAULT NULL,
  `working_hours` decimal(4,2) DEFAULT '0.00' COMMENT 'Số giờ làm hành chính',
  `overtime_hours` decimal(4,2) DEFAULT '0.00' COMMENT 'Số giờ OT',
  `status` enum('Present','Late','Absent') DEFAULT 'Present',
  PRIMARY KEY (`id`),
  KEY `emp_id` (`emp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `attendance_logs`
--

INSERT INTO `attendance_logs` (`id`, `emp_id`, `work_date`, `check_in`, `check_out`, `working_hours`, `overtime_hours`, `status`) VALUES
(1, 5, '2024-03-25', '2024-03-25 08:25:00', '2024-03-25 17:35:00', 0.00, 0.00, 'Present'),
(2, 6, '2024-03-25', '2024-03-25 08:45:00', '2024-03-25 17:30:00', 0.00, 0.00, 'Late'),
(3, 5, '2024-03-26', '2024-03-26 08:20:00', '2024-03-26 17:40:00', 0.00, 0.00, 'Present'),
(4, 6, '2024-03-26', NULL, NULL, 0.00, 0.00, 'Absent');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `departments`
--

DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `description` text,
  PRIMARY KEY (`id`),
  KEY `fk_dept_manager` (`manager_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `departments`
--

INSERT INTO `departments` (`id`, `name`, `code`, `manager_id`, `status`, `description`) VALUES
(1, 'Ban Giám Đốc', 'BOD', 2, 1, 'Điều hành và định hướng chiến lược công ty'),
(2, 'Phòng Nhân Sự', 'HR', 4, 1, 'Quản lý nguồn nhân lực, tuyển dụng và phúc lợi'),
(3, 'Phòng Công Nghệ Thông Tin', 'IT', 5, 1, 'Phát triển phần mềm và hạ tầng công nghệ');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `employees`
--

DROP TABLE IF EXISTS `employees`;
CREATE TABLE IF NOT EXISTS `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_code` varchar(20) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `gender` enum('male','female') DEFAULT 'male',
  `department_id` int DEFAULT NULL,
  `position_id` int DEFAULT NULL,
  `hire_date` date NOT NULL,
  `status` enum('Active','Resigned') DEFAULT 'Active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `emp_code` (`emp_code`),
  UNIQUE KEY `email` (`email`),
  KEY `department_id` (`department_id`),
  KEY `position_id` (`position_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `employees`
--

INSERT INTO `employees` (`id`, `emp_code`, `full_name`, `email`, `gender`, `department_id`, `position_id`, `hire_date`, `status`) VALUES
(1, 'BOD001', 'Nguyễn Văn A', 'nva@company.com', 'male', 1, 1, '2020-01-01', 'Active'),
(2, 'HR001', 'Trần Thị B', 'ttb@company.com', 'female', 2, 2, '2021-03-15', 'Active'),
(3, 'IT001', 'Lê Văn C', 'lvc@company.com', 'male', 3, 3, '2021-06-01', 'Active'),
(4, 'HR002', 'Phạm Thị D', 'ptd@company.com', 'female', 2, 4, '2022-08-10', 'Active'),
(5, 'IT002', 'Hoàng Văn E', 'hve@company.com', 'male', 3, 5, '2023-02-20', 'Active'),
(6, 'IT003', 'Ngô Thị L', 'ntf@company.com', 'male', 3, 2, '2023-05-12', 'Active'),
(10, 'EMP007', 'Ngô Thị TT', 'abc@gmail.com', 'male', 3, 3, '2026-05-02', 'Active');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `employee_contracts`
--

DROP TABLE IF EXISTS `employee_contracts`;
CREATE TABLE IF NOT EXISTS `employee_contracts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_id` int NOT NULL,
  `contract_code` varchar(50) NOT NULL,
  `base_salary` decimal(15,2) NOT NULL COMMENT 'Lương cơ bản thỏa thuận riêng',
  `sign_date` date NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('Active','Expired','Terminated') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contract_code` (`contract_code`),
  KEY `emp_id` (`emp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `employee_contracts`
--

INSERT INTO `employee_contracts` (`id`, `emp_id`, `contract_code`, `base_salary`, `sign_date`, `start_date`, `end_date`, `status`, `created_at`) VALUES
(1, 1, 'HD-BOD001', 50000000.00, '2020-01-01', '2020-01-01', NULL, 'Active', '2026-04-21 01:52:35'),
(2, 5, 'HD-IT002', 20000000.00, '2023-02-20', '2023-02-20', NULL, 'Active', '2026-04-21 01:52:35'),
(3, 6, 'HD-IT003', 25000000.00, '2023-05-12', '2023-05-12', NULL, 'Active', '2026-04-21 01:52:35');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `employee_job_history`
--

DROP TABLE IF EXISTS `employee_job_history`;
CREATE TABLE IF NOT EXISTS `employee_job_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_id` int NOT NULL,
  `old_department_id` int DEFAULT NULL,
  `new_department_id` int NOT NULL,
  `old_position_id` int DEFAULT NULL,
  `new_position_id` int NOT NULL,
  `effective_date` date NOT NULL COMMENT 'Ngày bắt đầu hiệu lực',
  `reason` varchar(255) DEFAULT NULL COMMENT 'Lý do: Thăng chức, Điều chuyển...',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_history_emp` (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `employee_shifts`
--

DROP TABLE IF EXISTS `employee_shifts`;
CREATE TABLE IF NOT EXISTS `employee_shifts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `emp_id` int NOT NULL,
  `shift_id` int NOT NULL,
  `work_date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_emp_date` (`emp_id`,`work_date`),
  KEY `fk_es_shift` (`shift_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `leave_requests`
--

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
  PRIMARY KEY (`id`),
  KEY `emp_id` (`emp_id`),
  KEY `approved_by` (`approved_by`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `leave_requests`
--

INSERT INTO `leave_requests` (`id`, `emp_id`, `leave_type`, `start_date`, `end_date`, `status`, `approved_by`, `created_at`) VALUES
(1, 6, 'Sick', '2024-03-26', '2024-03-26', 'Approved', 3, '2026-03-30 15:48:35'),
(2, 5, 'Annual', '2024-04-10', '2024-04-12', 'Pending', NULL, '2026-03-30 15:48:35');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payroll_details`
--

DROP TABLE IF EXISTS `payroll_details`;
CREATE TABLE IF NOT EXISTS `payroll_details` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `payroll_id` int NOT NULL,
  `component_id` int NOT NULL,
  `amount` decimal(15,2) NOT NULL COMMENT 'Số tiền cộng/trừ',
  `description` varchar(255) DEFAULT NULL COMMENT 'Ghi chú chi tiết nếu cần',
  PRIMARY KEY (`id`),
  KEY `payroll_id` (`payroll_id`),
  KEY `component_id` (`component_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `payroll_details`
--

INSERT INTO `payroll_details` (`id`, `payroll_id`, `component_id`, `amount`, `description`) VALUES
(1, 1, 1, 700000.00, '20 ngày ăn trưa'),
(2, 1, 2, 300000.00, 'Xăng xe tháng 2'),
(3, 1, 5, 500000.00, 'BHXH tháng 2');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payroll_records`
--

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
  PRIMARY KEY (`id`),
  KEY `emp_id` (`emp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `payroll_records`
--

INSERT INTO `payroll_records` (`id`, `emp_id`, `month`, `year`, `base_salary`, `total_allowance`, `total_deduction`, `net_salary`, `status`, `created_at`) VALUES
(1, 5, 2, '2024', 20000000.00, 1000000.00, 500000.00, 20500000.00, 'Paid', '2026-03-30 15:48:35'),
(2, 6, 2, '2024', 20000000.00, 1000000.00, 0.00, 21000000.00, 'Paid', '2026-03-30 15:48:35'),
(17, 1, 4, '2026', 50000000.00, 1000000.00, 0.00, 51000000.00, 'Draft', '2026-04-14 04:45:41'),
(18, 2, 4, '2026', 30000000.00, 1000000.00, 0.00, 31000000.00, 'Draft', '2026-04-14 04:45:41'),
(19, 3, 4, '2026', 35000000.00, 1000000.00, 0.00, 36000000.00, 'Draft', '2026-04-14 04:45:41'),
(20, 4, 4, '2026', 15000000.00, 1000000.00, 0.00, 16000000.00, 'Draft', '2026-04-14 04:45:41'),
(21, 5, 4, '2026', 20000000.00, 1000000.00, 0.00, 21000000.00, 'Draft', '2026-04-14 04:45:41'),
(22, 6, 4, '2026', 30000000.00, 1000000.00, 0.00, 31000000.00, 'Draft', '2026-04-14 04:45:41'),
(23, 10, 4, '2026', 35000000.00, 1000000.00, 0.00, 36000000.00, 'Draft', '2026-04-14 04:45:41'),
(24, 1, 3, '2026', 50000000.00, 1000000.00, 0.00, 51000000.00, 'Draft', '2026-04-14 04:48:37'),
(25, 2, 3, '2026', 30000000.00, 1000000.00, 0.00, 31000000.00, 'Draft', '2026-04-14 04:48:37'),
(26, 3, 3, '2026', 35000000.00, 1000000.00, 0.00, 36000000.00, 'Draft', '2026-04-14 04:48:37'),
(27, 4, 3, '2026', 15000000.00, 1000000.00, 0.00, 16000000.00, 'Draft', '2026-04-14 04:48:37'),
(28, 5, 3, '2026', 20000000.00, 1000000.00, 0.00, 21000000.00, 'Draft', '2026-04-14 04:48:37'),
(29, 6, 3, '2026', 30000000.00, 1000000.00, 0.00, 31000000.00, 'Draft', '2026-04-14 04:48:37'),
(30, 10, 3, '2026', 35000000.00, 1000000.00, 0.00, 36000000.00, 'Draft', '2026-04-14 04:48:37');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `positions`
--

DROP TABLE IF EXISTS `positions`;
CREATE TABLE IF NOT EXISTS `positions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `positions`
--

INSERT INTO `positions` (`id`, `title`, `created_at`) VALUES
(1, 'Giám đốc', '2026-03-30 15:48:34'),
(2, 'Trưởng phòng HR', '2026-03-30 15:48:34'),
(3, 'Trưởng phòng IT', '2026-03-30 15:48:34'),
(4, 'Chuyên viên HR', '2026-03-30 15:48:34'),
(5, 'Lập trình viên Backend', '2026-03-30 15:48:34'),
(6, 'Lập trình viên Frontend', '2026-03-30 15:48:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `salary_components`
--

DROP TABLE IF EXISTS `salary_components`;
CREATE TABLE IF NOT EXISTS `salary_components` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'Tên khoản thu/chi (VD: Ăn trưa, BHXH)',
  `type` enum('Allowance','Deduction') NOT NULL COMMENT 'Allowance (Cộng) | Deduction (Trừ)',
  `is_taxable` tinyint(1) DEFAULT '0' COMMENT 'Có tính thuế TNCN không',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `salary_components`
--

INSERT INTO `salary_components` (`id`, `name`, `type`, `is_taxable`) VALUES
(1, 'Phụ cấp ăn trưa', 'Allowance', 0),
(2, 'Phụ cấp xăng xe', 'Allowance', 0),
(3, 'Thưởng chuyên cần', 'Allowance', 1),
(4, 'Trừ tiền đi muộn', 'Deduction', 0),
(5, 'Đóng BHXH (8%)', 'Deduction', 0),
(6, 'Thuế TNCN', 'Deduction', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shifts`
--

DROP TABLE IF EXISTS `shifts`;
CREATE TABLE IF NOT EXISTS `shifts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shift_name` varchar(50) NOT NULL,
  `start_time` time NOT NULL COMMENT 'Giờ bắt đầu ca',
  `end_time` time NOT NULL COMMENT 'Giờ kết thúc ca',
  `grace_period_mins` int DEFAULT '0' COMMENT 'Số phút cho phép đi muộn (không phạt)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `shifts`
--

INSERT INTO `shifts` (`id`, `shift_name`, `start_time`, `end_time`, `grace_period_mins`) VALUES
(1, 'Ca Hành Chính', '08:00:00', '17:30:00', 15),
(2, 'Ca Sáng', '06:00:00', '14:00:00', 10),
(3, 'Ca Chiều', '14:00:00', '22:00:00', 10);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `system_configs`
--

DROP TABLE IF EXISTS `system_configs`;
CREATE TABLE IF NOT EXISTS `system_configs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `config_key` varchar(50) NOT NULL COMMENT 'Khóa cấu hình (VD: LATE_PENALTY_AMOUNT)',
  `config_value` varchar(255) NOT NULL COMMENT 'Giá trị cấu hình',
  `description` varchar(255) DEFAULT NULL COMMENT 'Mô tả ý nghĩa',
  `updated_by` int DEFAULT NULL COMMENT 'ID của Admin thao tác',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `config_key` (`config_key`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `system_configs`
--

INSERT INTO `system_configs` (`id`, `config_key`, `config_value`, `description`, `updated_by`, `updated_at`) VALUES
(1, 'STANDARD_WORK_HOURS', '8', 'Số giờ làm chuẩn 1 ngày', NULL, '2026-04-21 01:58:38'),
(2, 'LATE_PENALTY_AMOUNT', '50000', 'Số tiền phạt đi muộn (VNĐ/lần)', NULL, '2026-04-21 01:58:38'),
(3, 'BHXH_RATE_EMPLOYEE', '8', 'Tỷ lệ đóng BHXH của nhân viên (%)', NULL, '2026-04-21 01:58:38'),
(4, 'COMPANY_NAME', 'TechCorp VN', 'Tên công ty hiển thị trên hóa đơn/phiếu lương', NULL, '2026-04-21 01:58:38');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `emp_id`, `username`, `password_hash`, `role`) VALUES
(1, 1, 'admin', '$2b$10$Lg7zBsZtQCUeLo7wOuYsWOhbE4KY2o/DfcWXUYtimtYNcTRZ6KREG', 'Admin'),
(2, 2, 'manager_hr', '$2b$10$9QINSK85QG5sSIAQYjZJduDNbCXPDgb10mGGks2bkkIyNQneKIdlC', 'HR'),
(3, 3, 'manager_it', '$2b$10$2/IjiNrnEuvYvOa7XAlN3.95wht6YKeBE4tCNglyvZLfjNnqiH2/W', 'Staff'),
(4, 4, 'staff_hr', '$2b$10$0TzKKRmCw5SjEMugtf6/zun4rJZK/6HfvlXOPQsGtzAIHyLCsS0fm', 'HR'),
(5, 5, 'dev_be', '$2b$10$n1JWXGx0mhIv2wImsGKSweKvYWWCqSDNytIJhJYc3ED01VcafXby6', 'Staff'),
(6, 6, 'dev_fe', '$2b$10$TqokaKw0LjrEO2w.wR2UCO5XwrQXaxDkXmwtCydEKeEBLzoCuUH3a', 'Staff');

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD CONSTRAINT `attendance_logs_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `fk_dept_manager` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE RESTRICT;

--
-- Các ràng buộc cho bảng `employee_contracts`
--
ALTER TABLE `employee_contracts`
  ADD CONSTRAINT `fk_contract_employee` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `employee_job_history`
--
ALTER TABLE `employee_job_history`
  ADD CONSTRAINT `fk_history_emp` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `employee_shifts`
--
ALTER TABLE `employee_shifts`
  ADD CONSTRAINT `fk_es_emp` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_es_shift` FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`id`) ON DELETE RESTRICT;

--
-- Các ràng buộc cho bảng `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `leave_requests_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `payroll_details`
--
ALTER TABLE `payroll_details`
  ADD CONSTRAINT `fk_detail_component` FOREIGN KEY (`component_id`) REFERENCES `salary_components` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `fk_detail_payroll` FOREIGN KEY (`payroll_id`) REFERENCES `payroll_records` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `payroll_records`
--
ALTER TABLE `payroll_records`
  ADD CONSTRAINT `payroll_records_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
