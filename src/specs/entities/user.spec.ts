// src/specs/entities/user.ts
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { User } from "../../entities/users";
import { AppDataSource } from "../../lib/typeorm";
import { QueryFailedError } from "typeorm";

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
        email: "aymeric",
        passwordHash: "password123456",
      };

      console.log(user);

      await AppDataSource.getRepository(User).save(user);
      // console.log(`user validation : ${users} `);

      // const users = await AppDataSource.getRepository(User).findOne({
      //   where: {
      //     lastName: user.lastName,
      //   },
      // });
    });

    it("should raise error if email is missing", async () => {
      const repoUser = AppDataSource.getRepository(User);
      const user = {
        firstName: "aymeric",
        lastName: "maillot",
        email: undefined,
        passwordHash: "password123456",
      };

      const userPromise = repoUser.save(user);

      await chai
        .expect(userPromise)
        .to.eventually.be.rejectedWith(
          QueryFailedError,
          'null value in column "email" of relation "user" violates not-null constraint'
        );
    });
  });
});
