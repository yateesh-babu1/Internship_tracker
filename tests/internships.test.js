const request = require("supertest");

const app = require("../app");

describe("Internship Routes", () => {

    test("GET /internships should redirect unauthenticated user", async () => {

        const response = await request(app)
            .get("/internships");

        expect(response.statusCode).toBe(302);

        expect(response.headers.location).toBe("/login");

    });


    test("GET /internships/new should redirect unauthenticated user", async () => {

        const response = await request(app)
            .get("/internships/new");

        expect(response.statusCode).toBe(302);

        expect(response.headers.location).toBe("/login");

    });

});