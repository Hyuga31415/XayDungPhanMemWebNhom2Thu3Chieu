-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th4 14, 2026 lúc 05:50 AM
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
CREATE DATABASE IF NOT EXISTS `hrm_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `hrm_system`;

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
  `status` enum('Present','Late','Absent') DEFAULT 'Present',
  PRIMARY KEY (`id`),
  KEY `emp_id` (`emp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `attendance_logs`
--

INSERT INTO `attendance_logs` (`id`, `emp_id`, `work_date`, `check_in`, `check_out`, `status`) VALUES
(1, 5, '2024-03-25', '2024-03-25 08:25:00', '2024-03-25 17:35:00', 'Present'),
(2, 6, '2024-03-25', '2024-03-25 08:45:00', '2024-03-25 17:30:00', 'Late'),
(3, 5, '2024-03-26', '2024-03-26 08:20:00', '2024-03-26 17:40:00', 'Present'),
(4, 6, '2024-03-26', NULL, NULL, 'Absent');

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
  `base_salary` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `positions`
--

INSERT INTO `positions` (`id`, `title`, `base_salary`, `created_at`) VALUES
(1, 'Giám đốc', 50000000.00, '2026-03-30 15:48:34'),
(2, 'Trưởng phòng HR', 30000000.00, '2026-03-30 15:48:34'),
(3, 'Trưởng phòng IT', 35000000.00, '2026-03-30 15:48:34'),
(4, 'Chuyên viên HR', 15000000.00, '2026-03-30 15:48:34'),
(5, 'Lập trình viên Backend', 20000000.00, '2026-03-30 15:48:34'),
(6, 'Lập trình viên Frontend', 20000000.00, '2026-03-30 15:48:34');

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
-- Các ràng buộc cho bảng `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `leave_requests_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL;

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
