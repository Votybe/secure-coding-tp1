import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

console.log(process.env.PORT);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5433,
  username: "tutorial",
  password: "privatepassword",
  database: "iam",
});
