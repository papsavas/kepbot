import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  verbose: true,
  strict: true,
  driver: "mysql2",
  schema: "./schema.ts",
  out: "./drizzle",
});
