import { ConsoleLogger } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  log(message: any, context?: string) {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    super.log(message, context);
  }

  error(message: any, stack?: string, context?: string) {
    console.log(' message:', message);
    // Skip logging Prisma errors in test environment
    if (this.isPrismaError(message, stack, context)) {
      return;
    }

    super.error(message, stack, context);
  }

  private isPrismaError(message: any, stack?: string, context?: string): boolean {
    // Check if it's from ExceptionsHandler and contains Prisma error
    if (context === 'ExceptionsHandler') {
      const messageStr = typeof message === 'string' ? message : String(message);
      return PRISMA_ERRORS.some(error => messageStr.includes(error));
    }

    return false;
  }
}

const PRISMA_ERRORS = ['PrismaClientValidationError', 'PrismaClientKnownRequestError'];
