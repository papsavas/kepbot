import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2";
import * as responses from "./schema/responses";

// export const mySqlTable = mysqlTableCreator((name) => `kep_${name}`); //! uninitialized error on schemas access

const connection = createConnection(Bun.env.DATABASE_URL as string);
console.log(Bun.env.DATABASE_URL);
const _db = drizzle(connection, {
  schema: { ...responses },
  mode: "default",
  logger: true
});

export const db = _db;