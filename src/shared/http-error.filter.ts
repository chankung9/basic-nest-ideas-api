import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest();
      const response = ctx.getResponse();

      const status = exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
      const errorResponse = {
        code: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message:
          status !== HttpStatus.INTERNAL_SERVER_ERROR
            ? exception.message || null
            : 'Internal server error',
      };

      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        console.error(exception);
      }

      Logger.error(
        `${request.method} ${request.url}`,
        JSON.stringify(errorResponse),
        'ExceptionFilter',
      );
      response.status(status).json(errorResponse);
      // do something that is only important in the context of regular HTTP requests (REST)
    } else if (host.getType() === 'rpc') {
      // do something that is only important in the context of Microservice requests
    } else if (host.getType<GqlContextType>() === 'graphql') {
      const { path } = host.getArgs()[3];

      Logger.error(
        `${path.typename} ${path.key}`,
        JSON.stringify(exception),
        'ExceptionFilter',
      );

      return exception;
    }
  }
}
