import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '../../generated/prisma';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError, Prisma.PrismaClientUnknownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(
    exception:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientValidationError
      | Prisma.PrismaClientUnknownRequestError,
    host: ArgumentsHost
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let message: string;
    let error: string;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = this.handleKnownRequestError(exception);
      message = this.getKnownRequestErrorMessage(exception);
      error = 'Database Error';
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid data provided';
      error = 'Validation Error';
    } else if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An unexpected database error occurred';
      error = 'Unknown Database Error';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'Internal Server Error';
    }

    // Log the error for debugging
    this.logger.error(
      `Prisma error occurred: ${exception.message}`,
      exception.stack,
      `${request.method} ${request.url}`
    );

    response.status(status).json({
      statusCode: status,
      message,
      error,
    });
  }

  private handleKnownRequestError(exception: Prisma.PrismaClientKnownRequestError): HttpStatus {
    switch (exception.code) {
      case 'P2002': // Unique constraint failed
      case 'P2003': // Foreign key constraint failed
      case 'P2004': {
        // Constraint failed
        return HttpStatus.CONFLICT;
      }
      case 'P2025': {
        // Record not found
        return HttpStatus.NOT_FOUND;
      }
      case 'P2006': // Invalid value
      case 'P2007': // Data validation error
      case 'P2008': // Failed to parse query
      case 'P2009': // Failed to validate query
      case 'P2010': // Raw query failed
      case 'P2011': // Null constraint violation
      case 'P2012': // Missing required value
      case 'P2013': // Missing required argument
      case 'P2014': // Required relation is missing
      case 'P2015': // Related record not found
      case 'P2016': // Query interpretation error
      case 'P2017': // Records not connected
      case 'P2018': // Required connected records not found
      case 'P2019': // Input error
      case 'P2020': // Value out of range
      case 'P2021': // Table does not exist
      case 'P2022': {
        // Column does not exist
        return HttpStatus.BAD_REQUEST;
      }
      case 'P2024': {
        // Timed out
        return HttpStatus.REQUEST_TIMEOUT;
      }
      default: {
        return HttpStatus.INTERNAL_SERVER_ERROR;
      }
    }
  }

  private getKnownRequestErrorMessage(exception: Prisma.PrismaClientKnownRequestError): string {
    switch (exception.code) {
      case 'P2002': {
        return this.getUniqueConstraintErrorMessage(exception);
      }
      case 'P2003': {
        return 'Foreign key constraint failed. The referenced record does not exist.';
      }
      case 'P2004': {
        return 'A constraint failed on the database.';
      }
      case 'P2025': {
        return 'Record not found.';
      }
      case 'P2006': {
        return 'The provided value is invalid.';
      }
      case 'P2007': {
        return 'Data validation error.';
      }
      case 'P2008': {
        return 'Failed to parse the query.';
      }
      case 'P2009': {
        return 'Failed to validate the query.';
      }
      case 'P2010': {
        return 'Raw query failed.';
      }
      case 'P2011': {
        return 'Null constraint violation.';
      }
      case 'P2012': {
        return 'Missing a required value.';
      }
      case 'P2013': {
        return 'Missing the required argument.';
      }
      case 'P2014': {
        return 'The change you are trying to make would violate the required relation.';
      }
      case 'P2015': {
        return 'A related record could not be found.';
      }
      case 'P2016': {
        return 'Query interpretation error.';
      }
      case 'P2017': {
        return 'The records for relation are not connected.';
      }
      case 'P2018': {
        return 'The required connected records were not found.';
      }
      case 'P2019': {
        return 'Input error.';
      }
      case 'P2020': {
        return 'Value out of range for the type.';
      }
      case 'P2021': {
        return 'The table does not exist in the current database.';
      }
      case 'P2022': {
        return 'The column does not exist in the current database.';
      }
      case 'P2024': {
        return 'Timed out fetching a new connection from the connection pool.';
      }
      default: {
        return 'An unexpected database error occurred.';
      }
    }
  }

  private getUniqueConstraintErrorMessage(exception: Prisma.PrismaClientKnownRequestError): string {
    const meta = exception.meta as { target?: string[] };
    const target = meta?.target;

    if (target && target.length > 0) {
      const fields = target.join(', ');
      return `A record with this ${fields} already exists.`;
    }

    return 'A record with these details already exists.';
  }
}
