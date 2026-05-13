import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsRoleActiveValidator } from '../pipes/abstract-active-role-validator';

export function IsRoleActive(
  entityClass: any,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isRoleActive',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entityClass],
      validator: IsRoleActiveValidator
    });
  };
}
