import { IsEmail, IsNotEmpty, Validate } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";
import { UniqueInColumn } from "../custom-decorators/unique.in.column"
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  "id": number;

  @Column()
  "firstName": string;

  @Column()
  "lastName": string;

  @Column({ nullable: false, unique: true , transformer: {
    to(value) {
      return value.toLocaleLowerCase();
    },
    from(value) {
      return value;
    }
  }})
  @IsEmail({}, { message: "incorrect email" })
  @IsNotEmpty()
  @Index({ unique: true})
  @Validate(UniqueInColumn, {
    message: 'Wrong post title',
  })
  "email": string;

  @Column()
  "passwordHash": string;
}
