import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { DataSource, EntityTarget } from 'typeorm';

@ValidatorConstraint({ name: 'IsRoleActive', async: true })
@Injectable()
export class IsRoleActiveValidator implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(roleId: number, args: any) {
    // Get the entity class from the validation arguments
    const entityClass = args.constraints[0] as EntityTarget<any>;

    if (!entityClass) {
      return false;
    }

    const role = await this.dataSource.getRepository(entityClass).findOne({
      where: { id: roleId, is_active: true } // Check for active role
    });
    return !!role; // Return true if role exists and is active
  }

  defaultMessage() {
    return 'The selected role is inactive or does not exist.';
  }
}

@ValidatorConstraint({ async: false })
export class IsDuplicateValidator implements ValidatorConstraintInterface {
  validate(value: any[]): boolean {
    const seen = new Set();

    for (const item of value) {
      const key = `${item.company_id}-${item.department_id}-${item.first_level_approval_employee_id}-${item.second_level_approval_employee_id}`;

      if (seen.has(key)) {
        return false; // Duplicate found
      }

      seen.add(key);
    }

    return true; // No duplicates
  }

  defaultMessage(): string {
    return 'Duplicate expense approval config found in the array.';
  }
}
