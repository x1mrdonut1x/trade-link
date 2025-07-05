import { config } from 'dotenv';
import path from 'node:path';

const globalSetup = async () => {
  // Set NODE_ENV to test
  process.env.NODE_ENV = 'test';

  // Load test environment variables
  config({ path: path.join(__dirname, '../../.env.test') });

  console.log('🧪 Test environment loaded');
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    const maskedUrl = dbUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
    console.log('📊 Running tests with database:', maskedUrl);
  }
};

export default globalSetup;
