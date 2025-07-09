import { config } from 'dotenv';
import { spawn } from 'node:child_process';
import path from 'node:path';

export default async function globalSetup() {
  // Set NODE_ENV to test
  process.env.NODE_ENV = 'test';

  // Load test environment variables from the test directory
  config({ path: path.join(__dirname, '../.env.test') });

  const dbUrl = process.env.DATABASE_URL;

  if (dbUrl) {
    const maskedUrl = dbUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
    console.log('📊 Running tests with database:', maskedUrl);
  }

  // Run migrations once during global setup
  console.log('🔄 Running database migrations...');
  await runMigrations();
  console.log('✅ Database migrations completed');
}

async function runMigrations() {
  // Run Prisma migrations using spawn
  const migrationProcess = spawn('pnpm', ['prisma', 'migrate', 'deploy'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: { ...process.env, PATH: process.env.PATH },
    shell: true,
  });

  await new Promise<void>((resolve, reject) => {
    migrationProcess.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Migration process exited with code ${code}`));
      }
    });

    migrationProcess.on('error', error => {
      reject(error);
    });
  });
}
