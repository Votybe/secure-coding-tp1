export const createUserResponseBodyObject = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "CreateUserResponseBody",
    type : "object",
    required : ["firstname", "lastname", "email", "id"],
    properties : {
        id: { "type": "string" },
        email: { "type": "string" },
        firstname: { "type": "string" },
        lastname: { "type": "string" }
    },
    additionalProperties : false
}as const;