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
    const user = new User();
    user.firstName = event.entity.firstName;
    user.lastName = event.entity.lastName;
    user.email = event.entity.email;
    user.passwordHash = event.entity.passwordHash;

    console.log(`BEFORE POST INSERTED: `);

    const errors = await validate(user);
    if (errors.length > 0) {
      const validationErrorEmail = errors[0].constraints?.isEmail;
      throw new Error(`${validationErrorEmail}`);
    }
  }
}
