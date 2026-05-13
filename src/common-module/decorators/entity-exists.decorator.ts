/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'entityExists', async: true })
@Injectable()
export class EntityExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    try {
      const [entityType, column = '_id'] = args.constraints;

      // If the value is not provided and the field is optional, skip validation
      if (value === undefined || value === null) {
        return true;
      }

      // Get the repository for the entity
      const repository = this.dataSource.getRepository(entityType);

      // Create query builder
      const queryBuilder = repository.createQueryBuilder('entity');

      // Handle array of values
      if (Array.isArray(value)) {
        return (
          (await queryBuilder
            .where(`entity.${column} IN (:...values)`, { values: value })
            .getCount()) === value.length
        );
      }
      // Handle single value
      return await queryBuilder
        .where(`entity.${column} = :value`, { value })
        .getExists();
    } catch (error) {
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} does not exist in the database`;
  }
}

export function EntityExists(
  entityType: any,
  column = '_id',
  validationOptions?: ValidationOptions
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'entityExists',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entityType, column],
      validator: EntityExistsConstraint
    });
  };
}
