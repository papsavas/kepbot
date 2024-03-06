import {
	boolean,
	int,
	mysqlTable,
	serial,
	text,
	varchar,
} from "drizzle-orm/mysql-core";

// Timestamp: 3 bits for day index, 5 bits for time of day
// Format: (day << 3) | time, day and time must not be zero and time must not go above 23
// e.g. 00100001 = Monday 01:00

export const notifications = mysqlTable("notifications", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	timestamp: int("timestamp").notNull(),
	paused: boolean("paused").notNull().default(false),
	channelId: varchar("channelId", { length: 20 }).notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type NotificationInsert = typeof notifications.$inferInsert;
