import { mysqlTable, serial, text, varchar } from "drizzle-orm/mysql-core";

export const responses = mysqlTable("responses", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  userId: varchar("userId", { length: 20 }).notNull()
})

export type Response = typeof responses.$inferSelect
export type ResponseInsert = typeof responses.$inferInsert