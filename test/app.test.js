const request = require("supertest");
const app = require("../src/app");

describe("GET /", () => {
  it("should return welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Welcome to Secure NodeJS App!");
  });
});

