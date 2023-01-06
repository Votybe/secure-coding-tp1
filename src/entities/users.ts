import { IsEmail, IsNotEmpty } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  "id": number;

  @Column()
  "firstName": string;

  @Column()
  "lastName": string;

  @Column({ nullable: false, unique: true })
  @IsEmail({}, { message: "incorrect email" })
  @IsNotEmpty()
  "email": string;

  @Column()
  "passwordHash": string;
}
