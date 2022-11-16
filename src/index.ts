import "reflect-metadata";
import * as dotenv from "dotenv";
import { AppDataSource } from "./lib/typeorm";

dotenv.config({ path: "../.env" });

console.log("salut");
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
