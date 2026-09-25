const request = require("supertest");

const app = require("../app");

describe("Authentication", () => {

    test("GET /login should return login page", async () => {

        const response = await request(app)
            .get("/login");

        expect(response.statusCode).toBe(200);

    });

    test("GET /signup should return signup page", async () => {

        const response = await request(app)
            .get("/signup");

        expect(response.statusCode).toBe(200);

    });

    test("GET /dashboard should redirect unauthenticated user", async () => {

        const response = await request(app)
            .get("/dashboard");

        expect(response.statusCode).toBe(302);

        expect(response.headers.location).toBe("/login");

    });

});