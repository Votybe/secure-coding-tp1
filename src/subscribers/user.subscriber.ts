import {
  BeforeInsert,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { User } from "../entities/users";
import { validate } from "class-validator";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  /**
   * Indicates that this subscriber only listen to User events.
   */
  listenTo() {
    return User;
  }

  /**
   * Called before post insertion.
   */

  async beforeInsert(event: InsertEvent<User>) {
    const user = event.entity;

    console.log(await validate(user));
    console.log(user);

    console.log(`BEFORE POST INSERTED: `);

    const errors = await validate(user);
    if (errors.length > 0) {
      console.log(user);
      console.log("BEFORE POST INSERTED");
      throw new Error("Validation failed !");
    }
  }
}
