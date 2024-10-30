const request = require("supertest");
const express = require("express");
const restrictJs = require("./middleware/restrict");

const app = express();
app.use("/auth/login", restrictJs);

describe("restrict.js", () => {
  it("should redirect unauthenticated users to the login page", async () => {
    const res = await request(app)
      .get("/auth/login")
      .expect(302)
      .expect("Location", "/auth/login");
  });

  it("should allow authenticated users to access the resource", async () => {
    const res = await request(app)
      .get("/auth/login")
      .set("Authorization", "Bearer abc123")
      .expect(200);
  });
});
