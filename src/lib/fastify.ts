import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import routesUser from "../web-api/routes/users-routes"
import routesSession from "../web-api/routes/session-routes"
import fastify, { RouteOptions } from 'fastify';
import { Entity, EntityNotFoundError } from "typeorm";
import { ValidationError } from "ajv";
import cookie, { FastifyCookieOptions } from '@fastify/cookie'
import { COOKIE_SECRET } from './dotenv'
import { loadSession } from '../lib/session'

const server = fastify({
        logger: true,
        ajv: {
            customOptions: {
                removeAdditional: false,
            },
        },
    })
    .withTypeProvider<JsonSchemaToTsProvider>()
    //.addHook('onRoute', assertsResponseSchemaPresenceHook)
    .addHook('preHandler', loadSession)
    .register(cookie, { secret: COOKIE_SECRET } as FastifyCookieOptions)
    .decorateRequest('session', null)
    .setErrorHandler((error, request, reply) => {
      if(error instanceof EntityNotFoundError) {
        reply.log.info({res: reply, err: error}, error?.message);
        void reply.status(404).send(new Error("Requested entity not found"));
      } else if(error instanceof ValidationError) {
        reply.log.info({res: reply, err: error}, error?.message);
        void reply.status(400).send(new Error('Request error: the following field is not valid: $(error.property)'));
      } else if (reply.statusCode < 500) {
        reply.log.info({res: reply, err: error}, error?.message);
        void reply.send(error);
      } else {
        reply.log.error({req: request, res: reply, err: error}, error?.message);
        void reply.send(new Error("Internal server error, message dropped"));
      }
    })

routesUser(server);
routesSession(server);

export default server;

export function assertsResponseSchemaPresenceHook(routeOptions: RouteOptions) {
    if (!routeOptions.schema) {
      throw new Error("No schema");
    } else {
      if (!routeOptions.schema.body)
        throw new Error("No body in schema");
      if (!routeOptions.schema.params)
        throw new Error("No params in schema");
      if (!routeOptions.schema.querystring)
        throw new Error("No query in schema");
      if (!routeOptions.schema.response)
        throw new Error("No response in schema");
    }
}
  //Need 400-status code 