import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fastify from "fastify";

const server = fastify().withTypeProvider<JsonSchemaToTsProvider>();

export default server;