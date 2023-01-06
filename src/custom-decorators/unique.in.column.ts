import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from "class-validator";
import { User } from "../entities/users";
import { AppDataSource } from "../lib/typeorm";

@ValidatorConstraint()
export class UniqueInColumn implements ValidatorConstraintInterface {
  validate(emailValue: string) {
    console.log("ezdzedzefdzfzpjfzfkzef", emailValue)
    console.log("1", AppDataSource.getRepository(User));
    return AppDataSource.getRepository(User).findOne({where: {email: emailValue,}}).then((user: any) => {
      if (user)
        return false;
      return true;
    });
  }
}