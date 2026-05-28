-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: school_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `academic_events`
--

DROP TABLE IF EXISTS `academic_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academic_events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `deadline_text` varchar(255) DEFAULT NULL,
  `last_date` date DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_events`
--

LOCK TABLES `academic_events` WRITE;
/*!40000 ALTER TABLE `academic_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `academic_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `academic_years`
--

DROP TABLE IF EXISTS `academic_years`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academic_years` (
  `active` bit(1) NOT NULL,
  `end_date` date DEFAULT NULL,
  `end_year` int NOT NULL,
  `start_date` date DEFAULT NULL,
  `start_year` int NOT NULL,
  `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `id` bigint NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  `school_code` varchar(255) NOT NULL,
  `is_current` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKg4y8ior1scgmexqt26bhy9ylc` (`school_code`,`label`),
  UNIQUE KEY `uk_ay_label_school` (`label`,`school_code`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_years`
--

LOCK TABLES `academic_years` WRITE;
/*!40000 ALTER TABLE `academic_years` DISABLE KEYS */;
INSERT INTO `academic_years` VALUES (_binary '','2027-03-31',2027,'2026-04-01',2026,'2026-05-01 17:05:35.602341',1,'2026-27','SMS',_binary ''),(_binary '\0','2024-03-31',2024,'2023-04-01',2023,'2026-05-02 17:00:47.000000',2,'2023-24','SMS',NULL),(_binary '\0','2023-03-31',2023,'2022-04-01',2022,'2026-05-02 17:00:47.000000',3,'2022-23','SMS',NULL),(_binary '\0','2022-03-31',2022,'2021-04-01',2021,'2026-05-02 17:00:47.000000',4,'2021-22','SMS',NULL),(_binary '\0','2021-03-31',2021,'2020-04-01',2020,'2026-05-02 17:00:47.000000',5,'2020-21','SMS',NULL),(_binary '\0','2020-03-31',2020,'2019-04-01',2019,'2026-05-02 17:00:47.000000',6,'2019-20','SMS',NULL),(_binary '\0','2019-03-31',2019,'2018-04-01',2018,'2026-05-02 17:00:47.000000',7,'2018-19','SMS',NULL),(_binary '\0','2018-03-31',2018,'2017-04-01',2017,'2026-05-02 17:00:47.000000',8,'2017-18','SMS',NULL),(_binary '\0','2017-03-31',2017,'2016-04-01',2016,'2026-05-02 17:00:47.000000',9,'2016-17','SMS',NULL),(_binary '\0','2016-03-31',2016,'2015-04-01',2015,'2026-05-02 17:00:47.000000',10,'2015-16','SMS',NULL),(_binary '\0','2025-03-31',2025,'2024-04-01',2024,'2026-05-02 17:00:47.000000',11,'2024-25','NTH',_binary ''),(_binary '\0','2024-03-31',2024,'2023-04-01',2023,'2026-05-02 17:00:47.000000',12,'2023-24','NTH',NULL),(_binary '\0','2025-03-31',2025,'2024-04-01',2024,'2026-05-02 17:00:47.000000',13,'2024-25','STH',_binary ''),(_binary '\0','2024-03-31',2024,'2023-04-01',2023,'2026-05-02 17:00:47.000000',14,'2023-24','STH',NULL),(_binary '\0','2025-03-31',2025,'2024-04-01',2024,'2026-05-02 17:00:47.000000',15,'2024-25','EST',_binary ''),(_binary '\0','2024-03-31',2024,'2023-04-01',2023,'2026-05-02 17:00:47.000000',16,'2023-24','EST',NULL),(_binary '\0','2025-03-31',2025,'2024-04-01',2024,'2026-05-02 17:00:47.000000',17,'2024-25','WST',_binary ''),(_binary '\0','2024-03-31',2024,'2023-04-01',2023,'2026-05-02 17:00:47.000000',18,'2023-24','WST',NULL),(_binary '\0','2025-03-31',2025,'2024-04-01',2024,'2026-05-02 17:00:47.000000',19,'2024-25','CTR',_binary ''),(_binary '\0','2024-03-31',2024,'2023-04-01',2023,'2026-05-02 17:00:47.000000',20,'2023-24','CTR',NULL),(_binary '\0','2025-03-31',2025,'2024-04-01',2024,'2026-05-02 17:00:47.000000',21,'2024-25','SMS',NULL);
/*!40000 ALTER TABLE `academic_years` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `avatar` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `timestamp` datetime(6) DEFAULT NULL,
  `user` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admission_enquiries`
--

DROP TABLE IF EXISTS `admission_enquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admission_enquiries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `enquiry_no` varchar(50) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `parent_name` varchar(255) NOT NULL,
  `parent_phone` varchar(50) NOT NULL,
  `parent_email` varchar(100) DEFAULT NULL,
  `class_applied_id` bigint DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `source` enum('WHATSAPP','WALK_IN','WEBSITE','REFERRAL','SOCIAL_MEDIA','CALL') NOT NULL,
  `status` enum('LEAD','FOLLOW_UP','REGISTRATION','ADMISSION','REJECTED') NOT NULL DEFAULT 'LEAD',
  `assigned_counselor_id` bigint DEFAULT NULL,
  `next_followup_date` date DEFAULT NULL,
  `notes` text,
  `rejection_reason` text,
  `converted_student_id` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `enquiry_no` (`enquiry_no`),
  KEY `fk_enq_class` (`class_applied_id`),
  KEY `fk_enq_year` (`academic_year_id`),
  KEY `fk_enq_student` (`converted_student_id`),
  KEY `idx_enq_status` (`status`),
  KEY `idx_enq_phone` (`parent_phone`),
  KEY `idx_enq_email` (`parent_email`),
  CONSTRAINT `fk_enq_class` FOREIGN KEY (`class_applied_id`) REFERENCES `class_rooms` (`id`),
  CONSTRAINT `fk_enq_student` FOREIGN KEY (`converted_student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `fk_enq_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admission_enquiries`
--

LOCK TABLES `admission_enquiries` WRITE;
/*!40000 ALTER TABLE `admission_enquiries` DISABLE KEYS */;
/*!40000 ALTER TABLE `admission_enquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `audience` varchar(255) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `attendance_date` date NOT NULL,
  `academic_year_id` bigint NOT NULL,
  `branch_id` bigint DEFAULT NULL,
  `class_id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `marked_by` bigint DEFAULT NULL,
  `student_id` bigint NOT NULL,
  `subject_id` bigint DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `status` enum('ABSENT','EXCUSED','LATE','PRESENT') DEFAULT NULL,
  `period_number` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKor032omg3w64mxpdwj6hhgcv3` (`student_id`,`attendance_date`,`subject_id`,`academic_year_id`),
  UNIQUE KEY `UKqunp2jntjpyqlfmpqbwlwhba0` (`student_id`,`attendance_date`,`subject_id`,`academic_year_id`,`period_number`),
  KEY `idx_attendance_student_id` (`student_id`),
  KEY `idx_attendance_class_date` (`class_id`,`attendance_date`),
  KEY `idx_attendance_created_at` (`created_at`),
  KEY `FKbsjdwetb3k1d3ldbfy80j47rq` (`academic_year_id`),
  KEY `FKt5xqldek3k35ro9f0cd3sy3xu` (`branch_id`),
  KEY `FKcjg1qkkmmy4dtktcdug457x4p` (`subject_id`),
  KEY `FKpkwi8vo8nh7iu7kte6w8nyeeg` (`marked_by`),
  CONSTRAINT `FK7121lveuhtmu9wa6m90ayd5yg` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `FK7k86x0jyfhe1kvte7ed7kf860` FOREIGN KEY (`marked_by`) REFERENCES `teachers` (`id`),
  CONSTRAINT `FKbqdnkdqvt4vgs89mkjwc80upb` FOREIGN KEY (`class_id`) REFERENCES `class_rooms` (`id`),
  CONSTRAINT `FKbsjdwetb3k1d3ldbfy80j47rq` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
  CONSTRAINT `FKbxf31lnms0wc3r9w4ist8c0yu` FOREIGN KEY (`class_id`) REFERENCES `classrooms` (`id`),
  CONSTRAINT `FKcjg1qkkmmy4dtktcdug457x4p` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  CONSTRAINT `FKpkwi8vo8nh7iu7kte6w8nyeeg` FOREIGN KEY (`marked_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKt5xqldek3k35ro9f0cd3sy3xu` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES ('2026-05-01',1,NULL,1,'2026-05-01 17:06:59.979088',NULL,1,NULL,1,NULL,NULL,'','ABSENT',NULL),('2026-05-01',1,NULL,1,'2026-05-01 17:20:54.517500',NULL,2,NULL,2,NULL,NULL,'','PRESENT',NULL),('2026-05-02',1,NULL,1,'2026-05-02 10:59:26.137965',NULL,3,NULL,1,NULL,NULL,'','PRESENT',NULL),('2026-05-02',1,NULL,1,'2026-05-02 10:59:26.160320',NULL,4,NULL,2,NULL,NULL,'','ABSENT',NULL),('2026-07-01',1,1,14,'2026-05-02 17:57:45.000000',NULL,23,1,1,NULL,NULL,NULL,'PRESENT',NULL),('2026-07-01',1,1,14,'2026-05-02 17:57:45.000000',NULL,24,1,2,NULL,NULL,NULL,'PRESENT',NULL),('2026-07-02',1,1,14,'2026-05-02 17:57:45.000000',NULL,25,1,1,NULL,NULL,NULL,'PRESENT',NULL),('2026-07-02',1,1,14,'2026-05-02 17:57:45.000000',NULL,26,1,2,NULL,NULL,NULL,'ABSENT',NULL),('2026-07-03',1,1,14,'2026-05-02 17:57:45.000000',NULL,27,1,1,NULL,NULL,NULL,'LATE',NULL),('2026-07-03',1,1,14,'2026-05-02 17:57:45.000000',NULL,28,1,2,NULL,NULL,NULL,'PRESENT',NULL),('2026-07-04',1,1,14,'2026-05-02 17:57:45.000000',NULL,29,1,1,NULL,NULL,NULL,'PRESENT',NULL),('2026-07-04',1,1,14,'2026-05-02 17:57:45.000000',NULL,30,1,2,NULL,NULL,NULL,'PRESENT',NULL),('2026-07-05',1,1,14,'2026-05-02 17:57:45.000000',NULL,31,1,1,NULL,NULL,NULL,'ABSENT',NULL),('2026-07-05',1,1,14,'2026-05-02 17:57:45.000000',NULL,32,1,2,NULL,NULL,NULL,'PRESENT',NULL),('2026-05-10',1,NULL,1,'2026-05-10 05:53:29.633358',NULL,33,NULL,1,NULL,NULL,'','PRESENT',NULL),('2026-05-10',1,NULL,1,'2026-05-10 05:53:29.729587',NULL,34,NULL,2,NULL,NULL,'','PRESENT',NULL),('2026-05-10',1,NULL,1,'2026-05-10 05:53:29.769927',NULL,35,NULL,33,NULL,NULL,'','ABSENT',NULL),('2026-05-08',1,NULL,1,'2026-05-10 08:39:24.672627',NULL,36,NULL,1,NULL,NULL,'','ABSENT',NULL),('2026-05-08',1,NULL,1,'2026-05-10 08:39:24.717966',NULL,37,NULL,2,NULL,NULL,'','ABSENT',NULL),('2026-05-08',1,NULL,1,'2026-05-10 08:39:24.745650',NULL,38,NULL,33,NULL,NULL,'','ABSENT',NULL),('2026-05-14',1,1,14,'2026-05-14 05:47:52.112190',NULL,39,NULL,23,NULL,NULL,NULL,'PRESENT',NULL),('2026-05-14',1,1,14,'2026-05-14 05:47:52.316315',NULL,40,NULL,24,NULL,NULL,NULL,'PRESENT',NULL),('2026-05-14',1,2,14,'2026-05-14 05:47:52.355834',NULL,41,NULL,25,NULL,NULL,NULL,'LATE',NULL),('2026-05-15',1,2,15,'2026-05-15 15:24:45.332327',NULL,42,NULL,26,NULL,NULL,'','ABSENT',NULL),('2026-05-15',1,3,15,'2026-05-15 15:24:45.367506',NULL,43,NULL,27,NULL,NULL,'','PRESENT',NULL),('2026-05-15',1,3,15,'2026-05-15 15:24:45.395138',NULL,44,NULL,28,NULL,NULL,'','ABSENT',NULL),('2026-05-15',1,1,18,'2026-05-15 15:33:39.433940',NULL,45,NULL,36,NULL,NULL,'','ABSENT',NULL),('2026-05-15',1,4,16,'2026-05-15 15:34:25.170586',NULL,46,NULL,29,NULL,NULL,'','ABSENT',NULL),('2026-05-15',1,4,16,'2026-05-15 15:34:25.202011',NULL,47,NULL,30,NULL,NULL,'','ABSENT',NULL),('2026-05-15',1,5,17,'2026-05-15 15:35:22.457837',NULL,48,NULL,31,NULL,NULL,'','ABSENT',NULL),('2026-05-15',1,5,17,'2026-05-15 15:35:22.487939',NULL,49,NULL,32,NULL,NULL,'','ABSENT',NULL),('2026-05-16',1,2,15,'2026-05-16 02:59:41.687157',NULL,50,1,26,NULL,NULL,'','ABSENT',2),('2026-05-16',1,3,15,'2026-05-16 02:59:41.750530',NULL,51,1,27,NULL,NULL,'','PRESENT',2),('2026-05-16',1,3,15,'2026-05-16 02:59:41.793384',NULL,52,1,28,NULL,NULL,'','ABSENT',2),('2026-05-21',1,NULL,1,'2026-05-21 03:23:27.594843',NULL,53,1,1,NULL,NULL,'','ABSENT',NULL),('2026-05-21',1,NULL,1,'2026-05-21 03:23:27.736709',NULL,54,1,2,NULL,NULL,'','PRESENT',NULL),('2026-05-21',1,NULL,1,'2026-05-21 03:23:27.779474',NULL,55,1,33,NULL,NULL,'','PRESENT',NULL);
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_templates`
--

DROP TABLE IF EXISTS `attendance_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_templates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `is_system_template` bit(1) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `template_data` text,
  `updated_at` datetime(6) DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `class_room_id` bigint NOT NULL,
  `teacher_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5ryesnjicuwgapsn1dtbb169v` (`academic_year_id`),
  KEY `FK7779frt037ocxsoy0hs3cllr` (`branch_id`),
  KEY `FKjoy80krb3nwxnxvfvdwp8rcbb` (`teacher_id`),
  KEY `FKq3agore1hn6b0n8esy7me8knf` (`class_room_id`),
  CONSTRAINT `FK45yrtm6bc1sibtyjwg2cmc7ga` FOREIGN KEY (`class_room_id`) REFERENCES `classrooms` (`id`),
  CONSTRAINT `FK5ryesnjicuwgapsn1dtbb169v` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
  CONSTRAINT `FK7779frt037ocxsoy0hs3cllr` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKjoy80krb3nwxnxvfvdwp8rcbb` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`),
  CONSTRAINT `FKq3agore1hn6b0n8esy7me8knf` FOREIGN KEY (`class_room_id`) REFERENCES `class_rooms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_templates`
--

LOCK TABLES `attendance_templates` WRITE;
/*!40000 ALTER TABLE `attendance_templates` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `actor_id` bigint NOT NULL,
  `changed_at` datetime(6) NOT NULL,
  `entity_id` bigint NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `academic_year_label` varchar(255) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `actor_username` varchar(255) NOT NULL,
  `entity_type` varchar(255) NOT NULL,
  `field_name` varchar(255) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `new_value` text,
  `old_value` text,
  PRIMARY KEY (`id`),
  KEY `idx_audit_entity` (`entity_type`,`entity_id`),
  KEY `idx_audit_actor` (`actor_id`),
  KEY `idx_audit_time` (`changed_at`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'2026-05-02 18:18:50.000000',1,1,'2024-25','CREATE','ADMIN-001','Student','student_id','192.168.1.1','STU-2024-0001',NULL),(1,'2026-05-02 18:18:50.000000',2,2,'2024-25','CREATE','ADMIN-001','Student','student_id','192.168.1.1','STU-2024-0002',NULL),(1,'2026-05-02 18:18:50.000000',3,3,'2024-25','UPDATE','ADMIN-001','Student','classroom_id','192.168.1.2','14','12'),(1,'2026-05-02 18:18:50.000000',2,4,'2024-25','CREATE','ADMIN-001','Teacher','employee_id','192.168.1.1','TCH-2024-001',NULL),(1,'2026-05-02 18:18:50.000000',3,5,'2024-25','CREATE','ADMIN-001','Teacher','employee_id','192.168.1.1','TCH-2024-002',NULL),(1,'2026-05-02 18:18:50.000000',13,6,'2024-25','UPDATE','ADMIN-001','FeePayment','status','10.0.0.5','PENDING','COMPLETED'),(2,'2026-05-02 18:18:50.000000',4,7,'2024-25','CREATE','TCH-2024-001','Exam','exam_name','192.168.1.10','Mid-Term Math',NULL),(2,'2026-05-02 18:18:50.000000',1,8,'2024-25','CREATE','TCH-2024-001','Marks','marks_obtained','192.168.1.10','88',NULL),(1,'2026-05-02 18:18:50.000000',7,9,'2024-25','DELETE','ADMIN-001','Attendance','attendance_id','192.168.1.1',NULL,'7'),(7,'2026-05-02 18:18:50.000000',7,10,'2024-25','LOGIN','STU-2024-001','User','session_status','203.0.113.5','LOGGED_IN','LOGGED_OUT'),(2,'2026-05-02 18:18:50.000000',2,11,'2024-25','LOGIN','TCH-2024-001','User','session_status','192.168.1.15','LOGGED_IN','LOGGED_OUT'),(7,'2026-05-02 18:18:50.000000',7,12,'2024-25','LOGOUT','STU-2024-001','User','session_status','203.0.113.5','LOGGED_OUT','LOGGED_IN'),(1,'2026-05-02 18:18:50.000000',14,13,'2024-25','UPDATE','ADMIN-001','ClassRoom','max_capacity','192.168.1.1','40','38'),(1,'2026-05-02 18:18:50.000000',6,14,'2024-25','CREATE','ADMIN-001','Branch','branch_name','127.0.0.1','Central Branch',NULL),(1,'2026-05-02 18:18:50.000000',6,15,'2024-25','UPDATE','ADMIN-001','User','enabled','192.168.1.1','false','true'),(1,'2026-05-02 18:18:50.000000',1,16,'2024-25','CREATE','ADMIN-001','FeePayment','receipt_number','192.168.1.1','SMS/2024/001',NULL),(1,'2026-05-02 18:18:50.000000',1,17,'2024-25','CREATE','ADMIN-001','AcademicYear','year_label','127.0.0.1','2024-25',NULL),(2,'2026-05-02 18:18:50.000000',6,18,'2024-25','UPDATE','TCH-2024-001','Marks','marks_obtained','192.168.1.10','58','48'),(1,'2026-05-02 18:18:50.000000',9,19,'2024-25','CREATE','ADMIN-001','Subject','subject_name','192.168.1.1','Computer Science',NULL),(1,'2026-05-02 18:18:50.000000',16,20,'2024-25','UPDATE','ADMIN-001','Student','status','192.168.1.1','INACTIVE','ACTIVE'),(-1,'2026-05-04 03:28:05.615800',-1,21,NULL,'AUTH_LOGIN','ADMIN-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 03:28:37.103686',-1,22,NULL,'AUTH_LOGIN','ADMIN-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 03:40:42.148583',-1,23,NULL,'AUTH_LOGIN','ADMIN-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 03:41:27.816027',-1,24,NULL,'AUTH_LOGIN','ADMIN-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 03:42:58.646732',-1,25,NULL,'AUTH_LOGIN','TCH-2026-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 03:43:31.148008',-1,26,NULL,'AUTH_LOGIN','ADMIN-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 03:47:29.535837',-1,27,NULL,'AUTH_LOGIN','ADMIN-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 04:02:51.480333',-1,28,NULL,'AUTH_LOGIN','ADMIN-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 04:07:13.328732',-1,29,NULL,'AUTH_LOGIN','TCH-2026-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 04:07:41.016036',-1,30,NULL,'AUTH_LOGIN','TCH-2024-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 04:09:11.266194',-1,31,NULL,'AUTH_LOGIN','TCH-2024-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 04:14:04.869683',-1,32,NULL,'AUTH_LOGIN','TCH-2024-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 04:15:20.570027',-1,33,NULL,'AUTH_LOGIN','TCH-2024-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 04:15:37.583507',-1,34,NULL,'AUTH_LOGIN','TCH-2024-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 04:15:53.619846',-1,35,NULL,'AUTH_LOGIN','STU-2024-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 04:25:03.433587',-1,36,NULL,'AUTH_LOGIN','ADMIN-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 04:28:03.812214',-1,37,NULL,'AUTH_LOGIN','TCH-2026-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 04:28:25.821719',-1,38,NULL,'AUTH_LOGIN','STU-2024-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 04:48:36.680846',-1,39,NULL,'AUTH_LOGIN','ADMIN-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 04:51:23.652622',-1,40,NULL,'AUTH_LOGIN','STU-2024-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 05:34:55.159676',-1,41,NULL,'AUTH_LOGIN','TCH-2026-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 05:37:55.492440',-1,42,NULL,'AUTH_LOGIN','TCH-2026-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 05:38:53.392007',-1,43,NULL,'AUTH_LOGIN','STU-2026-0001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 05:55:46.428450',-1,44,NULL,'AUTH_LOGIN','STU-2026-0001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 05:57:03.984710',-1,45,NULL,'AUTH_LOGIN','TCH-2024-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 06:02:42.288153',-1,46,NULL,'AUTH_LOGIN','ADMIN-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 06:25:47.456498',-1,47,NULL,'AUTH_LOGIN','ADMIN-001','SYSTEM_EVENT','FAILED_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"Invalid credentials\"}',NULL),(-1,'2026-05-04 06:28:19.733558',-1,48,NULL,'AUTH_LOGIN','ADMIN-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 06:30:28.205647',-1,49,NULL,'AUTH_LOGIN','TCH-2026-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 06:38:31.477814',-1,50,NULL,'AUTH_LOGIN','STU-2024-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 06:41:30.596828',-1,51,NULL,'AUTH_LOGIN','TCH-2026-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 06:52:30.452100',-1,52,NULL,'AUTH_LOGIN','TCH-2026-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 12:46:34.422810',-1,53,NULL,'AUTH_LOGIN','TCH-2026-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 13:36:08.953123',-1,54,NULL,'AUTH_LOGIN','TCH-2026-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 13:37:29.357364',-1,55,NULL,'AUTH_LOGIN','STU-2024-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 13:48:10.421348',-1,56,NULL,'AUTH_LOGIN','STU-2024-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 13:48:56.555844',-1,57,NULL,'AUTH_LOGIN','STU-2024-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 13:52:56.386152',-1,58,NULL,'AUTH_LOGIN','ADMIN-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 13:54:02.508157',-1,59,NULL,'AUTH_LOGIN','STU-2024-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(-1,'2026-05-04 13:54:32.127242',-1,60,NULL,'AUTH_LOGIN','ADMIN-001','SYSTEM_EVENT','SUCCESSFUL_LOGIN','0:0:0:0:0:0:0:1','{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36\", \"details\":\"User logged in successfully\"}',NULL),(1,'2026-05-10 05:53:29.678673',33,61,'2026-27','CREATE','ADMIN-001','ATTENDANCE',NULL,'0:0:0:0:0:0:0:1','{\"studentId\":1,\"date\":\"2026-05-10\",\"status\":\"PRESENT\"}',NULL),(1,'2026-05-10 05:53:29.748496',34,62,'2026-27','CREATE','ADMIN-001','ATTENDANCE',NULL,'0:0:0:0:0:0:0:1','{\"studentId\":2,\"date\":\"2026-05-10\",\"status\":\"PRESENT\"}',NULL),(1,'2026-05-10 05:53:29.780712',35,63,'2026-27','CREATE','ADMIN-001','ATTENDANCE',NULL,'0:0:0:0:0:0:0:1','{\"studentId\":33,\"date\":\"2026-05-10\",\"status\":\"ABSENT\"}',NULL),(1,'2026-05-10 07:35:29.287741',1,64,'2026-27','CREATE','ADMIN-001','PARENT',NULL,'0:0:0:0:0:0:0:1','{\"name\":\"Ravi\",\"mobile\":\"9142081366\"}',NULL),(19,'2026-05-10 08:39:24.695315',36,65,'2026-27','CREATE','TCH-2026-001','ATTENDANCE',NULL,'0:0:0:0:0:0:0:1','{\"studentId\":1,\"date\":\"2026-05-08\",\"status\":\"ABSENT\"}',NULL),(19,'2026-05-10 08:39:24.726915',37,66,'2026-27','CREATE','TCH-2026-001','ATTENDANCE',NULL,'0:0:0:0:0:0:0:1','{\"studentId\":2,\"date\":\"2026-05-08\",\"status\":\"ABSENT\"}',NULL),(19,'2026-05-10 08:39:24.753557',38,67,'2026-27','CREATE','TCH-2026-001','ATTENDANCE',NULL,'0:0:0:0:0:0:0:1','{\"studentId\":33,\"date\":\"2026-05-08\",\"status\":\"ABSENT\"}',NULL),(1,'2026-05-10 09:25:56.317862',1,68,'2026-27','UPDATE','ADMIN-001','PARENT','PROFILE','0:0:0:0:0:0:0:1',NULL,NULL),(2,'2026-05-14 05:47:52.280165',39,69,'2026-27','CREATE','TCH-2024-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked PRESENT for student Arjun',NULL),(2,'2026-05-14 05:47:52.330997',40,70,'2026-27','CREATE','TCH-2024-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked PRESENT for student Sneha',NULL),(2,'2026-05-14 05:47:52.368618',41,71,'2026-27','CREATE','TCH-2024-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked LATE for student Rahul',NULL),(1,'2026-05-15 15:20:24.421388',36,72,'2026-27','CREATE','ADMIN-001','STUDENT',NULL,'0:0:0:0:0:0:0:1','{\"studentId\":\"STU-2026-0014\",\"name\":\"sk rk\"}',NULL),(1,'2026-05-15 15:21:03.071444',36,73,'2026-27','UPDATE','ADMIN-001','STUDENT','PROFILE','0:0:0:0:0:0:0:1',NULL,NULL),(1,'2026-05-15 15:23:04.711603',22,74,'2026-27','CREATE','ADMIN-001','TEACHER',NULL,'0:0:0:0:0:0:0:1','{\"employeeId\":\"TCH-2026-007\",\"email\":\"t@gmail.com\"}',NULL),(1,'2026-05-15 15:24:45.350048',42,75,'2026-27','CREATE','ADMIN-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked ABSENT for student Priya',NULL),(1,'2026-05-15 15:24:45.376615',43,76,'2026-27','CREATE','ADMIN-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked PRESENT for student Rohan',NULL),(1,'2026-05-15 15:24:45.404477',44,77,'2026-27','CREATE','ADMIN-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked PRESENT for student Kavya',NULL),(1,'2026-05-15 15:26:13.892441',1,78,'2026-27','UPDATE','ADMIN-001','PARENT','PROFILE','0:0:0:0:0:0:0:1',NULL,NULL),(1,'2026-05-15 15:26:29.406511',1,79,'2026-27','UPDATE','ADMIN-001','PARENT','PROFILE','0:0:0:0:0:0:0:1',NULL,NULL),(1,'2026-05-15 15:28:45.268786',2,80,'2026-27','UPDATE','ADMIN-001','Mark','marksObtained','0:0:0:0:0:0:0:1','51.0','515.0'),(1,'2026-05-15 15:28:45.300113',3,81,'2026-27','UPDATE','ADMIN-001','Mark','marksObtained','0:0:0:0:0:0:0:1','12.0','12.0'),(1,'2026-05-15 15:28:45.321498',4,82,'2026-27','UPDATE','ADMIN-001','Mark','marksObtained','0:0:0:0:0:0:0:1','20.0','20.0'),(1,'2026-05-15 15:33:39.446070',45,83,'2026-27','CREATE','ADMIN-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked ABSENT for student sk',NULL),(1,'2026-05-15 15:34:25.181271',46,84,'2026-27','CREATE','ADMIN-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked ABSENT for student Aditya',NULL),(1,'2026-05-15 15:34:25.210708',47,85,'2026-27','CREATE','ADMIN-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked ABSENT for student Pooja',NULL),(1,'2026-05-15 15:35:22.469564',48,86,'2026-27','CREATE','ADMIN-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked ABSENT for student Karan',NULL),(1,'2026-05-15 15:35:22.498044',49,87,'2026-27','CREATE','ADMIN-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked ABSENT for student Ananya',NULL),(1,'2026-05-15 15:54:47.529349',44,88,'2026-27','UPDATE','ADMIN-001','Attendance','status','0:0:0:0:0:0:0:1','ABSENT','PRESENT'),(1,'2026-05-16 02:59:41.717580',50,89,'2026-27','CREATE','ADMIN-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked ABSENT for student Priya',NULL),(1,'2026-05-16 02:59:41.766232',51,90,'2026-27','CREATE','ADMIN-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked PRESENT for student Rohan',NULL),(1,'2026-05-16 02:59:41.809274',52,91,'2026-27','CREATE','ADMIN-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked ABSENT for student Kavya',NULL),(1,'2026-05-16 04:03:07.296519',8,92,'2026-27','UPDATE','ADMIN-001','TEACHER','PROFILE','0:0:0:0:0:0:0:1',NULL,NULL),(1,'2026-05-16 11:25:00.558383',2,93,'2026-27','UPDATE','ADMIN-001','TEACHER','PROFILE','0:0:0:0:0:0:0:1',NULL,NULL),(1,'2026-05-21 03:23:27.655015',53,94,'2026-27','CREATE','ADMIN-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked ABSENT for student Demo',NULL),(1,'2026-05-21 03:23:27.753262',54,95,'2026-27','CREATE','ADMIN-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked PRESENT for student ravi',NULL),(1,'2026-05-21 03:23:27.794237',55,96,'2026-27','CREATE','ADMIN-001','Attendance',NULL,'0:0:0:0:0:0:0:1','Marked PRESENT for student Audit',NULL);
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `active` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKrt29b5cpquhexus5t5ywalg67` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (_binary '','2026-05-01 17:05:35.534724',1,NULL,'MAIN',NULL,'Main Campus',NULL),(_binary '','2026-05-02 16:59:37.000000',2,'456 Knowledge Ave, New Delhi','NRTH-02','north@school.com','North Campus','9988776644'),(_binary '','2026-05-02 16:59:37.000000',3,'789 Wisdom Rd, New Delhi','SUTH-03','south@school.com','South Campus','9988776633'),(_binary '','2026-05-02 16:59:37.000000',4,'321 Scholar Lane, Noida','EAST-04','east@school.com','East Campus','9988776622'),(_binary '','2026-05-02 16:59:37.000000',5,'654 Learning Blvd, Gurgaon','WEST-05','west@school.com','West Campus','9988776611'),(_binary '','2026-05-02 16:59:37.000000',6,'111 Central Park, New Delhi','CTRL-06','central@school.com','Central Branch','9977665544'),(_binary '','2026-05-02 16:59:37.000000',7,'222 Rohini Sector 5, New Delhi','RHNI-07','rohini@school.com','Rohini Branch','9977665533'),(_binary '','2026-05-02 16:59:37.000000',8,'333 Dwarka Sector 10, Delhi','DWRK-08','dwarka@school.com','Dwarka Branch','9977665522'),(_binary '\0','2026-05-02 16:59:37.000000',9,'444 Lajpat Nagar, New Delhi','LJPT-09','lajpat@school.com','Lajpat Branch','9977665511'),(_binary '','2026-05-02 16:59:37.000000',10,'555 Saket District, New Delhi','SAKT-10','saket@school.com','Saket Branch','9966554433'),(_binary '','2026-05-02 16:59:37.000000',11,'666 Janakpuri West, Delhi','JNKP-11','janakpuri@school.com','Janakpuri Branch','9966554422'),(_binary '','2026-05-02 16:59:37.000000',12,'777 Pitampura Block A, Delhi','PTMP-12','pitampura@school.com','Pitampura Branch','9966554411'),(_binary '','2026-05-02 16:59:37.000000',13,'888 Vasant Kunj Phase 2, Delhi','VSKJ-13','vasantkunj@school.com','Vasant Kunj Branch','9955443322'),(_binary '\0','2026-05-02 16:59:37.000000',14,'999 Mayur Vihar Phase 1, Delhi','MYVR-14','mayurvihar@school.com','Mayur Vihar Branch','9955443311'),(_binary '','2026-05-02 16:59:37.000000',15,'101 Shahdara Main Rd, Delhi','SHDR-15','shahdara@school.com','Shahdara Branch','9944332211'),(_binary '','2026-05-02 16:59:37.000000',16,'202 Sector 14, Faridabad','FRBD-16','faridabad@school.com','Faridabad Branch','9933221100'),(_binary '','2026-05-02 16:59:37.000000',17,'303 Indirapuram, Ghaziabad','GHZB-17','ghaziabad@school.com','Ghaziabad Branch','9922110099'),(_binary '','2026-05-02 16:59:37.000000',18,'404 Knowledge Park, Gr Noida','GNDA-18','greaternoida@school.com','Greater Noida','9911009988'),(_binary '','2026-05-02 16:59:37.000000',19,'505 Cyber City, Gurugram','GGRM-19','gurugram@school.com','Gurugram Branch','9900998877'),(_binary '','2026-05-02 16:59:37.000000',20,'100% Virtual, Pan India','ONLN-20','online@school.com','Online Campus','9800001234'),(_binary '','2026-05-02 16:59:37.000000',21,'123 Education St, New Delhi','MAIN-01','main@school.com','Main Campus','9988776655');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate_templates`
--

DROP TABLE IF EXISTS `certificate_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate_templates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `header_text` text,
  `body_text` text,
  `footer_text` text,
  `background_style` varchar(255) DEFAULT NULL,
  `show_watermark` tinyint(1) DEFAULT '1',
  `created_by` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate_templates`
--

LOCK TABLES `certificate_templates` WRITE;
/*!40000 ALTER TABLE `certificate_templates` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificate_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `circular_reads`
--

DROP TABLE IF EXISTS `circular_reads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `circular_reads` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `read_at` datetime(6) DEFAULT NULL,
  `announcement_id` bigint NOT NULL,
  `parent_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK559qjvtgs7x1e0fha9qg8t5fv` (`announcement_id`),
  KEY `FKld9b84pysyypbteg688iu9o5o` (`parent_id`),
  CONSTRAINT `FK559qjvtgs7x1e0fha9qg8t5fv` FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`id`),
  CONSTRAINT `FKld9b84pysyypbteg688iu9o5o` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `circular_reads`
--

LOCK TABLES `circular_reads` WRITE;
/*!40000 ALTER TABLE `circular_reads` DISABLE KEYS */;
/*!40000 ALTER TABLE `circular_reads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_diary`
--

DROP TABLE IF EXISTS `class_diary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_diary` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `announcements` text,
  `behavior_note` text,
  `created_at` datetime(6) DEFAULT NULL,
  `entry_date` date NOT NULL,
  `homework_assigned` text,
  `period_number` int DEFAULT NULL,
  `resources_used` text,
  `topics_covered` text,
  `updated_at` datetime(6) DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `class_room_id` bigint NOT NULL,
  `subject_id` bigint NOT NULL,
  `teacher_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK60ktmlqyvetax5669xlely5dr` (`academic_year_id`),
  KEY `FKqd5lhxto8xbv53r4osxasbd4e` (`branch_id`),
  KEY `FKnxmih4h5l2t5dnk01cmd32x97` (`subject_id`),
  KEY `FK1ys0b65us7owst1eirndi9d3p` (`teacher_id`),
  KEY `FKe3q1n12tut2oi1nk8cuw4ofg4` (`class_room_id`),
  CONSTRAINT `FK1ys0b65us7owst1eirndi9d3p` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`),
  CONSTRAINT `FK60ktmlqyvetax5669xlely5dr` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
  CONSTRAINT `FK8ooxay1nf55gn06xhgiu4dlsc` FOREIGN KEY (`class_room_id`) REFERENCES `classrooms` (`id`),
  CONSTRAINT `FKe3q1n12tut2oi1nk8cuw4ofg4` FOREIGN KEY (`class_room_id`) REFERENCES `class_rooms` (`id`),
  CONSTRAINT `FKnxmih4h5l2t5dnk01cmd32x97` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  CONSTRAINT `FKqd5lhxto8xbv53r4osxasbd4e` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_diary`
--

LOCK TABLES `class_diary` WRITE;
/*!40000 ALTER TABLE `class_diary` DISABLE KEYS */;
/*!40000 ALTER TABLE `class_diary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_rooms`
--

DROP TABLE IF EXISTS `class_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `section` varchar(255) DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `teacher_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT '1',
  `max_capacity` int DEFAULT NULL,
  `class_fee` double DEFAULT NULL,
  `admission_fee` double DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime(6) DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKsm2uwn2n4sxqiv35q9dq1fi16` (`academic_year_id`),
  KEY `FK8dhh6vvpj8p309mcb18nxpv8` (`branch_id`),
  KEY `FKjv0h6pl5k443r84duafh1o7ia` (`teacher_id`),
  CONSTRAINT `FK8dhh6vvpj8p309mcb18nxpv8` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKjv0h6pl5k443r84duafh1o7ia` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`),
  CONSTRAINT `FKsm2uwn2n4sxqiv35q9dq1fi16` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_rooms`
--

LOCK TABLES `class_rooms` WRITE;
/*!40000 ALTER TABLE `class_rooms` DISABLE KEYS */;
INSERT INTO `class_rooms` VALUES (1,'Grade 1','A',1,8,1,30,10000,3000,'2026-05-02 17:36:42',NULL,NULL,'2026-05-16 04:03:07.318098'),(2,'Grade 1','B',1,2,1,30,10000,3000,'2026-05-02 17:36:42',NULL,NULL,'2026-05-16 11:25:00.602997'),(3,'Grade 2','A',1,3,1,32,11000,3000,'2026-05-02 17:36:42',NULL,NULL,NULL),(4,'Grade 3','A',1,4,1,32,12000,3500,'2026-05-02 17:36:42',NULL,NULL,NULL),(5,'Grade 4','A',1,5,1,35,13000,3500,'2026-05-02 17:36:42',NULL,NULL,NULL),(6,'Grade 5','A',1,6,1,35,14000,3500,'2026-05-02 17:36:42',NULL,NULL,NULL),(7,'Grade 6','A',1,22,1,38,16000,4000,'2026-05-02 17:36:42',NULL,NULL,'2026-05-15 15:23:04.722550'),(8,'Grade 6','B',1,22,1,38,16000,4000,'2026-05-02 17:36:42',NULL,NULL,'2026-05-15 15:23:04.722550'),(9,'Grade 7','A',1,22,1,38,17000,4000,'2026-05-02 17:36:42',NULL,NULL,'2026-05-15 15:23:04.722550'),(10,'Grade 8','A',1,10,1,40,18000,4500,'2026-05-02 17:36:42',NULL,NULL,NULL),(11,'Grade 8','B',1,11,1,40,18000,4500,'2026-05-02 17:36:42',NULL,NULL,NULL),(12,'Grade 9','A',1,12,1,40,20000,5000,'2026-05-02 17:36:42',NULL,NULL,NULL),(13,'Grade 9','B',1,13,1,40,20000,5000,'2026-05-02 17:36:42',NULL,NULL,NULL),(14,'Grade 10','A',1,14,1,40,25000,5000,'2026-05-02 17:36:42',NULL,NULL,NULL),(15,'Grade 10','B',1,2,1,40,25000,5000,'2026-05-02 17:36:42',NULL,NULL,'2026-05-16 11:25:00.604098'),(16,'Grade 11','A',1,16,1,35,28000,6000,'2026-05-02 17:36:42',NULL,NULL,NULL),(17,'Grade 11','B',1,17,1,35,28000,6000,'2026-05-02 17:36:42',NULL,NULL,NULL),(18,'Grade 12','A',1,18,1,35,30000,6000,'2026-05-02 17:36:42',NULL,NULL,NULL),(19,'Grade 12','B',1,19,1,35,30000,6000,'2026-05-02 17:36:42',NULL,NULL,NULL),(20,'Grade 12','C',1,2,1,35,30000,6000,'2026-05-02 17:36:42',NULL,NULL,'2026-05-16 11:25:00.604098');
/*!40000 ALTER TABLE `class_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_subjects`
--

DROP TABLE IF EXISTS `class_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_subjects` (
  `class_id` bigint NOT NULL,
  `subject_id` bigint NOT NULL,
  KEY `FKck6avvuoer3mgm2mbjgs0gw6m` (`subject_id`),
  KEY `FKommv6dynf4ohly9pa3m2c1vh` (`class_id`),
  CONSTRAINT `FKa3qcrie8d7cy8o4g4dwestwqx` FOREIGN KEY (`class_id`) REFERENCES `classrooms` (`id`),
  CONSTRAINT `FKck6avvuoer3mgm2mbjgs0gw6m` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  CONSTRAINT `FKommv6dynf4ohly9pa3m2c1vh` FOREIGN KEY (`class_id`) REFERENCES `class_rooms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_subjects`
--

LOCK TABLES `class_subjects` WRITE;
/*!40000 ALTER TABLE `class_subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `class_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classrooms`
--

DROP TABLE IF EXISTS `classrooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classrooms` (
  `admission_fee` double DEFAULT NULL,
  `class_fee` double DEFAULT NULL,
  `max_capacity` int DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint DEFAULT NULL,
  `academic_year` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `section` varchar(255) DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbyl3mbf2j46aa8i242b6gxjg1` (`teacher_id`),
  KEY `FKa919165pe8mqragt20o7nxyu3` (`academic_year_id`),
  KEY `FKct98rtpl1eg4kakeq4p3r9dpx` (`branch_id`),
  CONSTRAINT `FKa919165pe8mqragt20o7nxyu3` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
  CONSTRAINT `FKbyl3mbf2j46aa8i242b6gxjg1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`),
  CONSTRAINT `FKct98rtpl1eg4kakeq4p3r9dpx` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classrooms`
--

LOCK TABLES `classrooms` WRITE;
/*!40000 ALTER TABLE `classrooms` DISABLE KEYS */;
INSERT INTO `classrooms` VALUES (3000,10000,30,1,1,'2024-25','Grade 1','A',1,NULL,NULL,NULL,NULL,NULL),(3000,10000,30,2,2,'2024-25','Grade 1','B',1,NULL,NULL,NULL,NULL,NULL),(3000,11000,32,3,3,'2024-25','Grade 2','A',1,NULL,NULL,NULL,NULL,NULL),(3500,12000,32,4,4,'2024-25','Grade 3','A',1,NULL,NULL,NULL,NULL,NULL),(3500,13000,35,5,5,'2024-25','Grade 4','A',1,NULL,NULL,NULL,NULL,NULL),(3500,14000,35,6,6,'2024-25','Grade 5','A',1,NULL,NULL,NULL,NULL,NULL),(4000,16000,38,7,7,'2024-25','Grade 6','A',1,NULL,NULL,NULL,NULL,NULL),(4000,16000,38,8,8,'2024-25','Grade 6','B',1,NULL,NULL,NULL,NULL,NULL),(4000,17000,38,9,9,'2024-25','Grade 7','A',1,NULL,NULL,NULL,NULL,NULL),(4500,18000,40,10,10,'2024-25','Grade 8','A',1,NULL,NULL,NULL,NULL,NULL),(4500,18000,40,11,11,'2024-25','Grade 8','B',1,NULL,NULL,NULL,NULL,NULL),(5000,20000,40,12,12,'2024-25','Grade 9','A',1,NULL,NULL,NULL,NULL,NULL),(5000,20000,40,13,13,'2024-25','Grade 9','B',1,NULL,NULL,NULL,NULL,NULL),(5000,25000,40,14,14,'2024-25','Grade 10','A',1,NULL,NULL,NULL,NULL,NULL),(5000,25000,40,15,15,'2024-25','Grade 10','B',1,NULL,NULL,NULL,NULL,NULL),(6000,28000,35,16,16,'2024-25','Grade 11','A',1,NULL,NULL,NULL,NULL,NULL),(6000,28000,35,17,17,'2024-25','Grade 11','B',1,NULL,NULL,NULL,NULL,NULL),(6000,30000,35,18,18,'2024-25','Grade 12','A',1,NULL,NULL,NULL,NULL,NULL),(6000,30000,35,19,19,'2024-25','Grade 12','B',1,NULL,NULL,NULL,NULL,NULL),(6000,30000,35,20,20,'2024-25','Grade 12','C',1,NULL,NULL,NULL,NULL,NULL),(5000,25000,40,21,1,'2026-27','Grade 10','A',1,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `classrooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaints` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `attachment_url` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text NOT NULL,
  `priority` varchar(255) NOT NULL,
  `resolution_remarks` text,
  `status` varchar(255) NOT NULL,
  `ticket_id` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `parent_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKlekkstoboy5isygru4s2f3i81` (`ticket_id`),
  KEY `FK390fp1jy4mi1sekwucmp69ca1` (`academic_year_id`),
  KEY `FKbj3umwtpbp44dcejivajah2yf` (`branch_id`),
  KEY `FKlj6v383a2wi9urikkc016qmqt` (`parent_id`),
  KEY `FKh1cahj0r1cwkhoc2evv4y83el` (`student_id`),
  CONSTRAINT `FK390fp1jy4mi1sekwucmp69ca1` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
  CONSTRAINT `FKbj3umwtpbp44dcejivajah2yf` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKh1cahj0r1cwkhoc2evv4y83el` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `FKlj6v383a2wi9urikkc016qmqt` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints`
--

LOCK TABLES `complaints` WRITE;
/*!40000 ALTER TABLE `complaints` DISABLE KEYS */;
/*!40000 ALTER TABLE `complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consent_forms`
--

DROP TABLE IF EXISTS `consent_forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consent_forms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `attachment_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text NOT NULL,
  `due_date` date NOT NULL,
  `target_audience` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `class_room_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKr9j82deenq4t2d9gtk9jtid7e` (`academic_year_id`),
  KEY `FKfq50uumwrdqfailfmvs8hxah3` (`branch_id`),
  KEY `FK8v4rjfwsc9shlteiabk2kw2k7` (`class_room_id`),
  CONSTRAINT `FK8v4rjfwsc9shlteiabk2kw2k7` FOREIGN KEY (`class_room_id`) REFERENCES `class_rooms` (`id`),
  CONSTRAINT `FKfq50uumwrdqfailfmvs8hxah3` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKkiohpjkotq9olsqy0oi12aca9` FOREIGN KEY (`class_room_id`) REFERENCES `classrooms` (`id`),
  CONSTRAINT `FKr9j82deenq4t2d9gtk9jtid7e` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consent_forms`
--

LOCK TABLES `consent_forms` WRITE;
/*!40000 ALTER TABLE `consent_forms` DISABLE KEYS */;
INSERT INTO `consent_forms` VALUES (1,NULL,NULL,'Do you allow your child to visit the museum?','2026-05-20','GLOBAL','School Trip',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `consent_forms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consent_responses`
--

DROP TABLE IF EXISTS `consent_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consent_responses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `device_info` text,
  `ip_address` varchar(255) DEFAULT NULL,
  `responded_at` datetime(6) DEFAULT NULL,
  `signature_text` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `consent_form_id` bigint NOT NULL,
  `parent_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKq7i6wwmxp81k0i9n1faxplv61` (`consent_form_id`),
  KEY `FKqm5dmnaapk7pu8jxjnvvtb5g4` (`parent_id`),
  KEY `FKpo030c471h2qv0ik3umbc8598` (`student_id`),
  CONSTRAINT `FKpo030c471h2qv0ik3umbc8598` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `FKq7i6wwmxp81k0i9n1faxplv61` FOREIGN KEY (`consent_form_id`) REFERENCES `consent_forms` (`id`),
  CONSTRAINT `FKqm5dmnaapk7pu8jxjnvvtb5g4` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consent_responses`
--

LOCK TABLES `consent_responses` WRITE;
/*!40000 ALTER TABLE `consent_responses` DISABLE KEYS */;
/*!40000 ALTER TABLE `consent_responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Humanity '),(2,'xyz'),(3,'SCIENCE'),(4,'LANGUAGE'),(5,'TECH');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_master`
--

DROP TABLE IF EXISTS `document_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_master` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `board_id` varchar(50) DEFAULT NULL,
  `class_id` bigint DEFAULT NULL,
  `is_mandatory` tinyint(1) DEFAULT '0',
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_doc_class` (`class_id`),
  CONSTRAINT `fk_doc_class` FOREIGN KEY (`class_id`) REFERENCES `class_rooms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_master`
--

LOCK TABLES `document_master` WRITE;
/*!40000 ALTER TABLE `document_master` DISABLE KEYS */;
/*!40000 ALTER TABLE `document_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `downloadable_documents`
--

DROP TABLE IF EXISTS `downloadable_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `downloadable_documents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `document_type` varchar(255) NOT NULL,
  `expiry_date` datetime(6) DEFAULT NULL,
  `file_url` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6j50kusrctg21jrpo3wxfo86i` (`academic_year_id`),
  KEY `FK5d98lu7c3n0s5owqs9fe0apnn` (`branch_id`),
  KEY `FK7meij8lopf10vk56djsdh9oe` (`student_id`),
  CONSTRAINT `FK5d98lu7c3n0s5owqs9fe0apnn` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FK6j50kusrctg21jrpo3wxfo86i` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
  CONSTRAINT `FK7meij8lopf10vk56djsdh9oe` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `downloadable_documents`
--

LOCK TABLES `downloadable_documents` WRITE;
/*!40000 ALTER TABLE `downloadable_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `downloadable_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enquiry_followups`
--

DROP TABLE IF EXISTS `enquiry_followups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enquiry_followups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `enquiry_id` bigint NOT NULL,
  `followup_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `followup_type` varchar(50) NOT NULL,
  `remarks` text,
  `next_followup_date` date DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_followup_enq` (`enquiry_id`),
  CONSTRAINT `fk_followup_enq` FOREIGN KEY (`enquiry_id`) REFERENCES `admission_enquiries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enquiry_followups`
--

LOCK TABLES `enquiry_followups` WRITE;
/*!40000 ALTER TABLE `enquiry_followups` DISABLE KEYS */;
/*!40000 ALTER TABLE `enquiry_followups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_papers`
--

DROP TABLE IF EXISTS `exam_papers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_papers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `answer_key_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `exam_name` varchar(255) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `is_locked` bit(1) DEFAULT NULL,
  `marking_scheme` text,
  `unlock_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `class_room_id` bigint NOT NULL,
  `subject_id` bigint NOT NULL,
  `teacher_id` bigint NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `exam_date` date DEFAULT NULL,
  `status` enum('DRAFT','LOCKED','PUBLISHED') DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1g36197qaav4damwoft1uggwl` (`academic_year_id`),
  KEY `FKffnwas0vincsq1jhqvlcokfue` (`branch_id`),
  KEY `FKn0g7a3gs9oepoylr2hgg1mtr1` (`subject_id`),
  KEY `FK6p5pilf0e4h1wvpabokc1d0f5` (`teacher_id`),
  KEY `FKf7lg6h4kk5ht62snn80rdq0hj` (`class_room_id`),
  CONSTRAINT `FK1g36197qaav4damwoft1uggwl` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
  CONSTRAINT `FK1xvsp7vd618tgly5ihmvk317s` FOREIGN KEY (`class_room_id`) REFERENCES `classrooms` (`id`),
  CONSTRAINT `FK6p5pilf0e4h1wvpabokc1d0f5` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`),
  CONSTRAINT `FKf7lg6h4kk5ht62snn80rdq0hj` FOREIGN KEY (`class_room_id`) REFERENCES `class_rooms` (`id`),
  CONSTRAINT `FKffnwas0vincsq1jhqvlcokfue` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKn0g7a3gs9oepoylr2hgg1mtr1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_papers`
--

LOCK TABLES `exam_papers` WRITE;
/*!40000 ALTER TABLE `exam_papers` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_papers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exams` (
  `exam_date` date DEFAULT NULL,
  `passing_marks` int DEFAULT NULL,
  `total_marks` int DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `class_id` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `subject_id` bigint DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `end_time` varchar(255) DEFAULT NULL,
  `exam_type` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `start_time` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_exams_classroom_id` (`class_id`),
  KEY `idx_exams_subject_id` (`subject_id`),
  KEY `idx_exams_academic_year` (`academic_year_id`),
  KEY `FKb1vpavfecuhgs4rb4fsqfpyu9` (`branch_id`),
  CONSTRAINT `FK14goie0rjq2sqqmt1t052ly62` FOREIGN KEY (`class_id`) REFERENCES `classrooms` (`id`),
  CONSTRAINT `FKb1vpavfecuhgs4rb4fsqfpyu9` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKddehgdbvhn56aeo9hempt82qq` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
  CONSTRAINT `FKl5oduqxm4al0elxhum5ufsjfp` FOREIGN KEY (`class_id`) REFERENCES `class_rooms` (`id`),
  CONSTRAINT `FKopre4n7j7fpxqbtbwpv8ywn1y` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exams`
--

LOCK TABLES `exams` WRITE;
/*!40000 ALTER TABLE `exams` DISABLE KEYS */;
INSERT INTO `exams` VALUES ('2026-07-20',9,25,1,1,1,'2026-05-02 18:11:01.000000',NULL,1,NULL,NULL,'10:00:00','THEORY','Unit Test 1 - Mathematics','09:00:00','COMPLETED','Room 101','2026-05-10 08:40:33.345773'),('2026-07-21',9,25,1,1,1,'2026-05-02 18:11:01.000000',NULL,2,NULL,NULL,'10:00:00','THEORY','Unit Test 1 - Physics','09:00:00','SCHEDULED','Room 101',NULL),('2026-07-22',9,25,1,1,1,'2026-05-02 18:11:01.000000',NULL,3,NULL,NULL,'10:00:00','THEORY','Unit Test 1 - Chemistry','09:00:00','SCHEDULED','Lab 1',NULL),('2026-07-23',9,25,1,1,1,'2026-05-02 18:11:01.000000',NULL,4,NULL,NULL,'10:00:00','THEORY','Unit Test 1 - English','09:00:00','SCHEDULED','Room 102',NULL),('2026-07-24',9,25,1,1,1,'2026-05-02 18:11:01.000000',NULL,5,NULL,NULL,'10:00:00','THEORY','Unit Test 1 - Biology','09:00:00','SCHEDULED','Lab 2',NULL),('2026-10-10',35,100,1,1,1,'2026-05-02 18:11:01.000000',NULL,6,NULL,NULL,'12:00:00','THEORY','Mid Term - Mathematics','09:00:00','SCHEDULED','Hall A',NULL),('2026-10-11',35,100,1,1,1,'2026-05-02 18:11:01.000000',NULL,7,NULL,NULL,'12:00:00','THEORY','Mid Term - Physics','09:00:00','SCHEDULED','Hall A',NULL),('2026-10-12',35,100,1,1,1,'2026-05-02 18:11:01.000000',NULL,8,NULL,NULL,'12:00:00','THEORY','Mid Term - Chemistry','09:00:00','SCHEDULED','Hall B',NULL),('2026-10-13',35,100,1,1,1,'2026-05-02 18:11:01.000000',NULL,9,NULL,NULL,'12:00:00','THEORY','Mid Term - English','09:00:00','SCHEDULED','Hall B',NULL),('2026-10-14',35,100,1,1,1,'2026-05-02 18:11:01.000000',NULL,10,NULL,NULL,'12:00:00','THEORY','Mid Term - Biology','09:00:00','SCHEDULED','Hall C',NULL),('2026-10-16',12,30,1,1,1,'2026-05-02 18:11:01.000000',NULL,11,NULL,NULL,'13:00:00','PRACTICAL','Practical - Physics','10:00:00','SCHEDULED','Physics Lab',NULL),('2026-10-17',12,30,1,1,1,'2026-05-02 18:11:01.000000',NULL,12,NULL,NULL,'13:00:00','PRACTICAL','Practical - Chemistry','10:00:00','SCHEDULED','Chem Lab',NULL),('2026-10-18',12,30,1,1,1,'2026-05-02 18:11:01.000000',NULL,13,NULL,NULL,'13:00:00','PRACTICAL','Practical - Biology','10:00:00','SCHEDULED','Bio Lab',NULL),('2027-02-06',35,100,1,1,1,'2026-05-02 18:11:01.000000',NULL,15,NULL,NULL,'12:00:00','THEORY','Final - Physics','09:00:00','SCHEDULED','Main Hall',NULL),('2027-02-07',35,100,1,1,1,'2026-05-02 18:11:01.000000',NULL,16,NULL,NULL,'12:00:00','THEORY','Final - Chemistry','09:00:00','SCHEDULED','Main Hall',NULL),('2027-02-08',35,100,1,1,1,'2026-05-02 18:11:01.000000',NULL,17,NULL,NULL,'12:00:00','THEORY','Final - English','09:00:00','SCHEDULED','Main Hall',NULL),('2027-02-09',35,100,1,1,1,'2026-05-02 18:11:01.000000',NULL,18,NULL,NULL,'12:00:00','THEORY','Final - Biology','09:00:00','SCHEDULED','Main Hall',NULL),('2027-02-10',35,100,1,1,1,'2026-05-02 18:11:01.000000',NULL,19,NULL,NULL,'12:00:00','THEORY','Final - Computer Science','09:00:00','SCHEDULED','Computer Lab',NULL),('2027-02-11',20,50,1,1,1,'2026-05-02 18:11:01.000000',NULL,20,NULL,NULL,'14:00:00','PRACTICAL','Practical - Computer Science','10:00:00','SCHEDULED','Computer Lab',NULL);
/*!40000 ALTER TABLE `exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_payments`
--

DROP TABLE IF EXISTS `fee_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_payments` (
  `amount` double DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `fee_structure_id` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `month` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `receipt_number` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `status` enum('CANCELLED','OVERDUE','PAID','PENDING') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK4rdrgjim6jniwms0k49npk5ep` (`receipt_number`),
  KEY `idx_fee_payments_student_id` (`student_id`),
  KEY `idx_fee_payments_receipt` (`receipt_number`),
  KEY `idx_fee_payments_student_year` (`student_id`,`academic_year_id`),
  KEY `idx_fee_payments_created_at` (`created_at`),
  KEY `FKqtendx69u3u83wlqtkgoq0iod` (`academic_year_id`),
  KEY `FKrnmugsv2an5hqxgmb8c294of3` (`branch_id`),
  KEY `FKm0gdar1j14en6am9pe6dlmt7w` (`fee_structure_id`),
  CONSTRAINT `FK6k0lkod8mk082lnbapghhrx0j` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `FKm0gdar1j14en6am9pe6dlmt7w` FOREIGN KEY (`fee_structure_id`) REFERENCES `fee_structures` (`id`),
  CONSTRAINT `FKqtendx69u3u83wlqtkgoq0iod` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
  CONSTRAINT `FKrnmugsv2an5hqxgmb8c294of3` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_payments`
--

LOCK TABLES `fee_payments` WRITE;
/*!40000 ALTER TABLE `fee_payments` DISABLE KEYS */;
INSERT INTO `fee_payments` VALUES (5000,'2026-05-07',1,1,'2026-05-07 09:39:44.578580',NULL,NULL,6,23,NULL,'Admission Fee - One Time','Cash','SMS/2026/000001','',NULL,'PAID');
/*!40000 ALTER TABLE `fee_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_structures`
--

DROP TABLE IF EXISTS `fee_structures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_structures` (
  `active` bit(1) NOT NULL,
  `amount` double DEFAULT NULL,
  `class_id` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fee_name` varchar(255) DEFAULT NULL,
  `frequency` varchar(255) DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKgvda8q1mibfvp8wfptqk0dfiu` (`academic_year_id`),
  KEY `FK86078qp59rr4cjygqb55f97v4` (`class_id`),
  CONSTRAINT `FK86078qp59rr4cjygqb55f97v4` FOREIGN KEY (`class_id`) REFERENCES `class_rooms` (`id`),
  CONSTRAINT `FKgvda8q1mibfvp8wfptqk0dfiu` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
  CONSTRAINT `FKj1dkuda8yyri4yd5x640d29kc` FOREIGN KEY (`class_id`) REFERENCES `classrooms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_structures`
--

LOCK TABLES `fee_structures` WRITE;
/*!40000 ALTER TABLE `fee_structures` DISABLE KEYS */;
/*!40000 ALTER TABLE `fee_structures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'7','<< Flyway Baseline >>','BASELINE','<< Flyway Baseline >>',NULL,'root','2026-05-14 16:01:20',0,1),(2,'8','Fix Receipt Sequence Constraint','SQL','V8__Fix_Receipt_Sequence_Constraint.sql',383613210,'root','2026-05-14 16:19:14',9,1),(3,'9','Fix Receipt Sequence Constraint','SQL','V9__Fix_Receipt_Sequence_Constraint.sql',1276777370,'root','2026-05-14 16:41:06',7,1),(4,'10','Fix Receipt Sequence Constraint','SQL','V10__Fix_Receipt_Sequence_Constraint.sql',347503446,'root','2026-05-14 16:41:07',990,1),(5,'11','Forensic Sequence Sync','SQL','V11__Forensic_Sequence_Sync.sql',-962003129,'root','2026-05-14 23:35:56',1263,1),(6,'12','Connect Departments to Subjects','SQL','V12__Connect_Departments_to_Subjects.sql',1734799342,'root','2026-05-16 03:41:26',2585,1),(7,'13','Enterprise Student Schema Hardening','SQL','V13__Enterprise_Student_Schema_Hardening.sql',1327594218,'root','2026-05-16 12:18:57',1083,1),(8,'14','Enterprise Teacher HRMS Hardening','SQL','V14__Enterprise_Teacher_HRMS_Hardening.sql',-1569906192,'root','2026-05-16 12:19:01',4515,1),(9,'15','Add Branch To Timetable','SQL','V15__Add_Branch_To_Timetable.sql',-442882476,'root','2026-05-16 14:32:57',1373,1),(10,'16','Advanced Admin Modules','SQL','V16__Advanced_Admin_Modules.sql',-309160285,'root','2026-05-18 16:55:17',1330,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `generated_id_cards`
--

DROP TABLE IF EXISTS `generated_id_cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `generated_id_cards` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `template_id` bigint NOT NULL,
  `card_no` varchar(100) NOT NULL,
  `generated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `generated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `card_no` (`card_no`),
  KEY `fk_idcard_student` (`student_id`),
  KEY `fk_idcard_template` (`template_id`),
  CONSTRAINT `fk_idcard_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_idcard_template` FOREIGN KEY (`template_id`) REFERENCES `id_card_templates` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `generated_id_cards`
--

LOCK TABLES `generated_id_cards` WRITE;
/*!40000 ALTER TABLE `generated_id_cards` DISABLE KEYS */;
/*!40000 ALTER TABLE `generated_id_cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `homework`
--

DROP TABLE IF EXISTS `homework`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homework` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `assigned_date` date NOT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `due_date` date NOT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `class_room_id` bigint NOT NULL,
  `subject_id` bigint NOT NULL,
  `teacher_id` bigint NOT NULL,
  `resource_links` text,
  `scheduled_publish_at` datetime(6) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKowverrheycygeaimk104fdxyi` (`academic_year_id`),
  KEY `FKfs07tgffucxtq14wbva0xe9q2` (`branch_id`),
  KEY `FKkeb86qd8iobrmavylixxdrwqo` (`subject_id`),
  KEY `FK495eip8kx1mmsmxk4txxdawo7` (`teacher_id`),
  KEY `FKg1qjlmlqwodtg5swyr3g80h04` (`class_room_id`),
  CONSTRAINT `FK495eip8kx1mmsmxk4txxdawo7` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`),
  CONSTRAINT `FK7i63aisa3e0pscp3vcdudkpo5` FOREIGN KEY (`class_room_id`) REFERENCES `classrooms` (`id`),
  CONSTRAINT `FKfs07tgffucxtq14wbva0xe9q2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKg1qjlmlqwodtg5swyr3g80h04` FOREIGN KEY (`class_room_id`) REFERENCES `class_rooms` (`id`),
  CONSTRAINT `FKkeb86qd8iobrmavylixxdrwqo` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  CONSTRAINT `FKowverrheycygeaimk104fdxyi` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homework`
--

LOCK TABLES `homework` WRITE;
/*!40000 ALTER TABLE `homework` DISABLE KEYS */;
/*!40000 ALTER TABLE `homework` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `id_card_templates`
--

DROP TABLE IF EXISTS `id_card_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `id_card_templates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `bg_gradient` varchar(255) DEFAULT NULL,
  `primary_color` varchar(50) DEFAULT NULL,
  `secondary_color` varchar(50) DEFAULT NULL,
  `text_color` varchar(50) DEFAULT NULL,
  `font_family` varchar(50) DEFAULT NULL,
  `show_logo` tinyint(1) DEFAULT '1',
  `show_barcode` tinyint(1) DEFAULT '0',
  `show_qr` tinyint(1) DEFAULT '1',
  `emergency_contact_phone` varchar(50) DEFAULT NULL,
  `school_address` text,
  `created_by` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `id_card_templates`
--

LOCK TABLES `id_card_templates` WRITE;
/*!40000 ALTER TABLE `id_card_templates` DISABLE KEYS */;
/*!40000 ALTER TABLE `id_card_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `issued_certificates`
--

DROP TABLE IF EXISTS `issued_certificates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `issued_certificates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `template_id` bigint NOT NULL,
  `certificate_no` varchar(100) NOT NULL,
  `verification_token` varchar(100) NOT NULL,
  `issued_date` date NOT NULL,
  `issued_by` varchar(100) NOT NULL,
  `digital_signature` text,
  `pdf_path` varchar(500) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'ISSUED',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificate_no` (`certificate_no`),
  UNIQUE KEY `verification_token` (`verification_token`),
  KEY `fk_cert_template` (`template_id`),
  KEY `idx_cert_student` (`student_id`),
  KEY `idx_cert_token` (`verification_token`),
  CONSTRAINT `fk_cert_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cert_template` FOREIGN KEY (`template_id`) REFERENCES `certificate_templates` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issued_certificates`
--

LOCK TABLES `issued_certificates` WRITE;
/*!40000 ALTER TABLE `issued_certificates` DISABLE KEYS */;
/*!40000 ALTER TABLE `issued_certificates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_requests`
--

DROP TABLE IF EXISTS `leave_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `attachment_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `end_date` date NOT NULL,
  `reason` text NOT NULL,
  `start_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  `teacher_remarks` text,
  `updated_at` datetime(6) DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `parent_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKnbrnofarxju4lrsxwuwl5y0ur` (`academic_year_id`),
  KEY `FKm6qg1etgs5v67tc4utc888vto` (`branch_id`),
  KEY `FK8g7wkcvmrsrx9ihuq7fqxoia4` (`parent_id`),
  KEY `FK5m8d2wwxbf245dqhbntl7hnn1` (`student_id`),
  CONSTRAINT `FK5m8d2wwxbf245dqhbntl7hnn1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `FK8g7wkcvmrsrx9ihuq7fqxoia4` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`id`),
  CONSTRAINT `FKm6qg1etgs5v67tc4utc888vto` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKnbrnofarxju4lrsxwuwl5y0ur` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_requests`
--

LOCK TABLES `leave_requests` WRITE;
/*!40000 ALTER TABLE `leave_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `leave_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson_plan_topics`
--

DROP TABLE IF EXISTS `lesson_plan_topics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson_plan_topics` (
  `lesson_plan_id` bigint NOT NULL,
  `completed` bit(1) DEFAULT NULL,
  `completion_percentage` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  KEY `FKhkpcaf1u4y9gvpyi3vs3vmwd4` (`lesson_plan_id`),
  CONSTRAINT `FKhkpcaf1u4y9gvpyi3vs3vmwd4` FOREIGN KEY (`lesson_plan_id`) REFERENCES `lesson_plans` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson_plan_topics`
--

LOCK TABLES `lesson_plan_topics` WRITE;
/*!40000 ALTER TABLE `lesson_plan_topics` DISABLE KEYS */;
/*!40000 ALTER TABLE `lesson_plan_topics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lesson_plans`
--

DROP TABLE IF EXISTS `lesson_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lesson_plans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activities` text,
  `chapter_name` varchar(255) DEFAULT NULL,
  `completion_status` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `objective` text,
  `planned_date` date DEFAULT NULL,
  `resources` text,
  `syllabus_code` varchar(255) DEFAULT NULL,
  `topic` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `class_room_id` bigint NOT NULL,
  `subject_id` bigint NOT NULL,
  `teacher_id` bigint NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `status` enum('ACTIVE','APPROVED','COMPLETED','DRAFT') DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5k6lbytv0xe9cw3rd7rite64g` (`academic_year_id`),
  KEY `FKnv98jbqmihngbfyj1yahx02qj` (`branch_id`),
  KEY `FKb0p2rtfkkp0o2sh8bfkinwv7v` (`subject_id`),
  KEY `FKshbgtgara2hqdyq2tcfb1l8jr` (`teacher_id`),
  KEY `FKjwhftmyqi4502230060qvlo9l` (`class_room_id`),
  CONSTRAINT `FK5k6lbytv0xe9cw3rd7rite64g` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
  CONSTRAINT `FKb0p2rtfkkp0o2sh8bfkinwv7v` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  CONSTRAINT `FKjwhftmyqi4502230060qvlo9l` FOREIGN KEY (`class_room_id`) REFERENCES `class_rooms` (`id`),
  CONSTRAINT `FKnv98jbqmihngbfyj1yahx02qj` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKq474xw3yec5w1qf0bri7s5qc9` FOREIGN KEY (`class_room_id`) REFERENCES `classrooms` (`id`),
  CONSTRAINT `FKshbgtgara2hqdyq2tcfb1l8jr` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lesson_plans`
--

LOCK TABLES `lesson_plans` WRITE;
/*!40000 ALTER TABLE `lesson_plans` DISABLE KEYS */;
/*!40000 ALTER TABLE `lesson_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marks`
--

DROP TABLE IF EXISTS `marks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marks` (
  `absent` bit(1) NOT NULL,
  `marks_obtained` double DEFAULT NULL,
  `total_marks` double DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `exam_id` bigint NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `grade` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKclhxmbpph0wfgle41hr6wnns1` (`student_id`,`exam_id`),
  KEY `idx_marks_student_id` (`student_id`),
  KEY `idx_marks_exam_id` (`exam_id`),
  KEY `idx_marks_student_exam` (`student_id`,`exam_id`),
  KEY `idx_marks_created_at` (`created_at`),
  KEY `FK8fe9bsufmwtlcw254fq9h8ca5` (`academic_year_id`),
  KEY `FKpemlv7q38pfxcp3s5gjqubuie` (`branch_id`),
  CONSTRAINT `FK6o5buy4g7i65v20hjy9inwn05` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `FK8fe9bsufmwtlcw254fq9h8ca5` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
  CONSTRAINT `FKpemlv7q38pfxcp3s5gjqubuie` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKqsh7nyinh5ntyjr023na0qfaa` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marks`
--

LOCK TABLES `marks` WRITE;
/*!40000 ALTER TABLE `marks` DISABLE KEYS */;
INSERT INTO `marks` VALUES (_binary '\0',51,25,1,NULL,'2026-05-10 08:40:33.307423',NULL,1,2,1,NULL,'A+',NULL),(_binary '\0',12,25,1,NULL,'2026-05-10 08:40:33.327686',NULL,1,3,2,NULL,'D',NULL),(_binary '\0',20,25,1,NULL,'2026-05-10 08:40:33.339185',NULL,1,4,33,NULL,'A',NULL);
/*!40000 ALTER TABLE `marks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `deleted_at` datetime(6) DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `action_link` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `message` text NOT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `recipient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqqnsjxlwleyjbxlmm213jaj3f` (`recipient_id`),
  CONSTRAINT `FKqqnsjxlwleyjbxlmm213jaj3f` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent_otp_sessions`
--

DROP TABLE IF EXISTS `parent_otp_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_otp_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `attempts_count` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `device_info` text,
  `expires_at` datetime(6) NOT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `mobile_number` varchar(255) NOT NULL,
  `otp_code_hash` varchar(255) NOT NULL,
  `purpose` varchar(255) NOT NULL,
  `verified_at` datetime(6) DEFAULT NULL,
  `parent_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK75whvyi9segc47m58vsrvqjqo` (`parent_id`),
  CONSTRAINT `FK75whvyi9segc47m58vsrvqjqo` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_otp_sessions`
--

LOCK TABLES `parent_otp_sessions` WRITE;
/*!40000 ALTER TABLE `parent_otp_sessions` DISABLE KEYS */;
INSERT INTO `parent_otp_sessions` VALUES (1,0,'2026-05-10 07:36:33.672538',NULL,'2026-05-10 07:41:33.672538',NULL,'9142081366','{bcrypt}$2a$10$eldbZHe2GEfBY5sJZpCQNO0kbQ1yucaypEYRmv2MmMBSK6fcY05xq','LOGIN',NULL,1);
/*!40000 ALTER TABLE `parent_otp_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent_sessions`
--

DROP TABLE IF EXISTS `parent_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `device_name` varchar(255) DEFAULT NULL,
  `device_type` varchar(255) DEFAULT NULL,
  `expires_at` datetime(6) NOT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `refresh_token_hash` varchar(255) NOT NULL,
  `revoked_at` datetime(6) DEFAULT NULL,
  `user_agent` text,
  `parent_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKe1ki69d79xbaye1a65k0kmq6` (`parent_id`),
  CONSTRAINT `FKe1ki69d79xbaye1a65k0kmq6` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_sessions`
--

LOCK TABLES `parent_sessions` WRITE;
/*!40000 ALTER TABLE `parent_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `parent_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent_student_link`
--

DROP TABLE IF EXISTS `parent_student_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_student_link` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `parent_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `relationship` varchar(255) NOT NULL,
  `is_primary_guardian` tinyint(1) DEFAULT '0',
  `created_by` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_parent_student` (`parent_id`,`student_id`),
  UNIQUE KEY `UKqh09aqd7yp2c7mp7nxhj1hkft` (`parent_id`,`student_id`),
  KEY `fk_link_student` (`student_id`),
  CONSTRAINT `fk_link_parent` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`id`),
  CONSTRAINT `fk_link_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_student_link`
--

LOCK TABLES `parent_student_link` WRITE;
/*!40000 ALTER TABLE `parent_student_link` DISABLE KEYS */;
/*!40000 ALTER TABLE `parent_student_link` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent_student_links`
--

DROP TABLE IF EXISTS `parent_student_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_student_links` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `fee_responsible` bit(1) NOT NULL,
  `is_primary_contact` bit(1) NOT NULL,
  `lives_with_student` bit(1) NOT NULL,
  `notes` text,
  `pickup_authorized` bit(1) NOT NULL,
  `relationship_type` varchar(255) NOT NULL,
  `parent_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2whfkij6kgxbvffohnp78ohgc` (`parent_id`),
  KEY `FK75kc9sb7vtllyup6dqav9k1su` (`student_id`),
  CONSTRAINT `FK2whfkij6kgxbvffohnp78ohgc` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`id`),
  CONSTRAINT `FK75kc9sb7vtllyup6dqav9k1su` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_student_links`
--

LOCK TABLES `parent_student_links` WRITE;
/*!40000 ALTER TABLE `parent_student_links` DISABLE KEYS */;
INSERT INTO `parent_student_links` VALUES (3,'2026-05-15 15:20:24.373363','SYSTEM_AUTO',_binary '',_binary '',_binary '',NULL,_binary '','GUARDIAN',2,36),(5,'2026-05-15 15:26:29.393997','ADMIN',_binary '\0',_binary '\0',_binary '',NULL,_binary '\0','GUARDIAN',1,2);
/*!40000 ALTER TABLE `parent_student_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parents`
--

DROP TABLE IF EXISTS `parents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `deleted_at` datetime(6) DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `address` text,
  `alternate_mobile` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `created_by_admin_id` bigint DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `is_mobile_verified` bit(1) NOT NULL,
  `last_login_at` datetime(6) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `parent_uuid` varchar(255) NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `pin_hash` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `relationship_default` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `alternate_phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK11m77ef1sp6b2lc5oicaq3xgp` (`phone`),
  UNIQUE KEY `UKe0js7mshi7ps1bory4d05gopb` (`parent_uuid`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `FKmra0liyfdrvs542etq8ylo99j` (`academic_year_id`),
  KEY `FKajf7d166rrui9631au8x2p0th` (`branch_id`),
  CONSTRAINT `FKajf7d166rrui9631au8x2p0th` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKchh8tf8w072tapgqoijrahojk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKmra0liyfdrvs542etq8ylo99j` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parents`
--

LOCK TABLES `parents` WRITE;
/*!40000 ALTER TABLE `parents` DISABLE KEYS */;
INSERT INTO `parents` VALUES (1,NULL,NULL,'','','',NULL,'x@gmail.com','Ravi','',_binary '',_binary '','2026-05-10 09:35:44.155240','9142081366','','9737f8e4-921e-4fb1-8b86-ba2cd6f9ec09',NULL,NULL,'','FATHER','',1,NULL,'Ravi','Ravi',NULL,NULL),(2,NULL,NULL,NULL,NULL,NULL,NULL,'df@gmail.com','fghjk',NULL,_binary '',_binary '\0',NULL,'5461237894',NULL,'4db31d78-d98d-4c40-b370-2d6817318048',NULL,NULL,NULL,'GUARDIAN',NULL,1,NULL,'fghjk','fghjk',NULL,NULL);
/*!40000 ALTER TABLE `parents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission_audit_logs`
--

DROP TABLE IF EXISTS `permission_audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission_audit_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action` varchar(255) DEFAULT NULL,
  `actor_id` bigint DEFAULT NULL,
  `after_value` text,
  `before_value` text,
  `created_at` datetime(6) DEFAULT NULL,
  `details` json DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `target_role_id` bigint DEFAULT NULL,
  `target_user_id` bigint DEFAULT NULL,
  `parent_role_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission_audit_logs`
--

LOCK TABLES `permission_audit_logs` WRITE;
/*!40000 ALTER TABLE `permission_audit_logs` DISABLE KEYS */;
INSERT INTO `permission_audit_logs` VALUES (1,'PERMISSION_CHANGED',1,'ATTENDANCE_CREATE,ATTENDANCE_DELETE,ATTENDANCE_EDIT,ATTENDANCE_EXPORT,ATTENDANCE_VIEW,BACKUPS_CREATE,BACKUPS_DELETE,BACKUPS_EDIT,BACKUPS_EXPORT,BACKUPS_VIEW,CLASSES_CREATE,CLASSES_DELETE,CLASSES_EDIT,CLASSES_EXPORT,CLASSES_VIEW,DASHBOARD_CREATE,DASHBOARD_DELETE,DASHBOARD_EDIT,DASHBOARD_EXPORT,DASHBOARD_VIEW,EXAMS_CREATE,EXAMS_DELETE,EXAMS_EDIT,EXAMS_EXPORT,EXAMS_VIEW,FEES_CREATE,FEES_DELETE,FEES_EDIT,FEES_EXPORT,FEES_VIEW,MARKS_CREATE,MARKS_DELETE,MARKS_EDIT,MARKS_EXPORT,MARKS_VIEW,REPORTS_CREATE,REPORTS_DELETE,REPORTS_EDIT,REPORTS_EXPORT,REPORTS_VIEW,ROLES_CREATE,ROLES_DELETE,ROLES_EDIT,ROLES_EXPORT,ROLES_VIEW,STUDENTS_CREATE,STUDENTS_DELETE,STUDENTS_EDIT,STUDENTS_EXPORT,STUDENTS_VIEW,TEACHERS_CREATE,TEACHERS_DELETE,TEACHERS_EDIT,TEACHERS_EXPORT,TEACHERS_VIEW,USERS_CREATE,USERS_DELETE,USERS_EDIT,USERS_EXPORT,USERS_VIEW','','2026-05-04 04:03:12.988623','{\"message\": \"Updated permissions for role: ADMIN\"}','0:0:0:0:0:0:0:1',2,NULL,NULL),(2,'PERMISSION_CHANGED',1,'ATTENDANCE_CREATE,ATTENDANCE_EDIT,ATTENDANCE_VIEW,DASHBOARD_VIEW,EXAMS_VIEW,MARKS_CREATE,MARKS_EDIT,MARKS_VIEW,STUDENTS_VIEW','ATTENDANCE_CREATE,ATTENDANCE_EDIT,ATTENDANCE_VIEW,DASHBOARD_VIEW,EXAMS_VIEW,MARKS_CREATE,MARKS_EDIT,MARKS_VIEW,STUDENTS_VIEW','2026-05-04 04:25:26.200901','{\"message\": \"Updated permissions for role: TEACHER\"}','0:0:0:0:0:0:0:1',3,NULL,NULL),(3,'PERMISSION_CHANGED',1,'ATTENDANCE_CREATE,ATTENDANCE_DELETE,ATTENDANCE_EDIT,ATTENDANCE_EXPORT,ATTENDANCE_VIEW,BACKUPS_CREATE,BACKUPS_DELETE,BACKUPS_EDIT,BACKUPS_EXPORT,BACKUPS_VIEW,CLASSES_CREATE,CLASSES_DELETE,CLASSES_EDIT,CLASSES_EXPORT,CLASSES_VIEW,DASHBOARD_CREATE,DASHBOARD_DELETE,DASHBOARD_EDIT,DASHBOARD_EXPORT,DASHBOARD_VIEW,EXAMS_CREATE,EXAMS_DELETE,EXAMS_EDIT,EXAMS_EXPORT,EXAMS_VIEW,FEES_CREATE,FEES_DELETE,FEES_EDIT,FEES_EXPORT,FEES_VIEW,MARKS_CREATE,MARKS_DELETE,MARKS_EDIT,MARKS_EXPORT,MARKS_VIEW,REPORTS_CREATE,REPORTS_DELETE,REPORTS_EDIT,REPORTS_EXPORT,REPORTS_VIEW,ROLES_CREATE,ROLES_DELETE,ROLES_EDIT,ROLES_EXPORT,ROLES_VIEW,STUDENTS_CREATE,STUDENTS_DELETE,STUDENTS_EDIT,STUDENTS_EXPORT,STUDENTS_VIEW,TEACHERS_CREATE,TEACHERS_DELETE,TEACHERS_EDIT,TEACHERS_EXPORT,TEACHERS_VIEW,USERS_CREATE,USERS_DELETE,USERS_EDIT,USERS_EXPORT,USERS_VIEW','ATTENDANCE_VIEW,CLASSES_VIEW,DASHBOARD_VIEW,EXAMS_VIEW,MARKS_VIEW','2026-05-04 13:53:45.922857','{\"message\": \"Updated permissions for role: STUDENT\"}','0:0:0:0:0:0:0:1',7,NULL,NULL);
/*!40000 ALTER TABLE `permission_audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action_name` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `module_name` varchar(255) NOT NULL,
  `permission_key` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKh1ss8mmscopr690vkcj25uj9a` (`permission_key`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'VIEW','2026-05-04 02:49:33.021692','STUDENTS','STUDENTS_VIEW'),(2,'CREATE','2026-05-04 02:49:33.047420','STUDENTS','STUDENTS_CREATE'),(3,'EDIT','2026-05-04 02:49:33.052085','STUDENTS','STUDENTS_EDIT'),(4,'DELETE','2026-05-04 02:49:33.056153','STUDENTS','STUDENTS_DELETE'),(5,'EXPORT','2026-05-04 02:49:33.058772','STUDENTS','STUDENTS_EXPORT'),(6,'VIEW','2026-05-04 02:49:33.060805','FEES','FEES_VIEW'),(7,'CREATE','2026-05-04 02:49:33.064415','FEES','FEES_CREATE'),(8,'EDIT','2026-05-04 02:49:33.068208','FEES','FEES_EDIT'),(9,'DELETE','2026-05-04 02:49:33.071713','FEES','FEES_DELETE'),(10,'EXPORT','2026-05-04 02:49:33.075301','FEES','FEES_EXPORT'),(11,'VIEW','2026-05-04 02:49:33.077870','ATTENDANCE','ATTENDANCE_VIEW'),(12,'CREATE','2026-05-04 02:49:33.082437','ATTENDANCE','ATTENDANCE_CREATE'),(13,'EDIT','2026-05-04 02:49:33.087433','ATTENDANCE','ATTENDANCE_EDIT'),(14,'DELETE','2026-05-04 02:49:33.091511','ATTENDANCE','ATTENDANCE_DELETE'),(15,'EXPORT','2026-05-04 02:49:33.094111','ATTENDANCE','ATTENDANCE_EXPORT'),(16,'VIEW','2026-05-04 02:49:33.097259','MARKS','MARKS_VIEW'),(17,'CREATE','2026-05-04 02:49:33.101898','MARKS','MARKS_CREATE'),(18,'EDIT','2026-05-04 02:49:33.105571','MARKS','MARKS_EDIT'),(19,'DELETE','2026-05-04 02:49:33.108596','MARKS','MARKS_DELETE'),(20,'EXPORT','2026-05-04 02:49:33.111106','MARKS','MARKS_EXPORT'),(21,'VIEW','2026-05-04 02:49:33.115244','EXAMS','EXAMS_VIEW'),(22,'CREATE','2026-05-04 02:49:33.119500','EXAMS','EXAMS_CREATE'),(23,'EDIT','2026-05-04 02:49:33.123077','EXAMS','EXAMS_EDIT'),(24,'DELETE','2026-05-04 02:49:33.125619','EXAMS','EXAMS_DELETE'),(25,'EXPORT','2026-05-04 02:49:33.129073','EXAMS','EXAMS_EXPORT'),(26,'VIEW','2026-05-04 02:49:33.132171','USERS','USERS_VIEW'),(27,'CREATE','2026-05-04 02:49:33.136694','USERS','USERS_CREATE'),(28,'EDIT','2026-05-04 02:49:33.139727','USERS','USERS_EDIT'),(29,'DELETE','2026-05-04 02:49:33.141877','USERS','USERS_DELETE'),(30,'EXPORT','2026-05-04 02:49:33.145101','USERS','USERS_EXPORT'),(31,'VIEW','2026-05-04 02:49:33.148753','BACKUPS','BACKUPS_VIEW'),(32,'CREATE','2026-05-04 02:49:33.153859','BACKUPS','BACKUPS_CREATE'),(33,'EDIT','2026-05-04 02:49:33.156875','BACKUPS','BACKUPS_EDIT'),(34,'DELETE','2026-05-04 02:49:33.159426','BACKUPS','BACKUPS_DELETE'),(35,'EXPORT','2026-05-04 02:49:33.162505','BACKUPS','BACKUPS_EXPORT'),(36,'VIEW','2026-05-04 02:49:33.165956','REPORTS','REPORTS_VIEW'),(37,'CREATE','2026-05-04 02:49:33.169507','REPORTS','REPORTS_CREATE'),(38,'EDIT','2026-05-04 02:49:33.173123','REPORTS','REPORTS_EDIT'),(39,'DELETE','2026-05-04 02:49:33.175753','REPORTS','REPORTS_DELETE'),(40,'EXPORT','2026-05-04 02:49:33.178799','REPORTS','REPORTS_EXPORT'),(41,'VIEW','2026-05-04 02:49:33.180841','ROLES','ROLES_VIEW'),(42,'CREATE','2026-05-04 02:49:33.185535','ROLES','ROLES_CREATE'),(43,'EDIT','2026-05-04 02:49:33.189667','ROLES','ROLES_EDIT'),(44,'DELETE','2026-05-04 02:49:33.192268','ROLES','ROLES_DELETE'),(45,'EXPORT','2026-05-04 02:49:33.195145','ROLES','ROLES_EXPORT'),(46,'VIEW','2026-05-04 02:49:33.198239','TEACHERS','TEACHERS_VIEW'),(47,'CREATE','2026-05-04 02:49:33.202262','TEACHERS','TEACHERS_CREATE'),(48,'EDIT','2026-05-04 02:49:33.205776','TEACHERS','TEACHERS_EDIT'),(49,'DELETE','2026-05-04 02:49:33.208668','TEACHERS','TEACHERS_DELETE'),(50,'EXPORT','2026-05-04 02:49:33.211673','TEACHERS','TEACHERS_EXPORT'),(51,'VIEW','2026-05-04 02:49:33.215262','CLASSES','CLASSES_VIEW'),(52,'CREATE','2026-05-04 02:49:33.219210','CLASSES','CLASSES_CREATE'),(53,'EDIT','2026-05-04 02:49:33.221786','CLASSES','CLASSES_EDIT'),(54,'DELETE','2026-05-04 02:49:33.223667','CLASSES','CLASSES_DELETE'),(55,'EXPORT','2026-05-04 02:49:33.227404','CLASSES','CLASSES_EXPORT'),(56,'VIEW','2026-05-04 03:46:25.766224','DASHBOARD','DASHBOARD_VIEW'),(57,'CREATE','2026-05-04 03:46:25.797686','DASHBOARD','DASHBOARD_CREATE'),(58,'EDIT','2026-05-04 03:46:25.802676','DASHBOARD','DASHBOARD_EDIT'),(59,'DELETE','2026-05-04 03:46:25.805697','DASHBOARD','DASHBOARD_DELETE'),(60,'EXPORT','2026-05-04 03:46:25.808782','DASHBOARD','DASHBOARD_EXPORT');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion_history`
--

DROP TABLE IF EXISTS `promotion_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `from_academic_year_id` bigint NOT NULL,
  `to_academic_year_id` bigint NOT NULL,
  `from_classroom_id` bigint NOT NULL,
  `to_classroom_id` bigint NOT NULL,
  `promotion_rule` varchar(100) NOT NULL,
  `promoted_by` varchar(100) NOT NULL,
  `promoted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `rollback_status` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_promo_from_year` (`from_academic_year_id`),
  KEY `fk_promo_to_year` (`to_academic_year_id`),
  KEY `fk_promo_from_class` (`from_classroom_id`),
  KEY `fk_promo_to_class` (`to_classroom_id`),
  KEY `idx_promo_student` (`student_id`),
  CONSTRAINT `fk_promo_from_class` FOREIGN KEY (`from_classroom_id`) REFERENCES `class_rooms` (`id`),
  CONSTRAINT `fk_promo_from_year` FOREIGN KEY (`from_academic_year_id`) REFERENCES `academic_years` (`id`),
  CONSTRAINT `fk_promo_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_promo_to_class` FOREIGN KEY (`to_classroom_id`) REFERENCES `class_rooms` (`id`),
  CONSTRAINT `fk_promo_to_year` FOREIGN KEY (`to_academic_year_id`) REFERENCES `academic_years` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_history`
--

LOCK TABLES `promotion_history` WRITE;
/*!40000 ALTER TABLE `promotion_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `promotion_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ptm_bookings`
--

DROP TABLE IF EXISTS `ptm_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ptm_bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `parent_id` bigint NOT NULL,
  `slot_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKkmmg0wtq55jr5669s8mmdwbo` (`slot_id`),
  KEY `FK26kynfivcdnmuyk4iq6r6c05x` (`parent_id`),
  KEY `FKs3pvyvdsspomv2dv7jinyst24` (`student_id`),
  CONSTRAINT `FK26kynfivcdnmuyk4iq6r6c05x` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`id`),
  CONSTRAINT `FKn97y144q2exmw3qqb49m45peg` FOREIGN KEY (`slot_id`) REFERENCES `ptm_slots` (`id`),
  CONSTRAINT `FKs3pvyvdsspomv2dv7jinyst24` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ptm_bookings`
--

LOCK TABLES `ptm_bookings` WRITE;
/*!40000 ALTER TABLE `ptm_bookings` DISABLE KEYS */;
INSERT INTO `ptm_bookings` VALUES (1,'2026-05-10 09:37:54.079620','BOOKED','2026-05-10 09:37:54.079620',1,1,2);
/*!40000 ALTER TABLE `ptm_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ptm_slots`
--

DROP TABLE IF EXISTS `ptm_slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ptm_slots` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `end_time` time(6) NOT NULL,
  `is_booked` bit(1) NOT NULL,
  `slot_date` date NOT NULL,
  `start_time` time(6) NOT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `teacher_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK93o4ep8bkg0tluh36o7q8q0c7` (`academic_year_id`),
  KEY `FKsj45q2c19e9p5nonu1di0w8ou` (`branch_id`),
  KEY `FK793wk1exh0nbqirqtqgfx0qv` (`teacher_id`),
  CONSTRAINT `FK793wk1exh0nbqirqtqgfx0qv` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`),
  CONSTRAINT `FK93o4ep8bkg0tluh36o7q8q0c7` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
  CONSTRAINT `FKsj45q2c19e9p5nonu1di0w8ou` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ptm_slots`
--

LOCK TABLES `ptm_slots` WRITE;
/*!40000 ALTER TABLE `ptm_slots` DISABLE KEYS */;
INSERT INTO `ptm_slots` VALUES (1,NULL,'10:30:00.000000',_binary '','2026-05-15','10:00:00.000000',NULL,NULL,1);
/*!40000 ALTER TABLE `ptm_slots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receipt_sequences`
--

DROP TABLE IF EXISTS `receipt_sequences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receipt_sequences` (
  `academic_year_id` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_sequence` bigint NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `school_code` varchar(255) NOT NULL,
  `sequence_type` enum('RECEIPT','STUDENT_ID','TEACHER_ID') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKnoy36l0gunndfugftyrrdxhqh` (`school_code`,`academic_year_id`,`sequence_type`),
  UNIQUE KEY `UK_school_year_type` (`school_code`,`academic_year_id`,`sequence_type`),
  KEY `FKld0wfo40icrh242quem679nt5` (`academic_year_id`),
  CONSTRAINT `FKld0wfo40icrh242quem679nt5` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receipt_sequences`
--

LOCK TABLES `receipt_sequences` WRITE;
/*!40000 ALTER TABLE `receipt_sequences` DISABLE KEYS */;
INSERT INTO `receipt_sequences` VALUES (21,1,150,'2026-05-02 17:23:34.000000','SMS','RECEIPT'),(2,2,320,'2026-05-02 17:23:34.000000','SMS','RECEIPT'),(3,3,285,'2026-05-02 17:23:34.000000','SMS','RECEIPT'),(4,4,210,'2026-05-02 17:23:34.000000','SMS','RECEIPT'),(5,5,195,'2026-05-02 17:23:34.000000','SMS','RECEIPT'),(11,6,98,'2026-05-02 17:23:34.000000','NTH','RECEIPT'),(12,7,175,'2026-05-02 17:23:34.000000','NTH','RECEIPT'),(13,8,112,'2026-05-02 17:23:34.000000','STH','RECEIPT'),(14,9,230,'2026-05-02 17:23:34.000000','STH','RECEIPT'),(15,10,88,'2026-05-02 17:23:34.000000','EST','RECEIPT'),(16,11,145,'2026-05-02 17:23:34.000000','EST','RECEIPT'),(17,12,76,'2026-05-02 17:23:34.000000','WST','RECEIPT'),(18,13,134,'2026-05-02 17:23:34.000000','WST','RECEIPT'),(19,14,200,'2026-05-02 17:23:34.000000','CTR','RECEIPT'),(20,15,310,'2026-05-02 17:23:34.000000','CTR','RECEIPT'),(21,16,55,'2026-05-02 17:23:34.000000','RHN','RECEIPT'),(21,17,43,'2026-05-02 17:23:34.000000','DWK','RECEIPT'),(21,18,67,'2026-05-02 17:23:34.000000','SKT','RECEIPT'),(21,19,39,'2026-05-02 17:23:34.000000','FRB','RECEIPT'),(21,20,28,'2026-05-02 17:23:34.000000','GRN','RECEIPT'),(1,21,1,'2026-05-07 09:39:44.621080','SMS','RECEIPT'),(1,38,14,'2026-05-15 15:20:24.472967','SMS','STUDENT_ID'),(2,39,0,'2026-05-15 05:05:55.000000','SMS','STUDENT_ID'),(3,40,0,'2026-05-15 05:05:55.000000','SMS','STUDENT_ID'),(4,41,0,'2026-05-15 05:05:55.000000','SMS','STUDENT_ID'),(5,42,0,'2026-05-15 05:05:55.000000','SMS','STUDENT_ID'),(6,43,0,'2026-05-15 05:05:55.000000','SMS','STUDENT_ID'),(7,44,0,'2026-05-15 05:05:55.000000','SMS','STUDENT_ID'),(8,45,0,'2026-05-15 05:05:55.000000','SMS','STUDENT_ID'),(9,46,0,'2026-05-15 05:05:55.000000','SMS','STUDENT_ID'),(10,47,0,'2026-05-15 05:05:55.000000','SMS','STUDENT_ID'),(11,48,10,'2026-05-15 05:05:55.000000','NTH','STUDENT_ID'),(12,49,0,'2026-05-15 05:05:55.000000','NTH','STUDENT_ID'),(13,50,10,'2026-05-15 05:05:55.000000','STH','STUDENT_ID'),(14,51,0,'2026-05-15 05:05:55.000000','STH','STUDENT_ID'),(15,52,10,'2026-05-15 05:05:55.000000','EST','STUDENT_ID'),(16,53,0,'2026-05-15 05:05:55.000000','EST','STUDENT_ID'),(17,54,10,'2026-05-15 05:05:55.000000','WST','STUDENT_ID'),(18,55,0,'2026-05-15 05:05:55.000000','WST','STUDENT_ID'),(19,56,10,'2026-05-15 05:05:55.000000','CTR','STUDENT_ID'),(20,57,0,'2026-05-15 05:05:55.000000','CTR','STUDENT_ID'),(21,58,10,'2026-05-15 05:05:55.000000','SMS','STUDENT_ID'),(1,70,7,'2026-05-15 15:23:04.721406','SMS','TEACHER_ID'),(2,71,0,'2026-05-15 05:05:56.000000','SMS','TEACHER_ID'),(3,72,0,'2026-05-15 05:05:56.000000','SMS','TEACHER_ID'),(4,73,0,'2026-05-15 05:05:56.000000','SMS','TEACHER_ID'),(5,74,0,'2026-05-15 05:05:56.000000','SMS','TEACHER_ID'),(6,75,0,'2026-05-15 05:05:56.000000','SMS','TEACHER_ID'),(7,76,0,'2026-05-15 05:05:56.000000','SMS','TEACHER_ID'),(8,77,0,'2026-05-15 05:05:56.000000','SMS','TEACHER_ID'),(9,78,0,'2026-05-15 05:05:56.000000','SMS','TEACHER_ID'),(10,79,0,'2026-05-15 05:05:56.000000','SMS','TEACHER_ID'),(11,80,5,'2026-05-15 05:05:56.000000','NTH','TEACHER_ID'),(12,81,0,'2026-05-15 05:05:56.000000','NTH','TEACHER_ID'),(13,82,5,'2026-05-15 05:05:56.000000','STH','TEACHER_ID'),(14,83,0,'2026-05-15 05:05:56.000000','STH','TEACHER_ID'),(15,84,5,'2026-05-15 05:05:56.000000','EST','TEACHER_ID'),(16,85,0,'2026-05-15 05:05:56.000000','EST','TEACHER_ID'),(17,86,5,'2026-05-15 05:05:56.000000','WST','TEACHER_ID'),(18,87,0,'2026-05-15 05:05:56.000000','WST','TEACHER_ID'),(19,88,5,'2026-05-15 05:05:56.000000','CTR','TEACHER_ID'),(20,89,0,'2026-05-15 05:05:56.000000','CTR','TEACHER_ID'),(21,90,5,'2026-05-15 05:05:56.000000','SMS','TEACHER_ID');
/*!40000 ALTER TABLE `receipt_sequences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `expiry_date` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `revoked_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `token_family` varchar(255) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKo2mlirhldriil2y7krapq4frt` (`token_hash`),
  KEY `FK1lih5y2npsf8u5o3vhdb9y0os` (`user_id`),
  CONSTRAINT `FK1lih5y2npsf8u5o3vhdb9y0os` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES ('2026-05-08 17:06:28.379277',1,NULL,1,'103ac4b9-f903-40d2-a993-02ff9793bb69','ztRbK1I6bcN27gycsvbFQDz3bJAyVE9KEgefq-PPHcI'),('2026-05-09 10:10:23.872152',2,NULL,7,'cdfb5813-d720-476d-a348-1954a24cb464','pt4pqpZW5yiMwtSQNq0XKeDZOQY3gFU86D7LH34eC20'),('2026-05-09 10:25:55.018839',3,NULL,1,'3985397c-a47f-4329-b317-c1babf30f621','z9gIKcWgXa0GRQw9Deg3eSJlkBoNTM2djqU4itKqLMc'),('2026-05-09 10:58:10.287649',7,NULL,19,'1e67a863-ddbc-4ed5-8faa-ae70c1c45c43','Oj0hwkLbQcDazd-7nrBybo9RC7roi7_m1ISJjR_QVdU'),('2026-05-09 12:54:49.973827',8,NULL,19,'d17e6630-afff-4b88-96cf-2c7f0d77af71','QFuTfMRurhZ7AUsvTaCBfjMyVhlbaIX8CQ-cvRy92aE'),('2026-05-09 12:55:57.862718',9,NULL,7,'26c92340-249a-446c-ae9e-1a1c6afd9c05','M_5AfLJ970P-XDfBtZxIJwuLXmfnek62n9DezZAkjac'),('2026-05-09 16:10:40.363654',10,NULL,1,'4a9da409-8941-469c-bd5c-37d9ccb932c3','Ni94hqA3wkRRbgDyEqY095n09OaxjymZBImJlpP1Dg8'),('2026-05-09 16:11:43.908304',11,NULL,15,'b91ca659-fb13-4e24-b4fb-becdcb6e8aaa','njO2hPv4ky8XoyJZCuhFWfDWVloqxtmrS8ZU-Bjz2Pg'),('2026-05-10 15:18:03.404158',12,NULL,1,'53e7f8ed-0e70-4c5c-9134-74c291b4c541','1rFiY6CadZsuweXx2_pEf12qZDIVkNqxoyxahmQOe-k'),('2026-05-11 03:28:05.713836',13,NULL,1,'d9f2b718-37e9-4138-bd19-f9b9633984b1','z25oMIreC7y6Xn2o1UYVzlu2adNbYwDZGcZOupExdDw'),('2026-05-11 03:28:37.113660',14,NULL,1,'37da0dc8-edd0-4d56-8e3d-93b85cc88893','cE8PtcUWajxRDzylaTQDL3_8GP_K-rLPxIAAZqtwAWg'),('2026-05-11 03:40:42.182292',15,NULL,1,'00685a23-202f-425b-99b1-1f04d05ecf29','cwyHxcBeA45Q6sqV2RN3NQcJNvO4E7r_nSszX3fftMg'),('2026-05-11 03:41:27.833366',16,NULL,1,'87be4cb3-6990-48b0-ab20-a2011e1105c0','cFlJPaP5mE_Zse0XzvJn4mBMxZAsajaQ2E7xEbGVOyA'),('2026-05-11 03:42:58.654562',17,NULL,19,'fafa3437-5ca5-4c10-b798-d9aebe3b4574','H_jOwYCwVHECtlEMfIl4kPRn4E2ezVQuOO6Tb-cwYr8'),('2026-05-11 03:43:31.154606',18,NULL,1,'70bf6e57-e4c6-48d0-b745-8dd42908608e','Qq1RYyDhSBlKr8UHMySRn9TcFTL3kDeWKmTKW5Yl4w0'),('2026-05-11 03:47:29.558859',19,NULL,1,'1aed10a2-125f-4e10-8c29-334952f9f141','vgDaBH__2GIhdA2hJhI4hTFZV7eAGYkXrjonBN37Sxo'),('2026-05-11 04:02:51.552674',20,NULL,1,'6f136e5f-4188-402e-b5da-262db1e57cc7','QNu6ERKRd1efid5gPfu6ll6-DEeLSa5-rL5WgZ_kqhI'),('2026-05-11 04:07:13.338484',21,NULL,19,'b1a40cd9-c355-4766-9c59-8fa1583cea59','uwiXv71PoPaS5DcZfQgkTJQHcBQ-OjdjdB6VNKcfL7M'),('2026-05-11 04:07:41.023209',22,NULL,2,'b587ba71-dc8e-4ccf-ac98-f23e308744ae','4PiPNkTjq7YquqKbaqjIkf0yh9KWmMm_nwEPu_EffBI'),('2026-05-11 04:09:11.333852',23,NULL,2,'ae63993e-31b0-4506-8fc1-e46f06caa8c7','oUNGebY9-UC3tC9y_viR08ld5oJ-5S3iyBOKxQdItOA'),('2026-05-11 04:14:04.881788',24,NULL,2,'7ba53e4e-dfbd-447f-a6b9-bd2d16518e2e','nom3x2Z0JPd1MCAUebjfPL53a7UKqe1uf8ZomKokJo0'),('2026-05-11 04:15:20.579890',25,NULL,2,'f10db02e-b29b-4dee-81a0-926f13dd829b','qh4ydkXOj76FiKfbi1A0UqASjJTJjmz33xV8EXwiCeY'),('2026-05-11 04:15:37.592224',26,NULL,2,'db98d4f6-66f5-4683-92e2-73b789c4c61c','32xOTi3lC380VFbiXOpDh9s2zwuORm2_oxCgj02q7Yc'),('2026-05-11 04:15:53.627803',27,NULL,7,'13a61b5a-35bf-400c-96b0-7c5b97fa46c9','9pyb4SaEtqk8pp6fsFEcKQ2RsbauOKYPcBMj6-cMuAE'),('2026-05-11 04:25:03.514726',28,NULL,1,'12ba9edc-7296-4d9b-acfe-d7fc021b7439','I8-skT7IhTUVYRBzGnTNEzeetqSdW75yelVmXjv5UBw'),('2026-05-11 04:28:03.824067',29,NULL,19,'f750418a-e506-4563-9114-d27ccdc1e3de','rrGm7dPjBnGwBhU0xEnzJC0POreswKln44XKh2cpr7k'),('2026-05-11 04:28:25.830730',30,NULL,7,'a99ae5e0-9890-42b7-9a80-37c60ada852c','B1rf8BNXyV8nYhcpzG6FX5DnpKucMZxGV2N7b-OPjBk'),('2026-05-11 04:48:36.758702',31,NULL,1,'c27420d9-8d9d-4236-a957-fb80aa2ac131','iNpLwZ2oWDPXV5vuh2bb9ExFsPbi8PKEWTEWu-D0rAE'),('2026-05-11 04:51:23.659933',32,NULL,7,'e5ec7a4c-30f6-4708-acca-36c7c0a77c55','AuY9iEUlU95m2q0Z2vL4VlGVBxPEEG3Rfl9H0wGKOmg'),('2026-05-11 05:34:55.249905',33,NULL,19,'8fd506d4-6d22-4ff2-ac62-0b09cc535a69','BhDOvR4vJTDvyZH8AqSAiEPMkRSeVtbV-Sgs4rccud8'),('2026-05-11 05:37:55.587833',34,NULL,19,'200f68f7-6ca3-408c-9587-c7cd47503347','o02bWo-u3oFc8n2P4sQSsNv2DyziworHLfLyniFquLw'),('2026-05-11 05:38:53.401950',35,NULL,20,'7f2bb7b3-6a70-4b3e-8852-602bedfc94cf','k_2EKDlfFD6NCpGFeuaTnzLw_HMhLiGpLG4aXzhCpVQ'),('2026-05-11 05:55:46.533336',36,NULL,20,'b4c86396-13ed-43c5-95ea-259c6b7698a9','03mTvP0hSkF3cGL0SLUO_5yxItWZ-2n9eI0oDPsWhaQ'),('2026-05-11 05:57:03.993447',37,NULL,2,'071314fe-3619-4bf5-bbf2-2eed1c5e4f2b','L4Ma-ce-J7vyBYjn-RiNf-5iTWMQ7g4vLMRKi1u1Me8'),('2026-05-11 06:02:42.365638',38,NULL,1,'1cbb289c-c289-459f-9749-1b86701add8f','UwGO6bYBDuoKdLjY0oy0x_KLqZedSXYC0O-XMMSZEPw'),('2026-05-11 06:28:19.826682',39,NULL,1,'8a306a82-34af-4436-8629-dbdda66e1474','LwSojaqsgGeot9qhYSVnRD0bmlOu4ZbD4SlJpXW3bPA'),('2026-05-11 06:30:28.238274',40,NULL,19,'fcd871be-277e-481f-952e-75a53bc45fc4','S5wJ8aoZEEc5qQSfTkftWQiUVwdFnWTyojyA8aAcwEs'),('2026-05-11 06:38:31.542837',41,NULL,7,'935030be-bb12-47c9-ade4-447bcd60e140','bvvvlIAkjUCOzZbI7Q3ybPsGq1M4pcl_vRidw8c-o-Y'),('2026-05-11 06:41:30.619418',42,NULL,19,'e7b50c7f-3de3-4f3d-b733-64ad9bb65c18','HcdSN1VYh_mK-tOphiJLfxMXfclERIYBM2wFZUucjAE'),('2026-05-11 06:52:30.508783',43,NULL,19,'50902b86-bbe8-48c2-8f42-7ace6557bf38','hASOOPhDbbOUbAa5y23svYpqxlCGF1AcU8UsUWOnM4E'),('2026-05-11 12:46:34.504488',44,NULL,19,'08a4faab-ca84-43a0-b1f0-07dcbddfa419','li2SowjEcYNeFO2qvbB15x9auzIwBfvyDPXAkM1KHjc'),('2026-05-11 13:36:09.056056',45,NULL,19,'0d53576e-79ec-4d45-8f0c-88eeed3e6914','zE1hkXTrUrtekETlLFqZOrxajU51p-7Q3-4Lo0p6CD0'),('2026-05-11 13:37:29.365708',46,NULL,7,'dc6f2c28-d609-4370-be9b-91237053fa70','CJCuSdlTYuwxV98e6qb_l0UFYfv3wTfq-Axb3kH0Mfs'),('2026-05-11 13:48:10.445193',47,NULL,7,'98259e78-b13c-483a-9caf-4ff165327daf','6CJHCDPTNxlO2oarLdlA1i8bo5FFsQ7nurFRQ9Km3yg'),('2026-05-11 13:48:56.565989',48,NULL,7,'6bfe4d08-4050-47f9-8abb-1dafc5992b71','VNvJ1zfo23DrhFCUaizWEMwQ3CpwlosY5YodJv6QUFE'),('2026-05-11 13:52:56.457426',49,NULL,1,'c052a2aa-d6f0-4868-8df4-81c7d971a05a','6lTagoLqByuYt_rDRt6Y3djmWLDqEdHtyGS08uMlZrc'),('2026-05-11 13:54:02.525768',50,NULL,7,'94d5d691-3684-4767-9406-b1b2312ad64b','DjrLvcVWsQOPKcX505TVz-FamG2BXeDtBNku7LwgchU'),('2026-05-11 13:54:32.135923',51,NULL,1,'ba6318e0-75a8-4a7a-97e3-f32e126310cc','UL24lGMC42ngE5eLOGzowxP94Z3zOYRWKPr6Xh_zn5Y'),('2026-05-12 08:39:26.914267',52,NULL,1,'64d98da9-7410-445f-86de-14635aee5be0','_A0ivn4g499iT4971JSwT-jvuqMefsob-8S5OeGWvN8'),('2026-05-12 08:54:05.340759',53,NULL,1,'ae78024e-10e0-481a-a25d-740a25f48bd6','JTMsLQNh-6664a7_I6BBv1Y-Pay2nO-s2hQGe0q-KjQ'),('2026-05-12 09:10:11.527521',54,NULL,7,'57ad7b31-10bc-498d-9b4c-eca92f21b829','We_BgUny7IxZ3uKUW7uyW0p6ZGGuqrHRwkcnB0pZOBU'),('2026-05-12 09:10:48.333983',55,NULL,2,'2c52e29d-e7cc-433d-9815-cef2ca77ec32','GxPSXx6sCndlLfXMa5jNATNM5YlENmZZShzsDcVJ-Ow'),('2026-05-12 09:11:44.613056',56,NULL,1,'24d7173f-40ab-49eb-99af-3af05510a1ca','bqTx6mTfPJvvuZd0wrqescubWghC27tGNGHYl_W1emo'),('2026-05-12 10:12:17.893800',57,NULL,1,'0c71d309-e642-4818-bee5-719688a6e860','evmrhWgVeiuZlEW5GOUrxpZON_KnOHqVL_ikLiczMsE'),('2026-05-12 10:12:47.086460',58,NULL,1,'b1351837-26de-4cf4-b882-47550c47b1c3','QEBpPO5-u26rb7XrNtkeP-ke78VCaoUQfaLQlW6l5T8'),('2026-05-12 10:12:59.095101',59,NULL,1,'59faff10-5b85-42e7-bcf4-5bc6ad178c0c','c9aQxRRxeeUK2f-MtmWiMYPV65LbLn9NODdj6m-5sT8'),('2026-05-12 10:14:06.318319',60,NULL,1,'1e256e5c-40c5-4dfa-a27e-885d961c22c8','FF16U9_JErBNH5u_i_1cI5Wj2jzEcTzwdqiL_edOzug'),('2026-05-12 10:14:06.524335',61,NULL,20,'c479ecd8-ed9c-4d1f-b2cb-c2a28fa2cb33','1At8u-DKyGkW6uxaUkQXRLkzSlqSWhq1bCx3WfScn_I'),('2026-05-12 10:40:22.472858',62,NULL,1,'ec624da9-4e55-40c3-aba5-f4045a91d39a','NgVZWycucWG4O5jYSAOaN20Xw_KlyQUrAp9ZOQpPaHA'),('2026-05-12 10:41:05.865400',63,NULL,11,'aa573305-271e-4d31-aca5-b0cee9654c7e','PVkCYgpcCzaXikELh5__RzFmVbUchLL8brMGDkpbFnA'),('2026-05-12 10:43:12.711575',64,NULL,2,'b161ce64-3140-42ec-ad60-34418849ba6c','fkDkB849tL2d2nCq407ZnmqjtKCvKj_mXOirEgaf9GA'),('2026-05-12 10:49:55.245136',65,NULL,1,'1b28aefb-2c76-4e65-9dec-2f253120a1a0','zFGikeE44ZBgs5g-dXc9gunoXBKvMM8ZRw68ndHZIw8'),('2026-05-12 11:33:59.865756',66,NULL,1,'0b1da7b7-ce4e-42c6-995e-71449fc605f4','4sSkdQuA7s81KPZ3eo3NwRhAiZkWODjxcUPInjMwWJU'),('2026-05-12 11:34:34.708909',67,NULL,7,'9396487d-5167-4710-96cc-156133baa02f','M913G-zIq-4DpSK_MeSomAd1xPFsmtbbHbC59-DNRiw'),('2026-05-12 11:35:50.277439',68,NULL,2,'5160686e-9046-4df9-bb12-ad3e162e586c','RK0hBn47EemMj1djaUtV1gfVUL0JNCHeNPfPnHzLziQ'),('2026-05-12 15:10:15.323621',69,NULL,1,'f1f81c4b-2be7-4d94-b911-bb294f91d38e','ggQvk82xqBWDMfTqfd9DDLkddXhnI-Rv5dodcfRIv3M'),('2026-05-12 15:10:32.839048',70,NULL,7,'be55798a-0e08-4faf-b1a5-77f20415d4af','WLraxqu7dhGETsdOYD3OW9WBZY-N8KQuHaPHTzj1-TM'),('2026-05-12 15:14:33.634378',71,NULL,1,'50e23eb7-b113-40b6-8c57-4f55e32844bf','UA1R_cyn3_5u2MaVlyJhEndV_lNlb3GUooqMEicoc-8'),('2026-05-12 15:32:04.710099',72,NULL,1,'4e3ec50c-0f95-4b95-9153-da0f5d344a4e','ppKGaJud6SFP_-ww4Se9IOoFN3-9PcOmkNsxv7rNGCk'),('2026-05-12 15:40:30.298408',73,NULL,1,'8e8e8e85-336b-4a4e-b78e-ffefb558d864','h12r7cW05v4v4oECxyySzjkhUvIytEjNCki6ihn3QeM'),('2026-05-12 15:55:45.611664',74,NULL,1,'48ac4136-2b81-4628-98dd-849b4fab3094','vfLpF8j8CTlA8TCmg0U2cM3JGZl-1ar4YAoe6IMqgt8'),('2026-05-12 15:59:34.710307',75,NULL,1,'d5c695f3-6ee1-4dca-b82d-04568a3a19a1','eyruMldoEW2qynyJTZS-ID1S7Vz6va_lEdqYiCQ7D60'),('2026-05-14 03:34:50.559564',76,NULL,1,'3bdb1ad7-7332-495a-ac22-ea3a448479bb','qiIwQG3lGGtYvK05n8jRffEQmfGVLTAQAFbn8EhoRq8'),('2026-05-14 03:37:16.283898',77,NULL,1,'af278f65-bdc5-49fd-b48a-70a50e731077','lMadIGBBDUZZhhJ8OjYKoLB5lMqpXzOTxWZSQKHELk0'),('2026-05-14 03:38:43.234978',78,NULL,1,'351a3116-accd-476c-9cbd-af187cbed0cb','Dunhd7IAbwvWUKh3xy2Xa5WwfUODjv6ciIKj_pqdOsw'),('2026-05-14 03:45:07.370058',79,NULL,7,'0b54f324-3cac-4588-bba5-3c212879f4c0','tcoVUqmTQX4YHfR2DvK-1UX_qLSm-jIGTK7qjiiEoD0'),('2026-05-14 03:53:41.192730',80,NULL,7,'f87c09c7-d28c-43a0-ae82-6083bceb34cc','ETGMc0I3CF2JERzpCg8VkXXyvRy2XrzRZ4DAq7Tk1sA'),('2026-05-14 03:56:37.385326',81,NULL,7,'5154a034-eadc-438b-b528-e4b7fe4e76c1','qGI3oKgyaqxY_8rzg8MXfFROASWQAA4OJM8U5Ilyv20'),('2026-05-14 03:56:44.830377',82,NULL,1,'bb808b10-05a1-4221-824e-f830fc61effb','_289Lfh5wAhcIgUeUvKec29K-R7gjwD6GWsANOMv1IY'),('2026-05-14 03:57:36.973168',83,NULL,2,'8a637bf7-2211-42e4-9764-b8eafd3a1129','hagICEfx9ntMd7HuoNFm2sYR39R7oBQUICCFI4j1kic'),('2026-05-14 08:14:42.378133',84,NULL,1,'e2174ec9-6ee0-4efa-b4d9-1151601110b7','Ljrh5ndnSQNinDCWMh4V30qf5tg8z_aPVMxlntHPJ3M'),('2026-05-14 08:15:17.060728',85,NULL,7,'5eca2916-67e3-4e48-b2ef-f156945ed500','I5OCpTZYrQf1RQuYMLat9LqTc76x1qsn1BBzeJyVrfg'),('2026-05-14 08:16:05.878574',86,NULL,2,'7ed03234-2e70-4fab-be1c-bb5022a4cbc6','GytCXu4DHcEmCnTQPTpj8RTNemFKTM2HNUx7_oIDdmE'),('2026-05-14 08:17:55.221617',87,NULL,19,'20d98fd4-fd70-47fd-a605-0113c511ab9c','Nd6vHHVpZwft5w5q8km8LF8lZxsJtJnEw0zmrKXww_A'),('2026-05-14 08:19:18.366120',88,NULL,1,'1d922c5e-3bdd-46a7-8662-03fbf462da7a','Z1zz6pGrsLAMnnljJJZttFSVOJGNObbiSC09ANAYyvc'),('2026-05-14 08:48:57.365549',89,NULL,1,'49df48d3-5677-4032-aaf7-5b1161a22ca6','peGtruNKeLHJjWtxDnaSJc8b6ZioiDoTjqVu2uvbeqQ'),('2026-05-14 08:50:31.644825',90,NULL,1,'c5ffffe3-4074-4e45-bc2e-f4d3c30dc4d9','Na3BCSJPNVY-RULLn2tPSO0dihRj31GdyajlGA4gYRQ'),('2026-05-14 08:50:33.263221',91,NULL,86,'dede26b9-7e1a-418b-9169-8450f1467aca','Gvio0iNmLuPvGSFeiiPOrmKoUjeOasm2EEbOXHATVjA'),('2026-05-14 08:50:33.561313',92,NULL,19,'6d9e241b-a4bd-447b-ae0e-0a476d484cd0','o-knOnsTuYEkKwspvgbT3rsCpA4p3Ic6n4r9_Y4_rrA'),('2026-05-14 08:50:49.745950',93,NULL,1,'36f1342b-5529-4d46-baf6-2deaf80c9dfb','IlWDZYXn1Dm8C-bxS_46niH-WXMC76qFfuARETNTzt4'),('2026-05-14 09:33:29.339447',94,NULL,1,'00af4e08-0f69-4f2a-a9ef-b34f827783a0','33Kz2Q0n2PAtN61t_V4rf3d-pYI-6_KL8t_nJZD2c8A'),('2026-05-14 09:34:12.920796',95,NULL,7,'afc038ea-2768-4e6e-85fe-e483f66cba8e','JbDhmYsjGKw0wwAg629pDZFaNvEC4iF5DDSztEmOOlw'),('2026-05-14 09:34:52.661269',96,NULL,2,'3a591299-1b87-4248-b0f0-ebc73cd1314f','p0OqjyItTrh5H9C8hvgwYiRVeNIcHwXXhAbWb5VlBkc'),('2026-05-14 09:35:23.893739',97,NULL,1,'a70aa0fb-e93e-4a15-9fcb-6765b858f490','z3eqIn1hEX_7B9k7QM9OrQ7jDV222CfAiErCgyA4onc'),('2026-05-14 09:53:45.640828',98,NULL,20,'7da14136-292e-48eb-bff1-a902bae98f05','nnLCYMjL7xnBXTKvT2CGEKQFSbbCB9PYvDgKuuK3THw'),('2026-05-14 09:54:55.025328',99,NULL,7,'9620911d-2e94-4f97-adbd-a4b346c055eb','9RTI8ZHmqzxF180fH2fQ8eTpF214EDq9gqjQrySNiT8'),('2026-05-14 12:36:16.331994',100,NULL,1,'ec3fd24b-c5de-45bc-8525-5ce6d076200f','F-ieoz8W22lTMRdJpufo8_AR5FEFI3wp3dQwD9uO3Mk'),('2026-05-14 12:40:03.609594',101,NULL,1,'18cfb586-f689-4955-9e24-814bd92b3030','KPmAZXY3TaK8FH-KXv0OcGVoHquGUXeLGtHsheHxw8I'),('2026-05-14 12:48:39.178903',102,NULL,7,'2e200634-a652-4082-8b0f-fe87f76d8401','czI6yyXVnGZLOdqKwZBqTnvaEm0PZ_zFmPpVBiQZ-8k'),('2026-05-14 13:00:05.612644',103,NULL,1,'4a2c373b-9b6f-4bfd-b86f-2f1a53b8ac5b','ffZD1xXN8IgnYLtWgDpERFLOhVuY130Vu380M2pFgxk'),('2026-05-14 13:09:44.933909',104,NULL,1,'be71bfe9-c9ac-4f3b-9f91-9cb0effd963a','EdZbXIkXA79DvHucTxYWUnopFNb8skAU_nt7oLpEsR0'),('2026-05-14 13:40:46.231915',105,NULL,7,'18db4a42-c0b1-451c-9eec-de41c21a0efe','YZupFO8-4GTRRjxUIU_vPCuz1_pWJNTKrLOHYs0O2P0'),('2026-05-14 14:05:34.038594',106,NULL,1,'eff8aca5-3e88-4f9a-a795-32739c926d7a','9cg1MLTN8FeSwrRKeheYurWX3qFvvs4veEvTiQMP8GE'),('2026-05-14 14:05:47.493908',107,NULL,7,'73cf6ba5-03ed-4837-b620-f45da23069d3','8BkFB6ZnEWAPjcu2f9A8YgmWCAElcJd-iPM6Wublm6o'),('2026-05-14 14:57:11.337303',108,NULL,1,'e78e47a3-8b2c-41c9-b902-7a05d806c5f4','YUulfVavQB06Hf7ft9VjxHFA5t_KiJVNfSihWa0bUa8'),('2026-05-14 15:15:04.159820',109,NULL,1,'2ff29f9e-0ac8-4e29-9d25-347888105ede','-H-SkNy6-CFNIlmqEOnSyvtVCyghmgTxvWpCEqp8ApI'),('2026-05-14 15:24:53.982560',110,NULL,1,'50b587f9-1122-4968-99c4-7efdb0746608','EvDc7wbGjIByIXMMX7hezaxWBHbwL2SVOLqMCE-Nono'),('2026-05-14 15:50:49.939425',111,NULL,1,'47ae1b47-7433-46eb-b7e7-b9dbfd984caf','G_AeEYNTbKOL-_t2L92V5XXcCAJjJQzok4rGuvVE6Rs'),('2026-05-14 16:25:37.565350',112,NULL,1,'30e1d0a8-6472-4979-a5a5-47983516603d','dXzpahlF-MJE9gbydUmmHhFdtbubTf9j1SDjHZ9EufQ'),('2026-05-14 16:26:41.130787',113,NULL,1,'7aa73777-0a62-4986-92fd-7181929007ab','Ar9rz1i1b_PYo78Y4y5R8JTbcaPltoCYYcjkKzVJK1g'),('2026-05-15 01:56:07.192838',114,NULL,1,'11c23d7f-5faf-4145-b728-4d53300ac49e','scbQYgW_gfNSsu3uWDt1bkuD5BhK_PECzt6pPU5rfHc'),('2026-05-15 03:06:28.446720',115,NULL,1,'65616b01-30af-448e-9c84-6f90215f051a','0H3TxP20MxZYeY8GjrzRTLzvCB-Alq107ZbDISAidY4'),('2026-05-15 03:06:45.408454',116,NULL,1,'08f2592a-bcf9-4967-acea-3e7fa36f29a8','vU3KQesTBwmMP6ETeav__sI-2Pj0VTDphe02_-v7OEs'),('2026-05-15 03:08:24.663950',117,NULL,1,'085092bc-6d9d-4996-a305-4df0bb953974','-9dhhM7fVNpEinLhD1jl-NTyBNC1Imi5n2X_MigYRtM'),('2026-05-16 15:19:04.964555',118,NULL,1,'bb19683c-348c-49d4-862f-ebd4fc289ded','sv9KGw0bdVwyzT7tvfOFZ62dnbOBPrAh0FDRvJ6M3GI'),('2026-05-16 16:18:13.106905',119,NULL,1,'a6cb4ec2-3dd0-44c5-a741-524fd26d331b','jD-BnxQgSV3kutoJ0n43-cV_LYho3a4E3GeopZngygA'),('2026-05-17 03:07:20.763033',120,NULL,1,'46220a78-5530-4b02-96ba-8759874b9c91','2fsAqw6pTVLZfQQ61xYE0Z7YmqU9sUEA3ENuen6w8pM'),('2026-05-17 04:17:16.104220',121,NULL,1,'2174e2f9-ed83-46e1-86e7-ea2a31e439c8','bXU2RA5LlIuz_5d8R98BLrP-ESSIIokVLaiAkxeM1JE'),('2026-05-17 04:30:17.872180',122,NULL,1,'780ae247-e005-4850-8382-0d9756583f3a','d3Q4V_IKnxYxL9aJWltKzvCIoWDqyMlc6TFNSXG1Sy0'),('2026-05-17 05:51:47.559680',123,NULL,1,'b55be7e4-bcef-4cde-8939-1473737bad69','eJHioNHx_TCjRyg2D4SzvyYMf_CZySVcEi9yJ6IP404'),('2026-05-17 06:49:52.446810',124,NULL,1,'7ed12947-7892-4345-84bb-fa20053d6b6a','yHpbwjWX_nE2ZKaDxAy8l80zRrjZYtiGLWbr3WVU7Fk'),('2026-05-17 06:57:45.142949',125,'2026-05-10 07:51:16.199385',1,'83229bdd-f106-488b-a21a-badb62c3025a','rQwvdlUchBTkxwOHMORcqWhqo_KGx-AmksJ6jj6vHTY'),('2026-05-17 07:51:23.433373',126,'2026-05-10 07:53:40.795791',1,'0a108aae-83c3-4617-8e44-cfc93d91a7a1','QHaixGqATu6sSrLcxmmp7HWBTxRS-97a_zCLHL1sAiM'),('2026-05-17 07:53:46.773327',127,NULL,7,'c3a12acd-bcbb-4722-8c64-66f86a9a5729','umxRRqnEI-mlIsm-pYdULspEUWXZMBGOIB4B1JsQtUU'),('2026-05-17 07:54:10.906858',128,NULL,2,'2eb4306d-8490-4d55-ae0f-68fee882f479','zCuaT0_xa8f2FJoZemb557WHRK8FhQuLa8DRHbysvgw'),('2026-05-17 08:28:33.209833',129,NULL,1,'b23fe715-2264-412c-b808-4e794eefbf57','TeWt1Fl6XT0jttiSS4Yz9hTw79kqo_rGx0MO9Z95jRM'),('2026-05-17 08:32:35.366888',130,NULL,11,'db90cbf3-ecd0-4b45-8919-1b0b6895aeb6','AIb-MjAoAsn0SJ9btLCzSkaHYny09NloYIKlwQ7BHME'),('2026-05-17 08:38:30.997750',131,'2026-05-10 08:56:25.129665',19,'d75709b6-6fd5-458f-8af3-a8361b9e93d4','14yffpkIBsqp6x4d0cNeffXqSgZIMu5VNPApgujim6I'),('2026-05-17 08:56:25.134727',132,NULL,19,'d75709b6-6fd5-458f-8af3-a8361b9e93d4','5qN7sIFwupNdVb_QA0Y84cMiv1qilickSJ38CaVfclA'),('2026-05-17 08:56:44.628390',133,NULL,1,'356ba4f9-a4a6-41f2-b08e-8352b6060ab9','9NPYKjOGP8I7Ok6XewRPJAMLym70Jzeixrik5q3-OTY'),('2026-05-17 09:13:53.595223',134,NULL,1,'ee1a82f5-13e5-4748-8b91-742192a49da4','1cSWRcSutU0UILsJEUIG_NEEBVqNCmP5phsEHC0lshE'),('2026-05-17 10:00:19.813727',135,NULL,7,'184cbab2-21d5-4c02-8a42-5f270dd41939','zrTAQvRr2eKuUys2iSI6CwfkFXsD3SHambiPpbolmVQ'),('2026-05-17 11:12:38.173876',136,NULL,19,'fed4adbe-0cb7-4147-b185-9e028d673359','3dOv8NdDhxRyg69CgqSPtnpYuL_A9-QxNpmRyR3ksxY'),('2026-05-17 13:55:44.468593',137,NULL,19,'287bf8c4-0b97-455b-807c-5429ee0dc01c','YITGrzFzP8T7g4iEoc67u0TrjBOjp4GjGVSlHBoRK50'),('2026-05-17 14:03:09.404835',138,NULL,19,'2b44041c-7b5e-4ebf-99ec-59547d681e4d','SHpec32aRMwuk8OpduWd_v6-vXhYRmm5pux_HzYr3fM'),('2026-05-17 14:06:45.388161',139,NULL,19,'cdeb16e1-41f1-49fc-b259-614ab2eeecd6','szIZOb2nuzF-6ZxKdka3oqjlNGmgPdKixj6dfvj2ADY'),('2026-05-17 14:13:07.229838',140,NULL,19,'134f4351-72de-42af-9e12-74e9575a43ba','TZ3RJb96fbrtQBgcxB0qMP_uHpmdlW531iP43tvw6q8'),('2026-05-17 14:14:37.832861',141,NULL,19,'7657e776-8b99-4ab5-a10d-6b3896aac1db','YmogbncKJEhGvToIbYSOuGjgrQDmVrHtYBetyyIDj9E'),('2026-05-17 14:23:36.610121',142,NULL,19,'81ef0163-1e92-4c27-9edf-8f842203d8b1','tzhblRm6al1AvqCGiRK09oXgTl3ILaIjvNpupLrdkD8'),('2026-05-17 14:23:45.506219',143,NULL,19,'609bc75a-3e6e-4e46-90d5-026aedbf5b5d','3rfy-Ubl_bEllvPMYiTW5CeI4e3znsy32PY19GnY0a8'),('2026-05-17 14:36:47.143150',144,NULL,1,'2b5c2618-e559-4dc7-bbd6-91a856292622','xn7HFxlZ2GvQEbvFr5O2HdFL9s6AGLOfK9HpFOF10pY'),('2026-05-17 14:37:20.545551',145,NULL,19,'89c438b1-295c-441d-8c2a-51183188a82e','gup_SVkpT7Er2jxoTvxXgc-5ucpVndGM8Q89qEzL_AE'),('2026-05-17 16:08:14.005632',146,'2026-05-10 16:16:44.446318',19,'5d02146e-3113-49b0-9a3e-b2a46c2ce976','pGfrrrpDWD7qzcEBj0ifnBnmQmS6iX0eewZ_SWnYlP8'),('2026-05-17 16:17:10.614898',147,'2026-05-10 16:29:16.004275',19,'680674f4-d8c9-4d20-aaad-4b066e6e0f9c','U88zR02FAlhN1A4tAqTxHh3COz39Rv3PdDb1NL9bYP4'),('2026-05-17 16:29:16.017343',148,'2026-05-10 16:29:43.561106',19,'680674f4-d8c9-4d20-aaad-4b066e6e0f9c','qrHl3SurvO0S3BCB90wDyJXoWvth_jbWCfh4j394kzw'),('2026-05-17 16:29:43.561106',149,NULL,19,'680674f4-d8c9-4d20-aaad-4b066e6e0f9c','C0dPn5hgxcFmsVrOZEP1gdcuWMDV_-XnE3qdYjVZyIA'),('2026-05-17 16:29:59.892722',150,'2026-05-16 12:36:55.247256',19,'244355ee-1ccc-48c9-b33d-ed54ad101c69','vVD0uNpwW-4dB1uExmmtxIlcGpJVcE1iwDoVIcrNoHM'),('2026-05-19 11:31:40.376734',151,NULL,19,'c8580b2a-f294-43bd-aac7-f3edb43e40a0','vM327Ac_CZ0Ht_OaX-1KTLF3CSGOycW7lsscPzADtI4'),('2026-05-19 12:18:51.002300',152,NULL,19,'e4696be5-1507-480b-aaca-8632e96c1365','iAI5E0pAp9owmS6Cq7H3gkqMwTGpQZ4oIswVkDq3WEc'),('2026-05-19 12:55:40.231176',153,NULL,19,'39be31fd-4208-41a5-b5ca-22055423ec14','NsKltHntqHS80kKSnxPb1JvWEvjSeEGi3AlV3uP5eN8'),('2026-05-19 16:16:14.907847',154,NULL,19,'9fc1b16d-f68e-4472-9e68-d87f3f876320','bnHEhmEtizinfMUsXf3nT6i3Gx-S03l_lky-nllcWCU'),('2026-05-20 16:02:40.366041',155,'2026-05-13 17:36:56.432324',19,'80c916a8-b7c3-4d9e-b013-63ab2fda75fd','fUiPheo8A4eU4dycLzGzcF4-gWgMmQ71V-HhU9_ME9c'),('2026-05-20 17:37:05.724201',156,NULL,1,'d884e702-4227-40d6-8a7a-d8db7c7a0c0b','Nm1lMSNxpIT0LWvRay2KqS835XvpDYYmRdM-iRlQMDw'),('2026-05-20 17:43:55.036989',157,NULL,1,'6c008b9a-51f6-4253-86a1-3880e64a64c5','-bDpoYYSMQBKUcKmq9XubXXuTmvcMl9GGwa2MOqu9Zw'),('2026-05-20 19:02:27.779768',158,NULL,2,'1f0d9efa-17a2-499b-b310-0d7baebb733f','HN0kZUjU4MsOArflS9Hd83LalZgorA0zVxmnMTM8aNQ'),('2026-05-21 04:29:31.575926',159,NULL,2,'9285c7f3-1370-4683-9e8f-41e8560ba0d4','Pze5Hn7w7n1S8pPbuYFyTk6v-v6RBSu8r7u69wwGP04'),('2026-05-21 05:30:32.015157',160,NULL,2,'aef9cd31-87eb-44cf-93ef-027bd4fcd010','0S2cBXFlaZJWhUWVt3gprYbUEVUXr9IgA_1ldcX7uWM'),('2026-05-21 15:00:20.132946',161,NULL,1,'bd5cac00-4240-45a9-accc-3c9e9600020f','q5hBmo0tcdxkPtInmHhUfv09KJKCedpFPTyXEHay3p8'),('2026-05-21 15:10:06.569604',162,'2026-05-14 15:39:10.529147',1,'da3bfddd-f579-4cf9-9f49-9f6a2004544c','09NSJSqRGPOAq7K04Jwy9RhCzGutfdpcQDgMtH_baAg'),('2026-05-21 15:39:21.028987',163,'2026-05-14 15:48:55.880464',1,'f8824fda-6644-4302-a211-6e39ee63dae4','bRIKWuwy11TfGd7tV_qLv1g7fpJ3U7D2o1CvcIkb28U'),('2026-05-21 15:49:05.252108',164,NULL,1,'e8c16ee1-f77c-4111-b67a-a71e5a9c0663','b4nRL0U9GL8vJRfUJazA1Epj7sWmW-grvfDya7VJfo4'),('2026-05-21 15:56:36.587475',165,NULL,1,'fe9248c9-c03f-4831-aa68-919639ff44a0','bawa0Q44SFYIVBscHd7U9-Kch59CZsvSnmYXKxIIWZU'),('2026-05-21 16:42:31.828346',166,NULL,1,'d57138a7-4eb4-4d32-b83b-13423dc124c4','kmDTuYxUoJZRgfIU4C4g3A0sdZyk9LUMWTOjvr7WQa4'),('2026-05-21 23:15:09.422461',167,NULL,1,'6d46a56e-e921-4123-8240-99bc914a5d64','qeREr1lvJmvUJaCOK7DPlcElIeuIvn4gMbIJjEituHU'),('2026-05-22 14:37:03.474002',168,NULL,1,'969f4e2b-f1b4-4fc8-9ddd-b82d5a0caab5','W5GN2lveKbFNPQflJJddSQSKcZMD5KfzJSJePYzHGYQ'),('2026-05-23 02:58:21.964366',169,NULL,1,'2b6249ab-70bd-4feb-aa91-5c69a083c447','sUfeLrzrnXkBhGtHTNVMVl2HqMcjy0CG2_iFlypDEdw'),('2026-05-23 03:59:01.659184',170,NULL,1,'178a7f7e-e57a-4894-a458-c259f15390c3','WOwQnWitzzEl8kQL0FKbqEr09xqX5CNXoj9DyJ2tjD8'),('2026-05-23 10:47:43.482546',171,NULL,1,'74afb909-bd8a-47de-b37f-87e8e9cd40a2','xYeCei3R0KyV3YPn9H0ksD_ba-wqMVwHFjpK1dG8JxY'),('2026-05-23 12:36:55.287315',172,'2026-05-16 12:54:09.430216',19,'244355ee-1ccc-48c9-b33d-ed54ad101c69','e1w6xMobKD8zINowwP-ag0vRAKrGA6IBXS8YNQvFiNM'),('2026-05-23 12:54:09.458897',173,'2026-05-16 12:54:25.963849',19,'244355ee-1ccc-48c9-b33d-ed54ad101c69','TvLAHyD3ddcAw-Gwu82EeUnoEzR6Gwo9kbmo9dzC1gU'),('2026-05-23 12:54:25.963849',174,'2026-05-16 13:16:09.634416',19,'244355ee-1ccc-48c9-b33d-ed54ad101c69','LALAVtUycuU4OFEuB-IF_L8ApLNg38Azc2eVISuAj_g'),('2026-05-23 13:16:09.640712',175,'2026-05-16 13:17:10.444488',19,'244355ee-1ccc-48c9-b33d-ed54ad101c69','SNwLj2Hr1hGj_V-4lCKdbhmbC4gR3-0CmvzCltr_t9k'),('2026-05-23 13:17:10.446561',176,NULL,19,'244355ee-1ccc-48c9-b33d-ed54ad101c69','stG2HnyjC77EqGuMxBYfJbwYy1mRaSHSiX0VRtUkq-Y'),('2026-05-23 13:18:06.900149',177,NULL,1,'6ddfb752-640b-4807-ac88-c3892f4a3788','V8qC9MhOrzj4wI_ug5xjcff9ejxDvY236Z-gqq5cuDE'),('2026-05-23 13:30:47.854225',178,NULL,1,'e1384a20-f710-4de2-b766-69c104c596d1','zFE7VhkhpMfUE1NonZiwdGuN0-KacrJo8l3cebvStqY'),('2026-05-23 13:45:21.836780',180,'2026-05-16 13:45:56.267649',1,'13372d24-d677-4e54-916c-07df9f93f9bb','K4XoamSpn_mXmHXN18SsSy8T1-XdYyt9IGyE371MO1g'),('2026-05-23 13:46:04.555976',181,'2026-05-16 13:49:07.525485',91,'01a22b2b-78d5-4e7a-baef-2cc7e302f538','kkFJAo1KCURO2XBoAdpt0Zmo7qXJk0ASkyXQTUdVbIg'),('2026-05-23 13:49:15.018226',182,'2026-05-16 13:50:25.933640',1,'8e3f2dfa-91f7-4a24-af15-5b6427737e3f','rAmoUlMtTGzFcnDL5ymvBXeWGGHVo7Na6HXgvNJlOI4'),('2026-05-23 13:50:34.609074',183,NULL,91,'f0b79cd1-33e7-4dcc-a9e5-c405986b9079','Hwt2lbLLvTcoK7Ge7sLR0laKQ0Ed9jzU5MH8MtmtU6Q'),('2026-05-23 14:04:17.394217',184,'2026-05-16 14:04:50.545822',1,'9074afa8-fad8-4015-a603-68202e03298c','_tYkfAvBEJY5Td6aHJN3MhxTlHgx9dTXSbFViSF0YZk'),('2026-05-23 14:05:02.547948',185,'2026-05-16 14:07:13.338617',19,'bedf7db0-1752-41a2-ab1b-a8e91d99d138','dQ8TnvOegYsP8GCDnQV1-TK4BKHD1gGPgUEC2xaQq7c'),('2026-05-23 14:07:29.686476',186,'2026-05-16 14:10:38.113405',1,'bc8ead91-b03a-46bc-9701-3003cfe8642c','178emoRIwOskDIDMf9vkt2Y45oMvu2B1Gih5h3FQXUU'),('2026-05-23 14:10:45.180101',187,'2026-05-16 14:11:30.897319',2,'2c926153-96b9-4a56-9b37-9a2114947ada','myB_3VscNgyQYWv7Xtf_zzZhIvKGHWGLXKbLeuWSdJE'),('2026-05-23 14:11:37.198988',188,NULL,3,'f0db7ece-e20e-4c12-ad73-0ac37135955e','BbFiBkBj8hKRq3XiUjNS5i4LRN0jdBtT-240Lj_CwIU'),('2026-05-23 14:16:31.456773',189,'2026-05-16 14:20:08.719566',1,'b96407f1-2a49-4241-aaf3-e908d7027edd','R6ZHdcVBW_oOZd8E-0qk-o8OmUwyFUC49sxZa9UClEk'),('2026-05-23 14:20:08.964618',190,NULL,19,'c2821de2-d394-4968-a2a7-e1fabf944f78','a-w5jyXhobxGVW6iFG7FLcVfUrWSciymVVlBgm8qbWg'),('2026-05-23 14:20:22.943709',191,'2026-05-16 15:38:30.516218',19,'e580f3ed-0e13-457f-8f29-b141e5c45802','OAyQCEST2353PC8bq7eTMr7WOLlaXoJIN1Vrx0ZJUnc'),('2026-05-23 15:28:39.616333',192,NULL,2,'1d65db15-4ff6-4d95-9df1-8ceb6a3822e7','TI-_8S8o-DWlZePwQcLkIwrrVw4YCKdHz91aaOaUugo'),('2026-05-24 16:11:29.943573',193,NULL,1,'60f88119-46b5-44ac-ba16-79e0e4f6354f','Jmvr1lYVe_VcvVJuepoFfdPbUF6NvYwDR8Mvu2_WF_0'),('2026-05-28 03:22:42.697277',194,NULL,1,'1fde6de9-8333-42cc-a0a8-ece61d87871f','Iq41GR4DP3JUN5gNBk1leTSkHws-3LiJw4fUZ0ljBQA'),('2026-05-28 03:29:28.482260',195,NULL,1,'a44d52f3-f2ab-4bca-b418-82569f203f27','AZDI-7Yo1oohNXaoN31Yl3LTlKLwugepVPgiN-WdXkk'),('2026-05-28 03:29:46.232262',196,NULL,1,'c0626bdc-8037-4b8d-9300-566e3ed3c788','fWUPuDfBYOjNSOoVdJzuT3DT9UbM7PIbDlxVJc9z_UI'),('2026-05-28 03:30:15.519077',197,NULL,1,'511228c6-a2de-497a-8d54-3f094b27dd26','RVgx5ybVACVqnZ3wrevBXLpAB4XgC9KJFJBnb0qpLl0'),('2026-05-28 03:36:37.219498',198,NULL,1,'3b970eb3-5ff6-415c-8da1-b73c8c82117f','tVvhjnwnEUUWwk3UjKe4vt-R20oj4TwUJZZnJs2FL7g'),('2026-05-28 03:42:32.613523',199,NULL,1,'af5dd1f7-f754-43e3-afb3-63a471aaed79','M4H2eGB8UHQnFImUzzr5i7qrZNzSInqDkG90RCmGjt0'),('2026-05-28 03:44:04.562788',200,NULL,1,'2115b340-fd90-47b5-97c5-cb29ced0dd31','6t_POk9RlgufdOCLkeDa0P6b-1Xlo5IKeX9PP-1vFUc'),('2026-05-28 03:46:12.760103',201,NULL,1,'3ee93bcc-c364-469b-9947-29e63bfcbdb5','a_0xZIMJeeOCYdbv63hhXYqrABpUqNv0_XJ5VYiMIfs'),('2026-05-28 03:53:08.358584',202,NULL,1,'be76d7a4-d791-496c-94f2-2137660c37b2','6qWAloEyIGvRgRqCfZqINbL6mCSQIbSpZ-D1gWp2iLM'),('2026-05-28 04:06:13.352472',204,NULL,1,'ce2329d4-49f5-4547-977d-99701bab535e','TK8Qsf2AGXhFqfUJ8vgge0mTqrpB6BvRRX2Rq7GAYuI'),('2026-05-28 04:06:34.386406',205,NULL,1,'d3f1ac64-cac7-4003-9af6-e6d497e2f37c','UEI59n2bOoxBYB5DMfNQgqCjvNz1ZnlyjaxhCLW0n04');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` bigint NOT NULL,
  `permission_id` bigint NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `FKegdk29eiy7mdtefy5c7eirr6e` (`permission_id`),
  CONSTRAINT `FKegdk29eiy7mdtefy5c7eirr6e` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`),
  CONSTRAINT `FKn5fotdgk8d1xvo8nav9uv3muc` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,1),(2,1),(3,1),(7,1),(1,2),(2,2),(1,3),(2,3),(1,4),(2,4),(1,5),(2,5),(1,6),(2,6),(1,7),(2,7),(1,8),(2,8),(1,9),(2,9),(1,10),(2,10),(1,11),(2,11),(3,11),(7,11),(1,12),(2,12),(3,12),(1,13),(2,13),(3,13),(1,14),(2,14),(1,15),(2,15),(1,16),(2,16),(3,16),(7,16),(1,17),(2,17),(3,17),(1,18),(2,18),(3,18),(1,19),(2,19),(1,20),(2,20),(1,21),(2,21),(3,21),(7,21),(1,22),(2,22),(1,23),(2,23),(1,24),(2,24),(1,25),(2,25),(1,26),(2,26),(1,27),(2,27),(1,28),(2,28),(1,29),(2,29),(1,30),(2,30),(1,31),(2,31),(1,32),(2,32),(1,33),(2,33),(1,34),(2,34),(1,35),(2,35),(1,36),(2,36),(1,37),(2,37),(1,38),(2,38),(1,39),(2,39),(1,40),(2,40),(1,41),(2,41),(1,42),(2,42),(1,43),(2,43),(1,44),(2,44),(1,45),(2,45),(1,46),(2,46),(3,46),(1,47),(2,47),(1,48),(2,48),(1,49),(2,49),(1,50),(2,50),(1,51),(2,51),(3,51),(7,51),(1,52),(2,52),(1,53),(2,53),(1,54),(2,54),(1,55),(2,55),(1,56),(2,56),(3,56),(7,56),(1,57),(2,57),(1,58),(2,58),(1,59),(2,59),(1,60),(2,60);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_system_role` bit(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `version` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKofx66keruapi6vyqpv6f2or37` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'2026-05-04 02:49:33.240287','Full system access',_binary '','SUPERADMIN','2026-05-21 04:04:13.555467',68),(2,'2026-05-04 02:49:33.254070','Administrative access',_binary '','ADMIN','2026-05-21 04:04:13.637630',68),(3,'2026-05-04 02:49:33.258234','Academic access',_binary '','TEACHER','2026-05-04 12:59:18.093685',8),(4,'2026-05-04 02:49:33.262333','Financial access',_binary '','ACCOUNTANT','2026-05-04 02:49:33.262333',0),(5,'2026-05-04 02:49:33.265866','Library access',_binary '','LIBRARIAN','2026-05-04 02:49:33.265866',0),(6,'2026-05-04 02:49:33.271121','Parental access',_binary '','PARENT','2026-05-04 02:49:33.271121',0),(7,'2026-05-04 02:49:33.275538','Student access',_binary '','STUDENT','2026-05-05 11:33:39.521308',5);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `section_transfer_history`
--

DROP TABLE IF EXISTS `section_transfer_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `section_transfer_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `from_classroom_id` bigint NOT NULL,
  `to_classroom_id` bigint NOT NULL,
  `remarks` text,
  `transferred_by` varchar(100) NOT NULL,
  `transferred_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_transfer_from` (`from_classroom_id`),
  KEY `fk_transfer_to` (`to_classroom_id`),
  KEY `idx_transfer_student` (`student_id`),
  CONSTRAINT `fk_transfer_from` FOREIGN KEY (`from_classroom_id`) REFERENCES `class_rooms` (`id`),
  CONSTRAINT `fk_transfer_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_transfer_to` FOREIGN KEY (`to_classroom_id`) REFERENCES `class_rooms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section_transfer_history`
--

LOCK TABLES `section_transfer_history` WRITE;
/*!40000 ALTER TABLE `section_transfer_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `section_transfer_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_academic_history`
--

DROP TABLE IF EXISTS `student_academic_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_academic_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `academic_year_id` bigint NOT NULL,
  `classroom_id` bigint NOT NULL,
  `roll_number` varchar(50) DEFAULT NULL,
  `marks_obtained` double DEFAULT NULL,
  `percentage` double DEFAULT NULL,
  `result_status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_hist_student` (`student_id`),
  KEY `fk_hist_year` (`academic_year_id`),
  KEY `fk_hist_class` (`classroom_id`),
  CONSTRAINT `fk_hist_class` FOREIGN KEY (`classroom_id`) REFERENCES `class_rooms` (`id`),
  CONSTRAINT `fk_hist_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_hist_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_academic_history`
--

LOCK TABLES `student_academic_history` WRITE;
/*!40000 ALTER TABLE `student_academic_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_academic_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_documents`
--

DROP TABLE IF EXISTS `student_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_documents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint NOT NULL,
  `document_id` bigint NOT NULL,
  `status` enum('PENDING','RECEIVED','WAIVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `uploaded_file` varchar(500) DEFAULT NULL,
  `remarks` text,
  `verified_by` varchar(100) DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_std_doc_student` (`student_id`),
  KEY `fk_std_doc_master` (`document_id`),
  KEY `idx_doc_status` (`status`),
  CONSTRAINT `fk_std_doc_master` FOREIGN KEY (`document_id`) REFERENCES `document_master` (`id`),
  CONSTRAINT `fk_std_doc_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_documents`
--

LOCK TABLES `student_documents` WRITE;
/*!40000 ALTER TABLE `student_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `date_of_birth` date DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `classroom_id` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `user_id` bigint DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `blood_group` varchar(255) DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `guardian_relationship` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `parent_email` varchar(255) DEFAULT NULL,
  `parent_name` varchar(255) DEFAULT NULL,
  `parent_phone` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `student_id` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','GRADUATED','INACTIVE','SUSPENDED') DEFAULT 'ACTIVE',
  `admission_class` varchar(255) DEFAULT NULL,
  `courses` text,
  `department_id` bigint DEFAULT NULL,
  `roll_number` varchar(255) DEFAULT NULL,
  `section` varchar(255) DEFAULT NULL,
  `religion` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `emergency_contact` varchar(255) DEFAULT NULL,
  `previous_school` varchar(255) DEFAULT NULL,
  `medical_conditions` text,
  `is_new_admission` tinyint(1) DEFAULT '1',
  `graduation_date` date DEFAULT NULL,
  `promoted_from_classroom_id` bigint DEFAULT NULL,
  `previous_student_id` varchar(255) DEFAULT NULL,
  `transfer_certificate_no` varchar(255) DEFAULT NULL,
  `aadhar_card` varchar(255) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `admission_source` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKg4fwvutq09fjdlb4bb0byp7t` (`user_id`),
  UNIQUE KEY `UKe2rndfrsx22acpq2ty1caeuyw` (`email`),
  UNIQUE KEY `uk_student_id` (`student_id`),
  UNIQUE KEY `uk_student_email` (`email`),
  UNIQUE KEY `uk_branch_year_student` (`branch_id`,`academic_year_id`,`id`),
  KEY `idx_students_classroom_id` (`classroom_id`),
  KEY `idx_students_user_id` (`user_id`),
  KEY `idx_students_branch_year` (`branch_id`,`academic_year_id`),
  KEY `FKalgc33nsolpmegw14o3h6g6rr` (`department_id`),
  KEY `idx_student_classroom` (`classroom_id`),
  KEY `idx_student_academic_year` (`academic_year_id`),
  KEY `idx_student_status` (`status`),
  KEY `idx_student_branch` (`branch_id`),
  KEY `idx_students_status` (`status`),
  CONSTRAINT `FKalgc33nsolpmegw14o3h6g6rr` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `FKdt1cjx5ve5bdabmuuf3ibrwaq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKg2mn7xulrj0msca8k41gelyg` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
  CONSTRAINT `FKn1fivp3d0vw7p2hvxm698lqgc` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKn4i882kjg6fdyg2e641yh3jmk` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`id`),
  CONSTRAINT `FKpq0o62iqp8d895ksmv3nplcpr` FOREIGN KEY (`classroom_id`) REFERENCES `class_rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (NULL,1,NULL,1,'2026-05-01 17:05:36.212157',NULL,1,'2026-05-01 17:05:36.212157',20,NULL,NULL,NULL,NULL,'student@school.com','Demo',NULL,NULL,'Student','Demo Student',NULL,NULL,NULL,NULL,NULL,'STU-2026-0001','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'Indian',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('2026-05-01',1,NULL,1,'2026-05-01 17:16:07.608054',NULL,2,'2026-05-01 17:17:30.494340',21,'xyz',NULL,'B+',NULL,'ravi@gmail.com','ravi','Male','Father','kumar','ravi kumar','xyz@gmail.com','xyz','0123456789','0123456789','/api/v1/files/3c3d8f12-2b7c-4bdb-bc45-d34f437e5a0a.png','STU-2026-0002','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'Indian',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(NULL,1,1,14,'2026-05-02 17:54:59.000000',NULL,23,NULL,7,NULL,NULL,NULL,NULL,'arjun.patel@gmail.com','Arjun',NULL,NULL,'Patel',NULL,NULL,NULL,NULL,NULL,NULL,'STU-2024-001','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'Indian',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(NULL,1,1,14,'2026-05-02 17:54:59.000000',NULL,24,NULL,8,NULL,NULL,NULL,NULL,'sneha.singh@gmail.com','Sneha',NULL,NULL,'Singh',NULL,NULL,NULL,NULL,NULL,NULL,'STU-2024-002','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'Indian',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(NULL,1,2,14,'2026-05-02 17:54:59.000000',NULL,25,NULL,9,NULL,NULL,NULL,NULL,'rahul.gupta@gmail.com','Rahul',NULL,NULL,'Gupta',NULL,NULL,NULL,NULL,NULL,NULL,'STU-2024-003','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'Indian',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(NULL,1,2,15,'2026-05-02 17:54:59.000000',NULL,26,NULL,10,NULL,NULL,NULL,NULL,'priya.mehta@gmail.com','Priya',NULL,NULL,'Mehta',NULL,NULL,NULL,NULL,NULL,NULL,'STU-2024-004','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'Indian',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(NULL,1,3,15,'2026-05-02 17:54:59.000000',NULL,27,NULL,11,NULL,NULL,NULL,NULL,'rohan.sharma@gmail.com','Rohan',NULL,NULL,'Sharma',NULL,NULL,NULL,NULL,NULL,NULL,'STU-2024-005','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'Indian',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(NULL,1,3,15,'2026-05-02 17:54:59.000000',NULL,28,NULL,12,NULL,NULL,NULL,NULL,'kavya.reddy@gmail.com','Kavya',NULL,NULL,'Reddy',NULL,NULL,NULL,NULL,NULL,NULL,'STU-2024-006','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'Indian',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(NULL,1,4,16,'2026-05-02 17:54:59.000000',NULL,29,NULL,13,NULL,NULL,NULL,NULL,'aditya.kumar@gmail.com','Aditya',NULL,NULL,'Kumar',NULL,NULL,NULL,NULL,NULL,NULL,'STU-2024-007','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'Indian',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(NULL,1,4,16,'2026-05-02 17:54:59.000000',NULL,30,NULL,14,NULL,NULL,NULL,NULL,'pooja.joshi@gmail.com','Pooja',NULL,NULL,'Joshi',NULL,NULL,NULL,NULL,NULL,NULL,'STU-2024-008','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'Indian',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(NULL,1,5,17,'2026-05-02 17:54:59.000000',NULL,31,NULL,15,NULL,NULL,NULL,NULL,'karan.malhotra@gmail.com','Karan',NULL,NULL,'Malhotra',NULL,NULL,NULL,NULL,NULL,NULL,'STU-2024-009','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'Indian',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(NULL,1,5,17,'2026-05-02 17:54:59.000000',NULL,32,NULL,16,NULL,NULL,NULL,NULL,'ananya.iyer@gmail.com','Ananya',NULL,NULL,'Iyer',NULL,NULL,NULL,NULL,NULL,NULL,'STU-2024-010','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'Indian',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('2010-01-15',1,NULL,1,'2026-05-07 08:50:32.957965',NULL,33,'2026-05-07 08:50:49.940605',86,'Forensic audit updated and persisted',NULL,'O+',NULL,'audit.probe.20260507142032@example.test','Audit','OTHER','Guardian','Probe20260507142032','Audit Probe20260507142032','audit.parent.20260507142032@example.test','Audit Parent','9999999998','8888888888',NULL,'STU-2026-0013','INACTIVE','Grade 1','Audit Trail',NULL,NULL,NULL,NULL,'Indian',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('2026-05-15',1,1,18,'2026-05-15 15:20:24.332440',NULL,36,'2026-05-15 15:21:03.080763',90,'',NULL,'A-',NULL,'s@gmail.com','sk','Male','Parent','rk','sk rk','df@gmail.com','fghjk','5461237894','58621478458','/api/v1/files/43040bc1-22bd-4685-8527-80add4b70952.png','STU-2026-0014','ACTIVE','Grade 12',NULL,NULL,NULL,NULL,NULL,'Indian',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_materials`
--

DROP TABLE IF EXISTS `study_materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `study_materials` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `deleted_at` datetime(6) DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `class_room_id` bigint DEFAULT NULL,
  `subject_id` bigint DEFAULT NULL,
  `teacher_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmsc84vx20hns74g20jsamar84` (`branch_id`),
  KEY `FKsacjb1j45am6r8bm6d9hfs95k` (`subject_id`),
  KEY `FKfishvthm6ehk4y9fdusi1ogg3` (`teacher_id`),
  KEY `FK7jac49ansbupwnwtf1ox3opt5` (`class_room_id`),
  CONSTRAINT `FK7jac49ansbupwnwtf1ox3opt5` FOREIGN KEY (`class_room_id`) REFERENCES `class_rooms` (`id`),
  CONSTRAINT `FK9b0v9fcsqd4bjdrdskg8chlvo` FOREIGN KEY (`class_room_id`) REFERENCES `classrooms` (`id`),
  CONSTRAINT `FKfishvthm6ehk4y9fdusi1ogg3` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`),
  CONSTRAINT `FKmsc84vx20hns74g20jsamar84` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKsacjb1j45am6r8bm6d9hfs95k` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_materials`
--

LOCK TABLES `study_materials` WRITE;
/*!40000 ALTER TABLE `study_materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `study_materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `passing_marks` int DEFAULT NULL,
  `total_marks` int DEFAULT NULL,
  `assigned_teacher_id` bigint DEFAULT NULL,
  `class_room_id` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `subject_type` varchar(255) DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `department_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKsuviqkdt46kwbnwauydcbn3gm` (`assigned_teacher_id`),
  KEY `FK4uc9mi2w62f5fihivc6er46o8` (`branch_id`),
  KEY `FKdwmmftv0uf1iyvcvkih1lxo4u` (`class_room_id`),
  KEY `idx_subjects_department` (`department_id`),
  CONSTRAINT `FK4uc9mi2w62f5fihivc6er46o8` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `fk_subjects_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `FKaq7w17pakrssk3g35cbjcdwe` FOREIGN KEY (`class_room_id`) REFERENCES `classrooms` (`id`),
  CONSTRAINT `FKdwmmftv0uf1iyvcvkih1lxo4u` FOREIGN KEY (`class_room_id`) REFERENCES `class_rooms` (`id`),
  CONSTRAINT `FKsuviqkdt46kwbnwauydcbn3gm` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (35,100,2,14,1,'MATH-10','SCIENCE','Advanced Algebra & Geometry','Mathematics','CORE',NULL,NULL,NULL,NULL,NULL,3),(35,100,3,14,2,'PHY-10','SCIENCE','Mechanics & Thermodynamics','Physics','CORE',NULL,NULL,NULL,NULL,NULL,3),(35,100,4,14,3,'CHEM-10','SCIENCE','Organic & Inorganic Chemistry','Chemistry','CORE',NULL,NULL,NULL,NULL,NULL,3),(35,100,5,14,4,'BIO-10','SCIENCE','Cell Biology & Human Anatomy','Biology','CORE',NULL,NULL,NULL,NULL,NULL,3),(35,100,2,14,5,'ENG-10','LANGUAGE','Grammar & Literature','English','CORE',NULL,NULL,NULL,NULL,NULL,4),(35,100,3,14,6,'HIN-10','LANGUAGE','Hindi Literature','Hindi','CORE',NULL,NULL,NULL,NULL,NULL,4),(35,100,4,14,7,'CS-10','TECH','Programming Fundamentals','Computer Science','CORE',NULL,NULL,NULL,NULL,NULL,5);
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `substitute_assignments`
--

DROP TABLE IF EXISTS `substitute_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `substitute_assignments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `assignment_date` date NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `notes` text,
  `period_number` int NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `class_room_id` bigint NOT NULL,
  `original_teacher_id` bigint NOT NULL,
  `subject_id` bigint NOT NULL,
  `substitute_teacher_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKh7s25fic68l9owvicmwkx51da` (`academic_year_id`),
  KEY `FK8e7m3yw6dqhs6g0cwy7eddxve` (`branch_id`),
  KEY `FK388xfpngm3s4xpdl4806b3ybw` (`original_teacher_id`),
  KEY `FKa13asagpbk2s9up8ehswga0gi` (`subject_id`),
  KEY `FKaob0hwn81bi6an9c2xfgxn4xo` (`substitute_teacher_id`),
  KEY `FKbug5r2o439jh3ltp75x0oq96m` (`class_room_id`),
  CONSTRAINT `FK388xfpngm3s4xpdl4806b3ybw` FOREIGN KEY (`original_teacher_id`) REFERENCES `teachers` (`id`),
  CONSTRAINT `FK6qcbrbj1vr80qk59twbj3q4uj` FOREIGN KEY (`class_room_id`) REFERENCES `classrooms` (`id`),
  CONSTRAINT `FK8e7m3yw6dqhs6g0cwy7eddxve` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKa13asagpbk2s9up8ehswga0gi` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  CONSTRAINT `FKaob0hwn81bi6an9c2xfgxn4xo` FOREIGN KEY (`substitute_teacher_id`) REFERENCES `teachers` (`id`),
  CONSTRAINT `FKbug5r2o439jh3ltp75x0oq96m` FOREIGN KEY (`class_room_id`) REFERENCES `class_rooms` (`id`),
  CONSTRAINT `FKh7s25fic68l9owvicmwkx51da` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `substitute_assignments`
--

LOCK TABLES `substitute_assignments` WRITE;
/*!40000 ALTER TABLE `substitute_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `substitute_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_backups`
--

DROP TABLE IF EXISTS `system_backups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_backups` (
  `created_at` datetime(6) NOT NULL,
  `file_size` bigint NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `backup_status` varchar(255) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_type` varchar(255) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `restore_status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKq3bt7uh5tmkx91ohv9bhqqsmv` (`file_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_backups`
--

LOCK TABLES `system_backups` WRITE;
/*!40000 ALTER TABLE `system_backups` DISABLE KEYS */;
INSERT INTO `system_backups` VALUES ('2026-05-01 17:07:24.782806',0,1,'FAILED','ADMIN-001','backup_20260501_223724.sql','SQL','Cannot run program \"mysqldump\": CreateProcess error=2, The system cannot find the file specified','NOT_RESTORED'),('2026-05-02 10:09:41.405747',0,2,'FAILED','SYSTEM','backup_20260502_153941.sql','SQL','Cannot run program \"mysqldump\": CreateProcess error=2, The system cannot find the file specified','NOT_RESTORED'),('2026-05-21 03:30:16.918992',0,3,'FAILED','ADMIN-001','backup_20260521_090016.sql','SQL','Process exited with code: -1','NOT_RESTORED'),('2026-05-21 03:46:12.900003',0,4,'FAILED','ADMIN-001','backup_20260521_091612.sql','SQL','Process exited with code: -1','NOT_RESTORED'),('2026-05-21 04:06:34.459875',0,6,'IN_PROGRESS','ADMIN-001','backup_20260521_093634.sql','SQL','Manual backup via API','NOT_RESTORED');
/*!40000 ALTER TABLE `system_backups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_subjects`
--

DROP TABLE IF EXISTS `teacher_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_subjects` (
  `subject_id` bigint NOT NULL,
  `teacher_id` bigint NOT NULL,
  KEY `FKdweqkwxroox2u7pbmksehx04i` (`subject_id`),
  KEY `FK6dcl3ihufp4v0j1fuxlw4ksoj` (`teacher_id`),
  CONSTRAINT `FK6dcl3ihufp4v0j1fuxlw4ksoj` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`),
  CONSTRAINT `FKdweqkwxroox2u7pbmksehx04i` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_subjects`
--

LOCK TABLES `teacher_subjects` WRITE;
/*!40000 ALTER TABLE `teacher_subjects` DISABLE KEYS */;
INSERT INTO `teacher_subjects` VALUES (1,22),(2,22),(3,22),(4,22),(5,22),(5,8),(1,2),(2,2);
/*!40000 ALTER TABLE `teacher_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_sync_queue`
--

DROP TABLE IF EXISTS `teacher_sync_queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_sync_queue` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `last_attempt_at` datetime(6) DEFAULT NULL,
  `payload` text NOT NULL,
  `payload_type` varchar(255) NOT NULL,
  `retry_count` int DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKi5h6i9txlg3gjabca5xl2mhtm` (`user_id`),
  CONSTRAINT `FKi5h6i9txlg3gjabca5xl2mhtm` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_sync_queue`
--

LOCK TABLES `teacher_sync_queue` WRITE;
/*!40000 ALTER TABLE `teacher_sync_queue` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacher_sync_queue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers` (
  `date_of_birth` date DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `salary` double DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `deleted_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `user_id` bigint DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `employee_id` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','ON_LEAVE','RESIGNED') DEFAULT 'ACTIVE',
  `aadhar_card` varchar(255) DEFAULT NULL,
  `blood_group` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `emergency_contact` varchar(255) DEFAULT NULL,
  `pan_card` varchar(255) DEFAULT NULL,
  `department_id` bigint DEFAULT NULL,
  `employment_type` enum('FULL_TIME','PART_TIME','CONTRACT','VISITING') DEFAULT 'FULL_TIME',
  `work_shift` varchar(255) DEFAULT NULL,
  `experience_years` int DEFAULT '0',
  `leave_balance` int DEFAULT '0',
  `marital_status` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `bank_account_no` varchar(255) DEFAULT NULL,
  `ifsc_code` varchar(255) DEFAULT NULL,
  `tax_id` varchar(50) DEFAULT NULL,
  `pf_number` varchar(255) DEFAULT NULL,
  `esi_number` varchar(255) DEFAULT NULL,
  `payment_mode` enum('BANK_TRANSFER','CASH','CHEQUE') DEFAULT 'BANK_TRANSFER',
  `payroll_status` enum('PENDING','ACTIVE','ON_HOLD') DEFAULT 'ACTIVE',
  `contract_start_date` date DEFAULT NULL,
  `contract_end_date` date DEFAULT NULL,
  `probation_end_date` date DEFAULT NULL,
  `resignation_date` date DEFAULT NULL,
  `last_working_date` date DEFAULT NULL,
  `exit_reason` varchar(255) DEFAULT NULL,
  `biometric_id` varchar(255) DEFAULT NULL,
  `reporting_manager_id` bigint DEFAULT NULL,
  `background_check_status` enum('PENDING','COMPLETED','FAILED') DEFAULT 'PENDING',
  `document_verification_status` enum('PENDING','VERIFIED','REJECTED') DEFAULT 'PENDING',
  `created_by` varchar(255) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKcd1k6xwg9jqtiwx9ybnxpmoh9` (`user_id`),
  UNIQUE KEY `UK4l9jjfvsct1dd5aufnurxcvbs` (`email`),
  UNIQUE KEY `uk_teacher_employee_id` (`employee_id`),
  UNIQUE KEY `uk_teacher_pan` (`pan_card`),
  UNIQUE KEY `uk_teacher_aadhar` (`aadhar_card`),
  UNIQUE KEY `uk_teacher_email` (`email`),
  KEY `idx_teachers_department` (`department_id`),
  KEY `idx_teacher_employment` (`employment_type`),
  KEY `idx_teacher_payroll` (`payroll_status`),
  KEY `idx_teacher_joining` (`joining_date`),
  KEY `idx_teacher_manager` (`reporting_manager_id`),
  KEY `idx_teacher_branch` (`branch_id`),
  KEY `idx_teacher_dept` (`department_id`),
  KEY `idx_teacher_status` (`status`),
  CONSTRAINT `fk_teacher_manager` FOREIGN KEY (`reporting_manager_id`) REFERENCES `teachers` (`id`),
  CONSTRAINT `fk_teachers_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `FKb8dct7w2j1vl1r2bpstw5isc0` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKnfcgljg4ttcgha3v67ib9jx68` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKrgr03njnvpwuktc0mntf8t6o0` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (NULL,NULL,NULL,NULL,'2026-05-01 17:05:35.993656',NULL,1,'2026-05-01 17:05:35.993656',19,NULL,NULL,'teacher@school.com','TCH-2026-001','Demo',NULL,'Teacher',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,2,'2026-05-16 11:25:00.321554',2,'',NULL,'alice@school.com','TCH-2024-001','Alice','','Johnson','',NULL,'','','ACTIVE','12','','','','55',NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,3,NULL,3,NULL,NULL,'bob@school.com','TCH-2024-002','Bob',NULL,'Williams',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,4,NULL,4,NULL,NULL,'carol@school.com','TCH-2024-003','Carol',NULL,'Davis',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,5,NULL,5,NULL,NULL,'david@school.com','TCH-2024-004','David',NULL,'Martinez',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,6,NULL,6,NULL,NULL,'eva@school.com','TCH-2024-005','Eva',NULL,'Brown',NULL,NULL,NULL,NULL,'INACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,7,NULL,18,NULL,NULL,'frank@school.com','TCH-2024-006','Frank',NULL,'Wilson',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,8,'2026-05-16 04:03:07.318098',NULL,'',NULL,'grace@school.com','TCH-2023-001','Grace','','Lee','',NULL,'','','ACTIVE',NULL,NULL,NULL,NULL,NULL,4,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,9,NULL,NULL,NULL,NULL,'henry@school.com','TCH-2023-002','Henry',NULL,'Taylor',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,10,NULL,NULL,NULL,NULL,'isabella@school.com','TCH-2023-003','Isabella',NULL,'Anderson',NULL,NULL,NULL,NULL,'INACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,11,NULL,NULL,NULL,NULL,'james@school.com','TCH-2023-004','James',NULL,'Thomas',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,12,NULL,NULL,NULL,NULL,'karen@school.com','TCH-2023-005','Karen',NULL,'Jackson',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,13,NULL,NULL,NULL,NULL,'liam@school.com','TCH-2022-001','Liam',NULL,'White',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,14,NULL,NULL,NULL,NULL,'mia@school.com','TCH-2022-002','Mia',NULL,'Harris',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,15,NULL,NULL,NULL,NULL,'noah@school.com','TCH-2022-003','Noah',NULL,'Clark',NULL,NULL,NULL,NULL,'INACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,16,NULL,NULL,NULL,NULL,'olivia@school.com','TCH-2022-004','Olivia',NULL,'Lewis',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,17,NULL,NULL,NULL,NULL,'peter@school.com','TCH-2022-005','Peter',NULL,'Robinson',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,18,NULL,NULL,NULL,NULL,'quinn@school.com','TCH-2021-001','Quinn',NULL,'Walker',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,19,NULL,NULL,NULL,NULL,'rachel@school.com','TCH-2021-002','Rachel',NULL,'Hall',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,20,NULL,NULL,NULL,NULL,'samuel@school.com','TCH-2021-003','Samuel',NULL,'Allen',NULL,NULL,NULL,NULL,'INACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,NULL,NULL,'2026-05-02 17:31:42.000000',NULL,21,NULL,NULL,NULL,NULL,'tanya@school.com','TCH-2021-004','Tanya',NULL,'Young',NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL),(NULL,NULL,625665,NULL,'2026-05-15 15:23:04.668459',NULL,22,'2026-05-15 15:23:04.668459',91,NULL,NULL,'t@gmail.com','TCH-2026-007','t','','h','5555555','/api/v1/files/206e4915-dcb1-458e-a591-e7289d09d6fd.png','ghg','hh','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,'FULL_TIME','General',0,0,NULL,'Indian',NULL,NULL,NULL,NULL,NULL,'BANK_TRANSFER','ACTIVE',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'PENDING','PENDING',NULL,NULL);
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timetables`
--

DROP TABLE IF EXISTS `timetables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timetables` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `day_of_week` varchar(255) NOT NULL,
  `end_time` time(6) DEFAULT NULL,
  `period_number` int NOT NULL,
  `room_number` varchar(255) DEFAULT NULL,
  `start_time` time(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `academic_year_id` bigint DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  `class_room_id` bigint NOT NULL,
  `subject_id` bigint NOT NULL,
  `teacher_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkl24y8oaxqvp2v2ces6wgyanr` (`academic_year_id`),
  KEY `FKgud9rcaxdpwxad8k1ubijyfem` (`subject_id`),
  KEY `FKhw9tm03jm0du6i411hc0gftu9` (`teacher_id`),
  KEY `FKt3e6nmr20nevpfm03qea1xsej` (`class_room_id`),
  KEY `idx_timetable_branch` (`branch_id`),
  CONSTRAINT `fk_timetable_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKgud9rcaxdpwxad8k1ubijyfem` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  CONSTRAINT `FKhw9tm03jm0du6i411hc0gftu9` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`),
  CONSTRAINT `FKj2y2538fbnu1f3je7lclf6d5v` FOREIGN KEY (`class_room_id`) REFERENCES `classrooms` (`id`),
  CONSTRAINT `FKkl24y8oaxqvp2v2ces6wgyanr` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
  CONSTRAINT `FKlleqok18fhekn7itxayt8e0j4` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKt3e6nmr20nevpfm03qea1xsej` FOREIGN KEY (`class_room_id`) REFERENCES `class_rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timetables`
--

LOCK TABLES `timetables` WRITE;
/*!40000 ALTER TABLE `timetables` DISABLE KEYS */;
INSERT INTO `timetables` VALUES (1,'2026-05-16 12:23:44.309753','MONDAY','18:53:00.000000',1,'222','17:53:00.000000','2026-05-16 12:23:44.309753',NULL,NULL,11,6,16),(2,'2026-05-16 12:27:54.559489','MONDAY','19:57:00.000000',1,'','17:57:00.000000','2026-05-16 12:27:54.559489',NULL,NULL,11,6,22),(3,'2026-05-16 12:32:19.589833','MONDAY','19:02:00.000000',2,'201','19:57:00.000000','2026-05-16 12:32:19.589833',NULL,NULL,11,6,22),(4,'2026-05-16 13:20:59.652117','MONDAY','09:00:00.000000',1,'','08:00:00.000000','2026-05-16 13:20:59.652117',NULL,NULL,1,1,2),(5,'2026-05-16 13:21:21.255950','MONDAY','09:00:00.000000',2,'101','08:00:00.000000','2026-05-16 13:21:21.255950',NULL,NULL,1,1,2),(6,'2026-05-16 13:29:23.983742','MONDAY','20:00:00.000000',1,'201','19:00:00.000000','2026-05-16 13:29:23.983742',NULL,NULL,14,1,22),(7,'2026-05-16 13:50:21.089154','MONDAY','20:20:00.000000',9,'','19:19:00.000000','2026-05-16 13:50:21.089154',NULL,NULL,16,1,22),(8,'2026-05-16 15:26:52.352532','MONDAY','22:56:00.000000',1,'444','21:56:00.000000','2026-05-16 15:26:52.352532',NULL,NULL,2,1,2),(9,'2026-05-16 15:27:48.557267','TUESDAY','22:57:00.000000',3,'444','21:56:00.000000','2026-05-16 15:27:48.557267',NULL,NULL,2,1,2);
/*!40000 ALTER TABLE `timetables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `todos`
--

DROP TABLE IF EXISTS `todos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `todos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `deleted_at` datetime(6) DEFAULT NULL,
  `deleted_by` varchar(255) DEFAULT NULL,
  `is_completed` bit(1) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `due_date` datetime(6) DEFAULT NULL,
  `priority` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9605g76a1dggbvs18f2r80gvu` (`user_id`),
  CONSTRAINT `FK9605g76a1dggbvs18f2r80gvu` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `todos`
--

LOCK TABLES `todos` WRITE;
/*!40000 ALTER TABLE `todos` DISABLE KEYS */;
INSERT INTO `todos` VALUES (1,'2026-05-14 05:04:13.126308',NULL,_binary '\0','2026-05-14 04:46:21.074841',NULL,'HIGH','at',2),(2,NULL,NULL,_binary '\0','2026-05-14 05:04:27.286830',NULL,'MEDIUM','ok ',2);
/*!40000 ALTER TABLE `todos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uploaded_files`
--

DROP TABLE IF EXISTS `uploaded_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uploaded_files` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `owner_id` bigint DEFAULT NULL,
  `size` bigint NOT NULL,
  `uploaded_at` datetime(6) DEFAULT NULL,
  `content_type` varchar(255) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `global_filename` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK5jlkysbo0wtk6nycwsm3oyq9m` (`filename`),
  KEY `FKcp6w2lt25yx26e3wxtutn2884` (`owner_id`),
  CONSTRAINT `FKcp6w2lt25yx26e3wxtutn2884` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uploaded_files`
--

LOCK TABLES `uploaded_files` WRITE;
/*!40000 ALTER TABLE `uploaded_files` DISABLE KEYS */;
INSERT INTO `uploaded_files` VALUES (1,1,212666,'2026-05-01 17:13:59.893702','image/png','03718f18-09ee-4fde-b3ce-9d754114688a.png','download (1).png',''),(2,1,174829,'2026-05-01 17:14:39.090252','image/png','4ef30d54-97c4-41fb-ae3a-f7da6d0c9c4e.png','Screenshot 2026-04-26 083846.png',''),(3,1,433852,'2026-05-01 17:17:16.708446','image/png','3c3d8f12-2b7c-4bdb-bc45-d34f437e5a0a.png','Screenshot 2025-10-03 124806.png',''),(4,1,414872,'2026-05-01 17:17:57.594994','image/png','e4c31513-40f8-4a7c-92ac-8037a1777976.png','Screenshot 2025-10-03 130918.png',''),(5,1,433852,'2026-05-01 17:19:25.837894','image/png','1116e802-7f50-42e0-bff9-8ea74e02635e.png','Screenshot 2025-10-03 124806.png',''),(6,1,1492042,'2026-05-14 15:24:58.050970','image/png','f874133d-47f9-45da-b95a-94b048089be9.png','ChatGPT Image May 11, 2026, 11_11_39 PM.png','ChatGPT Image May 11, 2026, 11_11_39 PM.png'),(7,1,750468,'2026-05-14 15:31:17.827215','image/png','423b1ff3-8804-43e8-a3a9-15ddb29d213e.png','Screenshot 2026-05-12 000005.png','Screenshot 2026-05-12 000005.png'),(8,1,1473664,'2026-05-14 15:39:33.926522','image/png','6855bd5a-e843-4ae7-a059-757a96ac727b.png','cover photo 1.png','cover photo 1.png'),(9,1,1492042,'2026-05-14 23:16:11.868022','image/png','6468ee00-8999-4f8c-84ee-9dafee407624.png','ChatGPT Image May 11, 2026, 11_11_39 PM.png','ChatGPT Image May 11, 2026, 11_11_39 PM.png'),(10,1,1492042,'2026-05-15 15:20:55.032551','image/png','43040bc1-22bd-4685-8527-80add4b70952.png','ChatGPT Image May 11, 2026, 11_11_39 PM.png','ChatGPT Image May 11, 2026, 11_11_39 PM.png'),(11,1,1473664,'2026-05-15 15:21:44.312501','image/png','206e4915-dcb1-458e-a591-e7289d09d6fd.png','cover photo 1.png','cover photo 1.png');
/*!40000 ALTER TABLE `uploaded_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `assigned_at` datetime(6) DEFAULT NULL,
  `assigned_by` varchar(255) DEFAULT NULL,
  `version` int DEFAULT NULL,
  `role_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKh8ciramu9cc9q3qcqiv4ue8a6` (`role_id`),
  KEY `FKhfh9dx7w3ubf1co1vdev94g3f` (`user_id`),
  CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,'2026-05-04 02:49:33.469567','SYSTEM',0,1,1),(2,'2026-05-04 06:52:09.567644','SYSTEM',0,3,19),(3,'2026-05-04 06:52:09.632446','SYSTEM',0,7,20),(4,'2026-05-05 08:52:06.693917','SYSTEM',1,2,1),(5,'2026-05-05 09:10:11.391232','SYSTEM',0,7,7),(6,'2026-05-05 09:10:48.251865','SYSTEM',0,3,2),(7,'2026-05-05 10:35:10.570238','SYSTEM',0,3,3),(8,'2026-05-05 10:35:10.610243','SYSTEM',0,3,4),(9,'2026-05-05 10:35:10.634278','SYSTEM',0,3,5),(10,'2026-05-05 10:35:10.658028','SYSTEM',0,3,6),(11,'2026-05-05 10:35:10.681103','SYSTEM',0,7,8),(12,'2026-05-05 10:35:10.703101','SYSTEM',0,7,9),(13,'2026-05-05 10:35:10.722416','SYSTEM',0,7,10),(14,'2026-05-05 10:35:10.740107','SYSTEM',0,7,11),(15,'2026-05-05 10:35:10.757585','SYSTEM',0,7,12),(16,'2026-05-05 10:35:10.779142','SYSTEM',0,7,13),(17,'2026-05-05 10:35:10.799387','SYSTEM',0,7,14),(18,'2026-05-05 10:35:10.818140','SYSTEM',0,7,15),(19,'2026-05-05 10:35:10.837577','SYSTEM',0,7,16),(20,'2026-05-05 10:35:10.861418','SYSTEM',0,3,17),(21,'2026-05-05 10:35:10.879741','SYSTEM',0,7,18),(22,'2026-05-05 10:35:10.899091','SYSTEM',0,7,21),(23,'2026-05-07 08:50:32.948859','SYSTEM',0,7,86),(26,'2026-05-15 15:20:24.327286','SYSTEM',0,7,90),(27,'2026-05-15 15:23:04.644071','SYSTEM',0,3,91);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sessions` (
  `active` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_active_at` datetime(6) DEFAULT NULL,
  `revoked_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `browser` varchar(255) DEFAULT NULL,
  `device_fingerprint` varchar(255) DEFAULT NULL,
  `device_name` varchar(255) DEFAULT NULL,
  `device_type` varchar(255) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `refresh_token_hash` varchar(255) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKbjoac5vd2jt3pnrfrdeb49014` (`session_id`),
  KEY `idx_sessions_user` (`user_id`),
  KEY `idx_sessions_token_hash` (`refresh_token_hash`),
  KEY `idx_sessions_session_id` (`session_id`),
  CONSTRAINT `FK8klxsgb8dcjjklmqebqp1twd5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=197 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
INSERT INTO `user_sessions` VALUES (_binary '\0','2026-05-01 17:06:28.385333',1,'2026-05-01 17:06:28.385333','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'ztRbK1I6bcN27gycsvbFQDz3bJAyVE9KEgefq-PPHcI','8fd7c38e-913d-4aa3-ad16-f22e7a0cefa2','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-02 10:10:23.961478',2,'2026-05-02 10:10:23.961478',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'pt4pqpZW5yiMwtSQNq0XKeDZOQY3gFU86D7LH34eC20','d35066bc-b2db-4943-95ac-3cd284261a39','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-02 10:25:55.074070',3,'2026-05-02 10:25:55.074070','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'z9gIKcWgXa0GRQw9Deg3eSJlkBoNTM2djqU4itKqLMc','ded70377-3f35-40a3-935e-89a897f8d03d','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-02 10:26:51.501164',4,'2026-05-02 10:26:51.501164','2026-05-02 10:27:04.408421',20,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'gd3EYYsUxFRU9Yg-hjIIMo_dQarLaQlxSqW_GctWZJY','8dfe502b-af8a-47f4-9c3a-9fec4e9633a3','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-02 10:28:27.427567',5,'2026-05-02 10:28:27.427567','2026-05-02 10:29:10.999656',19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'2cfB1t3ABG6-7UoTl1rBRN6bgbJm_V8FjNzWCUL0zdg','04e4045e-91c4-40f0-b333-7ccaac79103f','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-02 10:29:05.117552',6,'2026-05-02 10:29:05.117552','2026-05-02 10:29:10.999656',19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'kkSfkQ96PX_sn4SvZpjm4vrBEC4pKjff4WG3t89_7Fc','556cc915-0778-4817-bbf6-84b67f52192a','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-02 10:58:10.469758',7,'2026-05-02 10:58:10.469758',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'Oj0hwkLbQcDazd-7nrBybo9RC7roi7_m1ISJjR_QVdU','fbf70098-39cc-409b-a3a0-60d8f446cafa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-02 12:54:50.037593',8,'2026-05-02 12:54:50.037593',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'QFuTfMRurhZ7AUsvTaCBfjMyVhlbaIX8CQ-cvRy92aE','97314a94-38ea-4a04-bf0d-f48f7c5e3e49','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-02 12:55:57.871211',9,'2026-05-02 12:55:57.871211',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'M_5AfLJ970P-XDfBtZxIJwuLXmfnek62n9DezZAkjac','f8dd6073-9fc0-406a-ba4c-2afb345d11be','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-02 16:10:40.692777',10,'2026-05-02 16:10:40.692777','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'Ni94hqA3wkRRbgDyEqY095n09OaxjymZBImJlpP1Dg8','a94c0fa7-d9ac-4b1c-b422-407062eed6f7','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-02 16:11:43.913290',11,'2026-05-02 16:11:43.913290',NULL,15,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'njO2hPv4ky8XoyJZCuhFWfDWVloqxtmrS8ZU-Bjz2Pg','815cb563-84e7-4f4d-985b-eb7101735fbe','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-03 15:18:03.610556',12,'2026-05-03 15:18:03.610556','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'1rFiY6CadZsuweXx2_pEf12qZDIVkNqxoyxahmQOe-k','46da4171-a893-48da-8cec-5402792e550f','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-04 03:28:05.720826',13,'2026-05-04 03:28:05.720826','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'z25oMIreC7y6Xn2o1UYVzlu2adNbYwDZGcZOupExdDw','5469d86b-7cdc-4e64-983c-ee525a2d93d7','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-04 03:28:37.115733',14,'2026-05-04 03:28:37.115733','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'cE8PtcUWajxRDzylaTQDL3_8GP_K-rLPxIAAZqtwAWg','3b401ebd-94be-4a3b-bd85-9ddb6b56a6ef','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-04 03:40:42.187175',15,'2026-05-04 03:40:42.187175','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'cwyHxcBeA45Q6sqV2RN3NQcJNvO4E7r_nSszX3fftMg','312cf814-1988-4e60-8f4c-aaefd943827a','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-04 03:41:27.837162',16,'2026-05-04 03:41:27.837162','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'cFlJPaP5mE_Zse0XzvJn4mBMxZAsajaQ2E7xEbGVOyA','2d3cd2a5-09dc-4f89-9456-b3b94a688478','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 03:42:58.658155',17,'2026-05-04 03:42:58.658155',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'H_jOwYCwVHECtlEMfIl4kPRn4E2ezVQuOO6Tb-cwYr8','2a3f42dd-fad1-4a9f-ac32-761069f933a8','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-04 03:43:31.156645',18,'2026-05-04 03:43:31.156645','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'Qq1RYyDhSBlKr8UHMySRn9TcFTL3kDeWKmTKW5Yl4w0','36082ba5-9790-4880-a21e-b06d357288ee','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-04 03:47:29.562667',19,'2026-05-04 03:47:29.562667','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'vgDaBH__2GIhdA2hJhI4hTFZV7eAGYkXrjonBN37Sxo','092a1090-f973-4e4f-bcbe-031ee0521e48','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-04 04:02:51.560815',20,'2026-05-04 04:02:51.560815','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'QNu6ERKRd1efid5gPfu6ll6-DEeLSa5-rL5WgZ_kqhI','e3c2292b-0edb-4ae2-b98b-ee841029109d','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 04:07:13.341588',21,'2026-05-04 04:07:13.341588',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'uwiXv71PoPaS5DcZfQgkTJQHcBQ-OjdjdB6VNKcfL7M','eafe6fe5-af6b-48f6-9da7-621316b77a6c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 04:07:41.025761',22,'2026-05-04 04:07:41.025761',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'4PiPNkTjq7YquqKbaqjIkf0yh9KWmMm_nwEPu_EffBI','cd79e131-9383-47f9-a97e-e315baa40161','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 04:09:11.338094',23,'2026-05-04 04:09:11.338094',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'oUNGebY9-UC3tC9y_viR08ld5oJ-5S3iyBOKxQdItOA','4185a69e-7bdf-41c8-9d18-83850112edeb','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 04:14:04.885625',24,'2026-05-04 04:14:04.885625',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'nom3x2Z0JPd1MCAUebjfPL53a7UKqe1uf8ZomKokJo0','b2d3d897-d3d9-4f7b-b8e0-1e1081b2dfd7','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 04:15:20.582513',25,'2026-05-04 04:15:20.582513',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'qh4ydkXOj76FiKfbi1A0UqASjJTJjmz33xV8EXwiCeY','324ffa7e-bffa-45eb-ac8e-c6ce2e8a88e3','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 04:15:37.594769',26,'2026-05-04 04:15:37.594769',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'32xOTi3lC380VFbiXOpDh9s2zwuORm2_oxCgj02q7Yc','06901d67-7e2c-4df0-9007-4c938b1c68bf','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 04:15:53.632040',27,'2026-05-04 04:15:53.632040',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'9pyb4SaEtqk8pp6fsFEcKQ2RsbauOKYPcBMj6-cMuAE','16c8660b-2279-462b-a0d7-9ab7eba7c546','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-04 04:25:03.520961',28,'2026-05-04 04:25:03.520961','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'I8-skT7IhTUVYRBzGnTNEzeetqSdW75yelVmXjv5UBw','4c674961-4f73-41c1-9bbd-ad1d9250232b','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 04:28:03.828782',29,'2026-05-04 04:28:03.828782',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'rrGm7dPjBnGwBhU0xEnzJC0POreswKln44XKh2cpr7k','c3244a90-3fef-4fa1-8efd-6a7278c91018','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 04:28:25.833824',30,'2026-05-04 04:28:25.833824',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'B1rf8BNXyV8nYhcpzG6FX5DnpKucMZxGV2N7b-OPjBk','d1644f5f-3484-4bf9-80e2-603bccb77af7','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-04 04:48:36.763578',31,'2026-05-04 04:48:36.763578','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'iNpLwZ2oWDPXV5vuh2bb9ExFsPbi8PKEWTEWu-D0rAE','9bc046bf-3b53-4d71-853b-3675b6a90e0c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 04:51:23.663005',32,'2026-05-04 04:51:23.663005',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'AuY9iEUlU95m2q0Z2vL4VlGVBxPEEG3Rfl9H0wGKOmg','19a40b1d-5877-4b02-8e38-fb48d669ddfc','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 05:34:55.264674',33,'2026-05-04 05:34:55.264674',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'BhDOvR4vJTDvyZH8AqSAiEPMkRSeVtbV-Sgs4rccud8','861ffcd3-0f6a-45b0-8f13-45fc11f771b5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 05:37:55.606566',34,'2026-05-04 05:37:55.606566',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'o02bWo-u3oFc8n2P4sQSsNv2DyziworHLfLyniFquLw','2f363803-84ed-48b7-bac2-976645072a93','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 05:38:53.404530',35,'2026-05-04 05:38:53.404530',NULL,20,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'k_2EKDlfFD6NCpGFeuaTnzLw_HMhLiGpLG4aXzhCpVQ','6c2baf4d-1c2d-451d-9ed7-4c98bc00a1ab','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 05:55:46.538441',36,'2026-05-04 05:55:46.538441',NULL,20,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'03mTvP0hSkF3cGL0SLUO_5yxItWZ-2n9eI0oDPsWhaQ','c4dceb0a-5007-4f71-8a6c-f0acd4b66b38','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 05:57:03.997067',37,'2026-05-04 05:57:03.997067',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'L4Ma-ce-J7vyBYjn-RiNf-5iTWMQ7g4vLMRKi1u1Me8','ba373391-9579-4dd3-a9f5-7731f1863ac5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-04 06:02:42.372146',38,'2026-05-04 06:02:42.372146','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'UwGO6bYBDuoKdLjY0oy0x_KLqZedSXYC0O-XMMSZEPw','03ce7946-1298-4779-a65c-ff7195e870da','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-04 06:28:19.854686',39,'2026-05-04 06:28:19.854686','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'LwSojaqsgGeot9qhYSVnRD0bmlOu4ZbD4SlJpXW3bPA','e11f355e-5c99-4545-abb7-6e70f39251b3','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 06:30:28.246020',40,'2026-05-04 06:30:28.246020',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'S5wJ8aoZEEc5qQSfTkftWQiUVwdFnWTyojyA8aAcwEs','3eb8e9d4-6a26-47c9-82b6-e2c0aa89899d','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 06:38:31.548448',41,'2026-05-04 06:38:31.548448',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'bvvvlIAkjUCOzZbI7Q3ybPsGq1M4pcl_vRidw8c-o-Y','24e51009-2e61-4fb6-bf44-57d4d31dc786','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 06:41:30.625202',42,'2026-05-04 06:41:30.625202',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'HcdSN1VYh_mK-tOphiJLfxMXfclERIYBM2wFZUucjAE','70a3e1eb-faa8-408b-92f2-bf79800a2904','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 06:52:30.512377',43,'2026-05-04 06:52:30.512377',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'hASOOPhDbbOUbAa5y23svYpqxlCGF1AcU8UsUWOnM4E','a873ba6c-6270-4b99-ba64-966a69af9c53','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 12:46:34.524558',44,'2026-05-04 12:46:34.524558',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'li2SowjEcYNeFO2qvbB15x9auzIwBfvyDPXAkM1KHjc','084625dd-c177-4735-a505-065867a6374f','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 13:36:09.069461',45,'2026-05-04 13:36:09.069461',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'zE1hkXTrUrtekETlLFqZOrxajU51p-7Q3-4Lo0p6CD0','42fdf74f-76c1-4746-971c-e62379611b75','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 13:37:29.369577',46,'2026-05-04 13:37:29.369577',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'CJCuSdlTYuwxV98e6qb_l0UFYfv3wTfq-Axb3kH0Mfs','85d4d126-f255-4943-ae71-eea24e2cbc90','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 13:48:10.448220',47,'2026-05-04 13:48:10.448220',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'6CJHCDPTNxlO2oarLdlA1i8bo5FFsQ7nurFRQ9Km3yg','b9aa36f1-cae8-4fb2-b444-a8add7ac821b','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 13:48:56.569128',48,'2026-05-04 13:48:56.569128',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'VNvJ1zfo23DrhFCUaizWEMwQ3CpwlosY5YodJv6QUFE','afb37bbb-4aa0-4b52-b240-17995db9d1b7','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-04 13:52:56.461736',49,'2026-05-04 13:52:56.461736','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'6lTagoLqByuYt_rDRt6Y3djmWLDqEdHtyGS08uMlZrc','80768c97-c806-4671-8aa1-0310f9b2335b','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-04 13:54:02.528333',50,'2026-05-04 13:54:02.528333',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'DjrLvcVWsQOPKcX505TVz-FamG2BXeDtBNku7LwgchU','d641ac2b-a764-47fa-8705-5f8fbbe6b059','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-04 13:54:32.138033',51,'2026-05-04 13:54:32.138033','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'UL24lGMC42ngE5eLOGzowxP94Z3zOYRWKPr6Xh_zn5Y','c4bfca06-af10-4008-a2c1-2d12c378948f','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-05 08:39:26.950461',52,'2026-05-05 08:39:26.950461','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'_A0ivn4g499iT4971JSwT-jvuqMefsob-8S5OeGWvN8','7ffeea9b-4f7a-4b82-9e3c-fb99ae7841a6','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-05 08:54:05.346952',53,'2026-05-05 08:54:05.346952','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'JTMsLQNh-6664a7_I6BBv1Y-Pay2nO-s2hQGe0q-KjQ','37abec7b-79a6-4908-ad8e-d15ecdc673c6','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-05 09:10:11.533252',54,'2026-05-05 09:10:11.533252',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'We_BgUny7IxZ3uKUW7uyW0p6ZGGuqrHRwkcnB0pZOBU','0edbfa8c-d19d-4c33-865a-92ad90c06948','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-05 09:10:48.335497',55,'2026-05-05 09:10:48.335497',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'GxPSXx6sCndlLfXMa5jNATNM5YlENmZZShzsDcVJ-Ow','3eb300c7-bd9a-4578-89af-c82309746745','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-05 09:11:44.616570',56,'2026-05-05 09:11:44.616570','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'bqTx6mTfPJvvuZd0wrqescubWghC27tGNGHYl_W1emo','eae00d78-2fda-4b8e-8503-3091e5b21c83','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-05 10:12:18.269120',57,'2026-05-05 10:12:18.269120','2026-05-10 05:56:04.921401',1,'Unknown',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'evmrhWgVeiuZlEW5GOUrxpZON_KnOHqVL_ikLiczMsE','75a39e90-1a2b-4dd7-bb92-c4a6743a923a','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8328'),(_binary '\0','2026-05-05 10:12:47.108884',58,'2026-05-05 10:12:47.108884','2026-05-10 05:56:04.921401',1,'Unknown',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'QEBpPO5-u26rb7XrNtkeP-ke78VCaoUQfaLQlW6l5T8','3eee0a84-2b98-481f-a27e-415b158e2bf6','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8328'),(_binary '\0','2026-05-05 10:12:59.100029',59,'2026-05-05 10:12:59.100029','2026-05-10 05:56:04.921401',1,'Unknown',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'c9aQxRRxeeUK2f-MtmWiMYPV65LbLn9NODdj6m-5sT8','e19e1c87-9cd6-46e0-b2cb-f832093ef29b','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8328'),(_binary '\0','2026-05-05 10:14:06.334128',60,'2026-05-05 10:14:06.334128','2026-05-10 05:56:04.921401',1,'Unknown',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'FF16U9_JErBNH5u_i_1cI5Wj2jzEcTzwdqiL_edOzug','ad538278-d0cb-499b-819f-64c155c55aa7','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8328'),(_binary '','2026-05-05 10:14:06.528921',61,'2026-05-05 10:14:06.528921',NULL,20,'Unknown',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'1At8u-DKyGkW6uxaUkQXRLkzSlqSWhq1bCx3WfScn_I','d36badb1-1c38-4c09-aa33-4bc1d2de8a59','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8328'),(_binary '\0','2026-05-05 10:40:22.517332',62,'2026-05-05 10:40:22.517332','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'NgVZWycucWG4O5jYSAOaN20Xw_KlyQUrAp9ZOQpPaHA','1368dbae-27c7-4383-9b80-2e76c7a63bd5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-05 10:41:06.018355',63,'2026-05-05 10:41:06.018355',NULL,11,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'PVkCYgpcCzaXikELh5__RzFmVbUchLL8brMGDkpbFnA','9bb252cb-d480-42af-a44f-f33dc8c3d5dc','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-05 10:43:12.766931',64,'2026-05-05 10:43:12.766931',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'fkDkB849tL2d2nCq407ZnmqjtKCvKj_mXOirEgaf9GA','25542ed6-5de0-45fa-bcf8-0c11915a50d2','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-05 10:49:55.309397',65,'2026-05-05 10:49:55.309397','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'zFGikeE44ZBgs5g-dXc9gunoXBKvMM8ZRw68ndHZIw8','f04b7daf-c1af-4b3b-b0d2-b2297ade102f','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-05 11:33:59.895401',66,'2026-05-05 11:33:59.895401','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'4sSkdQuA7s81KPZ3eo3NwRhAiZkWODjxcUPInjMwWJU','4f5b69ca-8138-4763-81eb-cbcbf334d2a8','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-05 11:34:34.711451',67,'2026-05-05 11:34:34.711451',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'M913G-zIq-4DpSK_MeSomAd1xPFsmtbbHbC59-DNRiw','a75d6950-5536-4e87-86fb-b3f31de7158d','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-05 11:35:50.283255',68,'2026-05-05 11:35:50.283255',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'RK0hBn47EemMj1djaUtV1gfVUL0JNCHeNPfPnHzLziQ','200c4336-7c77-42fc-a5f3-a1fd2143ecfa','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-05 15:10:15.390488',69,'2026-05-05 15:10:15.390488','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'ggQvk82xqBWDMfTqfd9DDLkddXhnI-Rv5dodcfRIv3M','984f4bdf-abf4-41a7-9ffc-1f0ac33a9761','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-05 15:10:32.843649',70,'2026-05-05 15:10:32.843649',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'WLraxqu7dhGETsdOYD3OW9WBZY-N8KQuHaPHTzj1-TM','01210445-3472-4cfb-bf53-28b7c4a4f03c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-05 15:14:33.681717',71,'2026-05-05 15:14:33.681717','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'UA1R_cyn3_5u2MaVlyJhEndV_lNlb3GUooqMEicoc-8','daf406a1-ed2e-4d5d-90cb-a856e7c32d95','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-05 15:32:04.766422',72,'2026-05-05 15:32:04.766422','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'ppKGaJud6SFP_-ww4Se9IOoFN3-9PcOmkNsxv7rNGCk','c4317c44-4edf-4a73-a458-b4052f263e6c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-05 15:40:30.373682',73,'2026-05-05 15:40:30.373682','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'h12r7cW05v4v4oECxyySzjkhUvIytEjNCki6ihn3QeM','d509565b-859b-4574-be5e-1fc4bb60efa6','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-05 15:55:45.743781',74,'2026-05-05 15:55:45.743781','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'vfLpF8j8CTlA8TCmg0U2cM3JGZl-1ar4YAoe6IMqgt8','ff1a43c4-6095-4eb1-a78d-04f247b178d2','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-05 15:59:34.761651',75,'2026-05-05 15:59:34.761651','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'eyruMldoEW2qynyJTZS-ID1S7Vz6va_lEdqYiCQ7D60','bcbf94fc-8663-49fa-9a1b-d6e2d73563ed','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 03:34:50.685701',76,'2026-05-07 03:34:50.685701','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'qiIwQG3lGGtYvK05n8jRffEQmfGVLTAQAFbn8EhoRq8','782b9c12-ec50-496e-bca3-e9de3e24fdb4','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 03:37:16.316511',77,'2026-05-07 03:37:16.316511','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'lMadIGBBDUZZhhJ8OjYKoLB5lMqpXzOTxWZSQKHELk0','c98f4d83-7800-4903-82a3-424b7d2eca8e','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 03:38:43.242336',78,'2026-05-07 03:38:43.242336','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'Dunhd7IAbwvWUKh3xy2Xa5WwfUODjv6ciIKj_pqdOsw','fe5b710e-83e4-4960-bf29-c72e7216bc07','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-07 03:45:07.411363',79,'2026-05-07 03:45:07.411363',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'tcoVUqmTQX4YHfR2DvK-1UX_qLSm-jIGTK7qjiiEoD0','7747df3a-88f3-4fbd-a4dc-cb4f7f37c759','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-07 03:53:41.210350',80,'2026-05-07 03:53:41.210350',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'ETGMc0I3CF2JERzpCg8VkXXyvRy2XrzRZ4DAq7Tk1sA','3f667c6e-5926-41d5-8a58-12705bef7a60','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-07 03:56:37.443082',81,'2026-05-07 03:56:37.443082',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'qGI3oKgyaqxY_8rzg8MXfFROASWQAA4OJM8U5Ilyv20','5e15e942-a798-459a-9beb-59000e7e2099','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 03:56:44.835172',82,'2026-05-07 03:56:44.835172','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'_289Lfh5wAhcIgUeUvKec29K-R7gjwD6GWsANOMv1IY','eb0d2910-8a43-42bc-ab31-87404054ae00','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-07 03:57:36.982034',83,'2026-05-07 03:57:36.982034',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'hagICEfx9ntMd7HuoNFm2sYR39R7oBQUICCFI4j1kic','cfc15bf5-cba6-43ed-8588-8362a4ed081b','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 08:14:42.469056',84,'2026-05-07 08:14:42.469056','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'Ljrh5ndnSQNinDCWMh4V30qf5tg8z_aPVMxlntHPJ3M','f75d18d5-9a2e-48b3-8830-96edf685e0d0','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-07 08:15:17.063757',85,'2026-05-07 08:15:17.063757',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'I5OCpTZYrQf1RQuYMLat9LqTc76x1qsn1BBzeJyVrfg','2bfc0426-8c2a-476f-87d4-26b752a69eef','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-07 08:16:05.881104',86,'2026-05-07 08:16:05.881104',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'GytCXu4DHcEmCnTQPTpj8RTNemFKTM2HNUx7_oIDdmE','6e7bbd10-184e-4108-854c-98cab99078e4','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-07 08:17:55.233001',87,'2026-05-07 08:17:55.233001',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'Nd6vHHVpZwft5w5q8km8LF8lZxsJtJnEw0zmrKXww_A','1fe65ae3-5ef2-4423-b14b-ae7791ca3b3c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 08:19:18.368981',88,'2026-05-07 08:19:18.368981','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'Z1zz6pGrsLAMnnljJJZttFSVOJGNObbiSC09ANAYyvc','01e36f1c-76fc-4060-8933-f672aa79803e','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 08:48:57.427582',89,'2026-05-07 08:48:57.427582','2026-05-10 05:56:04.921401',1,'Unknown',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'peGtruNKeLHJjWtxDnaSJc8b6ZioiDoTjqVu2uvbeqQ','09274c08-5743-44a9-a0f4-791bd38dc0f6','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8328'),(_binary '\0','2026-05-07 08:50:31.660380',90,'2026-05-07 08:50:31.660380','2026-05-10 05:56:04.921401',1,'Unknown',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'Na3BCSJPNVY-RULLn2tPSO0dihRj31GdyajlGA4gYRQ','56b38ff2-0f18-4222-942a-053949cfeaa8','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8328'),(_binary '','2026-05-07 08:50:33.266360',91,'2026-05-07 08:50:33.266360',NULL,86,'Unknown',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'Gvio0iNmLuPvGSFeiiPOrmKoUjeOasm2EEbOXHATVjA','6542cda2-76d4-4c3d-b834-64f94128e78f','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8328'),(_binary '','2026-05-07 08:50:33.563664',92,'2026-05-07 08:50:33.563664',NULL,19,'Unknown',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'o-knOnsTuYEkKwspvgbT3rsCpA4p3Ic6n4r9_Y4_rrA','c641dbc4-e310-4c4d-9cf8-082b450da2e6','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8328'),(_binary '\0','2026-05-07 08:50:49.749162',93,'2026-05-07 08:50:49.749162','2026-05-10 05:56:04.921401',1,'Unknown',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'IlWDZYXn1Dm8C-bxS_46niH-WXMC76qFfuARETNTzt4','8f9112df-4e43-4ed4-9306-a49bb5a5ebc8','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-IN) WindowsPowerShell/5.1.26100.8328'),(_binary '\0','2026-05-07 09:33:29.473642',94,'2026-05-07 09:33:29.473642','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'33Kz2Q0n2PAtN61t_V4rf3d-pYI-6_KL8t_nJZD2c8A','99964cef-1e7b-4b66-b172-bea431f6fd56','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-07 09:34:12.976065',95,'2026-05-07 09:34:12.976065',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'JbDhmYsjGKw0wwAg629pDZFaNvEC4iF5DDSztEmOOlw','8aed80a7-7297-4718-865e-eef0711da622','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-07 09:34:52.722164',96,'2026-05-07 09:34:52.722164',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'p0OqjyItTrh5H9C8hvgwYiRVeNIcHwXXhAbWb5VlBkc','70cdda43-6c40-4b62-93d0-aad8e6137f1a','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 09:35:23.975972',97,'2026-05-07 09:35:23.975972','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'z3eqIn1hEX_7B9k7QM9OrQ7jDV222CfAiErCgyA4onc','491f02b7-33a4-4b40-9ed9-46e117a68e82','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-07 09:53:46.007968',98,'2026-05-07 09:53:46.007968',NULL,20,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'nnLCYMjL7xnBXTKvT2CGEKQFSbbCB9PYvDgKuuK3THw','10894305-7408-4b21-85a7-af3884dd90cf','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-07 09:54:55.290466',99,'2026-05-07 09:54:55.290466',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'9RTI8ZHmqzxF180fH2fQ8eTpF214EDq9gqjQrySNiT8','490dd9fd-99d6-41a3-a049-09a7d79efc55','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 12:36:16.379895',100,'2026-05-07 12:36:16.379895','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'F-ieoz8W22lTMRdJpufo8_AR5FEFI3wp3dQwD9uO3Mk','4f7470dc-36fe-4372-9131-17294ad958eb','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 12:40:03.643525',101,'2026-05-07 12:40:03.643525','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'KPmAZXY3TaK8FH-KXv0OcGVoHquGUXeLGtHsheHxw8I','be9b50c8-751c-44e5-8828-3e96954e23a6','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-07 12:48:39.214156',102,'2026-05-07 12:48:39.214156',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'czI6yyXVnGZLOdqKwZBqTnvaEm0PZ_zFmPpVBiQZ-8k','10327545-b7c2-470d-8d3a-f12f3aca9b4f','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 13:00:05.776441',103,'2026-05-07 13:00:05.776441','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'ffZD1xXN8IgnYLtWgDpERFLOhVuY130Vu380M2pFgxk','8d113c03-5cf0-4a90-b034-7cfe16283a9f','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 13:09:45.005205',104,'2026-05-07 13:09:45.005205','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'EdZbXIkXA79DvHucTxYWUnopFNb8skAU_nt7oLpEsR0','cfbe8fd5-8367-4796-b0e3-27a16d171c94','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-07 13:40:46.317715',105,'2026-05-07 13:40:46.317715',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'YZupFO8-4GTRRjxUIU_vPCuz1_pWJNTKrLOHYs0O2P0','97cf9c05-5e1f-48e6-8d76-b7786922772e','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 14:05:34.238602',106,'2026-05-07 14:05:34.238602','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'9cg1MLTN8FeSwrRKeheYurWX3qFvvs4veEvTiQMP8GE','cdde3ae8-70e4-4025-92cc-a16da9d28396','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-07 14:05:47.506416',107,'2026-05-07 14:05:47.506416',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'8BkFB6ZnEWAPjcu2f9A8YgmWCAElcJd-iPM6Wublm6o','3b755d25-0f8d-4b83-aa95-7a51c0371336','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 14:57:11.384262',108,'2026-05-07 14:57:11.384262','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'YUulfVavQB06Hf7ft9VjxHFA5t_KiJVNfSihWa0bUa8','fae65f9b-a1b8-414c-8a34-5c67812067a6','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 15:15:04.222135',109,'2026-05-07 15:15:04.222135','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'-H-SkNy6-CFNIlmqEOnSyvtVCyghmgTxvWpCEqp8ApI','2475cff3-53df-4f26-8256-4c5c60057b03','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 15:24:54.077830',110,'2026-05-07 15:24:54.077830','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'EvDc7wbGjIByIXMMX7hezaxWBHbwL2SVOLqMCE-Nono','df66b4cd-f0b4-4d2b-b0f4-b58b1106b58c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 15:50:49.985664',111,'2026-05-07 15:50:49.985664','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'G_AeEYNTbKOL-_t2L92V5XXcCAJjJQzok4rGuvVE6Rs','aeab854a-9154-45c3-8d99-2c64457ff780','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 16:25:37.616234',112,'2026-05-07 16:25:37.616234','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'dXzpahlF-MJE9gbydUmmHhFdtbubTf9j1SDjHZ9EufQ','1477adb3-2e53-4d2c-b10a-b3013adb7798','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-07 16:26:41.133877',113,'2026-05-07 16:26:41.133877','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'Ar9rz1i1b_PYo78Y4y5R8JTbcaPltoCYYcjkKzVJK1g','60096ed2-9c08-4153-a72b-fb3dcc4006cc','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-08 01:56:07.248815',114,'2026-05-08 01:56:07.248815','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'scbQYgW_gfNSsu3uWDt1bkuD5BhK_PECzt6pPU5rfHc','7418daf5-7dfb-41d2-97ba-1d4268b2ec71','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-08 03:06:28.487034',115,'2026-05-08 03:06:28.487034','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'0H3TxP20MxZYeY8GjrzRTLzvCB-Alq107ZbDISAidY4','6dc85ed7-09ac-4bd5-acaa-ad4a10c93212','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-08 03:06:45.413191',116,'2026-05-08 03:06:45.413191','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'vU3KQesTBwmMP6ETeav__sI-2Pj0VTDphe02_-v7OEs','6e2c5cbb-3438-4e7c-a274-f6930648c916','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-08 03:08:24.701549',117,'2026-05-08 03:08:24.701549','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'-9dhhM7fVNpEinLhD1jl-NTyBNC1Imi5n2X_MigYRtM','c68e45b0-c930-4031-84d7-f3fcfd5b3f1a','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-09 15:19:05.095700',118,'2026-05-09 15:19:05.095700','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'sv9KGw0bdVwyzT7tvfOFZ62dnbOBPrAh0FDRvJ6M3GI','a98fa2e3-a0fe-499e-a523-89f06f0c4149','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-09 16:18:13.790884',119,'2026-05-09 16:18:13.790884','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'jD-BnxQgSV3kutoJ0n43-cV_LYho3a4E3GeopZngygA','49a767b9-ba1a-4dde-90d3-c77f48b1ba79','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-10 03:07:20.811398',120,'2026-05-10 03:07:20.811398','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'2fsAqw6pTVLZfQQ61xYE0Z7YmqU9sUEA3ENuen6w8pM','b5582bd5-2587-4160-b1b4-ee4975db5fdf','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-10 04:17:16.174398',121,'2026-05-10 04:17:16.174398','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'bXU2RA5LlIuz_5d8R98BLrP-ESSIIokVLaiAkxeM1JE','43344cb7-0b7f-4c25-8e44-9f1e3dce752c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-10 04:30:17.909349',122,'2026-05-10 04:30:17.909349','2026-05-10 05:56:04.921401',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'d3Q4V_IKnxYxL9aJWltKzvCIoWDqyMlc6TFNSXG1Sy0','cffaeefd-d9c2-47de-9fb9-28879a71a52a','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 05:51:47.612714',123,'2026-05-10 05:51:47.612714',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'eJHioNHx_TCjRyg2D4SzvyYMf_CZySVcEi9yJ6IP404','92d87ae1-202b-4a12-a22d-7e3563f0e507','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 06:49:52.479606',124,'2026-05-10 06:49:52.479606',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'yHpbwjWX_nE2ZKaDxAy8l80zRrjZYtiGLWbr3WVU7Fk','48cdd64f-486a-49c2-ad69-9ea753db349a','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-10 06:57:45.180902',125,'2026-05-10 06:57:45.180902','2026-05-10 07:51:16.209535',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'rQwvdlUchBTkxwOHMORcqWhqo_KGx-AmksJ6jj6vHTY','270f313b-9420-450b-91ab-554715c75a9c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-10 07:51:23.467978',126,'2026-05-10 07:51:23.467978','2026-05-10 07:53:40.799338',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'QHaixGqATu6sSrLcxmmp7HWBTxRS-97a_zCLHL1sAiM','b69b3b6e-1c55-4323-bd4c-7d30e0dd2f3e','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 07:53:46.777323',127,'2026-05-10 07:53:46.777323',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'umxRRqnEI-mlIsm-pYdULspEUWXZMBGOIB4B1JsQtUU','05ab2538-3e49-4421-bda0-b1c4f804a424','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 07:54:10.910941',128,'2026-05-10 07:54:10.910941',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'zCuaT0_xa8f2FJoZemb557WHRK8FhQuLa8DRHbysvgw','0f81342a-2462-400f-b8c3-92eb1f714dd1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 08:28:33.266064',129,'2026-05-10 08:28:33.266064',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'TeWt1Fl6XT0jttiSS4Yz9hTw79kqo_rGx0MO9Z95jRM','91fa6188-36cd-4fbe-8303-98016750c107','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 08:32:35.374700',130,'2026-05-10 08:32:35.374700',NULL,11,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'AIb-MjAoAsn0SJ9btLCzSkaHYny09NloYIKlwQ7BHME','1aca1dad-3c23-44a6-9494-49e1e256f5ec','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 08:38:31.001949',131,'2026-05-10 08:56:25.236549',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'5qN7sIFwupNdVb_QA0Y84cMiv1qilickSJ38CaVfclA','e31cffa2-d40d-46a0-9a37-366fd19e99f2','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 08:56:44.634787',132,'2026-05-10 08:56:44.634787',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'9NPYKjOGP8I7Ok6XewRPJAMLym70Jzeixrik5q3-OTY','53c38153-670c-467a-8373-aec10b38be96','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 09:13:53.612742',133,'2026-05-10 09:13:53.612742',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'1cSWRcSutU0UILsJEUIG_NEEBVqNCmP5phsEHC0lshE','d4135a1a-bdd0-4fed-be41-ce8a902d3706','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 10:00:19.897624',134,'2026-05-10 10:00:19.897624',NULL,7,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'zrTAQvRr2eKuUys2iSI6CwfkFXsD3SHambiPpbolmVQ','63fafabb-faf2-4ab7-bf55-2bc3dae7f575','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 11:12:38.323491',135,'2026-05-10 11:12:38.323491',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'3dOv8NdDhxRyg69CgqSPtnpYuL_A9-QxNpmRyR3ksxY','f6bfff34-5efe-4dfe-8d6a-0800217e274c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 13:55:44.520018',136,'2026-05-10 13:55:44.520018',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'YITGrzFzP8T7g4iEoc67u0TrjBOjp4GjGVSlHBoRK50','a83e0990-1285-48f5-aa47-ecf680a7d061','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 14:03:09.431442',137,'2026-05-10 14:03:09.431442',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'SHpec32aRMwuk8OpduWd_v6-vXhYRmm5pux_HzYr3fM','f6d7c021-c677-4e4d-8fb0-6c9336423e44','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 14:06:45.399405',138,'2026-05-10 14:06:45.399405',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'szIZOb2nuzF-6ZxKdka3oqjlNGmgPdKixj6dfvj2ADY','0a066e72-1403-4581-9944-cd304c6621a8','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 14:13:07.262190',139,'2026-05-10 14:13:07.262190',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'TZ3RJb96fbrtQBgcxB0qMP_uHpmdlW531iP43tvw6q8','826f8268-ffd0-4eb4-8688-c0f3c8b61a38','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 14:14:37.837380',140,'2026-05-10 14:14:37.837380',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'YmogbncKJEhGvToIbYSOuGjgrQDmVrHtYBetyyIDj9E','4ada3f6a-457d-4b16-a9ec-d4558cbb591e','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 14:23:36.627390',141,'2026-05-10 14:23:36.627390',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'tzhblRm6al1AvqCGiRK09oXgTl3ILaIjvNpupLrdkD8','d6b966f5-a2ed-410b-a513-40acd7154e24','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 14:23:45.517674',142,'2026-05-10 14:23:45.517674',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'3rfy-Ubl_bEllvPMYiTW5CeI4e3znsy32PY19GnY0a8','54ea0b9e-8d20-406e-92fa-1fcde6cfd737','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 14:36:47.233769',143,'2026-05-10 14:36:47.233769',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'xn7HFxlZ2GvQEbvFr5O2HdFL9s6AGLOfK9HpFOF10pY','4adcb257-7656-45be-a8a9-a54df1ea1bfd','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 14:37:20.552100',144,'2026-05-10 14:37:20.552100',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'gup_SVkpT7Er2jxoTvxXgc-5ucpVndGM8Q89qEzL_AE','7fcba439-b469-4e7d-a7c8-606b96488037','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-10 16:08:14.254373',145,'2026-05-10 16:08:14.254373','2026-05-10 16:16:44.475314',19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'pGfrrrpDWD7qzcEBj0ifnBnmQmS6iX0eewZ_SWnYlP8','c200fb84-e47a-4d82-bda3-bb2662573e36','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 16:17:10.628994',146,'2026-05-10 16:29:43.570215',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'C0dPn5hgxcFmsVrOZEP1gdcuWMDV_-XnE3qdYjVZyIA','474058a1-e368-46b8-b022-580e8bc7fa0f','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-10 16:29:59.897982',147,'2026-05-16 13:17:10.461008',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'stG2HnyjC77EqGuMxBYfJbwYy1mRaSHSiX0VRtUkq-Y','daa32795-a003-4eca-96fd-3e702c37df1f','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-12 11:31:40.414419',148,'2026-05-12 11:31:40.414419',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'vM327Ac_CZ0Ht_OaX-1KTLF3CSGOycW7lsscPzADtI4','cf36157b-024a-4cd8-ae68-48712477404e','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-12 12:18:51.123040',149,'2026-05-12 12:18:51.123040',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'iAI5E0pAp9owmS6Cq7H3gkqMwTGpQZ4oIswVkDq3WEc','e569ed68-af2e-403c-90b1-aeb9ad3f118e','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-12 12:55:40.304046',150,'2026-05-12 12:55:40.304046',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'NsKltHntqHS80kKSnxPb1JvWEvjSeEGi3AlV3uP5eN8','cdbea3b6-e30e-4dfd-bc22-6163a54daed8','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '','2026-05-12 16:16:14.962908',151,'2026-05-12 16:16:14.962908',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'bnHEhmEtizinfMUsXf3nT6i3Gx-S03l_lky-nllcWCU','86f8e0c7-9b9e-4ceb-a92f-e89bd3d1553d','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'),(_binary '\0','2026-05-13 16:02:40.417002',152,'2026-05-13 16:02:40.417002','2026-05-13 17:36:56.459943',19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'fUiPheo8A4eU4dycLzGzcF4-gWgMmQ71V-HhU9_ME9c','0ba784da-7db1-417e-bfd5-cf44688bb80c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-13 17:37:05.743871',153,'2026-05-13 17:37:05.743871',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'Nm1lMSNxpIT0LWvRay2KqS835XvpDYYmRdM-iRlQMDw','46bae8fe-b311-4b42-956f-e8b66e0764b4','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-13 17:43:55.086915',154,'2026-05-13 17:43:55.086915',NULL,1,'Chrome',NULL,'Android','Mobile','0:0:0:0:0:0:0:1',NULL,'-bDpoYYSMQBKUcKmq9XubXXuTmvcMl9GGwa2MOqu9Zw','d6099529-cadf-4cae-9d7c-e8daac894510','Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36'),(_binary '','2026-05-13 19:02:28.018305',155,'2026-05-13 19:02:28.018305',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'HN0kZUjU4MsOArflS9Hd83LalZgorA0zVxmnMTM8aNQ','a7763a06-732a-4bbc-97d2-1cd4eaf5c7b1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-14 04:29:31.621709',156,'2026-05-14 04:29:31.621709',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'Pze5Hn7w7n1S8pPbuYFyTk6v-v6RBSu8r7u69wwGP04','3f8b0efa-5c03-4e0e-8c5e-e03f3e0c7286','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-14 05:30:32.075829',157,'2026-05-14 05:30:32.075829',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'0S2cBXFlaZJWhUWVt3gprYbUEVUXr9IgA_1ldcX7uWM','185bbfd3-9fec-4bf6-878e-83ad117f9c91','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-14 15:00:20.205777',158,'2026-05-14 15:00:20.205777',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'q5hBmo0tcdxkPtInmHhUfv09KJKCedpFPTyXEHay3p8','0f9c61b6-05dc-4912-bf49-024dc6af3cbb','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '\0','2026-05-14 15:10:06.615437',159,'2026-05-14 15:10:06.615437','2026-05-14 15:39:10.535175',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'09NSJSqRGPOAq7K04Jwy9RhCzGutfdpcQDgMtH_baAg','cf5e64a4-936f-4e30-ac02-be64fa82b185','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '\0','2026-05-14 15:39:21.059071',160,'2026-05-14 15:39:21.059071','2026-05-14 15:48:55.888210',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'bRIKWuwy11TfGd7tV_qLv1g7fpJ3U7D2o1CvcIkb28U','39494371-a883-4012-9b04-0e1bd91c98cd','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-14 15:49:05.279159',161,'2026-05-14 15:49:05.279159',NULL,1,'Chrome',NULL,'Android','Mobile','0:0:0:0:0:0:0:1',NULL,'b4nRL0U9GL8vJRfUJazA1Epj7sWmW-grvfDya7VJfo4','4cb60c8f-cc7a-4931-8f31-e386d2263e3e','Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36'),(_binary '','2026-05-14 15:56:36.618548',162,'2026-05-14 15:56:36.618548',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'bawa0Q44SFYIVBscHd7U9-Kch59CZsvSnmYXKxIIWZU','7701a385-a8ea-4a7b-9e53-060a9d590120','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-14 16:42:31.869436',163,'2026-05-14 16:42:31.869436',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'kmDTuYxUoJZRgfIU4C4g3A0sdZyk9LUMWTOjvr7WQa4','e402171e-bdb6-43d7-af6e-c89b55119f9f','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-14 23:15:09.464925',164,'2026-05-14 23:15:09.464925',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'qeREr1lvJmvUJaCOK7DPlcElIeuIvn4gMbIJjEituHU','7dcc1cc6-49dc-430f-becb-2dbb0f4257c9','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-15 14:37:03.506103',165,'2026-05-15 14:37:03.506103',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'W5GN2lveKbFNPQflJJddSQSKcZMD5KfzJSJePYzHGYQ','34b1fbcc-e946-4896-b15b-e1fdacb542a8','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-16 02:58:22.031075',166,'2026-05-16 02:58:22.031075',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'sUfeLrzrnXkBhGtHTNVMVl2HqMcjy0CG2_iFlypDEdw','b1e39072-bfa5-48c1-a937-5886c86d3d8d','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-16 03:59:01.694662',167,'2026-05-16 03:59:01.694662',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'WOwQnWitzzEl8kQL0FKbqEr09xqX5CNXoj9DyJ2tjD8','e928527a-6a7d-456e-960b-a0edbafc14f0','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-16 10:47:43.519787',168,'2026-05-16 10:47:43.519787',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'xYeCei3R0KyV3YPn9H0ksD_ba-wqMVwHFjpK1dG8JxY','ce24b5fe-9476-49d1-9d2b-bb08de60250b','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-16 13:18:06.924504',169,'2026-05-16 13:18:06.924504',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'V8qC9MhOrzj4wI_ug5xjcff9ejxDvY236Z-gqq5cuDE','3314db1a-0e1e-4fb6-8ade-11380a73d1ee','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-16 13:30:47.864933',170,'2026-05-16 13:30:47.864933',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'zFE7VhkhpMfUE1NonZiwdGuN0-KacrJo8l3cebvStqY','c82d57e6-823d-43ec-b46a-00c48aeb8424','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '\0','2026-05-16 13:31:15.104794',171,'2026-05-16 13:31:15.104794','2026-05-16 13:45:12.434488',91,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'1Hfa8eEkpjz8j1lZKy83NDjYxXnKySBNsMFuBvcrTvw','0aba235f-da79-4272-830d-704708c2a509','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '\0','2026-05-16 13:45:21.898817',172,'2026-05-16 13:45:21.898817','2026-05-16 13:45:56.271292',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'K4XoamSpn_mXmHXN18SsSy8T1-XdYyt9IGyE371MO1g','5424edda-fce6-4b17-9377-96f7fefb007f','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '\0','2026-05-16 13:46:04.560515',173,'2026-05-16 13:46:04.560515','2026-05-16 13:49:07.533583',91,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'kkFJAo1KCURO2XBoAdpt0Zmo7qXJk0ASkyXQTUdVbIg','328a63b8-3901-4d08-9953-30996a4c4f61','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '\0','2026-05-16 13:49:15.039415',174,'2026-05-16 13:49:15.039415','2026-05-16 13:50:25.937741',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'rAmoUlMtTGzFcnDL5ymvBXeWGGHVo7Na6HXgvNJlOI4','58ecae7d-0ffd-4314-90e2-ff7e12e14394','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-16 13:50:34.614730',175,'2026-05-16 13:50:34.614730',NULL,91,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'Hwt2lbLLvTcoK7Ge7sLR0laKQ0Ed9jzU5MH8MtmtU6Q','b58bfef8-2f42-477a-90cd-3d084c16ebdd','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '\0','2026-05-16 14:04:17.462129',176,'2026-05-16 14:04:17.462129','2026-05-16 14:04:50.560050',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'_tYkfAvBEJY5Td6aHJN3MhxTlHgx9dTXSbFViSF0YZk','16ec0aa8-0893-4678-87d2-a6183f08ec77','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '\0','2026-05-16 14:05:02.574569',177,'2026-05-16 14:05:02.574569','2026-05-16 14:07:13.371830',19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'dQ8TnvOegYsP8GCDnQV1-TK4BKHD1gGPgUEC2xaQq7c','f2ca13b6-8cf4-4cb2-a0fd-c8a31928bb51','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '\0','2026-05-16 14:07:29.698833',178,'2026-05-16 14:07:29.698833','2026-05-16 14:10:38.136410',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'178emoRIwOskDIDMf9vkt2Y45oMvu2B1Gih5h3FQXUU','1ff0ea1a-7dc8-4288-9cd8-c41507bf39b4','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '\0','2026-05-16 14:10:45.212179',179,'2026-05-16 14:10:45.212179','2026-05-16 14:11:30.903834',2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'myB_3VscNgyQYWv7Xtf_zzZhIvKGHWGLXKbLeuWSdJE','00bbcf30-86b7-43d1-bbb5-2ac4c4e1b2ca','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-16 14:11:37.202601',180,'2026-05-16 14:11:37.202601',NULL,3,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'BbFiBkBj8hKRq3XiUjNS5i4LRN0jdBtT-240Lj_CwIU','c18a4979-6522-452f-ad90-f3b98d1ae639','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '\0','2026-05-16 14:16:31.536112',181,'2026-05-16 14:16:31.536112','2026-05-16 14:20:08.746964',1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'R6ZHdcVBW_oOZd8E-0qk-o8OmUwyFUC49sxZa9UClEk','f8afd1dd-1362-456b-8c1e-cf0a5efdd03a','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-16 14:20:09.009186',182,'2026-05-16 14:20:09.009186',NULL,19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'a-w5jyXhobxGVW6iFG7FLcVfUrWSciymVVlBgm8qbWg','a1b75fdb-c956-443e-8c7b-861cc67bfd92','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '\0','2026-05-16 14:20:22.948473',183,'2026-05-16 14:20:22.948473','2026-05-16 15:38:30.541675',19,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'OAyQCEST2353PC8bq7eTMr7WOLlaXoJIN1Vrx0ZJUnc','99c0ea2e-384a-44cb-b4a8-8ced4772f03b','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-16 15:28:39.627243',184,'2026-05-16 15:28:39.627243',NULL,2,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'TI-_8S8o-DWlZePwQcLkIwrrVw4YCKdHz91aaOaUugo','482842f1-5c73-4ba7-b7be-a17bdc819507','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-17 16:11:29.994559',185,'2026-05-17 16:11:29.994559',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'Jmvr1lYVe_VcvVJuepoFfdPbUF6NvYwDR8Mvu2_WF_0','f8f45abd-4e83-4f81-ba12-6fb7e1e657af','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-21 03:22:42.792332',186,'2026-05-21 03:22:42.792332',NULL,1,'Chrome',NULL,'Windows 10/11','Desktop','0:0:0:0:0:0:0:1',NULL,'Iq41GR4DP3JUN5gNBk1leTSkHws-3LiJw4fUZ0ljBQA','8d40dee0-6473-40b9-a264-dd6aea8d4c84','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36'),(_binary '','2026-05-21 03:29:28.576467',187,'2026-05-21 03:29:28.576467',NULL,1,'Unknown',NULL,'Unknown Device','Desktop','0:0:0:0:0:0:0:1',NULL,'AZDI-7Yo1oohNXaoN31Yl3LTlKLwugepVPgiN-WdXkk','27373509-a2f3-41b0-b87b-235e330ab67b','node'),(_binary '','2026-05-21 03:29:46.270327',188,'2026-05-21 03:29:46.270327',NULL,1,'Unknown',NULL,'Unknown Device','Desktop','0:0:0:0:0:0:0:1',NULL,'fWUPuDfBYOjNSOoVdJzuT3DT9UbM7PIbDlxVJc9z_UI','dc5f3128-91d1-41c8-b235-65cff85dbbfd','node'),(_binary '','2026-05-21 03:30:15.523778',189,'2026-05-21 03:30:15.523778',NULL,1,'Unknown',NULL,'Unknown Device','Desktop','0:0:0:0:0:0:0:1',NULL,'RVgx5ybVACVqnZ3wrevBXLpAB4XgC9KJFJBnb0qpLl0','dabd433b-930d-45ed-b77b-e000dc52e4b7','node'),(_binary '','2026-05-21 03:42:23.513462',190,'2026-05-21 03:42:23.513462',NULL,1,'Unknown',NULL,'Unknown Device','Desktop','0:0:0:0:0:0:0:1',NULL,'tVvhjnwnEUUWwk3UjKe4vt-R20oj4TwUJZZnJs2FL7g','f92869b0-d4c2-434a-bc53-ea88a6ae06b9','node'),(_binary '','2026-05-21 03:42:32.629308',191,'2026-05-21 03:42:32.629308',NULL,1,'Unknown',NULL,'Unknown Device','Desktop','0:0:0:0:0:0:0:1',NULL,'M4H2eGB8UHQnFImUzzr5i7qrZNzSInqDkG90RCmGjt0','e3ec2b9a-badc-465f-a881-1eec04c3551c','node'),(_binary '','2026-05-21 03:44:04.565800',192,'2026-05-21 03:44:04.565800',NULL,1,'Unknown',NULL,'Unknown Device','Desktop','0:0:0:0:0:0:0:1',NULL,'6t_POk9RlgufdOCLkeDa0P6b-1Xlo5IKeX9PP-1vFUc','50ec0ac3-cb65-4b0e-924b-c0eeb54925a8','node'),(_binary '','2026-05-21 03:46:12.775734',193,'2026-05-21 03:46:12.775734',NULL,1,'Unknown',NULL,'Unknown Device','Desktop','0:0:0:0:0:0:0:1',NULL,'a_0xZIMJeeOCYdbv63hhXYqrABpUqNv0_XJ5VYiMIfs','0977df99-225f-4129-93ec-60238e09c13f','node'),(_binary '','2026-05-21 03:53:08.364733',194,'2026-05-21 03:53:08.364733',NULL,1,'Unknown',NULL,'Unknown Device','Desktop','0:0:0:0:0:0:0:1',NULL,'6qWAloEyIGvRgRqCfZqINbL6mCSQIbSpZ-D1gWp2iLM','8a0dd5ac-a035-497f-9424-8dd3f77bd1ea','node'),(_binary '','2026-05-21 04:06:13.368337',195,'2026-05-21 04:06:13.368337',NULL,1,'Unknown',NULL,'Unknown Device','Desktop','0:0:0:0:0:0:0:1',NULL,'TK8Qsf2AGXhFqfUJ8vgge0mTqrpB6BvRRX2Rq7GAYuI','51b4b080-7e43-4c37-8bac-c01dbd787a19','node'),(_binary '','2026-05-21 04:06:34.389936',196,'2026-05-21 04:06:34.389936',NULL,1,'Unknown',NULL,'Unknown Device','Desktop','0:0:0:0:0:0:0:1',NULL,'UEI59n2bOoxBYB5DMfNQgqCjvNz1ZnlyjaxhCLW0n04','fbf34bcf-8f3c-40ae-a3e4-0cc54ff7924d','node');
/*!40000 ALTER TABLE `user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `first_login` bit(1) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Super','Admin','admin@school.com','$2a$10$BP.WZl5vFE558QBaZ3xFneyodXKarD/Z5bjDN7a9Q0iupEcSgrIay','ADMIN',1,'2026-04-10 15:19:35','2026-04-15 11:23:58',_binary '\0','ADMIN-001'),(2,'Alice','Johnson','alice@school.com','{bcrypt}$2a$10$I046MFxFbDXoEcyaTHEfU.MKXsv4CjSEmQWQAe6FR7.fS5JFrcFiO','TEACHER',1,'2026-04-10 15:19:35','2026-05-16 11:25:00',_binary '\0','TCH-2024-001'),(3,'Priya','Sharma','priya.sharma@school.com','{bcrypt}$2a$10$Ws81AG3G1pzqFqESxTaMVuS0mf5W9VsPXYNdF8csWPwYn87ujVjTS','TEACHER',1,'2026-04-10 15:19:35','2026-05-16 14:11:37',_binary '\0','TCH-2024-002'),(4,'Amit','Verma','amit.verma@school.com','{bcrypt}$2a$10$rH2TxcVVh338nQVonbbT8O548J3MRntsCcIFNrnlU.fhIkP9xLX7O','TEACHER',1,'2026-04-10 15:19:35','2026-04-17 13:32:34',_binary '\0','TCH-2024-003'),(5,'Sunita','Patel','sunita.patel@school.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','TEACHER',1,'2026-04-10 15:19:35','2026-04-10 15:19:35',_binary '\0','TCH-2024-004'),(6,'Vikram','Singh','vikram.singh@school.com','{bcrypt}$2a$10$LByJSxUfWGmdFhOUR3pHHOg4dyVe4WhVXn/edXL.fGDBmKKPU4GHu','TEACHER',1,'2026-04-10 15:19:35','2026-04-15 13:32:46',_binary '','TCH-2024-005'),(7,'Arjun','Patel','arjun.patel@gmail.com','{bcrypt}$2a$10$Q33jexli//mQ8FBf2Ajflu86z4KQH0GGnjyQHmLhjeqz1/7B0lBlG','STUDENT',1,'2026-04-10 15:19:35','2026-04-15 14:19:09',_binary '\0','STU-2024-001'),(8,'Sneha','Singh','sneha.singh@gmail.com','{bcrypt}$2a$10$YN63h2yNI60Ue/Vv.UgHfOc2tPZk//jlJ6.oRX7aLsbxtVnBfeh62','STUDENT',1,'2026-04-10 15:19:35','2026-04-17 13:34:25',_binary '\0','STU-2024-002'),(9,'Rahul','Gupta','rahul.gupta@gmail.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','STUDENT',1,'2026-04-10 15:19:35','2026-04-10 15:19:35',_binary '\0','STU-2024-003'),(10,'Priya','Mehta','priya.mehta@gmail.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','STUDENT',1,'2026-04-10 15:19:35','2026-04-10 15:19:35',_binary '\0','STU-2024-004'),(11,'Rohan','Sharma','rohan.sharma@gmail.com','{bcrypt}$2a$10$KeLAQl5eZWqB4OUfeJYYqOcApm4v58WPGvg32U7HBu/YTBybzsGb2','STUDENT',1,'2026-04-10 15:19:35','2026-04-18 01:44:44',_binary '\0','STU-2024-005'),(12,'Kavya','Reddy','kavya.reddy@gmail.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','STUDENT',1,'2026-04-10 15:19:35','2026-04-10 15:19:35',_binary '\0','STU-2024-006'),(13,'Aditya','Kumar','aditya.kumar@gmail.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','STUDENT',1,'2026-04-10 15:19:35','2026-04-10 15:19:35',_binary '\0','STU-2024-007'),(14,'Pooja','Joshi','pooja.joshi@gmail.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','STUDENT',1,'2026-04-10 15:19:35','2026-04-10 15:19:35',_binary '\0','STU-2024-008'),(15,'Karan','Malhotra','karan.malhotra@gmail.com','{bcrypt}$2a$10$U.XoFGiV/MQpHJIUTeAHiun5jzKGrqafE34k8QCMRJU75e/9qbGom','STUDENT',1,'2026-04-10 15:19:35','2026-05-02 16:11:44',_binary '\0','STU-2024-009'),(16,'Ananya','Iyer','ananya.iyer@gmail.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','STUDENT',1,'2026-04-10 15:19:35','2026-04-10 15:19:35',_binary '\0','STU-2024-010'),(17,'xyz','234','teacher19@gmail.com','{bcrypt}$2a$10$QOCjTpU/b5oKqw2jTqzVv.H6zpMYRMlv8hWMkFpN.cVDallhGlYCe','TEACHER',1,'2026-04-29 06:18:25','2026-04-29 06:18:25',_binary '','TCH-2026-006'),(18,'s1','s1','s1@gmail.com','{bcrypt}$2a$10$sTxKhLmIcs9/saVEyQPWGeVkSGjCiDnT4IDHghfamH2cqAx8ULbqC','STUDENT',1,'2026-05-01 12:06:02','2026-05-01 12:06:02',_binary '','STU-2026-0011'),(19,'Demo','Teacher','teacher@school.com','{bcrypt}$2a$10$L7XCf5teyDvwBWG8hryKw.6u1Y.kqVJiwlqIQbx2MMfq4m33..bCS','TEACHER',1,'2026-05-01 17:05:36','2026-05-02 10:29:11',_binary '\0','TCH-2026-001'),(20,'Demo','Student','student@school.com','{bcrypt}$2a$10$KMfJU.B61LgxVK/2pMBj6OF5LY7F0VLb2TVdyjJf.qeifW2SOgDFa','STUDENT',1,'2026-05-01 17:05:36','2026-05-02 10:27:04',_binary '\0','STU-2026-0001'),(21,'ravi','kumar','ravi@gmail.com','{bcrypt}$2a$10$Llobc8O.oAaiJrMl/g4UQ..QdnaPTAZYHxtZqYrmzU.rRUdJspFOK','STUDENT',1,'2026-05-01 17:16:08','2026-05-01 17:16:08',_binary '','STU-2026-0002'),(86,'Audit','Probe20260507142032','audit.probe.20260507142032@example.test','{bcrypt}$2a$10$zhFAVl08BzSxqYWIk2AVNO1OcNdS2vAnv1NuNcCnylVt7izyoUu4K',NULL,1,'2026-05-07 08:50:33','2026-05-07 08:50:33',_binary '','STU-2026-0013'),(90,'sk','rk','s@gmail.com','{bcrypt}$2a$10$BnSVJepVeA7FKruoQgHTwOTHNCAOQbzk6d0eKheeh.Jlrmo/hKkJa','STUDENT',1,'2026-05-15 15:20:24','2026-05-15 15:20:24',_binary '','STU-2026-0014'),(91,'t','h','t@gmail.com','{bcrypt}$2a$10$VwU0WIZq0YoTt5Cc10Ogq.Yd.KA5o2qSvmTCdDvgwWZXrKcucd7qu',NULL,1,'2026-05-15 15:23:05','2026-05-16 13:31:35',_binary '\0','TCH-2026-007');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'school_db'
--

--
-- Dumping routines for database 'school_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-21  9:36:35
