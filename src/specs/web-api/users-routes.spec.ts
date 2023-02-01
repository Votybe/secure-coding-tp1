// src/specs/routes/web-api/users-routes.spec.ts
import server from '../../lib/fastify'
import * as chai from "chai";
import { AppDataSource } from '../../lib/typeorm';
import { createUserFixture } from '../fixtures/user-fixtures.spec';
import { Session } from '../../entities/session';
import { sign } from '@fastify/cookie';
import { COOKIE_SECRET } from '../../lib/dotenv';

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

    it('should respond with the current user identity', async () => {
      let user = await createUserFixture()
        await server.inject(
            { 
              url: `/web-api/session`, 
              method: 'POST', 
              payload: {
                email: user.email.toLowerCase(),
                password : user.passwordHash,
              }
            }
        )
        const session = await AppDataSource.getRepository(Session).findOneByOrFail({ user: {id: user.id}});
        const response = await server.inject(
            { 
              url: `/web-api/users/me`, 
              method: 'GET',
              headers: { 
                cookie: sign(session.token, COOKIE_SECRET)
              }
            }
        )
        // console.log("response : ", response);
        await chai
        .expect(response.statusCode)
        .to.equal(200);
    });

    // it('should respond with 401 if user is not logged in')
    // it('should respond with 401 if unsigned cookie')
    // it('should respond with 401 if cookie signature with a wrong key')
    // it('should respond with 401 if session has expired')
    // it('should respond with 401 if session has been revoked')
  })
})