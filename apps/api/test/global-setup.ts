import { config } from 'dotenv';
import path from 'node:path';

const globalSetup = async () => {
  // Set NODE_ENV to test
  process.env.NODE_ENV = 'test';

  // Store GitHub Actions environment variables before loading .env.test
  const githubActionsEnvVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    PORT: process.env.PORT,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  };

  // Load test environment variables
  config({ path: path.join(__dirname, '../../.env.test') });

  // Restore GitHub Actions environment variables if they exist
  // This ensures GitHub Actions env vars take precedence over .env.test
  for (const [key, value] of Object.entries(githubActionsEnvVars)) {
    if (value) {
      process.env[key] = value;
    }
  }

  console.log('🧪 Test environment loaded');
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    const maskedUrl = dbUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
    console.log('📊 Running tests with database:', maskedUrl);
  }

  console.log('🔑 JWT Secret configured:', process.env.JWT_SECRET ? '✅' : '❌');
};

export default globalSetup;
