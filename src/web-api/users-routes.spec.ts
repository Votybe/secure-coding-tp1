// src/specs/routes/web-api/users-routes.spec.ts
import server from '../lib/fastify'
import { QueryFailedError } from "typeorm";
import { FromSchema } from 'json-schema-to-ts';
import { createUserRequestBodyObject } from '../schemas/createUserRequestBody';
import * as chai from "chai";

describe('/web-api/users', function () {
  describe('POST #create', function () {
    it('should register the user', async function () {
      console.log("test api")
      const body: FromSchema<typeof createUserRequestBodyObject> = {
        firstName: "Aymeric",
        lastName: "Maillot",
        email: "aymeric@gmail.com",
        passwordHash : "Password123456",
        passwordConfirmation : "Password123456"
      }
      const response = await server.inject({ url: `/web-api/users`, method: 'POST', payload: { body } })
      console.log("response : ", response)
      // await chai
      // .expect(response)
      // .to.eventually.be.rejectedWith(
      //     QueryFailedError,
      //     ''
      // );
    })
  })
})