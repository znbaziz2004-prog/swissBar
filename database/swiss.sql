-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: swiss
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointment_services`
--

DROP TABLE IF EXISTS `appointment_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appointment_services` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `appointment_id` int(10) unsigned NOT NULL,
  `service_id` int(10) unsigned NOT NULL,
  `service_name` varchar(150) NOT NULL,
  `duration_minutes` int(10) unsigned NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_appointment_service_appointment` (`appointment_id`),
  KEY `fk_appointment_service_service` (`service_id`),
  CONSTRAINT `fk_appointment_service_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_appointment_service_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment_services`
--

LOCK TABLES `appointment_services` WRITE;
/*!40000 ALTER TABLE `appointment_services` DISABLE KEYS */;
INSERT INTO `appointment_services` VALUES (6,6,2,'Beard Trim',20,20.00),(7,7,2,'Beard Trim',20,20.00),(8,8,2,'Beard Trim',20,20.00),(9,9,2,'Beard Trim',20,20.00),(10,11,2,'Beard Trim',20,20.00),(11,12,2,'Beard Trim',20,20.00),(12,13,5,'Beard Trim',20,20.00),(13,14,4,'Classic Haircut',35,35.00),(14,15,5,'Beard Trim',20,20.00),(15,16,4,'Classic Haircut',35,35.00),(16,17,5,'Beard Trim',20,20.00),(17,18,5,'Beard Trim',20,20.00);
/*!40000 ALTER TABLE `appointment_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appointments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int(10) unsigned NOT NULL,
  `branch_id` int(10) unsigned NOT NULL,
  `customer_id` int(10) unsigned NOT NULL,
  `staff_id` int(10) unsigned NOT NULL,
  `appointment_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled','no_show','rescheduled') NOT NULL DEFAULT 'pending',
  `total_amount` decimal(10,2) DEFAULT 0.00,
  `currency` char(3) DEFAULT 'CHF',
  `customer_note` text DEFAULT NULL,
  `internal_note` text DEFAULT NULL,
  `management_token_hash` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_appointment_shop` (`shop_id`),
  KEY `fk_appointment_customer` (`customer_id`),
  KEY `idx_appointment_date` (`appointment_date`),
  KEY `idx_appointment_staff_date` (`staff_id`,`appointment_date`),
  KEY `idx_appointment_branch_date` (`branch_id`,`appointment_date`),
  CONSTRAINT `fk_appointment_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_appointment_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `fk_appointment_shop` FOREIGN KEY (`shop_id`) REFERENCES `barber_shops` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_appointment_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (6,1,2,1,1,'2026-10-05','10:00:00','10:20:00','completed',20.00,'CHF',NULL,NULL,NULL,'2026-10-01 09:25:27','2026-10-01 10:57:41'),(7,1,2,6,1,'2026-10-12','12:00:00','12:20:00','completed',20.00,'CHF',NULL,NULL,NULL,'2026-10-01 11:25:07','2026-10-02 05:11:36'),(8,1,2,7,1,'2026-10-05','10:00:00','10:20:00','cancelled',20.00,'CHF','Test booking',NULL,NULL,'2026-10-02 10:12:22','2026-10-02 10:57:15'),(9,1,2,7,1,'2026-10-08','12:00:00','12:20:00','cancelled',20.00,'CHF','Reschedule test booking',NULL,NULL,'2026-10-02 11:10:12','2026-10-02 11:27:18'),(11,1,2,7,1,'2026-10-08','14:00:00','14:20:00','cancelled',20.00,'CHF','Postman email test',NULL,NULL,'2026-10-02 12:25:23','2026-10-02 12:35:18'),(12,1,2,7,1,'2026-10-09','14:00:00','14:20:00','cancelled',20.00,'CHF','Credentials email test',NULL,NULL,'2026-10-02 12:29:33','2026-10-02 12:32:37'),(13,2,3,8,8,'2026-10-28','13:15:00','13:35:00','rescheduled',20.00,'CHF',NULL,NULL,NULL,'2026-10-06 09:11:17','2026-10-06 12:15:37'),(14,2,3,8,8,'2026-10-27','13:53:00','14:28:00','pending',35.00,'CHF',NULL,NULL,NULL,'2026-10-06 09:46:17','2026-10-06 11:56:04'),(15,2,3,8,8,'2026-10-21','15:30:00','15:50:00','pending',20.00,'CHF',NULL,NULL,NULL,'2026-10-06 09:49:50','2026-10-06 09:49:50'),(16,2,3,8,8,'2026-10-14','15:09:00','15:44:00','rescheduled',35.00,'CHF',NULL,NULL,NULL,'2026-10-06 10:33:57','2026-10-06 12:09:37'),(17,2,3,8,8,'2026-10-29','12:00:00','12:20:00','cancelled',20.00,'CHF',NULL,NULL,NULL,'2026-10-06 10:39:51','2026-10-06 11:37:36'),(18,2,3,8,8,'2026-10-14','13:50:00','14:10:00','pending',20.00,'CHF',NULL,NULL,NULL,'2026-10-06 10:56:07','2026-10-06 11:46:01');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `barber_registrations`
--

DROP TABLE IF EXISTS `barber_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `barber_registrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `shop_id` int(10) unsigned NOT NULL,
  `registration_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `business_name` varchar(200) NOT NULL,
  `registration_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`registration_data`)),
  `add_ons` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`add_ons`)),
  `rejection_reason` text DEFAULT NULL,
  `reviewed_by` int(10) unsigned DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_registration_reviewer` (`reviewed_by`),
  KEY `idx_registration_status` (`registration_status`),
  KEY `idx_registration_user` (`user_id`),
  KEY `idx_registration_shop` (`shop_id`),
  CONSTRAINT `fk_registration_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_registration_shop` FOREIGN KEY (`shop_id`) REFERENCES `barber_shops` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_registration_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barber_registrations`
--

LOCK TABLES `barber_registrations` WRITE;
/*!40000 ALTER TABLE `barber_registrations` DISABLE KEYS */;
INSERT INTO `barber_registrations` VALUES (1,15,2,'approved','Ahmed Barber Studio','{\"city\": \"Zurich\", \"canton\": \"Zurich\", \"address\": \"Bahnhofstrasse 25\", \"website\": \"https://example.com\", \"shopEmail\": \"ahmed.barber.shop@test.com\", \"shopPhone\": \"+41441234567\", \"postalCode\": \"8001\", \"description\": \"Professional barber shop in Zurich\"}','{\"extra_branch\": false, \"priority_support\": false, \"sms_notifications\": true}',NULL,2,'2026-10-03 10:32:52','2026-10-03 05:09:24','2026-10-03 05:32:52'),(2,16,3,'rejected','Kamyar  Studio','{\"city\": \"Zurich\", \"canton\": \"ZH\", \"address\": \"Bahnhofstrasse 10\", \"website\": null, \"shopEmail\": \"kamyar.shop@test.com\", \"shopPhone\": \"+41441234567\", \"postalCode\": \"8001\", \"description\": \"Professional barber shop in Zurich\"}','[]','Shop information could not be verified.',2,'2026-10-03 15:46:22','2026-10-03 10:45:19','2026-10-03 10:46:22'),(3,17,4,'approved','Sara Barber Studio','{\"city\": \"Zurich\", \"canton\": \"ZH\", \"address\": \"Limmatstrasse 20\", \"website\": null, \"shopEmail\": \"sara.shop@test.com\", \"shopPhone\": \"+41441234568\", \"postalCode\": \"8005\", \"description\": \"Professional barber shop in Zurich\"}','[]',NULL,2,'2026-10-03 15:51:47','2026-10-03 10:47:15','2026-10-03 10:51:47'),(4,18,5,'pending','Alizay Barber Studio','{\"city\": \"Zurich\", \"canton\": \"ZH\", \"address\": \"Limmatstrasse 22\", \"website\": null, \"shopEmail\": \"alizay.shop@test.com\", \"shopPhone\": \"+41441234568\", \"postalCode\": \"8085\", \"description\": \"Professional barber shop in Zurich\"}','[]',NULL,NULL,NULL,'2026-10-03 10:48:56','2026-10-03 10:48:56'),(5,19,6,'approved','AbuBakar Barber Studio','{\"city\": \"Zurich\", \"canton\": \"ZH\", \"address\": \"Limmatstrasse 98\", \"website\": null, \"shopEmail\": \"abu.bakar.shop@test.com\", \"shopPhone\": \"+41449874568\", \"postalCode\": \"9085\", \"description\": \"Professional barber shop in Zurich\"}','[]',NULL,2,'2026-10-05 14:59:22','2026-10-03 10:53:34','2026-10-05 09:59:22'),(6,20,7,'approved','Zaid Barber Studio','{\"city\": \"Zurich\", \"canton\": \"ZH\", \"address\": \"Limmatstrasse 18\", \"website\": null, \"shopEmail\": \"zaid.shop@test.com\", \"shopPhone\": \"+41449874568\", \"postalCode\": \"9085\", \"description\": \"Professional barber shop in Zurich\"}','[]',NULL,2,'2026-10-05 14:49:29','2026-10-03 10:54:36','2026-10-05 09:49:29'),(7,21,8,'approved','TAha\'s Barbar shop','{\"city\": \"Zurich\", \"canton\": null, \"address\": \"swksws w12\", \"website\": null, \"shopEmail\": \"taha@gmail.com\", \"shopPhone\": \"098765432\", \"postalCode\": \"2134\", \"description\": \"Professional barbershop registered with Swiss Barber.\"}','{\"instagram\": null}',NULL,2,'2026-10-05 20:32:19','2026-10-05 15:30:27','2026-10-05 15:32:19');
/*!40000 ALTER TABLE `barber_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `barber_shops`
--

DROP TABLE IF EXISTS `barber_shops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `barber_shops` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `owner_id` int(10) unsigned NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `street_name` varchar(150) DEFAULT NULL,
  `building_number` varchar(30) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `canton` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'Switzerland',
  `coc_number` varchar(50) DEFAULT NULL,
  `vat_id` varchar(50) DEFAULT NULL,
  `instagram_username` varchar(100) DEFAULT NULL,
  `referral_source` varchar(150) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `currency` char(3) DEFAULT 'CHF',
  `timezone` varchar(50) DEFAULT 'Europe/Zurich',
  `tax_rate` decimal(5,2) DEFAULT 0.00,
  `subscription_package` varchar(50) DEFAULT NULL,
  `subscription_monthly_price` decimal(10,2) DEFAULT NULL,
  `subscription_currency` char(3) DEFAULT NULL,
  `subscription_one_time_fee` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','active','suspended','inactive') NOT NULL DEFAULT 'pending',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `featured_until` date DEFAULT NULL,
  `featured_priority` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_shop_owner` (`owner_id`),
  KEY `idx_shops_city` (`city`),
  KEY `idx_shops_postal_code` (`postal_code`),
  KEY `idx_shops_canton` (`canton`),
  CONSTRAINT `fk_shop_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barber_shops`
--

LOCK TABLES `barber_shops` WRITE;
/*!40000 ALTER TABLE `barber_shops` DISABLE KEYS */;
INSERT INTO `barber_shops` VALUES (1,3,'Zurich Premium Barber Studio','Premium barber shop in Zurich offering professional haircuts and grooming services.','+41440000000','info@zurichbarber.ch','https://zurichbarber.ch','Bahnhofstrasse 10',NULL,NULL,'Zurich','8001','Zurich','Switzerland',NULL,NULL,NULL,NULL,47.37690000,8.54170000,'CHF','Europe/Zurich',0.00,NULL,NULL,NULL,NULL,'active',0,NULL,0,'2026-09-30 11:09:25','2026-10-01 06:02:45'),(2,15,'Ahmed Barber Studio','Professional barber shop in Zurich','+41441234567','ahmed.barber.shop@test.com','https://example.com','Bahnhofstrasse 25',NULL,NULL,'Zurich','8001','Zurich','Switzerland',NULL,NULL,NULL,NULL,NULL,NULL,'CHF','Europe/Zurich',0.00,NULL,NULL,NULL,NULL,'active',1,NULL,0,'2026-10-03 05:09:24','2026-10-03 12:17:37'),(3,16,'Kamyar  Studio','Professional barber shop in Zurich','+41441234567','kamyar.shop@test.com',NULL,'Bahnhofstrasse 10',NULL,NULL,'Zurich','8001','ZH','Switzerland',NULL,NULL,NULL,NULL,NULL,NULL,'CHF','Europe/Zurich',0.00,NULL,NULL,NULL,NULL,'active',0,NULL,0,'2026-10-03 10:45:19','2026-10-03 11:04:15'),(4,17,'Sara Barber Studio','Professional barber shop in Zurich','+41441234568','sara.shop@test.com',NULL,'Limmatstrasse 20',NULL,NULL,'Zurich','8005','ZH','Switzerland',NULL,NULL,NULL,NULL,NULL,NULL,'CHF','Europe/Zurich',0.00,NULL,NULL,NULL,NULL,'active',0,NULL,0,'2026-10-03 10:47:15','2026-10-05 09:59:06'),(5,18,'Alizay Barber Studio','Professional barber shop in Zurich','+41441234568','alizay.shop@test.com',NULL,'Limmatstrasse 22',NULL,NULL,'Zurich','8085','ZH','Switzerland',NULL,NULL,NULL,NULL,NULL,NULL,'CHF','Europe/Zurich',0.00,NULL,NULL,NULL,NULL,'pending',0,NULL,0,'2026-10-03 10:48:56','2026-10-03 10:48:56'),(6,19,'AbuBakar Barber Studio','Professional barber shop in Zurich','+41449874568','abu.bakar.shop@test.com',NULL,'Limmatstrasse 98',NULL,NULL,'Zurich','9085','ZH','Switzerland',NULL,NULL,NULL,NULL,NULL,NULL,'CHF','Europe/Zurich',0.00,NULL,NULL,NULL,NULL,'active',0,NULL,0,'2026-10-03 10:53:34','2026-10-05 09:59:22'),(7,20,'Zaid Barber Studio','Professional barber shop in Zurich','+41449874568','zaid.shop@test.com',NULL,'Limmatstrasse 18',NULL,NULL,'Zurich','9085','ZH','Switzerland',NULL,NULL,NULL,NULL,NULL,NULL,'CHF','Europe/Zurich',0.00,NULL,NULL,NULL,NULL,'active',0,NULL,0,'2026-10-03 10:54:36','2026-10-05 09:49:29'),(8,21,'TAha\'s Barbar shop','Professional barbershop registered with Swiss Barber.','098765432','taha@gmail.com',NULL,'swksws w12',NULL,NULL,'Zurich','2134',NULL,'Switzerland',NULL,NULL,NULL,NULL,NULL,NULL,'CHF','Europe/Zurich',0.00,NULL,NULL,NULL,NULL,'active',0,NULL,0,'2026-10-05 15:30:27','2026-10-05 15:32:19');
/*!40000 ALTER TABLE `barber_shops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blocked_times`
--

DROP TABLE IF EXISTS `blocked_times`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blocked_times` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int(10) unsigned NOT NULL,
  `branch_id` int(10) unsigned DEFAULT NULL,
  `staff_id` int(10) unsigned DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_blocked_shop` (`shop_id`),
  KEY `fk_blocked_branch` (`branch_id`),
  KEY `fk_blocked_staff` (`staff_id`),
  KEY `idx_blocked_dates` (`start_datetime`,`end_datetime`),
  CONSTRAINT `fk_blocked_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_blocked_shop` FOREIGN KEY (`shop_id`) REFERENCES `barber_shops` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_blocked_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blocked_times`
--

LOCK TABLES `blocked_times` WRITE;
/*!40000 ALTER TABLE `blocked_times` DISABLE KEYS */;
/*!40000 ALTER TABLE `blocked_times` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `branches` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int(10) unsigned NOT NULL,
  `name` varchar(200) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `canton` varchar(100) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_branch_shop` (`shop_id`),
  KEY `idx_branches_city` (`city`),
  CONSTRAINT `fk_branch_shop` FOREIGN KEY (`shop_id`) REFERENCES `barber_shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (2,1,'Zurich Test Branch','+41440000003','testbranch@swissbarber.ch','Teststrasse 10','Zurich','8002','Zurich',47.37690000,8.54170000,'active','2026-10-01 07:45:53','2026-10-01 07:46:56'),(3,2,'Ahmed Barber Studio Main Branch',NULL,NULL,'Bahnhofstrasse 25','Zurich','8001','Zurich',NULL,NULL,'active','2026-10-05 15:19:08','2026-10-05 15:19:08');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `email` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied') DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES (1,'Test User','03001234567','test@example.com','This is a test contact message.','new','2026-10-06 09:38:11','2026-10-06 09:38:11'),(2,'Tester','03001987654','tester@gmail.com','Testingggggg','new','2026-10-06 09:38:59','2026-10-06 09:38:59');
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_pages`
--

DROP TABLE IF EXISTS `content_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `content_pages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int(10) unsigned DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_shop_slug` (`shop_id`,`slug`),
  KEY `idx_shop_id` (`shop_id`),
  KEY `idx_slug` (`slug`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_content_pages_shop` FOREIGN KEY (`shop_id`) REFERENCES `barber_shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_pages`
--

LOCK TABLES `content_pages` WRITE;
/*!40000 ALTER TABLE `content_pages` DISABLE KEYS */;
INSERT INTO `content_pages` VALUES (2,1,'About Our Barber Shop','about-us','Zurich Premium Barber Studio provides professional haircut and grooming services in Zurich.','published','2026-10-01 10:10:59','2026-10-01 10:10:59'),(3,1,'Manager Test Content','manager-test-content','This content was created by the manager.','draft','2026-10-01 10:43:02','2026-10-01 10:43:02');
/*!40000 ALTER TABLE `content_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_booking_verifications`
--

DROP TABLE IF EXISTS `customer_booking_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_booking_verifications` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(191) NOT NULL,
  `shop_id` int(10) unsigned NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_booking_verification_email` (`email`),
  KEY `idx_booking_verification_shop` (`shop_id`),
  KEY `idx_booking_verification_token` (`token_hash`),
  CONSTRAINT `fk_booking_verification_shop` FOREIGN KEY (`shop_id`) REFERENCES `barber_shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_booking_verifications`
--

LOCK TABLES `customer_booking_verifications` WRITE;
/*!40000 ALTER TABLE `customer_booking_verifications` DISABLE KEYS */;
INSERT INTO `customer_booking_verifications` VALUES (1,'ainaswiss101@gmail.com',1,'81dcec18fc387b3276ecc2c95ce8260e0d4d72d289422836f88650827297ffc7','2026-10-02 10:11:38',NULL,'2026-10-02 09:56:38'),(2,'ainaswiss101@gmail.com',1,'27e1efa008b5ad65a2d9c19f6454bb5bf48d1a2334ce62b7fb45eff6f13f3deb','2026-10-02 10:24:07','2026-10-02 10:12:22','2026-10-02 10:09:07'),(3,'ainaswiss101@gmail.com',1,'57b024605c360c909e12285d0653d73bf3e2904df3fad065bf3b49839660ca05','2026-10-02 11:21:06','2026-10-02 11:10:12','2026-10-02 11:06:06'),(4,'ainaswiss101@gmail.com',1,'5c690bc7300987d13a49b94a755a0adb5e9fea176ec70cac7fb071b96dbc2bab','2026-10-02 12:39:26','2026-10-02 12:25:23','2026-10-02 12:24:26'),(5,'ainaswiss101@gmail.com',1,'0bca7defd58f19ead0ad532a79ec37eaefb2af0142f19d04fad1a931de20ef7d','2026-10-02 12:43:53','2026-10-02 12:29:33','2026-10-02 12:28:53'),(6,'ainaswiss101@gmail.com',2,'765f523b9ddcea9d80be31d527bdf893b62e5d1aaa6cc489fd4d5008bbd03628','2026-10-06 09:25:49','2026-10-06 09:11:17','2026-10-06 09:10:49'),(7,'ainaswiss101@gmail.com',2,'c8113729c350565a929c05a1c18c0cc889eb37826d88eb473dc4df173a616fdc','2026-10-06 10:00:44','2026-10-06 09:46:17','2026-10-06 09:45:44'),(8,'ainaswiss101@gmail.com',2,'a5fb61bc43972e8c098aba038b10544e37409d3f4ca37f07efb2185c189780db','2026-10-06 10:04:24','2026-10-06 09:49:50','2026-10-06 09:49:24'),(9,'ainaswiss101@gmail.com',2,'8701a46fc8d8ab4f646ccf738a78c649c43d7fb5b5f1a8151476129ecb9e61f1','2026-10-06 10:48:35','2026-10-06 10:33:57','2026-10-06 10:33:35'),(10,'ainaswiss101@gmail.com',2,'eb28df7a8bc53552f8b8acc654fd761e8a2856a05852e7fc78b03c258337cb62','2026-10-06 10:54:35','2026-10-06 10:39:51','2026-10-06 10:39:35'),(11,'ainaswiss101@gmail.com',2,'20bf1c842537867b8e964eaef43c621257078ec4d094f17c20141181f5792f33','2026-10-06 11:10:43','2026-10-06 10:56:07','2026-10-06 10:55:43');
/*!40000 ALTER TABLE `customer_booking_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_email_verifications`
--

DROP TABLE IF EXISTS `customer_email_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_email_verifications` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` int(10) unsigned DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `code` varchar(10) NOT NULL,
  `purpose` enum('booking_verification','login_verification','password_reset') NOT NULL DEFAULT 'booking_verification',
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `verified_at` timestamp NULL DEFAULT NULL,
  `attempts` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_customer_verification_customer` (`customer_id`),
  KEY `idx_customer_verification_email` (`email`),
  CONSTRAINT `fk_customer_verification_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_email_verifications`
--

LOCK TABLES `customer_email_verifications` WRITE;
/*!40000 ALTER TABLE `customer_email_verifications` DISABLE KEYS */;
INSERT INTO `customer_email_verifications` VALUES (1,NULL,'znbaziz2004@gmail.com','999545','booking_verification','2026-10-02 08:04:48','2026-10-06 10:45:40',1,'2026-10-02 07:54:48'),(2,NULL,'ainaswiss101@gmail.com','449192','booking_verification','2026-10-02 08:08:36','2026-10-02 07:59:24',0,'2026-10-02 07:58:36'),(3,NULL,'ainaswiss101@gmail.com','165518','booking_verification','2026-10-02 10:05:12','2026-10-02 09:56:38',0,'2026-10-02 09:55:12'),(4,NULL,'ainaswiss101@gmail.com','142748','booking_verification','2026-10-02 10:18:06','2026-10-02 10:09:07',0,'2026-10-02 10:08:06'),(5,NULL,'ainaswiss101@gmail.com','963023','booking_verification','2026-10-02 11:15:02','2026-10-02 11:06:06',0,'2026-10-02 11:05:02'),(6,NULL,'ainaswiss101@gmail.com','170440','booking_verification','2026-10-02 12:33:23','2026-10-02 12:24:26',0,'2026-10-02 12:23:23'),(7,NULL,'ainaswiss101@gmail.com','238570','booking_verification','2026-10-02 12:38:19','2026-10-02 12:28:53',0,'2026-10-02 12:28:19'),(8,NULL,'ainaswiss101@gmail.com','485163','booking_verification','2026-10-06 09:20:20','2026-10-06 09:10:49',0,'2026-10-06 09:10:20'),(9,NULL,'ainaswiss101@gmail.com','643358','booking_verification','2026-10-06 09:55:12','2026-10-06 09:45:29',0,'2026-10-06 09:45:12'),(10,NULL,'ainaswiss101@gmail.com','247309','booking_verification','2026-10-06 09:55:29','2026-10-06 09:45:44',0,'2026-10-06 09:45:29'),(11,NULL,'ainaswiss101@gmail.com','527126','booking_verification','2026-10-06 09:59:10','2026-10-06 09:49:24',0,'2026-10-06 09:49:10'),(12,NULL,'ainaswiss101@gmail.com','907967','booking_verification','2026-10-06 10:42:57','2026-10-06 10:33:35',0,'2026-10-06 10:32:57'),(13,NULL,'ainaswiss101@gmail.com','236818','booking_verification','2026-10-06 10:49:18','2026-10-06 10:39:35',0,'2026-10-06 10:39:18'),(14,NULL,'znbaziz2004@gmail.com','794757','booking_verification','2026-10-06 10:55:40',NULL,0,'2026-10-06 10:45:40'),(15,NULL,'ainaswiss101@gmail.com','985793','booking_verification','2026-10-06 11:05:28','2026-10-06 10:55:43',0,'2026-10-06 10:55:28'),(16,NULL,'znbaziz2606@gmail.com','608051','booking_verification','2026-10-06 11:08:01',NULL,0,'2026-10-06 10:58:01');
/*!40000 ALTER TABLE `customer_email_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_password_setup_tokens`
--

DROP TABLE IF EXISTS `customer_password_setup_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_password_setup_tokens` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` int(10) unsigned NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_customer_password_setup_customer` (`customer_id`),
  KEY `idx_customer_password_setup_token` (`token_hash`),
  CONSTRAINT `fk_customer_password_setup_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_password_setup_tokens`
--

LOCK TABLES `customer_password_setup_tokens` WRITE;
/*!40000 ALTER TABLE `customer_password_setup_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_password_setup_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int(10) unsigned NOT NULL,
  `name` varchar(150) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `dashboard_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `credentials_sent_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_customer_shop` (`shop_id`),
  KEY `idx_customer_phone` (`phone`),
  KEY `idx_customer_email` (`email`),
  CONSTRAINT `fk_customer_shop` FOREIGN KEY (`shop_id`) REFERENCES `barber_shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,1,'Ali Ahmed','+41791234567','ali@example.com',NULL,NULL,0,NULL,NULL,'2026-09-30 12:12:20','2026-10-01 11:00:07'),(2,1,'Sara Ahmed','+41790001122','sara@example.com',NULL,NULL,0,NULL,NULL,'2026-09-30 12:26:46','2026-09-30 12:26:46'),(3,1,'Test Customer','+41790009999','test@example.com',NULL,NULL,0,NULL,NULL,'2026-09-30 12:40:35','2026-09-30 12:40:35'),(4,1,'No Show Test','+41790008888','noshow@example.com',NULL,NULL,0,NULL,NULL,'2026-10-01 05:17:04','2026-10-01 05:17:04'),(5,1,'Test Customer','+41790000111','testcustomer5@example.com',NULL,NULL,0,NULL,NULL,'2026-10-01 07:20:30','2026-10-01 07:31:07'),(6,1,'Payment Test Customer','+41790001112','paymenttest@example.com',NULL,NULL,0,NULL,NULL,'2026-10-01 11:25:07','2026-10-01 12:42:01'),(7,1,'Aina Swiss','+41790000000','ainaswiss101@gmail.com','$2b$12$e9/Vj0SMPZZt5fwZ3XiG1uH7NhAiIGleEIMK616igvt16B7A0ueqO','2026-10-02 10:12:22',1,'2026-10-02 12:29:33',NULL,'2026-10-02 10:12:22','2026-10-02 12:29:33'),(8,2,'abc','1233353535','ainaswiss101@gmail.com','$2b$12$uXPU/WtkMpk0ErV7PYaY7.HFXSdEKe04EDlyz4fNfU7MFLzcCC2L.','2026-10-06 09:11:17',1,'2026-10-06 09:11:17',NULL,'2026-10-06 09:11:17','2026-10-06 10:56:07');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `appointment_id` int(10) unsigned DEFAULT NULL,
  `type` enum('booking_confirmation','booking_reminder','booking_created','rescheduled','cancelled') NOT NULL,
  `channel` enum('email','sms') NOT NULL DEFAULT 'email',
  `recipient` varchar(191) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
  `sent_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_notification_user` (`user_id`),
  KEY `fk_notification_appointment` (`appointment_id`),
  CONSTRAINT `fk_notification_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,3,NULL,'booking_confirmation','email','ali@example.com','Appointment Confirmation','Your barber appointment has been confirmed for October 5, 2026 at 10:00.','sent','2026-09-30 17:37:40','2026-09-30 12:36:41'),(2,NULL,NULL,'booking_confirmation','email','test@example.com','Your appointment has been booked','Hello Test Customer, your appointment at Zurich Barber Studio has been booked for 2026-10-07 at 11:00:00. Service: Premium Haircut. Duration: 45 minutes. Price: CHF 40.00.','pending',NULL,'2026-09-30 12:40:35'),(3,NULL,NULL,'booking_confirmation','email','test@example.com','Your appointment has been confirmed','Hello Test Customer, your appointment at Zurich Barber Studio has been confirmed for 2026-10-07 at 11:00:00.','pending',NULL,'2026-09-30 12:44:10'),(4,NULL,NULL,'booking_confirmation','email','sara@example.com','Your appointment has been confirmed','Hello Sara Ahmed, your appointment at Zurich Barber Studio has been confirmed for 2026-10-06 at 14:00:00.','pending',NULL,'2026-10-01 05:08:17'),(5,NULL,NULL,'cancelled','email','sara@example.com','Your appointment has been cancelled','Hello Sara Ahmed, your appointment at Zurich Barber Studio on 2026-10-06 at 14:00:00 has been cancelled.','pending',NULL,'2026-10-01 05:10:06'),(6,NULL,NULL,'booking_confirmation','email','noshow@example.com','Your appointment has been booked','Hello No Show Test, your appointment at Zurich Barber Studio has been booked for 2026-10-08 at 10:00:00. Service: Premium Haircut. Duration: 45 minutes. Price: CHF 40.00.','pending',NULL,'2026-10-01 05:17:04'),(7,NULL,NULL,'booking_confirmation','email','noshow@example.com','Your appointment has been confirmed','Hello No Show Test, your appointment at Zurich Barber Studio has been confirmed for 2026-10-08 at 10:00:00.','pending',NULL,'2026-10-01 05:18:02'),(8,NULL,NULL,'rescheduled','email','testcustomer5@example.com','Your appointment has been rescheduled','Hello Test Customer, your appointment at Zurich Premium Barber Studio has been rescheduled to 2026-10-30 at 15:00:00.','pending',NULL,'2026-10-01 07:33:42'),(9,NULL,6,'booking_confirmation','email','ali@example.com','Your appointment has been booked','Hello Ali Ahmed, your appointment at Zurich Premium Barber Studio has been booked for 2026-10-05 at 10:00:00. Service: Beard Trim. Duration: 20 minutes. Price: CHF 20.00.','pending',NULL,'2026-10-01 09:25:27'),(10,NULL,6,'booking_confirmation','email','ali@example.com','Your appointment has been confirmed','Hello Ali Ahmed, your appointment at Zurich Premium Barber Studio has been confirmed for 2026-10-05 at 10:00:00.','sent','2026-10-01 15:53:04','2026-10-01 10:47:09'),(11,NULL,7,'booking_confirmation','email','paymenttest@example.com','Your appointment has been booked','Hello Payment Test Customer, your appointment at Zurich Premium Barber Studio has been booked for 2026-10-12 at 11:00:00. Service: Beard Trim. Duration: 20 minutes. Price: CHF 20.00.','sent','2026-10-01 17:30:20','2026-10-01 11:25:07'),(12,NULL,7,'booking_confirmation','email','paymenttest@example.com','Your appointment has been confirmed','Hello Payment Test Customer, your appointment at Zurich Premium Barber Studio has been confirmed for 2026-10-12 at 11:00:00.','pending',NULL,'2026-10-01 12:38:58'),(13,NULL,7,'rescheduled','email','paymenttest@example.com','Your appointment has been rescheduled','Hello Payment Test Customer, your appointment at Zurich Premium Barber Studio has been rescheduled to 2026-10-12 at 12:00:00.','pending',NULL,'2026-10-01 12:40:51'),(14,NULL,8,'booking_confirmation','email','ainaswiss101@gmail.com','Your appointment has been booked','Hello Aina, your appointment at Zurich Premium Barber Studio has been booked for 2026-10-05 at 10:00:00. Service: Beard Trim. Duration: 20 minutes. Price: CHF 20.00.','pending',NULL,'2026-10-02 10:12:22'),(15,NULL,9,'booking_confirmation','email','ainaswiss101@gmail.com','Your appointment has been booked','Hello Aina, your appointment at Zurich Premium Barber Studio has been booked for 2026-10-06 at 10:00:00. Service: Beard Trim. Duration: 20 minutes. Price: CHF 20.00.','pending',NULL,'2026-10-02 11:10:12'),(16,NULL,9,'rescheduled','email','ainaswiss101@gmail.com','Your appointment has been rescheduled','Your Swiss Barber appointment has been rescheduled to 2026-10-08 at 12:00:00.','sent',NULL,'2026-10-02 11:25:41'),(17,NULL,11,'booking_confirmation','email','ainaswiss101@gmail.com','Your appointment has been booked','Hello Aina Swiss, your appointment at Zurich Premium Barber Studio has been booked for 2026-10-08 at 14:00:00. Service: Beard Trim. Duration: 20 minutes. Price: CHF 20.00.','sent',NULL,'2026-10-02 12:25:23'),(18,NULL,12,'booking_confirmation','email','ainaswiss101@gmail.com','Your appointment has been booked','Hello Aina Swiss, your appointment at Zurich Premium Barber Studio has been booked for 2026-10-09 at 14:00:00. Service: Beard Trim. Duration: 20 minutes. Price: CHF 20.00.','sent',NULL,'2026-10-02 12:29:33'),(19,NULL,12,'booking_confirmation','email','ainaswiss101@gmail.com','Swiss Barber - Your Customer Dashboard Login','Hello Aina Swiss, your Swiss Barber customer dashboard has been created.','sent',NULL,'2026-10-02 12:29:33'),(20,NULL,11,'cancelled','email','ainaswiss101@gmail.com','Your appointment has been cancelled','Hello undefined, your appointment at Zurich Premium Barber Studio scheduled for Thu Oct 08 2026 00:00:00 GMT+0500 (Pakistan Standard Time) at 14:00:00 has been cancelled.','sent',NULL,'2026-10-02 12:35:18'),(21,NULL,13,'booking_confirmation','email','ainaswiss101@gmail.com','Your appointment has been booked','Hello Talha, your appointment at Ahmed Barber Studio has been booked for 2026-10-20 at 14:30:00. Service: Beard Trim. Duration: 20 minutes. Price: CHF 20.00.','sent',NULL,'2026-10-06 09:11:17'),(22,NULL,13,'booking_confirmation','email','ainaswiss101@gmail.com','Swiss Barber - Your Customer Dashboard Login','Hello Talha, your Swiss Barber customer dashboard has been created.','sent',NULL,'2026-10-06 09:11:17'),(23,NULL,14,'booking_confirmation','email','ainaswiss101@gmail.com','Your appointment has been booked','Hello Mohid, your appointment at Ahmed Barber Studio has been booked for 2026-10-22 at 16:30:00. Service: Classic Haircut. Duration: 35 minutes. Price: CHF 35.00.','sent',NULL,'2026-10-06 09:46:17'),(24,NULL,15,'booking_confirmation','email','ainaswiss101@gmail.com','Your appointment has been booked','Hello Zamil, your appointment at Ahmed Barber Studio has been booked for 2026-10-21 at 15:30:00. Service: Beard Trim. Duration: 20 minutes. Price: CHF 20.00.','sent',NULL,'2026-10-06 09:49:50'),(25,NULL,16,'booking_confirmation','email','ainaswiss101@gmail.com','Your appointment has been booked','Hello Hassan, your appointment at Ahmed Barber Studio has been booked for 2026-10-21 at 14:00:00. Service: Classic Haircut. Duration: 35 minutes. Price: CHF 35.00.','sent',NULL,'2026-10-06 10:33:57'),(26,NULL,17,'booking_confirmation','email','ainaswiss101@gmail.com','Your appointment has been booked','Hello Daud, your appointment at Ahmed Barber Studio has been booked for 2026-10-29 at 12:00:00. Service: Beard Trim. Duration: 20 minutes. Price: CHF 20.00.','sent',NULL,'2026-10-06 10:39:51'),(27,NULL,18,'booking_confirmation','email','ainaswiss101@gmail.com','Your appointment has been booked','Hello abc, your appointment at Ahmed Barber Studio has been booked for 2026-10-28 at 10:30:00. Service: Beard Trim. Duration: 20 minutes. Price: CHF 20.00.','sent',NULL,'2026-10-06 10:56:07'),(28,NULL,17,'cancelled','email','ainaswiss101@gmail.com','Your appointment has been cancelled','Hello undefined, your appointment at Ahmed Barber Studio scheduled for Thu Oct 29 2026 00:00:00 GMT+0500 (Pakistan Standard Time) at 12:00:00 has been cancelled.','sent',NULL,'2026-10-06 11:37:36'),(29,NULL,18,'rescheduled','email','ainaswiss101@gmail.com','Your appointment has been rescheduled','Your Swiss Barber appointment has been rescheduled to 2026-10-14 at 13:50.','sent',NULL,'2026-10-06 11:46:01'),(30,NULL,14,'rescheduled','email','ainaswiss101@gmail.com','Your appointment has been rescheduled','Your Swiss Barber appointment has been rescheduled to 2026-10-21 at 15:50.','sent',NULL,'2026-10-06 11:46:50'),(31,NULL,14,'rescheduled','email','ainaswiss101@gmail.com','Your appointment has been rescheduled','Your Swiss Barber appointment has been rescheduled to 2026-10-27 at 13:53.','sent',NULL,'2026-10-06 11:53:41'),(32,NULL,14,'rescheduled','email','ainaswiss101@gmail.com','Your appointment has been rescheduled','Your Swiss Barber appointment has been rescheduled to 2026-10-27 at 13:53.','sent',NULL,'2026-10-06 11:56:04'),(33,NULL,16,'rescheduled','email','ainaswiss101@gmail.com','Your appointment has been rescheduled','Your Swiss Barber appointment has been rescheduled to 2026-10-14 at 15:09.','sent',NULL,'2026-10-06 12:09:37'),(34,NULL,13,'rescheduled','email','ainaswiss101@gmail.com','Your appointment has been rescheduled','Your Swiss Barber appointment has been rescheduled to 2026-10-28 at 13:15.','sent',NULL,'2026-10-06 12:15:37');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `appointment_id` int(10) unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` char(3) DEFAULT 'CHF',
  `method` varchar(50) DEFAULT NULL,
  `status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `transaction_reference` varchar(255) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_payment_appointment` (`appointment_id`),
  CONSTRAINT `fk_payment_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,6,20.00,'CHF','cash','refunded','REFUND-TEST-006',NULL,'2026-10-01 09:34:39'),(2,7,20.00,'CHF','cash','refunded','CASH-TEST-007',NULL,'2026-10-01 11:28:25'),(4,7,20.00,'CHF','cash','refunded','REFUND-TEST-004',NULL,'2026-10-01 11:48:36'),(5,7,20.00,'CHF','cash','paid','MANAGER-PAID-005','2026-10-01 17:36:21','2026-10-01 12:35:22'),(6,6,20.00,'CHF','cash','paid','RECEPTIONIST-PAID-006','2026-10-01 17:44:53','2026-10-01 12:44:15');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int(10) unsigned NOT NULL,
  `branch_id` int(10) unsigned DEFAULT NULL,
  `customer_id` int(10) unsigned DEFAULT NULL,
  `appointment_id` int(10) unsigned DEFAULT NULL,
  `rating` tinyint(3) unsigned NOT NULL,
  `comment` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_review_shop` (`shop_id`),
  KEY `fk_review_branch` (`branch_id`),
  KEY `fk_review_customer` (`customer_id`),
  KEY `fk_review_appointment` (`appointment_id`),
  CONSTRAINT `fk_review_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_review_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_review_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_review_shop` FOREIGN KEY (`shop_id`) REFERENCES `barber_shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,NULL,3,NULL,5,'Excellent service. Very professional barber and great experience.','approved','2026-10-01 05:33:00');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int(10) unsigned NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `duration_minutes` int(10) unsigned NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `currency` char(3) DEFAULT 'CHF',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_services_shop_status` (`shop_id`,`status`),
  CONSTRAINT `fk_service_shop` FOREIGN KEY (`shop_id`) REFERENCES `barber_shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (2,1,'Beard Trim','Professional beard trimming and styling',20,20.00,'CHF','active','2026-09-30 11:20:02','2026-09-30 11:20:02'),(3,1,'Classic Haircut','Classic men\'s haircut, styling and finishing',35,35.00,'CHF','active','2026-10-01 07:49:15','2026-10-01 07:51:04'),(4,2,'Classic Haircut','Professional classic haircut',35,35.00,'CHF','active','2026-10-05 15:05:16','2026-10-05 15:05:16'),(5,2,'Beard Trim','Professional beard trimming service',20,20.00,'CHF','active','2026-10-05 15:05:16','2026-10-05 15:05:16');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_subscriptions`
--

DROP TABLE IF EXISTS `shop_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_subscriptions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int(10) unsigned NOT NULL,
  `plan_id` int(10) unsigned NOT NULL,
  `status` enum('pending','active','past_due','cancelled','expired') NOT NULL DEFAULT 'pending',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `next_billing_date` date DEFAULT NULL,
  `auto_renew` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_subscription_plan` (`plan_id`),
  KEY `idx_subscription_shop` (`shop_id`),
  KEY `idx_subscription_status` (`status`),
  KEY `idx_subscription_billing` (`next_billing_date`),
  CONSTRAINT `fk_subscription_plan` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`),
  CONSTRAINT `fk_subscription_shop` FOREIGN KEY (`shop_id`) REFERENCES `barber_shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_subscriptions`
--

LOCK TABLES `shop_subscriptions` WRITE;
/*!40000 ALTER TABLE `shop_subscriptions` DISABLE KEYS */;
INSERT INTO `shop_subscriptions` VALUES (1,2,3,'active','2026-10-03',NULL,'2026-11-03',1,'2026-10-03 05:09:24','2026-10-03 05:59:47'),(2,3,1,'active','2026-10-03',NULL,'2026-11-03',1,'2026-10-03 10:45:19','2026-10-03 12:40:02'),(3,4,1,'active','2026-10-03',NULL,'2026-11-03',1,'2026-10-03 10:47:15','2026-10-03 10:51:07'),(4,5,3,'active','2026-10-03',NULL,'2026-11-03',0,'2026-10-03 10:48:56','2026-10-05 09:49:22'),(5,6,1,'active','2026-10-03',NULL,'2026-11-03',1,'2026-10-03 10:53:34','2026-10-03 12:40:03'),(6,7,2,'active','2026-10-05',NULL,'2026-11-05',1,'2026-10-03 10:54:36','2026-10-05 09:49:21'),(7,8,1,'active','2026-10-05',NULL,'2026-11-05',1,'2026-10-05 15:30:27','2026-10-05 15:32:15');
/*!40000 ALTER TABLE `shop_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `shop_id` int(10) unsigned NOT NULL,
  `branch_id` int(10) unsigned DEFAULT NULL,
  `display_name` varchar(150) NOT NULL,
  `bio` text DEFAULT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_staff_user` (`user_id`),
  KEY `fk_staff_shop` (`shop_id`),
  KEY `fk_staff_branch` (`branch_id`),
  CONSTRAINT `fk_staff_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_staff_shop` FOREIGN KEY (`shop_id`) REFERENCES `barber_shops` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_staff_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,4,1,2,'Ahmed','Professional barber specializing in modern men\'s haircuts and beard styling',NULL,'active','2026-09-30 11:43:49','2026-10-01 09:21:57'),(2,5,1,NULL,'Luca','Barber specializing in classic cuts and beard grooming',NULL,'active','2026-09-30 11:44:02','2026-09-30 11:44:02'),(3,6,1,NULL,'Emma M.','Senior receptionist at Zurich Premium Barber Studio',NULL,'active','2026-10-01 06:31:52','2026-10-01 06:35:22'),(4,10,1,2,'Manager Test','Test manager account',NULL,'active','2026-10-01 10:40:40','2026-10-01 10:40:40'),(5,11,1,2,'Manager Created Barber','Created by manager for permission testing',NULL,'active','2026-10-01 10:44:08','2026-10-01 10:44:08'),(6,12,1,NULL,'RBAC Test Barber',NULL,NULL,'active','2026-10-02 05:00:31','2026-10-02 05:00:31'),(7,14,1,2,'Appointment Barber','Professional barber',NULL,'active','2026-10-02 11:46:29','2026-10-02 11:46:29'),(8,15,2,3,'Ahmed Khan','Professional barber at Ahmed Barber Studio',NULL,'active','2026-10-05 15:36:50','2026-10-05 15:40:21');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff_services`
--

DROP TABLE IF EXISTS `staff_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff_services` (
  `staff_id` int(10) unsigned NOT NULL,
  `service_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`staff_id`,`service_id`),
  KEY `fk_staff_service_service` (`service_id`),
  CONSTRAINT `fk_staff_service_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_staff_service_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff_services`
--

LOCK TABLES `staff_services` WRITE;
/*!40000 ALTER TABLE `staff_services` DISABLE KEYS */;
INSERT INTO `staff_services` VALUES (1,2),(3,2),(8,4),(8,5);
/*!40000 ALTER TABLE `staff_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription_payments`
--

DROP TABLE IF EXISTS `subscription_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscription_payments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `subscription_id` int(10) unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` char(3) DEFAULT 'CHF',
  `billing_period_start` date DEFAULT NULL,
  `billing_period_end` date DEFAULT NULL,
  `status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `transaction_reference` varchar(255) DEFAULT NULL,
  `invoice_number` varchar(100) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_subscription_payment_subscription` (`subscription_id`),
  KEY `idx_subscription_payment_status` (`status`),
  KEY `idx_subscription_payment_invoice` (`invoice_number`),
  KEY `idx_subscription_payment_transaction` (`transaction_reference`),
  CONSTRAINT `fk_subscription_payment_subscription` FOREIGN KEY (`subscription_id`) REFERENCES `shop_subscriptions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription_payments`
--

LOCK TABLES `subscription_payments` WRITE;
/*!40000 ALTER TABLE `subscription_payments` DISABLE KEYS */;
INSERT INTO `subscription_payments` VALUES (1,1,49.00,'CHF','2026-10-03','2026-11-03','paid','card','TEST-TXN-001','INV-2026-0001','2026-10-03 10:17:08','2026-10-03 05:12:47'),(2,3,49.00,'CHF','2026-10-03','2026-11-03','paid','card','TXN-SARA-0002','INV-SARA-0002','2026-10-03 15:51:07','2026-10-03 10:50:26');
/*!40000 ALTER TABLE `subscription_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription_plans`
--

DROP TABLE IF EXISTS `subscription_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscription_plans` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `monthly_price` decimal(10,2) NOT NULL,
  `currency` char(3) DEFAULT 'CHF',
  `billing_interval` enum('monthly','yearly') NOT NULL DEFAULT 'monthly',
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription_plans`
--

LOCK TABLES `subscription_plans` WRITE;
/*!40000 ALTER TABLE `subscription_plans` DISABLE KEYS */;
INSERT INTO `subscription_plans` VALUES (1,'Starter','Basic barber shop management plan',49.00,'CHF','monthly','[]','active','2026-10-03 04:58:50','2026-10-05 10:17:10'),(2,'Professional','Advanced plan for growing barber shops',89.00,'CHF','monthly','{\"staff\": 10, \"branches\": 3, \"appointments\": true, \"featured_badge\": false, \"online_booking\": true, \"priority_listing\": false, \"homepage_featured\": false, \"customer_management\": true, \"higher_search_visibility\": false}','active','2026-10-03 04:58:50','2026-10-03 05:49:23'),(3,'Business','Full-featured plan for larger barber businesses',149.00,'CHF','monthly','{\"staff\": 50, \"branches\": 10, \"appointments\": true, \"featured_badge\": true, \"online_booking\": true, \"priority_listing\": true, \"homepage_featured\": true, \"customer_management\": true, \"higher_search_visibility\": true}','active','2026-10-03 04:58:50','2026-10-05 10:33:13');
/*!40000 ALTER TABLE `subscription_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_settings`
--

LOCK TABLES `system_settings` WRITE;
/*!40000 ALTER TABLE `system_settings` DISABLE KEYS */;
INSERT INTO `system_settings` VALUES (1,'site_name','Swiss Barber','2026-10-05 09:44:16','2026-10-05 09:44:16'),(2,'support_email','support@swissbarber.com','2026-10-05 09:44:16','2026-10-05 09:44:16'),(3,'support_phone','+41 44 123 4567','2026-10-05 09:44:16','2026-10-05 09:44:16'),(4,'default_currency','CHF','2026-10-05 09:44:16','2026-10-05 09:44:16'),(5,'default_timezone','Europe/Zurich','2026-10-05 09:44:16','2026-10-05 09:44:16'),(6,'booking_enabled','true','2026-10-05 09:44:16','2026-10-05 09:44:16');
/*!40000 ALTER TABLE `system_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `default_language` varchar(5) NOT NULL DEFAULT 'en',
  `email` varchar(191) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('super_admin','owner','manager','receptionist','barber') NOT NULL DEFAULT 'barber',
  `status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test Barber',NULL,NULL,'en','barber@test.com','+41790000000','$2b$12$LtIqgH7UoqezfdapNjW65euhHL.Lgc3Pw62cSz/z/L9vBFKYmu7te','barber','active','2026-09-30 10:54:48','2026-09-30 10:54:48'),(2,'Swiss Barber Admin',NULL,NULL,'en','admin@swissbarber.com',NULL,'$2b$12$m2lbIDE8x8L4Vn7Er3r7Ou6WA4p9Xa.rufJdhR1gyynu45ihR1/iy','super_admin','active','2026-09-30 11:02:30','2026-09-30 11:02:30'),(3,'John Smith',NULL,NULL,'en','john@zurichbarber.ch','+41790000001','$2b$12$Pgul23RZqKmb/Fk3qbnLl.lqpuw8VnHjjLxDUYFXwUdaLPEkOvsOu','owner','active','2026-09-30 11:09:25','2026-10-01 06:19:43'),(4,'Ahmed Khan',NULL,NULL,'en','ahmed@zurichbarber.ch','+41790000002','$2b$12$8lNU.8QGshSyDOer0R9hq.wkqAZNFhVbRKz8LP3B3e5LyEwVrAl6e','barber','active','2026-09-30 11:43:49','2026-09-30 11:43:49'),(5,'Luca Rossi',NULL,NULL,'en','luca@zurichbarber.ch','+41790000003','$2b$12$jvePOFte6cyvCeOP4SZHLu4P8wcS.BMUTqGNgZenQxx.X9OCDXs/6','barber','active','2026-09-30 11:44:02','2026-09-30 11:44:02'),(6,'Emma M??ller',NULL,NULL,'en','emma@zurichbarber.ch','+41790000004','$2b$12$khh/AhcU1F6Iye5LzUNlGuqXUqIlusWifySt68sgXFtoyYB/x9oV2','receptionist','active','2026-10-01 06:31:52','2026-10-01 06:35:22'),(7,'Test Barber',NULL,NULL,'en','testbarber@swissbarber.com','+41790009999','$2b$12$A687lwl4KZri0dxW3CrOyuSDyRrmG577t3l2nLJ0VqF5H03hM.TXy','barber','active','2026-10-01 10:17:30','2026-10-01 10:17:30'),(8,'Test Barber',NULL,NULL,'en','Ali@swissbarber.com','+41790009999','$2b$12$enykRWXGye2hwEjaViZXQO9Iw18O5CFbrXdrXhdJLzcvG7O/Si9VC','barber','active','2026-10-01 10:18:28','2026-10-01 10:18:28'),(9,'Test Barber',NULL,NULL,'en','Saad@swissbarber.com','+41790009999','$2b$12$NkkWLR..hNObC7G1.fgyt.uK.82B1vV3l7EzPeaeoJkHRus2ZeuS2','barber','active','2026-10-01 10:19:54','2026-10-01 10:19:54'),(10,'Manager Test',NULL,NULL,'en','manager@swissbarber.com','+41790009998','$2b$12$fduZ9GthLUG.osuG9OMLTevqABAXdoMdJ59uEOVmeNPUmK.Y5AG12','manager','active','2026-10-01 10:40:40','2026-10-01 10:40:40'),(11,'Manager Created Barber',NULL,NULL,'en','managercreated@swissbarber.com','+41790009997','$2b$12$oXf.RJleQYYxUVfkWzSwbeOaOkOF.bL.b07wKoeNpHWpHfS4Rj4am','barber','active','2026-10-01 10:44:08','2026-10-01 10:44:08'),(12,'RBAC Test Barber',NULL,NULL,'en','rbacbarber@swissbarber.com','+41790009999','$2b$12$2kA9LE2bajbHFRxBzFgNlujoDSLkUcY7/WLiiZv/JlVA0e3Ry/59.','barber','active','2026-10-02 05:00:31','2026-10-02 05:00:31'),(13,'New Barber',NULL,NULL,'en','newbarber@test.com','+41790001111','$2b$12$xEyAD4ZG.oj.l/dp9guHHO5IZSbQf401dIVYJzi2RnMFhANYhPFJq','barber','active','2026-10-02 11:40:18','2026-10-02 11:40:18'),(14,'Appointment Barber',NULL,NULL,'en','appointmentbarber@test.com','+41790003333','$2b$12$jAOabcDqeTCW9tJkWy2/muNax5LDDZISxytZG0aOaPsZKt38jdLLW','barber','active','2026-10-02 11:46:29','2026-10-02 11:46:29'),(15,'Ahmed Khan',NULL,NULL,'en','ahmed.barber@test.com','+41791234567','$2b$12$3M7eG1xARL0iRFb/ddoiTOj5WVsIycfP50q7tAVNxF9dFAn4maT0q','owner','active','2026-10-03 05:09:24','2026-10-03 05:32:52'),(16,'Ahmed Khan',NULL,NULL,'en','Kamyar.barber@test.com','+41791234567','$2b$12$WHzX4UENS/9MzrZDHkfqK.Tg7qYiuJJ2ByM694XS0ALdW/lKmtVb2','owner','inactive','2026-10-03 10:45:19','2026-10-03 10:45:19'),(17,'Sara Meier',NULL,NULL,'en','sara.barber@test.com','+41791234568','$2b$12$9Az8A0E9uhiDZjwZNCWG6OOsoxwnRCPoJsJ3WE/jGu3MMTNXHfQy6','owner','active','2026-10-03 10:47:15','2026-10-03 10:51:47'),(18,'Alizay ak',NULL,NULL,'en','alizay@test.com','+41791238976','$2b$12$A/UWqYsp7gIEjueGjPUJx.qTlRPOjqbo7n7DMtYhwVvrX6RMPpBvm','owner','inactive','2026-10-03 10:48:56','2026-10-03 10:48:56'),(19,'AbuBakar Azeem',NULL,NULL,'en','AbuBakar@test.com','+41799878976','$2b$12$VjjWTqsz2WIFjZByKnfwkeitBiWlp0voa/zBqWnfAc4AUf2bgNFrO','owner','active','2026-10-03 10:53:34','2026-10-03 12:26:53'),(20,'Zaid Ali',NULL,NULL,'en','zaid@test.com','+41799876576','$2b$12$tv9VTVQVZXM/ls9.IsawCubIvztebkDSB8I9XD5YIMrUF7O/loHM6','owner','active','2026-10-03 10:54:36','2026-10-05 09:49:29'),(21,'Taha Yaseen',NULL,NULL,'en','taha@gmail.com','1234567843','$2b$12$JaIdX3CCdI52yCvzcq5XaebuaK2PxyJmmkzQQ4iI2/hFgq2LyYOom','owner','active','2026-10-05 15:30:27','2026-10-05 15:32:19');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `working_hours`
--

DROP TABLE IF EXISTS `working_hours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `working_hours` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int(10) unsigned NOT NULL,
  `branch_id` int(10) unsigned DEFAULT NULL,
  `staff_id` int(10) unsigned DEFAULT NULL,
  `day_of_week` tinyint(3) unsigned NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `fk_working_shop` (`shop_id`),
  KEY `fk_working_branch` (`branch_id`),
  KEY `fk_working_staff` (`staff_id`),
  KEY `idx_working_hours_day` (`day_of_week`),
  CONSTRAINT `fk_working_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_working_shop` FOREIGN KEY (`shop_id`) REFERENCES `barber_shops` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_working_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `working_hours`
--

LOCK TABLES `working_hours` WRITE;
/*!40000 ALTER TABLE `working_hours` DISABLE KEYS */;
INSERT INTO `working_hours` VALUES (8,1,2,1,1,'09:00:00','18:00:00',1),(9,1,2,1,2,'09:00:00','18:00:00',1),(10,1,2,1,3,'09:00:00','18:00:00',1),(11,1,2,1,4,'09:00:00','18:00:00',1),(12,1,2,1,5,'09:00:00','18:00:00',1),(13,1,2,1,6,'09:00:00','18:00:00',1),(14,2,3,8,1,'09:00:00','18:00:00',1),(15,2,3,8,2,'09:00:00','18:00:00',1),(16,2,3,8,3,'09:00:00','18:00:00',1),(17,2,3,8,4,'09:00:00','18:00:00',1),(18,2,3,8,5,'09:00:00','18:00:00',1),(19,2,3,8,6,'09:00:00','18:00:00',1);
/*!40000 ALTER TABLE `working_hours` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-07 13:07:06
