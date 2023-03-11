CREATE TABLE `user` (
      `id` bigint(20) NOT NULL AUTO_INCREMENT,
      `created_by` varchar(50) NOT NULL,
      `created_date` datetime NOT NULL,
      `last_modified_by` varchar(50) DEFAULT NULL,
      `last_modified_date` datetime DEFAULT NULL,
      `version` bigint(20) NOT NULL,
      `entity_status` int(11) NOT NULL,

      `first_name` VARCHAR(25) NOT NULL,
      `last_name`  VARCHAR(50) NOT NULL,
      `username` VARCHAR(50) NOT NULL,
      `password` VARCHAR(255) NOT NULL,
      `email` VARCHAR(100) NOT NULL,
      PRIMARY KEY (`id`)
);