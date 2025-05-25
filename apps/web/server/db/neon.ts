import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// neonConfig.fetchConnectionCache = true; // Optional: enable connection caching

const sql = neon(process.env.DATABASE_URL);

// For now, we'll just export the raw 'sql' client.
// If you decide to use Drizzle ORM (highly recommended for type safety and schema management),
// you would initialize it here like so:
//
// import * as schema from './schema'; // You would create this schema file
// export const db = drizzle(sql, { schema });
//
// For now, we'll stick to raw SQL queries for simplicity in this step.
export { sql };

// Example of how you might create a table if it doesn't exist (run once, or use migrations)
// async function setupDatabase() {
//   try {
//     await sql`
//       CREATE TABLE IF NOT EXISTS claims (
//         id SERIAL PRIMARY KEY,
//         claim_text TEXT NOT NULL,
//         analysis_text TEXT,
//         submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//       );
//     `;
//     console.log("Database table 'claims' checked/created successfully.");
//   } catch (error) {
//     console.error("Error setting up database table:", error);
//   }
// }
// setupDatabase(); // Call this if you want to ensure the table exists on server start