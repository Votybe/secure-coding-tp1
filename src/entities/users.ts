import { IsEmail, IsNotEmpty, ValidationError } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, Index, Repository } from "typeorm";
import { UniqueInColumn } from '../custom-decorators/unique.in.column';

const bcrypt = require('bcrypt');

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
  //@UniqueInColumn()
  "email": string;

  @Column()
  "passwordHash": string;

  async setPassword(password: string, passwordConfirmation: string) {
    if(password != passwordConfirmation)
      throw new Error("Both passwords don't match")
    await bcrypt.genSalt().then(async (salt: any) => {
      await bcrypt.hash(password, salt).then((hash: string) => {
          this.passwordHash = hash;
      });
    });
  }

  async isPasswordValid(password: string): Promise<boolean> {
    const passMatch = await bcrypt.compare(password, this.passwordHash);
    return passMatch;
  }

}