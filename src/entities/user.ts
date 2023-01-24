import { IsEmail, IsNotEmpty, ValidationError } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

const bcrypt = require('bcrypt');

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  "id": string;

  @Column()
  "firstName": string;

  @Column()
  "lastName": string;

  @Column({ nullable: false, unique: true , transformer: {
    to(value: string) {
      return value.toLocaleLowerCase();
    },
    from(value: any) {
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
    console.log("1111111111111111111")
    if(this.calculateEntropy(password) < 80) {
      console.log("2222222222222222222")
      const err = new ValidationError();
      err.property = "passwordHash";
      err.contexts =  ["Password is not strong enough"];
      throw err;
    }
    if(password != passwordConfirmation){
      console.log("333333333333333333")
      const err = new ValidationError();
      err.property = "passwordHash"
      err.contexts = ["Both passwords don't match"]
      throw err;
    }
    console.log("efefezfez");
    await bcrypt.genSalt().then(async (salt: any) => {
      console.log("fzgrehrtejytjyutkty");
      await bcrypt.hash(password, salt).then((hash: string) => {
        console.log("34444444444444444444444");
          this.passwordHash = hash;
      });
    });
  }

  async isPasswordValid(password: string): Promise<boolean> {
    console.log("this.pass", this.passwordHash);
    console.log("password", password);
    console.log("bcrypt.compare(password, this.passwordHash)", bcrypt.compare(password, this.passwordHash));
    console.log("await bcrypt.compare(password, this.passwordHash", await bcrypt.compare(password, this.passwordHash));
    return await bcrypt.compare(password, this.passwordHash);
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
    return Math.round((password.length) * (Math.log(enthropy) / Math.log(2)));
  }
}