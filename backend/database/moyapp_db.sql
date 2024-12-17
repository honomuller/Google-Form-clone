-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 09, 2024 at 04:49 PM
-- Server version: 8.3.0
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `moyapp_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
CREATE TABLE IF NOT EXISTS `application` (
  `app_id` int NOT NULL AUTO_INCREMENT,
  `app_title` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `app_name` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` int NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`app_id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `application`
--

INSERT INTO `application` (`app_id`, `app_title`, `app_name`, `user_id`, `status`) VALUES
(8, 'form1', '8e49ebc6-b44a-4b5e-9bb7-f454ebb46be6', 2, 1),
(9, 'form3', '56b0d3b5-fa3a-44c2-a810-d5841c5f3197', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `emailtype`
--

DROP TABLE IF EXISTS `emailtype`;
CREATE TABLE IF NOT EXISTS `emailtype` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `form1`
--

DROP TABLE IF EXISTS `form1`;
CREATE TABLE IF NOT EXISTS `form1` (
  `form_id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Submited',
  `email` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `one` text COLLATE utf8mb4_general_ci,
  `two` text COLLATE utf8mb4_general_ci,
  `helloo` text COLLATE utf8mb4_general_ci,
  `UntitledQuestionName` text COLLATE utf8mb4_general_ci,
  `rating` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`form_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form1`
--

INSERT INTO `form1` (`form_id`, `status`, `email`, `one`, `two`, `helloo`, `UntitledQuestionName`, `rating`) VALUES
(1, 'confirm', 'muller@gmail.com', 'dfg', 'dfg', NULL, NULL, NULL),
(2, 'Submitted', 'muller@gmail.com', 'koko', 'lp', NULL, NULL, NULL),
(3, 'Submitted', 'shinwa@gmail.com', 'lap', 'lip', NULL, NULL, NULL),
(4, 'Submitted', 'bebeto@gmail.com', 'kere', 'kiki', NULL, NULL, NULL),
(5, 'Submited', 'lplpl@hfdj.com', 'hjhj', 'lkoko', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `form3`
--

DROP TABLE IF EXISTS `form3`;
CREATE TABLE IF NOT EXISTS `form3` (
  `form_id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(250) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ksoer` text COLLATE utf8mb4_general_ci,
  `kdori` text COLLATE utf8mb4_general_ci,
  `dfgkdjf` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`form_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `responsemail`
--

DROP TABLE IF EXISTS `responsemail`;
CREATE TABLE IF NOT EXISTS `responsemail` (
  `resp_id` int NOT NULL AUTO_INCREMENT,
  `email` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `app_id` int NOT NULL,
  PRIMARY KEY (`resp_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `responsemail`
--

INSERT INTO `responsemail` (`resp_id`, `email`, `type`, `app_id`) VALUES
(5, '<div>jgjdfkjgsdklkflskfsg<strong>kjfgkjdjg</strong></div><div><strong><br></strong></div><div><strong>fdgd</strong><em>kjdfgjdfjgkdkg</em></div>', 'reject', 8),
(4, '<div>jgjdfkjgsdk</div>', 'confirm', 8);

-- --------------------------------------------------------

--
-- Table structure for table `shared_app`
--

DROP TABLE IF EXISTS `shared_app`;
CREATE TABLE IF NOT EXISTS `shared_app` (
  `shared_id` int NOT NULL AUTO_INCREMENT,
  `app_id` int NOT NULL,
  `user_id` int NOT NULL,
  `type` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`shared_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shared_app`
--

INSERT INTO `shared_app` (`shared_id`, `app_id`, `user_id`, `type`) VALUES
(3, 8, 1, 'full'),
(4, 8, 3, 'partial');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `institution` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `role` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `firstname` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastname` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `email`, `password`, `institution`, `role`, `firstname`, `lastname`) VALUES
(1, 'muller@gmail.com', '$2b$10$XZoh1BVIjOg6XxvKVpeJOeTzoWW3uwH5PQxk5X/DaAov6bNBsXazG', 'moya', 'user', NULL, NULL),
(2, 'shinwa@gmail.com', '$2b$10$HEmfH4fyTyewAULqJ3vUWuRaJtvGkaCB75x8XbvoiVNtajC6CAx0G', 'moya', 'user', NULL, NULL),
(3, 'bebeto@gmail.com', '$2b$10$ah9m0zIePBouyIAHUlpyROcLiGwuYa0Vf9S9ACIYCb7KZ1a3yU8mm', 'moya', 'user', NULL, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
