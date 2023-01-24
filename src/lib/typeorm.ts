import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "../entities/user";
import { UserSubscriber } from "../subscribers/user.subscriber";
import { Session } from "../entities/session";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST_POSTGRES,
  port: 5434,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Session],
  synchronize: true,
  subscribers: [UserSubscriber],
});
