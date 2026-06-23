import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    const rpc = exception as Record<string, unknown>;
    const statusCode =
      typeof rpc?.statusCode === 'number'
        ? rpc.statusCode
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      typeof rpc?.message === 'string' ? rpc.message : 'Internal server error';

    response.status(statusCode).json({ statusCode, message });
  }
}
