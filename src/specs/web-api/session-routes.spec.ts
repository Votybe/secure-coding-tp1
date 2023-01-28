// src/specs/entities/user.ts
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { AppDataSource } from "../../lib/typeorm";
import server from '../../lib/fastify'
import { createUserFixture } from "../fixtures/user-fixtures.spec";
import fastify = require("fastify");
import { Session } from "../../entities/session";
import { COOKIE_SECRET } from "../../lib/dotenv";
import { sign } from "@fastify/cookie";

chai.use(chaiAsPromised);

describe("Session", function () {
    before(async function () {
        // Initialise the datasource (database connection)
        await AppDataSource.initialize()
            .then(() => {
            console.log("database initialized");
            })
            .catch((error: any) => console.log(error));
    });

    beforeEach(async function () {
        await AppDataSource.getRepository("Session").createQueryBuilder().delete().execute();
        await AppDataSource.getRepository("User").createQueryBuilder().delete().execute();
    });

    // it("should create a session after lowering email", async () => {
    //     let user = await createUserFixture()response
    //     const response = await server.inject(
    //         { 
    //           url: `/web-api/session`, 
    //           method: 'POST', 
    //           payload: {
    //             email: user.email.toLowerCase(),
    //             password : user.passwordHash,
    //           }
    //         }
    //     )
    //     // console.log("response : ", response);
    //     await chai
    //     .expect(response.statusCode)
    //     .to.equal(200);
    // });

    // it("should reject with 404 if email not found", async () => {
        
    // });

    // it("should reject with 404 if password does not match", async () => {
        
    // });



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
});
