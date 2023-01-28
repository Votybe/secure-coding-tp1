import { createUserRequestBodyObject } from "../../schemas/createUserRequestBody";
import { AppDataSource } from "../../lib/typeorm";
import { User } from '../../entities/user';
import { FromSchema } from 'json-schema-to-ts';
import { FastifyBaseLogger, FastifyInstance } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { FromSchemaDefaultOptions } from "json-schema-to-ts";
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { createUserResponseBodyObject } from "../../schemas/createUserResponseBody";

function routesUser (server: FastifyInstance<Server, IncomingMessage, ServerResponse, FastifyBaseLogger, JsonSchemaToTsProvider<FromSchemaDefaultOptions>>) {
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

            user.firstName= body.firstName;
            user.lastName= body.lastName;
            user.email= body.email;
            await user.setPassword(body.password, body.passwordConfirmation);
            const repoSave = await AppDataSource.getRepository(User).save(user)
            res.send(repoSave);
        }
    )

    server.get(
        "/web-api/users/me",
        { 
            schema: { 
                response: {200 : createUserResponseBodyObject},
                params: {},
                querystring: {}
            }
        },
        async (req, res) => {
            console.log("user me : ", req.user);
            const user = req.user;
            if(user != undefined ) {
                console.log("user response :", user);
                res.send({
                    id : user.id,
                    email : user.email,
                    firstname : user.firstName,
                    lastname : user.lastName,
    
                });
            }
        }
    )
}

export default routesUser;