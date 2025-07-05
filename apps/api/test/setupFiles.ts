import { config } from 'dotenv';
import path from 'node:path';

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

// Load test environment variables from the test directory
config({ path: path.join(__dirname, '.env.test') });

const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  const maskedUrl = dbUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
  console.log('📊 Running tests with database:', maskedUrl);
}
