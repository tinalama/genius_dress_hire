import { Injectable } from '@nestjs/common';
import { ValidatorConstraint } from 'class-validator';
import { DataSource } from 'typeorm';

import { IsRoleActiveValidator } from './abstract-active-role-validator';

/**

Pipe to validate if a role is active */
@ValidatorConstraint({ name: 'isRoleActive', async: true })
@Injectable()
export class IsRoleActivePipe extends IsRoleActiveValidator {
  constructor(protected readonly connection: DataSource) {
    super(connection);
  }
}
