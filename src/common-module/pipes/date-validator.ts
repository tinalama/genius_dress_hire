import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

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
            typeof value === 'string' &&
            Date.parse(value) > Date.parse(new Date().toISOString())
          );
        },
        defaultMessage() {
          return `${propertyName} must be a future date`;
        }
      }
    });
  };
}

export function IsValidPreConfirmationDate(
  validationOptions?: ValidationOptions
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidPreConfirmationDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const currentDate = new Date().toISOString(); // Current date in ISO format
          const startDateTime = (args.object as any)['start_date_time']; // Event start date

          // Ensure start_date_time is valid
          if (!startDateTime || !Date.parse(startDateTime)) {
            return false;
          }
          // Check pre_confirmation_date is between now and start_date_time
          return (
            typeof value === 'string' &&
            Date.parse(value) > Date.parse(currentDate) &&
            Date.parse(value) < Date.parse(startDateTime)
          );
        },
        defaultMessage() {
          return `${propertyName} must be greater than the current date and less than the start date of the event.`;
        }
      }
    });
  };
}

export function MaxDateDynamic(
  property: string,
  validationOptions?: ValidationOptions
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'maxDateDynamic',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            Date.parse(relatedValue) < Date.parse(value) // ONLY DIFFERENCE
          );
        }
      }
    });
  };
}

export function IsAboveOrSameDate(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isAboveOrSameDate',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            Date.parse(value) >= Date.parse(relatedValue)
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be equal to or greater than ${relatedPropertyName}`;
        }
      }
    });
  };
}

export function TodayOrGreaterDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'todayOrGreaterDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return false;
          }

          // Parse the UTC ISO date string
          const inputDate = new Date(value);

          // Check if it's a valid date
          if (isNaN(inputDate.getTime())) {
            return false;
          }

          // Get today's start (00:00:00) in local time
          const now = new Date();
          const todayStart = new Date(
            Date.UTC(
              now.getUTCFullYear(),
              now.getUTCMonth(),
              now.getUTCDate(),
              -9, // Japan timezone offset (UTC+9)
              0,
              0,
              0
            )
          );

          // Convert to UTC
          const todayStartUTC = new Date(todayStart.toISOString());

          // Compare with input UTC time
          return inputDate.getTime() >= todayStartUTC.getTime();
        },
        defaultMessage() {
          return `${propertyName} must be today or a future date`;
        }
      }
    });
  };
}

// Helper function to get date field names based on property name
function getDateFieldNames(propertyName: string): {
  yearField: string;
  monthField: string;
  dayField: string;
} | null {
  if (propertyName.includes('survey_date')) {
    return {
      yearField: 'survey_date_year',
      monthField: 'survey_date_month',
      dayField: 'survey_date_day'
    };
  }
  if (propertyName.includes('confirmation_date')) {
    return {
      yearField: 'confirmation_date_year',
      monthField: 'confirmation_date_month',
      dayField: 'confirmation_date_day'
    };
  }
  if (
    propertyName.includes('date_year') ||
    propertyName.includes('date_month') ||
    propertyName.includes('date_day')
  ) {
    return {
      yearField: 'date_year',
      monthField: 'date_month',
      dayField: 'date_day'
    };
  }
  if (propertyName.includes('checklist_date')) {
    return {
      yearField: 'checklist_date_year',
      monthField: 'checklist_date_month',
      dayField: 'checklist_date_day'
    };
  }
  return null;
}

// Validator for year range (1800-3000)
@ValidatorConstraint({ name: 'isValidYear', async: false })
export class IsValidYearConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    if (!value) return true; // Optional field, allow empty

    // Format is valid, check range
    const year = parseInt(value, 10);
    if (isNaN(year)) return false;
    return year >= 1800 && year <= 3000;
  }

  defaultMessage() {
    return 'Year must be between 1800 and 3000';
  }
}

// Validator for month range (1-12)
@ValidatorConstraint({ name: 'isValidMonth', async: false })
export class IsValidMonthConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    if (!value) return true; // Optional field, allow empty

    // Format is valid, check range
    const month = parseInt(value, 10);
    if (isNaN(month)) return false;
    return month >= 1 && month <= 12;
  }

  defaultMessage() {
    return 'Month must be between 1 and 12';
  }
}

// Validator for day range (1-31, and valid for month if year/month present)
@ValidatorConstraint({ name: 'isValidDay', async: false })
export class IsValidDayConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value) return true; // Optional field, allow empty

    // Format is valid, check range
    const day = parseInt(value, 10);
    if (isNaN(day)) return false;
    if (day < 1 || day > 31) return false;

    // If year and month are present and valid, validate day for that month
    const object = args.object as any;
    const propertyName = args.property;
    const fields = getDateFieldNames(propertyName);

    if (!fields) return true; // Unknown structure, basic validation passed

    const yearStr = object[fields.yearField];
    const monthStr = object[fields.monthField];

    // If year and month are present and valid, check day validity for that month
    if (
      yearStr &&
      monthStr &&
      /^\d+$/.test(yearStr) &&
      /^\d+$/.test(monthStr)
    ) {
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);

      if (
        !isNaN(year) &&
        !isNaN(month) &&
        year >= 1800 &&
        year <= 3000 &&
        month >= 1 &&
        month <= 12
      ) {
        const daysInMonth = new Date(year, month, 0).getDate();
        return day <= daysInMonth;
      }
    }

    return true; // Basic range check passed, or year/month not available
  }

  defaultMessage() {
    return 'Day must be valid for the given month (1-31, and valid for the specific month/year)';
  }
}
