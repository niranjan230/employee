import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

// Create a new database connection
const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite, { schema });

// Initialize the database
export const initDb = async () => {
  try {
    // Run migrations
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Database migrations completed successfully');
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};