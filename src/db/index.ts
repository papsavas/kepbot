import { drizzle } from "drizzle-orm/mysql2";
import mysql from 'mysql2/promise';
import * as responses from "./schema/responses";


const connection = mysql.createPool(Bun.env.DATABASE_URL as string);
export const db = drizzle(connection, {
  schema: { ...responses },
  mode: "default",
});