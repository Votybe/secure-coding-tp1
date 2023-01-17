import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fastify from "fastify";
import routes from "../routes/users-routes"

const server = fastify().withTypeProvider<JsonSchemaToTsProvider>();
routes(server);
export default server;