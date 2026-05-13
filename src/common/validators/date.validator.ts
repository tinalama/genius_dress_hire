import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Validate that a date is in the future
 */
export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'string' && Date.parse(value) > Date.parse(new Date().toISOString())
          );
        },
        defaultMessage() {
          return `${propertyName} must be a future date`;
        },
      },
    });
  };
}

/**
 * Validate that a date is not in the future (past or present)
 */
export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isNotFutureDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return false;
          }
          const inputDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set time to start of day for accurate comparison
          inputDate.setHours(0, 0, 0);
          return inputDate <= today;
        },
        defaultMessage() {
          return `${propertyName} cannot be in the future`;
        },
      },
    });
  };
}

/**
 * Validate that end date is after start date
 */
export function IsEndDateAfterStartDate(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isEndDateAfterStartDate',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const startDate = (args.object as any)[property];
          if (!startDate || !value) {
            return true; // Skip validation if either date is missing
          }
          return new Date(value) > new Date(startDate);
        },
        defaultMessage(args: ValidationArguments) {
          return `${propertyName} must be after ${args.constraints[0]}`;
        },
      },
    });
  };
}