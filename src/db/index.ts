import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as notifications from "~/db/schema/notifications";
import * as responses from "./schema/responses";

const connection = mysql.createPool(Bun.env.DATABASE_URL as string);
export const db = drizzle(connection, {
	schema: { ...responses, ...notifications },
	mode: "default",
});
