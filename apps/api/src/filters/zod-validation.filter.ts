import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';

@Catch(ZodValidationException)
export class ZodValidationFilter implements ExceptionFilter {
  private readonly logger = new Logger(ZodValidationFilter.name);

  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const zodError = exception.getZodError();
    const status = HttpStatus.BAD_REQUEST;
    const message = `${zodError.issues.length} validation error(s) occurred`;
    const error = 'Validation Error';

    // Log the error for debugging
    this.logger.error(
      `Zod validation error occurred: ${exception.message}`,
      exception.stack,
      `${request.method} ${request.url}`
    );

    response.status(status).json({
      statusCode: status,
      message,
      error,
      errors: zodError.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }
}
