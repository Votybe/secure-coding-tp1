import server from '../lib/fastify'
import { createUserRequestBodyObject } from "../schemas/createUserRequestBody";
import { AppDataSource } from "../lib/typeorm";
import { User } from '../entities/users';
import { FromSchema } from 'json-schema-to-ts';

server.post<{Body: FromSchema<typeof createUserRequestBodyObject> }>(
    "/web-api/users",
    { schema: { body: createUserRequestBodyObject } },
    async (req, res) => {
        const repo = AppDataSource.getRepository(User);
        const user = new User();
        const body : any = req.body;
        console.log("body : ",body);
        console.log("test: ");

        user.firstName= body.firstName;
        user.lastName= body.lastName;
        user.email= body.email;
        user.passwordHash= body.passwordHash;

        res.send(await repo.save(user));
    }
)