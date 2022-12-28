import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "../entities/users";
import { UserSubscriber } from "../subscribers/user.subscriber";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST_POSTGRES,
  port: 5434,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User],
  synchronize: true,
  subscribers: [UserSubscriber],
});
