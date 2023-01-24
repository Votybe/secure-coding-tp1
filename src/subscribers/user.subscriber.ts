import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { User } from "../entities/user";
import { validate } from "class-validator";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  /**
   * Indicates that this subscriber only listen to User events.
   */
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const user = new User();
    user.firstName = event.entity.firstName;
    user.lastName = event.entity.lastName;
    user.email = event.entity.email;
    user.passwordHash = event.entity.passwordHash;
    const errors = await validate(event.entity);
    if (errors.length > 0) {
      throw errors[0];
    }
  }
}
