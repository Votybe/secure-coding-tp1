// src/specs/routes/web-api/users-routes.spec.ts
import server from '../lib/fastify'
import * as chai from "chai";
import { AppDataSource } from '../lib/typeorm';

describe('/web-api/users', function () {
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

  describe('POST #create', function () {
    it('should register the user', async function () {
      const response = await server.inject(
        { 
          url: `/web-api/users`, 
          method: 'POST', 
          payload: {
            firstName: "Aymeric",
            lastName: "Maillot",
            email: "aymeric@gmail.com",
            password : "Password123456",
            passwordConfirmation : "Password123456"
          }
        }
      )
      console.log("test")
      await chai
      .expect(response.statusCode)
      .to.equal(200);
    })
  })
})