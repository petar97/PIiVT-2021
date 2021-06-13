/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `aplikacija` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `aplikacija`;

CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `is_active`) VALUES
	(1, 'petar', '$2b$11$oKLmOfpi5V2oUUdD3wSI8u84klqE/ZVgJ8OXvDMUNKB1x5qtuPP4G', 1),
	(4, 'admin', '$2b$11$jBtxT/986To4GutprTPm7.beJugX0crdVnVfEf26sEGcXcudQbXB2', 1);
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` (`category_id`, `name`) VALUES
	(5, 'Network'),
	(1, 'Operativni sistem'),
	(6, 'Promenjena test kategorija'),
	(2, 'RAM'),
	(4, 'Screen size'),
	(3, 'Storage'),
	(8, 'Test Kategorija 3');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `feature` (
  `feature_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`feature_id`),
  UNIQUE KEY `uq_feature_name_category_id` (`name`,`category_id`),
  KEY `fk_feature_category_id` (`category_id`),
  CONSTRAINT `fk_feature_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `feature` DISABLE KEYS */;
INSERT INTO `feature` (`feature_id`, `name`, `category_id`) VALUES
	(14, '<128GB Storage', 3),
	(8, '<2GB RAM', 2),
	(11, '<6\'\' Screen', 4),
	(16, '>256GB Storage', 3),
	(13, '>6.5\'\' Screen', 4),
	(10, '>6GB RAM', 2),
	(15, '128-256GB Storage', 3),
	(9, '2-6GB RAM', 2),
	(4, '3G Type', 5),
	(6, '4G Type', 5),
	(7, '5G Type', 5),
	(12, '6-6.5\'\' Screen', 4),
	(1, 'Android', 1),
	(2, 'iOS', 1),
	(5, 'LTE Type', 5),
	(21, 'test', 1),
	(3, 'Windows', 1);
/*!40000 ALTER TABLE `feature` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `phone` (
  `phone_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `title` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  PRIMARY KEY (`phone_id`),
  UNIQUE KEY `uq_phone_title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `phone` DISABLE KEYS */;
INSERT INTO `phone` (`phone_id`, `created_at`, `title`, `description`, `price`) VALUES
	(1, '2021-06-01 16:11:07', 'iPhone 12', 'Opis za iPhone 12: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel dignissim enim. In iaculis nulla commodo bibendum laoreet. Praesent vulputate lorem fringilla porttitor scelerisque. Etiam sit amet neque quis sem egestas tincidunt nec ut arcu. Praesent ornare rutrum ex ut pharetra. Integer fermentum libero nec massa gravida porta. Curabitur sed venenatis risus. Suspendisse aliquet vitae ligula vitae dignissim. Quisque placerat orci libero, quis porttitor erat sodales sit amet. Nulla ornare nisl dolor, id dignissim lorem viverra sit amet.', 800.49),
	(40, '2021-06-02 14:30:20', 'Samsung Galaxy S21', 'Opis za Samsung Galaxy S21: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel dignissim enim. In iaculis nulla commodo bibendum laoreet. Praesent vulputate lorem fringilla porttitor scelerisque. Etiam sit amet neque quis sem egestas tincidunt nec ut arcu. Praesent ornare rutrum ex ut pharetra. Integer fermentum libero nec massa gravida porta. Curabitur sed venenatis risus. Suspendisse aliquet vitae ligula vitae dignissim. Quisque placerat orci libero, quis porttitor erat sodales sit amet. Nulla ornare nisl dolor, id dignissim lorem viverra sit amet.', 999.35),
	(42, '2021-06-02 14:36:08', 'Samsung Galaxy S20', 'Opis za Samsung Galaxy S20: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel dignissim enim. In iaculis nulla commodo bibendum laoreet. Praesent vulputate lorem fringilla porttitor scelerisque. Etiam sit amet neque quis sem egestas tincidunt nec ut arcu. Praesent ornare rutrum ex ut pharetra. Integer fermentum libero nec massa gravida porta. Curabitur sed venenatis risus. Suspendisse aliquet vitae ligula vitae dignissim. Quisque placerat orci libero, quis porttitor erat sodales sit amet. Nulla ornare nisl dolor, id dignissim lorem viverra sit amet.', 799.97),
	(44, '2021-06-02 14:40:58', 'Samsung Galaxy S8', 'Opis za Samsung Galaxy S8: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel dignissim enim. In iaculis nulla commodo bibendum laoreet. Praesent vulputate lorem fringilla porttitor scelerisque. Etiam sit amet neque quis sem egestas tincidunt nec ut arcu. Praesent ornare rutrum ex ut pharetra. Integer fermentum libero nec massa gravida porta. Curabitur sed venenatis risus. Suspendisse aliquet vitae ligula vitae dignissim. Quisque placerat orci libero, quis porttitor erat sodales sit amet. Nulla ornare nisl dolor, id dignissim lorem viverra sit amet.', 325.25),
	(45, '2021-06-02 15:39:09', 'iPhone X', 'Opis za iPhone X: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel dignissim enim. In iaculis nulla commodo bibendum laoreet. Praesent vulputate lorem fringilla porttitor scelerisque. Etiam sit amet neque quis sem egestas tincidunt nec ut arcu. Praesent ornare rutrum ex ut pharetra. Integer fermentum libero nec massa gravida porta. Curabitur sed venenatis risus. Suspendisse aliquet vitae ligula vitae dignissim. Quisque placerat orci libero, quis porttitor erat sodales sit amet. Nulla ornare nisl dolor, id dignissim lorem viverra sit amet.', 550.99),
	(47, '2021-06-03 14:55:44', 'iPhone Xs', 'Opis za iPhone Xs: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel dignissim enim. In iaculis nulla commodo bibendum laoreet. Praesent vulputate lorem fringilla porttitor scelerisque. Etiam sit amet neque quis sem egestas tincidunt nec ut arcu. Praesent ornare rutrum ex ut pharetra. Integer fermentum libero nec massa gravida porta. Curabitur sed venenatis risus. Suspendisse aliquet vitae ligula vitae dignissim. Quisque placerat orci libero, quis porttitor erat sodales sit amet. Nulla ornare nisl dolor, id dignissim lorem viverra sit amet.', 600.33);
/*!40000 ALTER TABLE `phone` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `phone_category` (
  `phone_category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `phone_id` int(10) unsigned NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`phone_category_id`),
  UNIQUE KEY `uq_phone_category_phone_id_category_id` (`phone_id`,`category_id`) USING BTREE,
  KEY `fk_phone_category_category_id` (`category_id`),
  CONSTRAINT `fk_phone_category_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_phone_category_phone_id` FOREIGN KEY (`phone_id`) REFERENCES `phone` (`phone_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `phone_category` DISABLE KEYS */;
INSERT INTO `phone_category` (`phone_category_id`, `phone_id`, `category_id`) VALUES
	(1, 1, 1),
	(2, 1, 2),
	(3, 1, 3),
	(4, 42, 1);
/*!40000 ALTER TABLE `phone_category` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `phone_feature` (
  `phone_feature_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `value` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_id` int(10) unsigned NOT NULL,
  `feature_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`phone_feature_id`),
  UNIQUE KEY `uq_phone_feature_phone_id_feature_id` (`phone_id`,`feature_id`),
  KEY `fk_phone_feature_feature_id` (`feature_id`),
  CONSTRAINT `fk_phone_feature_feature_id` FOREIGN KEY (`feature_id`) REFERENCES `feature` (`feature_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_phone_feature_phone_id` FOREIGN KEY (`phone_id`) REFERENCES `phone` (`phone_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=259 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `phone_feature` DISABLE KEYS */;
INSERT INTO `phone_feature` (`phone_feature_id`, `value`, `phone_id`, `feature_id`) VALUES
	(1, '14', 1, 2),
	(2, '3.0G', 1, 4),
	(193, '11', 40, 1),
	(194, '4.5G', 40, 6),
	(195, '8GB', 40, 10),
	(196, '6.7\'\'', 40, 13),
	(197, '128GB', 40, 15),
	(198, '10', 42, 1),
	(199, '4.5G', 42, 6),
	(200, '7GB', 42, 10),
	(201, '6.6\'\'', 42, 13),
	(202, '256GB', 42, 15),
	(203, '9', 44, 1),
	(204, '3.5G', 44, 4),
	(205, '4GB', 44, 9),
	(206, '5.8"', 44, 11),
	(207, '64GB', 44, 14),
	(208, '12', 45, 2),
	(209, '4.5G', 45, 6),
	(210, '4GB', 45, 9),
	(211, '5.8"', 45, 11),
	(212, '64GB', 45, 14),
	(221, '4GB', 1, 9),
	(222, '6.1"', 1, 12),
	(223, '64GB', 1, 14),
	(254, '12', 47, 2),
	(255, '4.5G', 47, 6),
	(256, '4GB', 47, 9),
	(257, '5.9"', 47, 11),
	(258, '64GB', 47, 14);
/*!40000 ALTER TABLE `phone_feature` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_image_path` (`image_path`),
  KEY `fk_photo_phone_id` (`phone_id`),
  CONSTRAINT `fk_photo_phone_id` FOREIGN KEY (`phone_id`) REFERENCES `phone` (`phone_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
INSERT INTO `photo` (`photo_id`, `image_path`, `phone_id`) VALUES
	(1, 'static/uploads/2021/05/1.jpg', 1),
	(2, 'static/uploads/2021/05/1-all.jpg', 1),
	(48, 'static/uploads/2021/06/41df59a9-e6a3-4772-92d1-008842dcf925-ronan-furuta-ZJ8M0bfiu8U-unsplash.jpg', 40),
	(49, 'static/uploads/2021/06/54fad404-3764-4791-afdb-212972f2e6ab-ronan-furuta-ZJ8M0bfiu8U-unsplash.jpg', 42),
	(50, 'static/uploads/2021/06/b023d0d3-04f6-4022-8384-4e64f55c7fe8-ronan-furuta-ZJ8M0bfiu8U-unsplash.jpg', 44),
	(51, 'static/uploads/2021/06/8eb5190e-9fab-47df-898c-35ee97909876-GY8Rg8f.png', 45),
	(54, 'static/uploads/2021/06/d1fda9a7-9b45-45b7-afd6-9e1ca6ab29cc-GY8Rg8f.png', 47),
	(55, 'static/uploads/2021/06/0ea71f25-b73a-465e-90b8-20b088ef3f1a-wallhaven-429p9n_1920x1080.png', 47);
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
