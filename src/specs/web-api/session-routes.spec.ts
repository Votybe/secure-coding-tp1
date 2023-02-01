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

    it("should create a session after lowering email", async () => {
        let user = await createUserFixture()
        const response = await server.inject(
            { 
              url: `/web-api/session`, 
              method: 'POST', 
              payload: {
                email: user.email.toLowerCase(),
                password : user.passwordHash,
              }
            }
        )
        // console.log("response : ", response);
        await chai
        .expect(response.statusCode)
        .to.equal(200);
    });

    // it("should reject with 404 if email not found", async () => {
        
    // });

    // it("should reject with 404 if password does not match", async () => {
        
    // });

});
