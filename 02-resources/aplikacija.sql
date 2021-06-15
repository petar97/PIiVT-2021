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
	(2, 'RAM'),
	(4, 'Screen size'),
	(3, 'Storage');
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
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `phone` DISABLE KEYS */;
INSERT INTO `phone` (`phone_id`, `created_at`, `title`, `description`, `price`) VALUES
	(1, '2021-06-01 16:11:07', 'iPhone 12', 'Opis za iPhone 12: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel dignissim enim. In iaculis nulla commodo bibendum laoreet. Praesent vulputate lorem fringilla porttitor scelerisque. Etiam sit amet neque quis sem egestas tincidunt nec ut arcu. Praesent ornare rutrum ex ut pharetra. Integer fermentum libero nec massa gravida porta. Curabitur sed venenatis risus. Suspendisse aliquet vitae ligula vitae dignissim. Quisque placerat orci libero, quis porttitor erat sodales sit amet. Nulla ornare nisl dolor, id dignissim lorem viverra sit amet.', 800.49),
	(40, '2021-06-02 14:30:20', 'Samsung Galaxy S21', 'Opis za Samsung Galaxy S21: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel dignissim enim. In iaculis nulla commodo bibendum laoreet. Praesent vulputate lorem fringilla porttitor scelerisque. Etiam sit amet neque quis sem egestas tincidunt nec ut arcu. Praesent ornare rutrum ex ut pharetra. Integer fermentum libero nec massa gravida porta. Curabitur sed venenatis risus. Suspendisse aliquet vitae ligula vitae dignissim. Quisque placerat orci libero, quis porttitor erat sodales sit amet. Nulla ornare nisl dolor, id dignissim lorem viverra sit amet.', 999.35),
	(42, '2021-06-02 14:36:08', 'Samsung Galaxy S20', 'Opis za Samsung Galaxy S20: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel dignissim enim. In iaculis nulla commodo bibendum laoreet. Praesent vulputate lorem fringilla porttitor scelerisque. Etiam sit amet neque quis sem egestas tincidunt nec ut arcu. Praesent ornare rutrum ex ut pharetra. Integer fermentum libero nec massa gravida porta. Curabitur sed venenatis risus. Suspendisse aliquet vitae ligula vitae dignissim. Quisque placerat orci libero, quis porttitor erat sodales sit amet. Nulla ornare nisl dolor, id dignissim lorem viverra sit amet.', 799.97),
	(44, '2021-06-02 14:40:58', 'Samsung Galaxy S8', 'Opis za Samsung Galaxy S8: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel dignissim enim. In iaculis nulla commodo bibendum laoreet. Praesent vulputate lorem fringilla porttitor scelerisque. Etiam sit amet neque quis sem egestas tincidunt nec ut arcu. Praesent ornare rutrum ex ut pharetra. Integer fermentum libero nec massa gravida porta. Curabitur sed venenatis risus. Suspendisse aliquet vitae ligula vitae dignissim. Quisque placerat orci libero, quis porttitor erat sodales sit amet. Nulla ornare nisl dolor, id dignissim lorem viverra sit amet.', 325.25),
	(45, '2021-06-02 15:39:09', 'iPhone X', 'Opis za iPhone X: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel dignissim enim. In iaculis nulla commodo bibendum laoreet. Praesent vulputate lorem fringilla porttitor scelerisque. Etiam sit amet neque quis sem egestas tincidunt nec ut arcu. Praesent ornare rutrum ex ut pharetra. Integer fermentum libero nec massa gravida porta. Curabitur sed venenatis risus. Suspendisse aliquet vitae ligula vitae dignissim. Quisque placerat orci libero, quis porttitor erat sodales sit amet. Nulla ornare nisl dolor, id dignissim lorem viverra sit amet.', 550.99),
	(47, '2021-06-03 14:55:44', 'iPhone Xs', 'Opis za iPhone Xs: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel dignissim enim. In iaculis nulla commodo bibendum laoreet. Praesent vulputate lorem fringilla porttitor scelerisque. Etiam sit amet neque quis sem egestas tincidunt nec ut arcu. Praesent ornare rutrum ex ut pharetra. Integer fermentum libero nec massa gravida porta. Curabitur sed venenatis risus. Suspendisse aliquet vitae ligula vitae dignissim. Quisque placerat orci libero, quis porttitor erat sodales sit amet. Nulla ornare nisl dolor, id dignissim lorem viverra sit amet.', 600.33),
	(49, '2021-06-15 17:13:45', 'Windows Phone X', 'Opis za Windows Phone X: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel dignissim enim. In iaculis nulla commodo bibendum laoreet. Praesent vulputate lorem fringilla porttitor scelerisque. Etiam sit amet neque quis sem egestas tincidunt nec ut arcu. Praesent ornare rutrum ex ut pharetra. Integer fermentum libero nec massa gravida porta. Curabitur sed venenatis risus. Suspendisse aliquet vitae ligula vitae dignissim. Quisque placerat orci libero, quis porttitor erat sodales sit amet. Nulla ornare nisl dolor, id dignissim lorem viverra sit amet.', 450.81);
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
) ENGINE=InnoDB AUTO_INCREMENT=265 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
	(258, '64GB', 47, 14),
	(260, '10', 49, 3),
	(261, 'Standard LTE', 49, 5),
	(262, '1.5GB', 49, 8),
	(263, '5.6"', 49, 11),
	(264, '512GB', 49, 16);
/*!40000 ALTER TABLE `phone_feature` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_image_path` (`image_path`),
  KEY `fk_photo_phone_id` (`phone_id`),
  CONSTRAINT `fk_photo_phone_id` FOREIGN KEY (`phone_id`) REFERENCES `phone` (`phone_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
INSERT INTO `photo` (`photo_id`, `image_path`, `phone_id`) VALUES
	(59, 'static/uploads/2021/06/43bd0c87-7929-4195-b8ae-c95e17cfa5ed-Apple-Logo-1.png', 1),
	(60, 'static/uploads/2021/06/11179a8c-bd4e-4826-a109-45232d0474fb-u_10215596.jpg', 1),
	(61, 'static/uploads/2021/06/d786dbb3-04f2-47f5-ad47-254827ee8e8e-iphone-12-2020.jpg', 1),
	(62, 'static/uploads/2021/06/a820ce1b-edb5-4c34-8855-93f97d190f66-Apple-Logo-1.png', 45),
	(63, 'static/uploads/2021/06/5b2566a4-9eed-4bdb-af02-004fd09caab0-u_10215596.jpg', 45),
	(64, 'static/uploads/2021/06/f65dc300-cc8f-4f1a-92d4-c446321a65e7-iphone-12-2020.jpg', 45),
	(65, 'static/uploads/2021/06/4ea6ace9-73e4-4a6f-9266-d35031b712c2-Apple-Logo-1.png', 47),
	(66, 'static/uploads/2021/06/07c4485b-454c-4d89-a609-5abfcc39c10c-u_10215596.jpg', 47),
	(67, 'static/uploads/2021/06/6e7042d4-9a53-4728-a17b-74118d18fbda-iphone-12-2020.jpg', 47),
	(68, 'static/uploads/2021/06/7619b448-f10e-4a05-8984-5ca65a40369c-Screenshot_2019-06-15_at_32803_AM_hij9sw.png', 40),
	(69, 'static/uploads/2021/06/0a440866-d513-4462-9d8b-8bd9d0c45e86-samsung-smartphones-1618864389.jpg', 40),
	(70, 'static/uploads/2021/06/4d2d18c9-f3d7-4f3a-97df-b67f6c9b6b6b-Screenshot_2019-06-15_at_32803_AM_hij9sw.png', 42),
	(71, 'static/uploads/2021/06/b2dc6eb9-5d41-4c9b-8e84-7a8db61fbb32-samsung-smartphones-1618864389.jpg', 42),
	(72, 'static/uploads/2021/06/34af5aba-d9c4-4ed9-a1f2-a1802b7253f8-Screenshot_2019-06-15_at_32803_AM_hij9sw.png', 44),
	(73, 'static/uploads/2021/06/76dcfd94-b7eb-4e5f-a489-8ce92778a14c-samsung-smartphones-1618864389.jpg', 44),
	(74, 'static/uploads/2021/06/c5a6623a-04aa-4b8c-82e8-7105deaf482c-6f050e39-windows_10_logobluesvg-copy_windows.jpg', 49),
	(75, 'static/uploads/2021/06/97266b04-4dc8-4eac-8526-56f14ec26174-windows-phone-the-final-review.jpg', 49);
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
