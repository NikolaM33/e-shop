CREATE TABLE `category` (
      `id` bigint(20) NOT NULL AUTO_INCREMENT,
      `created_by` varchar(50) NOT NULL,
      `created_date` datetime NOT NULL,
      `last_modified_by` varchar(50) DEFAULT NULL,
      `last_modified_date` datetime DEFAULT NULL,
      `version` bigint(20) NOT NULL,
      `entity_status` int(11) NOT NULL,

      `category_name` VARCHAR(25) NOT NULL,
      `file_system_identifier`  varchar(36) UNIQUE,
      `image_type` varchar(15),
      `active` BIT(1) DEFAULT b'1',
      `specification` MEDIUMTEXT,
      PRIMARY KEY (`id`)
);


CREATE TABLE `sub_category` (
      `id` bigint(20) NOT NULL AUTO_INCREMENT,
      `created_by` varchar(50) NOT NULL,
      `created_date` datetime NOT NULL,
      `last_modified_by` varchar(50) DEFAULT NULL,
      `last_modified_date` datetime DEFAULT NULL,
      `version` bigint(20) NOT NULL,
      `entity_status` int(11) NOT NULL,

      `sub_category_name` VARCHAR(25) NOT NULL,
      `file_system_identifier`  varchar(36) UNIQUE,
      `image_type` varchar(15),
      `active` BIT(1) DEFAULT b'1',
      `specification` MEDIUMTEXT,
      `category_id` bigint(20),
       PRIMARY KEY (`id`),
       KEY `fk_sub_category_category` (`category_id`),
       CONSTRAINT `fk_sub_category_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
);