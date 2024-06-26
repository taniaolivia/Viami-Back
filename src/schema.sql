-- Adminer 4.8.1 MySQL 11.1.2-MariaDB-1:11.1.2+maria~ubu2204 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `viami`;
CREATE DATABASE `viami` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `viami`;

DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `image`;
CREATE TABLE `image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `interest`;
CREATE TABLE `interest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `interest` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `language`;
CREATE TABLE `language` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language` varchar(100) NOT NULL,
  `imageName` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneNumber` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` int(10) NOT NULL,
  `sex` enum('f','m') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastConnection` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connected` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `profileImage` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verifyEmailToken` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emailVerified` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plan` enum('free','premium') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'free',
  `fcmToken` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `user_comment`;
CREATE TABLE `user_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `commenterId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `commentId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `commentId` (`commentId`),
  KEY `commenterId` (`commenterId`),
  CONSTRAINT `user_comment_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `user_comment_ibfk_2` FOREIGN KEY (`commentId`) REFERENCES `comment` (`id`),
  CONSTRAINT `user_comment_ibfk_3` FOREIGN KEY (`commenterId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `user_image`;
CREATE TABLE `user_image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `imageId` (`imageId`),
  CONSTRAINT `user_image_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `user_image_ibfk_2` FOREIGN KEY (`imageId`) REFERENCES `image` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `user_interest`;
CREATE TABLE `user_interest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) NOT NULL,
  `interestId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `interestId` (`interestId`),
  CONSTRAINT `user_interest_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `user_interest_ibfk_2` FOREIGN KEY (`interestId`) REFERENCES `interest` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `user_language`;
CREATE TABLE `user_language` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `languageId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `languageId` (`languageId`),
  CONSTRAINT `user_language_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `user_language_ibfk_2` FOREIGN KEY (`languageId`) REFERENCES `language` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `travel`;
CREATE TABLE `travel` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nbParticipant` int(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `url` varchar(200) DEFAULT NULL,
  `telephone` varchar(100) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `latitude` varchar(200) NOT NULL,
  `longitude` varchar(200) NOT NULL,
  `schedule` varchar(500) DEFAULT NULL,
  `language` varchar(200) DEFAULT NULL,
  `accessibility` varchar(200) DEFAULT NULL,
  `imageName` varchar(200) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `location` varchar(200) NOT NULL,
  `isRecommended` tinyint(1) NOT NULL DEFAULT 0,
  `nbParticipant` int(100) DEFAULT NULL,
  `note` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `travel_activity`;
CREATE TABLE `travel_activity` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `idActivity` int(100) NOT NULL,
  `idTravel` int(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idActivity` (`idActivity`),
  KEY `idTravel` (`idTravel`),
  CONSTRAINT `travel_activity_ibfk_1` FOREIGN KEY (`idActivity`) REFERENCES `activity` (`id`),
  CONSTRAINT `travel_activity_ibfk_2` FOREIGN KEY (`idTravel`) REFERENCES `travel` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `travel_image`;
CREATE TABLE `travel_image` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `idTravel` int(100) NOT NULL,
  `idImage` int(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idImage` (`idImage`),
  KEY `idTravel` (`idTravel`),
  CONSTRAINT `travel_image_ibfk_1` FOREIGN KEY (`idImage`) REFERENCES `image` (`id`),
  CONSTRAINT `travel_image_ibfk_2` FOREIGN KEY (`idTravel`) REFERENCES `travel` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `theme`;
CREATE TABLE `theme` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `theme` varchar(100) NOT NULL,
  `icon` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `theme_activity`;
CREATE TABLE `theme_activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `themeId` int(11) NOT NULL,
  `activityId` int(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `themeId` (`themeId`),
  KEY `activityId` (`activityId`),
  CONSTRAINT `theme_activity_ibfk_1` FOREIGN KEY (`themeId`) REFERENCES `theme` (`id`),
  CONSTRAINT `theme_activity_ibfk_2` FOREIGN KEY (`activityId`) REFERENCES `activity` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `activity_image`;
CREATE TABLE `activity_image` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `idActivity` int(100) NOT NULL,
  `idImage` int(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idImage` (`idImage`),
  KEY `idActivity` (`idActivity`),
  CONSTRAINT `activity_image_ibfk_1` FOREIGN KEY (`idImage`) REFERENCES `image` (`id`),
  CONSTRAINT `activity_image_ibfk_2` FOREIGN KEY (`idActivity`) REFERENCES `activity` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `date_location`;
CREATE TABLE `date_location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `nbParticipant` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `user_date_location`;
CREATE TABLE `user_date_location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dateLocationId` int(11) NOT NULL,
  `userId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `dateLocationId` (`dateLocationId`),
  KEY `userId` (`userId`),
  CONSTRAINT `user_date_location_ibfk_1` FOREIGN KEY (`dateLocationId`) REFERENCES `date_location` (`id`),
  CONSTRAINT `user_date_location_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `group`;
CREATE TABLE `group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `user_group`;
CREATE TABLE `user_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `groupId` int(11)  NULL,
  PRIMARY KEY (`userId`,`groupId`),
  UNIQUE KEY `id` (`id`),
  KEY `fk_user_group_group` (`groupId`),
  CONSTRAINT `fk_user_group_group` FOREIGN KEY (`groupId`) REFERENCES `group` (`id`),
  CONSTRAINT `fk_user_group_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `message` VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `senderId` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `groupId` INT  NULL,
  `responderId` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `date` DATETIME NOT NULL,
  `read` ENUM('0', '1') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `senderId` (`senderId`),
  KEY `groupId` (`groupId`),
  KEY `responderId` (`responderId`),
  CONSTRAINT `fk_message_sender` FOREIGN KEY (`senderId`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_message_group` FOREIGN KEY (`groupId`) REFERENCES `group` (`id`),
  CONSTRAINT `fk_message_responder` FOREIGN KEY (`responderId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `message_user_read`;
CREATE TABLE `message_user_read` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `messageId` int(11) NOT NULL,
  `userRead` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `messageId` (`messageId`),
  KEY `userRead` (`userRead`),
  CONSTRAINT `message_user_read_ibfk_1` FOREIGN KEY (`messageId`) REFERENCES `message` (`id`),
  CONSTRAINT `message_user_read_ibfk_2` FOREIGN KEY (`userRead`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `activity_comment`;
CREATE TABLE `activity_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `activityId` int(100) NOT NULL,
  `commenterId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `commentId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `activityId` (`activityId`),
  KEY `commenterId` (`commenterId`),
  KEY `commentId` (`commentId`),
  CONSTRAINT `activity_comment_ibfk_1` FOREIGN KEY (`activityId`) REFERENCES `activity` (`id`),
  CONSTRAINT `activity_comment_ibfk_2` FOREIGN KEY (`commenterId`) REFERENCES `user` (`id`),
  CONSTRAINT `activity_comment_ibfk_3` FOREIGN KEY (`commentId`) REFERENCES `comment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `faq`;
CREATE TABLE `faq` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `question` varchar(1000) NOT NULL,
  `answer` text NOT NULL,
  `isFrequented` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `request_message_user`;
CREATE TABLE `request_message_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `requesterId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiverId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `accept` tinyint(2) DEFAULT NULL,
  `chat` tinyint(2) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `requesterId` (`requesterId`),
  KEY `receiverId` (`receiverId`),
  CONSTRAINT `request_message_user_ibfk_1` FOREIGN KEY (`requesterId`) REFERENCES `user` (`id`),
  CONSTRAINT `request_message_user_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `premium_plan`;
CREATE TABLE `premium_plan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plan` varchar(100) NOT NULL,
  `price` varchar(100) NOT NULL,
  `by` varchar(100) NOT NULL,
  `description` varchar(700) NOT NULL,
  `popular` tinyint(2) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `user_premium_plan`;
CREATE TABLE `user_premium_plan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `planId` int(11) NOT NULL,
  `token` varchar(300) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `planId` (`planId`),
  CONSTRAINT `user_premium_plan_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `user_premium_plan_ibfk_2` FOREIGN KEY (`planId`) REFERENCES `premium_plan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `forum`;
CREATE TABLE `forum` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post` varchar(200) NOT NULL,
  `userId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postedOn` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `forum_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `forum_cities`;
CREATE TABLE `forum_cities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `city` varchar(100) NOT NULL,
  `image` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `image` (`image`),
  CONSTRAINT `forum_cities_ibfk_1` FOREIGN KEY (`image`) REFERENCES `image` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



DROP TABLE IF EXISTS `forum_comment`;
CREATE TABLE `forum_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `forumId` int(11) NOT NULL,
  `comment` varchar(200) NOT NULL,
  `userId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `commentedOn` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `forumId` (`forumId`),
  KEY `userId` (`userId`),
  CONSTRAINT `forum_comment_ibfk_1` FOREIGN KEY (`forumId`) REFERENCES `forum` (`id`),
  CONSTRAINT `forum_comment_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `forum_posts_city`;
CREATE TABLE `forum_posts_city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post` varchar(200) NOT NULL,
  `cityId` int(11) NOT NULL,
  `userId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `postedOn` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `cityId` (`cityId`),
  CONSTRAINT `forum_posts_city_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `forum_posts_city_ibfk_2` FOREIGN KEY (`cityId`) REFERENCES `forum_cities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

