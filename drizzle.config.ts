import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  verbose: true,
  strict: true,
  driver: "mysql2",
  schema: "./schema.ts",
  out: "./drizzle",
  dbCredentials: {
    uri: Bun.env.DATABASE_URL as string
  }
});
