import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorResponse } from '../model/exception.model';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const responseBody = ErrorResponse.of(exception);
    const { url } = ctx.getRequest();
    this.logger.error(`url=${url} response=${responseBody.message}`, exception);

    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.status);
  }
}
