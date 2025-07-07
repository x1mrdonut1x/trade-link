import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bodyParser from 'body-parser';
import { ZodValidationPipe } from 'nestjs-zod';
import { spawn } from 'node:child_process';

import { AppModule } from '../src/app.module';
import { CustomLogger } from '../src/filters/custom-logger';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { clearAuthToken, setAuthToken } from './helpers/request.helper';

let app: INestApplication;
let prisma: PrismaService;

export const getTestApp = () => app;
export const getTestPrisma = () => prisma;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useLogger(new CustomLogger());

  prisma = moduleFixture.get<PrismaService>(PrismaService);

  // Configure the app like in main.ts
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  });
  app.use(bodyParser.json({ limit: '10mb' }));
  app.useGlobalPipes(new ZodValidationPipe());

  await app.init();

  // Run migrations before running tests
  await runMigrations();

  // Clean the database before running tests
  await cleanDatabase();
});

afterAll(async () => {
  await app.close();
});

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

async function cleanDatabase() {
  // Delete all records in the correct order (respecting foreign keys)
  await prisma.note.deleteMany();
  await prisma.task.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  // Reset sequences
  await prisma.$executeRaw`ALTER SEQUENCE note_id_seq RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE task_id_seq RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE membership_id_seq RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE contact_id_seq RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE tag_id_seq RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE company_id_seq RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE user_id_seq RESTART WITH 1;`;
  await prisma.$executeRaw`ALTER SEQUENCE tenant_id_seq RESTART WITH 1;`;
}

// Helper function to clean database between tests if needed
export const resetDatabase = async () => {
  await cleanDatabase();
};

export const setTestAuthToken = (token: string) => {
  setAuthToken(token);
};

export const clearTestAuthToken = () => {
  clearAuthToken();
};
