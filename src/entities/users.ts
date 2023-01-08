import { IsEmail, IsNotEmpty, ValidationError } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, Index, Repository, QueryFailedError } from "typeorm";
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
    if(this.calculateEntropy(password) < 80) {
      throw new Error("Password is not strong enough");
    }
      
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

  calculateEntropy(password: string) {
    let enthropy = 0;
    if (password.match(/[a-z]/))
      enthropy += 26;
    if (password.match(/[A-Z]/))
      enthropy += 26;
    if (password.match(/[0-9]/))
      enthropy += 10;
    if (password.match(/[^a-zA-Z0-9]/))
      enthropy += 33;
    const res = Math.round((password.length) * (Math.log(enthropy) / Math.log(2)));
    return res;
  }
}