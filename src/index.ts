import "reflect-metadata";
import { AppDataSource } from "./lib/typeorm";
import server from "./lib/fastify"
//import { FASTIFY_ADDR, FASTIFY_PORT } from './lib/dotenv'

async function run() {
  await AppDataSource.initialize();
  server.listen({ port: 8080, host: "localhost"}, (err, address) => {
    if (err) {
      console.log(err);
      process.exit(1)
    }
    console.log('server listening');
  })
}

run().catch(console.error)


