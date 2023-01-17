import { JSONSchema } from 'json-schema-to-ts';

export const createUserRequestBodyObject : JSONSchema = {
  $schema: "http://json-schema.org/draft-04/schema#",
  title: "CreateUserRequestBody",
  type : "object",
  required : ["firstname", "lastname", "email", "password", "passwordConfirmation"],
  properties : {
    firstname: { "type": "string" },
    lastname: { "type": "string" },
    email: { "type": "string" },
    password: { "type": "string" },
    passwordConfirmation: { "type": "string" }
  }
}