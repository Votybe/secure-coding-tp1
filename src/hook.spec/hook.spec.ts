import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import fastify, { FastifyInstance } from "fastify";
import { assertsResponseSchemaPresenceHook } from "../lib/fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import server from '../lib/fastify'

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("onRoute hook", () => {
    let server: FastifyInstance;

    beforeEach(() => {
        server = fastify()
        .withTypeProvider<JsonSchemaToTsProvider>()
        .addHook("onRoute", assertsResponseSchemaPresenceHook)
        .setErrorHandler((error, request, reply) => {
            console.log("statu", reply.statusCode)
            if (reply.statusCode < 500) {
              reply.log.info({res: reply, err: error}, error?.message);
              void reply.send(error);
            } else {
              reply.log.error({req: request, res: reply, err: error}, error?.message);
              void reply.send(new Error("Internal server error, message dropped"));
            }
          })
    });

    it("should throw an error if route does not contain a schema", async () => {
            try {
                await server.route({
                    method: "POST",
                    url: "/testNoSchema",
                    handler: () => {}
                })
            } catch (error) {
                expect((error as Error).message).to.equal("No schema");
            }
    });

    it("should throw an error if route does not contain a response schema", async () => {
        try {
            await server.route({
                method: "POST",
                url: "/testNoResponseSchema",
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                handler: () => {},
                schema: {
                    body: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                    querystring: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                    params: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                  },
              })
        } catch (error) {
            expect((error as Error).message).to.equal("No response in schema");
        }
      });
    
      it("should throw an error if route does not contain a body schema", async () => {
        try {
            await server.route({
                method: "POST",
                url: "/testNoBodySchema",
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                handler: () => {},
                schema: {
                    querystring: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                    params: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                    response: {
                        200: {
                            type: "object",
                            properties: {
                                message: { type: "string" },
                            },
                        },
                    },
                  },
              })
        } catch (error) {
            expect((error as Error).message).to.equal("No body in schema");
        }
    });
    
      it("should throw an error if route does not contain a params schema", async () => {
        try {
            await server.route({
                method: "POST",
                url: "/testNoParamsSchema",
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                handler: () => {},
                schema: {
                    body: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                    querystring: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                    response: {
                        200: {
                            type: "object",
                            properties: {
                                message: { type: "string" },
                            },
                        },
                    },
                  },
              })
        } catch (error) {
            expect((error as Error).message).to.equal("No params in schema");
        }
      });
    
      it("should throw an error if route does not contain a query schema", async () => {
        try {
            await server.route({
                method: "POST",
                url: "/testNoQuerySchema",
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                handler: () => {},
                schema: {
                    body: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                    params: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        },
                    },
                    response: {
                        200: {
                            type: "object",
                            properties: {
                                message: { type: "string" },
                            },
                        },
                    },
                },
              })
        } catch (error) {
            expect((error as Error).message).to.equal("No query in schema");
        }
      });

    afterEach(async () => {
        await server.close();
    });
});