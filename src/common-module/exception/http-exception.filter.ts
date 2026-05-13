import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { ExceptionTitleList } from '../custom-constant/exception-title-list.constant';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseMessage: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : ExceptionTitleList.InternalServerError;

    const message: any = responseMessage;

    response.status(status).json({
      statusCode: status,
      error:
        typeof responseMessage === 'object'
          ? (responseMessage.error ?? responseMessage)
          : responseMessage,
      message:
        typeof responseMessage === 'object'
          ? (responseMessage.message ?? message)
          : message
    });
  }
}
