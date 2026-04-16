CREATE TABLE `hotel_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timezone_iana` text(64) DEFAULT 'Europe/Madrid' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reservations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_type_id` integer NOT NULL,
	`room_id` integer,
	`status` text(16) NOT NULL,
	`check_in_date` text(10) NOT NULL,
	`check_out_date` text(10) NOT NULL,
	`guest_name` text(200) NOT NULL,
	`guest_email` text(254) NOT NULL,
	`guest_phone` text(64) NOT NULL,
	`notes` text(2000),
	`cancel_reason` text(500),
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`room_type_id`) REFERENCES `room_types`(`id`) ON UPDATE cascade ON DELETE restrict,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `reservations_status_idx` ON `reservations` (`status`);--> statement-breakpoint
CREATE INDEX `reservations_room_type_status_idx` ON `reservations` (`room_type_id`,`status`);--> statement-breakpoint
CREATE INDEX `reservations_room_id_idx` ON `reservations` (`room_id`);--> statement-breakpoint
CREATE INDEX `reservations_stay_idx` ON `reservations` (`check_in_date`,`check_out_date`);--> statement-breakpoint
CREATE TABLE `room_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text(32) NOT NULL,
	`display_name` text(128) NOT NULL,
	`oriented_price_cents` integer NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `room_types_code_unique` ON `room_types` (`code`);--> statement-breakpoint
CREATE INDEX `room_types_code_idx` ON `room_types` (`code`);--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_type_id` integer NOT NULL,
	`unit_code` text(64) NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`room_type_id`) REFERENCES `room_types`(`id`) ON UPDATE cascade ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rooms_unit_code_unique` ON `rooms` (`unit_code`);--> statement-breakpoint
CREATE INDEX `rooms_room_type_id_idx` ON `rooms` (`room_type_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text(64) NOT NULL,
	`password_hash` text(256) NOT NULL,
	`role` text(32) DEFAULT 'reception' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);