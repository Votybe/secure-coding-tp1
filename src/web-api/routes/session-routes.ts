import { AppDataSource } from "../../lib/typeorm";
import { User } from '../../entities/user';
import { FromSchema } from 'json-schema-to-ts';
import { FastifyBaseLogger, FastifyInstance } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { FromSchemaDefaultOptions } from "json-schema-to-ts";
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { createUserResponseBodyObject } from "../../schemas/createUserResponseBody";
import { createSessionRequestBodyObject } from "../../schemas/createSessionRequestBody";
import { Session } from "../../entities/session";
import { saveSession } from "../../lib/session";

function routesSession (server: FastifyInstance<Server, IncomingMessage, ServerResponse, FastifyBaseLogger, JsonSchemaToTsProvider<FromSchemaDefaultOptions>>) {
    server.post<{Body: FromSchema<typeof createSessionRequestBodyObject> }>(
        "/web-api/session",
        { 
            schema: { 
                body: createSessionRequestBodyObject,
                response: {200 : {}},
                params: {},
                querystring: {}
            }
        },
        async (req, res) => {
            const body = req.body;
            const user = await AppDataSource.getRepository(User).findOneOrFail({
                where: { email: body.email , passwordHash: body.password}
            });
            if(user) {
                await saveSession(res, user);
            }
            res.code(404).send(new Error("Bad email or password"));
        }
    )
}

export default routesSession;