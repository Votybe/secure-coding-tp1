// src/specs/entities/user.ts
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { User } from "../../entities/users";
import { AppDataSource } from "../../lib/typeorm";
import { QueryFailedError } from "typeorm";
import { ValidationError } from "class-validator";

chai.use(chaiAsPromised);

describe("User", function () {
  before(async function () {
    // Initialise the datasource (database connection)
    await AppDataSource.initialize()
      .then(() => {
        console.log("database initialized");
      })
      .catch((error: any) => console.log(error));
  });

  beforeEach(function () {
    beforeEach(async function () {
      const entities = AppDataSource.entityMetadatas;
      // iterate on all entities then get the name of all entities and delete it
      for (const entity of entities) {
        const repository = AppDataSource.getRepository(entity.name);
        await repository.clear();
      }
    });
  });

  describe("validations", function () {
    it("should create a new User in database", async () => {
      const user = {
        firstName: "aymeric",
        lastName: "maillot",
        email: "aymeric.maillot@gmail.com",
        passwordHash: "password123456",
      };
      await AppDataSource.getRepository(User).save(user);
    });

    it("should raise error if email is missing", async () => {
      const user = new User();
      user.firstName= "aymeric";
      user.lastName= "maillot";
      user.passwordHash= "password123456";
      const userPromise = AppDataSource.getRepository(User).save(user);

      await chai
        .expect(userPromise)
        .to.eventually.be.rejected.and.deep.include({
          target: user,
          property: 'email',
          constraints: {
            isNotEmpty: 'email should not be empty',
            isEmail: 'incorrect email'
          }
        })
    });

    it("should raise error if email has not email format", async () => {
      const user = new User();
      user.firstName= "aymeric";
      user.lastName= "maillot";
      user.email= "ayMeric",
      user.passwordHash= "password123456";
      const userPromise = AppDataSource.getRepository(User).save(user);

      await chai
        .expect(userPromise)
        .to.eventually.be.rejected.and.deep.include({
          target: user,
          property: 'email',
          constraints: {isEmail: 'incorrect email'}
        })
    });

    it("Should raise error if email is already used", async () => {
      const repoUser = AppDataSource.getRepository(User);
      const user1 = new User();
      user1.firstName= "aymeric";
      user1.lastName= "maillot";
      user1.email= "aymeric@gmail.com",
      user1.passwordHash= "password123456";
      const user2 = new User();
      user2.firstName= "aymeric";
      user2.lastName= "maillot";
      user2.email= "AyMeRic@gmail.com",
      user2.passwordHash= "password123456";
      repoUser.save(user1);
      const userPromise2 = repoUser.save(user2);

      await chai
        .expect(userPromise2)
        .to.eventually.be.rejectedWith(
          QueryFailedError,
          'duplicate key value violates unique constraint'
        );
    });

    it("should match passwords", async () => {
      const user = new User();
      user.firstName= "aymeric";
      user.lastName= "maillot";
      user.email= "aymeric@gmail.com";
      const password1 = "password123456";
      const password2 = "password12";
      await user.setPassword(password1, password1)

      const userPromise = await user.isPasswordValid(password2);
      await chai
        .expect(userPromise)
        .to.equal(false);
    });

  });
});
