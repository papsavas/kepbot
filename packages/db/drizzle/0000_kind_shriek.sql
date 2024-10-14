CREATE TABLE `responses` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`text` text NOT NULL,
	`userId` varchar(20) NOT NULL,
	CONSTRAINT `responses_id` PRIMARY KEY(`id`)
);
