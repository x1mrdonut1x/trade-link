import { ConsoleLogger } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  log(message: any, context?: string) {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    super.log(message, context);
  }

  error(message: any, stack?: string, context?: string) {
    // Skip logging Prisma errors in test environment
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    super.error(message, stack, context);
  }
}
