import { mysqlTableCreator } from "drizzle-orm/mysql-core";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

export const mySqlTable = mysqlTableCreator((name) => `kep_${name}`);

const connection = await mysql.createConnection(Bun.env.DATABASE_URL as string);
const _db = drizzle(connection);

export const db = _db;