import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";

// Use SQLite for development, PostgreSQL for production
const dbPath = process.env.NODE_ENV === 'production' ? ':memory:' : './dev.db';
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });