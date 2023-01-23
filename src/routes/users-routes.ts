import { createUserRequestBodyObject } from "../schemas/createUserRequestBody";
import { AppDataSource } from "../lib/typeorm";
import { User } from '../entities/users';
import { FromSchema } from 'json-schema-to-ts';
import { FastifyBaseLogger, FastifyInstance } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { FromSchemaDefaultOptions } from "json-schema-to-ts";
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { createUserResponseBodyObject } from "../schemas/createUserResponseBody";

function routes (server: FastifyInstance<Server, IncomingMessage, ServerResponse, FastifyBaseLogger, JsonSchemaToTsProvider<FromSchemaDefaultOptions>>) {
    server.post<{Body: FromSchema<typeof createUserRequestBodyObject> }>(
        "/web-api/users",
        { 
            schema: { 
                body: createUserRequestBodyObject,
                response: {200 : createUserResponseBodyObject},
                params: {},
                querystring: {}
            }
        },
        async (req, res) => {
            const user = new User();
            const body : any = req.body;
            console.log("body", body)

            user.firstName= body.firstName;
            user.lastName= body.lastName;
            user.email= body.email;
            await user.setPassword(body.password, body.passwordConfirmation);
            const repoSave = await AppDataSource.getRepository(User).save(user)
            console.log("repoSave", repoSave)
            res.send(repoSave);
        }
    )
}

export default routes;