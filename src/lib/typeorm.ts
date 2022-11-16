import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

console.log(typeof process.env.PORT);
console.log(process.env.PORT);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST,
  port: 5433,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: ["entity/*.ts"],
});
