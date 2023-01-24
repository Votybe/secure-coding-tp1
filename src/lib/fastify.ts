import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import routesUser from "../web-api/routes/users-routes"
import routesSession from "../web-api/routes/session-routes"
import fastify, { RouteOptions } from 'fastify';

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
    .setErrorHandler((error, request, reply) => {
      if (reply.statusCode < 500) {
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
      //throw new BadRequest("rerre")
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