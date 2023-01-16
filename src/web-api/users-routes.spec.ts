// src/specs/routes/web-api/users-routes.spec.ts
import server from '../lib/fastify'
import { QueryFailedError } from "typeorm";


describe('/web-api/users', function () {
  describe('POST #create', function () {
    it('should register the user', async function () {
        const response = await server.inject({ url: `/web-api/users`, method: 'POST', payload: {} })
        console.log("response : ", response)
        await chai
        .expect(response)
        .to.eventually.be.rejectedWith(
            QueryFailedError,
            'duplicate key value violates unique constraint "UQ_e12875dfb3b1d92d7d7c5377e22"'
        );
    })
  })
})