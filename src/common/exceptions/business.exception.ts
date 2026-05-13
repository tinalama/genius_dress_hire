import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Custom exception for business logic errors
 * Use when domain rules are violated (e.g., insufficient stock, invalid status, etc.)
 */
export class BusinessException extends HttpException {
  constructor(message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(
      {
        success: false,
        statusCode,
        message,
        code: 'BUSINESS_ERROR',
      },
      statusCode
    );
  }
}

/**
 * Exception for resource not found
 */
export class ResourceNotFoundException extends HttpException {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(
      {
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message,
        code: 'RESOURCE_NOT_FOUND',
        resource: resource,
        identifier: identifier,
      },
      HttpStatus.NOT_FOUND
    );
  }
}

/**
 * Exception for conflict errors (duplicate resources, etc.)
 */
export class ConflictException extends HttpException {
  constructor(message: string) {
    super(
      {
        success: false,
        statusCode: HttpStatus.CONFLICT,
        message,
        code: 'CONFLICT',
      },
      HttpStatus.CONFLICT
    );
  }
}

/**
 * Exception for invalid state transitions
 */
export class InvalidStateException extends HttpException {
  constructor(message: string, currentState?: string, requiredStates?: string[]) {
    super(
      {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message,
        code: 'INVALID_STATE',
        currentState,
        requiredStates,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}