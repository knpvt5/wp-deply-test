import pkg from 'pg';
const { Pool } = pkg; // Use Pool instead of Client
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.WS_DB_HOST,
  port: process.env.WS_DB_PORT,
  user: process.env.WS_DB_USER,
  password: process.env.WS_DB_PASSWORD,
  database: process.env.WS_DB_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10, // Maximum number of connections in the pool
  min: 3, // Minimum number of connections to maintain in the pool
  idleTimeoutMillis: 60000, // Close idle clients after 60 seconds
  connectionTimeoutMillis: 10000, // Timeout for establishing a new connection
};

// Create a new pool instance
const pool = new Pool(dbConfig);

async function connectWithRetry(retries = 5, delay = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pool.connect(); // Attempt to connect using the pool
      console.log('Connected to the database');
      return pool; // Return the connected pool
    } catch (error) {
      console.error(`Connection attempt ${attempt} failed:`, error.message);

      if (attempt === retries) {
        console.error('Max retries reached. Exiting...');
        process.exit(1); // Exit if max retries are reached
      }

      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise(res => setTimeout(res, delay)); // Wait before retrying
    }
  }
}

// Initialize connection with retry logic
await connectWithRetry();

export default pool; // Export the pool for use in other modules
