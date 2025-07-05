import { NestFactory } from '@nestjs/core';

import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { CustomLogger } from './filters/custom-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  });
  app.use(bodyParser.json({ limit: '10mb' }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
