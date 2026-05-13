import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * Abstract validator for unique field validation
 * Extend this validator for each entity that needs unique field validation
 */
@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [entityClass, fieldName] = args.constraints;

    const repository = this.dataSource.getRepository(entityClass);
    const entity = await repository.findOne({
      where: {
        [fieldName]: value,
      } as any,
    });

    // For update, we need to exclude the current entity from the check
    if (args.object && (args.object as any).id) {
      const existingEntity = await repository.findOne({
        where: { id: (args.object as any).id } as any,
      });
      if (existingEntity && existingEntity[fieldName] === value) {
        return true; // Same entity, same value - it's okay
      }
    }

    return !entity;
  }

  defaultMessage(args: ValidationArguments) {
    const [entityClass, fieldName] = args.constraints;
    return `${fieldName} must be unique`;
  }
}

/**
 * Decorator to use the UniqueValidator
 * Usage: @Unique(User, 'email')
 */
export function IsUnique(
  entityClass: any,
  fieldName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entityClass, fieldName],
      validator: UniqueValidator,
    });
  };
}