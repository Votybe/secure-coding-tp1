// src/specs/entities/user.ts
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { User } from "../../entities/user";
import { AppDataSource } from "../../lib/typeorm";
import { QueryFailedError } from "typeorm";
import { faker } from "@faker-js/faker";
import { createUserFixture } from "../fixtures/user-fixtures.spec";
import { createSessionFixture } from "../fixtures/sessions-fixtures.spec";

chai.use(chaiAsPromised);
const repoUser = AppDataSource.getRepository(User);

describe("User", function () {
  before(async function () {
    // Initialise the datasource (database connection)
    await AppDataSource.initialize()
      .then(() => {
        console.log("database initialized");
      })
      .catch((error: any) => console.log(error));
  });

  beforeEach(async function () {
    const entities = AppDataSource.entityMetadatas;
    // iterate on all entities then get the name of all entities and delete it
    console.log()
    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      await repository.clear();
    }
  });

  describe("validations", function () {
    it("should create a new User in database", async () => {
      const user = new User();
      user.firstName= faker.name.firstName();
      user.lastName= faker.name.lastName();
      user.email= faker.internet.email();
      user.passwordHash=  "password123456";
      await repoUser.save(user);
      await chai
        .expect((repoUser.findBy({ email: user.email })) !== undefined || null)
        .to.equal(true);
    });

    it("should raise error if email is missing", async () => {
      const user = new User();
      user.firstName= faker.name.firstName();
      user.lastName= faker.name.lastName();
      user.passwordHash= "password123456";
      await chai
        .expect(repoUser.save(user))
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
      user.firstName= faker.name.firstName();
      user.lastName= faker.name.lastName();
      user.email= "ayMeric",
      user.passwordHash= "password123456";
      await chai
        .expect(repoUser.save(user))
        .to.eventually.be.rejected.and.deep.include({
          target: user,
          property: 'email',
          constraints: {isEmail: 'incorrect email'}
        })
    });

    it("Should raise error if email is already used", async () => {
      const user1 = new User();
      const user2 = new User();
      user1.firstName= faker.name.firstName();
      user1.lastName= faker.name.lastName();
      user1.email= "aymeric@gmail.com",
      user1.passwordHash= "password123456";
      user2.firstName= faker.name.firstName();
      user2.lastName= faker.name.lastName();
      user2.email= "AyMeRic@gmail.com",
      user2.passwordHash= "password123456";
      await repoUser.save(user1);
      await chai
        .expect(repoUser.save(user2))
        .to.eventually.be.rejectedWith(
          QueryFailedError,
          'duplicate key value violates unique constraint "UQ_e12875dfb3b1d92d7d7c5377e22"'
        );
    });

    it("raise error if password and passwordConfirmation dont match", async () => {
      const user = new User();
      user.firstName= faker.name.firstName();
      user.lastName= faker.name.lastName();
      user.email= faker.internet.email();
      const password1 = "Password123456";
      const password2 = "password12";
      await chai
        .expect(user.setPassword(password1, password2))
        .to.eventually.be.rejected.and.deep.include({
          property: 'passwordHash',
          contexts: ["Both passwords don't match"]
        })
    });

    it("raise error if passwords dont match", async () => {
      const user = new User();
      user.firstName= faker.name.firstName();
      user.lastName= faker.name.lastName();
      user.email= faker.internet.email();
      const password1 = "Password123456";
      const password2 = "password12";
      await user.setPassword(password1, password1)
      const userPromise = await user.isPasswordValid(password2);
      await chai
        .expect(userPromise)
        .to.equal(false);
    });

    it("raise error if password is not strong enough", async () => {
      const user = new User();
      user.firstName= faker.name.firstName();
      user.lastName= faker.name.lastName();
      user.email= faker.internet.email();
      const password1 = "password123456";
      await chai
        .expect(user.setPassword(password1, password1))
        .to.eventually.be.rejected.and.deep.include({
          property: 'passwordHash',
          contexts: ["Password is not strong enough"]
        })
    });
  });
});
