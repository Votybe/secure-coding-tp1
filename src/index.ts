import "reflect-metadata";
import { AppDataSource } from "./lib/typeorm";
import server from "./lib/fastify"
//import { FASTIFY_ADDR, FASTIFY_PORT } from './lib/dotenv'

async function run() {
  await AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

  await server.listen({ port: 8080 }).then(() => {
    console.log("server listening ");
  })
  .catch((err) => {
    console.error("Error during server initialisation", err);
  });
}

run().catch(console.error)


