export const createSessionRequestBodyObject = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "CreateSessionRequestBody",
    type : "object",
    required : ["email", "password"],
    properties : {
        email: { "type": "string" },
        password: { "type": "string" }
    },
    additionalProperties : false
}as const;