// src/specs/entities/user.ts
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { AppDataSource } from "../../lib/typeorm";

chai.use(chaiAsPromised);

describe("Session", function () {
    before(async function () {
        // Initialise the datasource (database connection)
        await AppDataSource.initialize()
            .then(() => {
            console.log("database initialized");
            })
            .catch((error: any) => console.log(error));
    });

    it("should create a new User in database", async () => {
        
    });
});
