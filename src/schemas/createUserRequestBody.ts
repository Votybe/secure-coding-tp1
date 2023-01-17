export const createUserRequestBodyObject = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "CreateUserRequestBody",
  type : "object",
  required : ["firstName", "lastName", "email", "password", "passwordConfirmation"],
  properties : {
    firstName: { "type": "string" },
    lastName: { "type": "string" },
    email: { "type": "string" },
    password: { "type": "string" },
    passwordConfirmation: { "type": "string" }
  },
  additionalProperties : false
}as const;