import { HttpException, HttpStatus } from '@nestjs/common';

export class ResourceNotFoundException extends HttpException {
  constructor(resource: string, id: string) {
    super(
      {
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: `${resource} with id "${id}" was not found`,
        code: 'RESOURCE_NOT_FOUND',
        resource,
        id,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
