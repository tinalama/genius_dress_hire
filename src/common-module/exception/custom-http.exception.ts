import { HttpException, HttpStatus } from '@nestjs/common';

import { ExceptionTitleList } from '../custom-constant/exception-title-list.constant';
import { StatusCodesList } from '../custom-constant/status-codes-list.constant';

export class CustomHttpException extends HttpException {
  constructor(message?: string, statusCode?: number, code?: number) {
    super(
      {
        error: ExceptionTitleList.BadRequest,
        message: message || ExceptionTitleList.BadRequest,
        code: code || StatusCodesList.BadRequest,
        statusCode: statusCode || HttpStatus.BAD_REQUEST
      },
      statusCode || HttpStatus.BAD_REQUEST
    );
  }
}

export class CustomHttpWithDataException extends HttpException {
  constructor(
    message?: string,
    statusCode?: number,
    code?: number,
    data?: any
  ) {
    super(
      {
        error: ExceptionTitleList.BadRequest,
        message: message || ExceptionTitleList.BadRequest,
        code: code || StatusCodesList.BadRequest,
        statusCode: statusCode || HttpStatus.BAD_REQUEST,
        data: data || null
      },
      statusCode || HttpStatus.BAD_REQUEST
    );
  }
}

export class CustomArrayHttpException extends HttpException {
  constructor(message?: any, statusCode?: number, code?: number) {
    super(
      {
        error: ExceptionTitleList.BadRequest,
        message: message || ExceptionTitleList.BadRequest,
        code: code || StatusCodesList.BadRequest,
        statusCode: statusCode || HttpStatus.BAD_REQUEST
      },
      statusCode || HttpStatus.BAD_REQUEST
    );
  }
}

export class CustomConflictException extends HttpException {
  constructor(message?: string, statusCode?: number, code?: number) {
    super(
      {
        error: ExceptionTitleList.Conflict,
        message: message || ExceptionTitleList.Conflict,
        code: code || StatusCodesList.Conflict,
        statusCode: statusCode || HttpStatus.CONFLICT
      },
      statusCode || HttpStatus.CONFLICT
    );
  }
}
