CREATE TABLE `budgetItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`budgetId` int NOT NULL,
	`inventoryId` int,
	`description` varchar(255) NOT NULL,
	`quantity` int DEFAULT 1,
	`unitValue` decimal(10,2) NOT NULL,
	`total` decimal(10,2) NOT NULL,
	CONSTRAINT `budgetItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `budgets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clientId` int NOT NULL,
	`eventDate` timestamp NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`status` enum('draft','sent','approved','rejected','completed') DEFAULT 'draft',
	`subtotal` decimal(10,2) NOT NULL DEFAULT '0',
	`tax` decimal(10,2) NOT NULL DEFAULT '0',
	`total` decimal(10,2) NOT NULL DEFAULT '0',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `budgets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cashFlow` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` timestamp NOT NULL,
	`type` enum('income','expense') NOT NULL,
	`category` varchar(100) NOT NULL,
	`value` decimal(10,2) NOT NULL,
	`description` text,
	`relatedEventId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cashFlow_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`cpf` varchar(255),
	`phone` varchar(255),
	`email` varchar(320),
	`address` text,
	`city` varchar(100),
	`state` varchar(2),
	`cep` varchar(20),
	`notes` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`budgetId` int NOT NULL,
	`clientId` int NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`eventDate` timestamp NOT NULL,
	`contractContent` text,
	`status` enum('draft','sent','signed','completed','cancelled') DEFAULT 'draft',
	`signedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contracts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100) NOT NULL,
	`quantity` int DEFAULT 0,
	`unitValue` decimal(10,2) NOT NULL,
	`minThreshold` int DEFAULT 5,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inventory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `receipts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`budgetId` int NOT NULL,
	`clientId` int NOT NULL,
	`receiptNumber` varchar(50) NOT NULL,
	`paymentDate` timestamp NOT NULL,
	`value` decimal(10,2) NOT NULL,
	`paymentMethod` varchar(50) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `receipts_id` PRIMARY KEY(`id`),
	CONSTRAINT `receipts_receiptNumber_unique` UNIQUE(`receiptNumber`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `ownerName` text;--> statement-breakpoint
ALTER TABLE `users` ADD `ownerCpf` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `ownerPhone` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `ownerAddress` text;--> statement-breakpoint
ALTER TABLE `users` ADD `ownerCity` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `ownerState` varchar(2);--> statement-breakpoint
CREATE INDEX `budgetItems_budgetId_idx` ON `budgetItems` (`budgetId`);--> statement-breakpoint
CREATE INDEX `budgets_userId_idx` ON `budgets` (`userId`);--> statement-breakpoint
CREATE INDEX `budgets_clientId_idx` ON `budgets` (`clientId`);--> statement-breakpoint
CREATE INDEX `budgets_eventDate_idx` ON `budgets` (`eventDate`);--> statement-breakpoint
CREATE INDEX `cashFlow_userId_idx` ON `cashFlow` (`userId`);--> statement-breakpoint
CREATE INDEX `cashFlow_date_idx` ON `cashFlow` (`date`);--> statement-breakpoint
CREATE INDEX `cashFlow_type_idx` ON `cashFlow` (`type`);--> statement-breakpoint
CREATE INDEX `clients_userId_idx` ON `clients` (`userId`);--> statement-breakpoint
CREATE INDEX `clients_name_idx` ON `clients` (`name`);--> statement-breakpoint
CREATE INDEX `contracts_userId_idx` ON `contracts` (`userId`);--> statement-breakpoint
CREATE INDEX `contracts_budgetId_idx` ON `contracts` (`budgetId`);--> statement-breakpoint
CREATE INDEX `inventory_userId_idx` ON `inventory` (`userId`);--> statement-breakpoint
CREATE INDEX `inventory_category_idx` ON `inventory` (`category`);--> statement-breakpoint
CREATE INDEX `receipts_userId_idx` ON `receipts` (`userId`);--> statement-breakpoint
CREATE INDEX `receipts_receiptNumber_idx` ON `receipts` (`receiptNumber`);