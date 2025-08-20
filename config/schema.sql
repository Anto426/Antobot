-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: antobot
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.1

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
-- Table structure for table `guild`
--

DROP TABLE IF EXISTS `guild`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guild` (
  `ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `NOME` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `WELCOME_ID` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `LOG_ID` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ROLEDEFAULT_ID` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ROLEBOTDEFAULT_ID` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `RULES_CH_ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `BOOST_CH_ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ANNOUNCEMENT_CH_ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `guild_member`
--

DROP TABLE IF EXISTS `guild_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guild_member` (
  `GUILD_ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `MEMBER_ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`GUILD_ID`,`MEMBER_ID`),
  KEY `MEMBER_ID` (`MEMBER_ID`),
  CONSTRAINT `guild_member_ibfk_1` FOREIGN KEY (`GUILD_ID`) REFERENCES `guild` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guild_member_ibfk_2` FOREIGN KEY (`MEMBER_ID`) REFERENCES `member` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `holyday`
--

DROP TABLE IF EXISTS `holyday`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holyday` (
  `GUILD_ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `CATEGORY_CH` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `NAME_CHANNEL` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `HOLYDAY_CHANNEL` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`GUILD_ID`),
  CONSTRAINT `holyday_ibfk_1` FOREIGN KEY (`GUILD_ID`) REFERENCES `guild` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs` (
  `ID` bigint unsigned NOT NULL AUTO_INCREMENT,
  `GUILD_ID` varchar(25) COLLATE utf8mb4_general_ci NOT NULL,
  `LOG_TYPE` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `ACTOR_ID` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `TARGET_ID` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `TARGET_TYPE` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `DETAILS` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `CREATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `idx_guild_type` (`GUILD_ID`,`LOG_TYPE`),
  KEY `idx_actor_id` (`ACTOR_ID`),
  KEY `idx_target_id` (`TARGET_ID`),
  CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`GUILD_ID`) REFERENCES `guild` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `logs_chk_1` CHECK (json_valid(`DETAILS`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `NOME` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ACCCREATED` date DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `member_role`
--

DROP TABLE IF EXISTS `member_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_role` (
  `MEMBER_ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ROLE_ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`MEMBER_ID`,`ROLE_ID`),
  KEY `ROLE_ID` (`ROLE_ID`),
  CONSTRAINT `member_role_ibfk_1` FOREIGN KEY (`MEMBER_ID`) REFERENCES `member` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `member_role_ibfk_2` FOREIGN KEY (`ROLE_ID`) REFERENCES `role` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `NOME` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `COLORE` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `IDGUILD` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `IDGUILD` (`IDGUILD`),
  CONSTRAINT `role_ibfk_1` FOREIGN KEY (`IDGUILD`) REFERENCES `guild` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `temp_channel`
--

DROP TABLE IF EXISTS `temp_channel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `temp_channel` (
  `GUILD_ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `CATEGORY_CH` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `DUO_CH` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `TRIO_CH` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `QUARTET_CH` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `NOLIMIT_CH` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`GUILD_ID`),
  CONSTRAINT `temp_channel_ibfk_1` FOREIGN KEY (`GUILD_ID`) REFERENCES `guild` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-20 18:43:35
