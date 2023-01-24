import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { AppDataSource } from "../lib/typeorm";
import { User } from "../entities/user";

@ValidatorConstraint({ async: true })
export class UniqueInColumnConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return AppDataSource.getRepository(User).findOne({ where: { email: value} }).then(user => {
      if (user) return false;
      return true;
    });
  }
}

export function UniqueInColumn(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueInColumnConstraint,
    });
  };
}