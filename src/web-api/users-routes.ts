import server from '../lib/fastify'
import * as CreateUserRequestBody from "../schemas/CreateUserRequestBody.json";
import { AppDataSource } from "../lib/typeorm";
import { User } from '../entities/users';
import { FromSchema } from 'json-schema-to-ts';

function routes() {
    server.post<{Body: FromSchema<typeof CreateUserRequestBody> }>(
        "web-api/users",
        { schema: { body: CreateUserRequestBody } },
        async (request, reply) => {
            const repo = AppDataSource.getRepository(User);
            const user = new User();
            const body = request.body;

            user.firstName= body.firstName;
            user.lastName= body.lastName;
            user.email= body.email;
            user.passwordHash= body.passwordHash;

            await repo.save(user);
        }
    )
}