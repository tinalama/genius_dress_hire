import { HttpException, HttpStatus } from '@nestjs/common';

import { ExceptionTitleList } from '../custom-constant/exception-title-list.constant';
import { StatusCodesList } from '../custom-constant/status-codes-list.constant';

export class ForbiddenException extends HttpException {
  constructor(message?: string, code?: number, statusCode?: number) {
    super(
      {
        error: ExceptionTitleList.Forbidden,
        message: message || ExceptionTitleList.Forbidden,
        code: code || StatusCodesList.Forbidden,
        statusCode: statusCode || HttpStatus.FORBIDDEN
      },
      HttpStatus.FORBIDDEN
    );
  }
}
