CREATE TABLE `employee_salaries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee_id` integer NOT NULL,
	`from_date` text NOT NULL,
	`to_date` text,
	`title` text NOT NULL,
	`salary` integer NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`ssn` text NOT NULL,
	`dob` text NOT NULL,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`zip` text NOT NULL,
	`phone` text NOT NULL,
	`join_date` text NOT NULL,
	`exit_date` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employees_ssn_unique` ON `employees` (`ssn`);