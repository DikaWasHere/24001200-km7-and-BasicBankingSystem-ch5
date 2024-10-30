const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const restrictJwt = require("./middleware/restrictJwt");

const app = express();
app.use("/api", restrictJwt);

describe("restrictJwt.js", () => {
  it("should return 401 Unauthorized for requests without a valid JWT token", async () => {
    const res = await request(app)
      .get("/api/protected")
      .expect(401)
      .expect("Content-Type", /application\/json/)
      .expect((res) => {
        expect(res.body).toEqual({ message: "Unauthorized" });
      });
  });

  it("should allow access to protected routes with a valid JWT token", async () => {
    // Generate a valid JWT token
    const payload = { userId: 123, username: "testuser" };
    const secret = "my_secret_key";
    const validToken = jwt.sign(payload, secret, { expiresIn: "1h" });

    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200);
  });
});
