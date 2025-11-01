import request from "supertest";
import app from "../../app.js";
import { User } from "../../models/user.js";

describe("User Controller Tests", () => {
  // Clear the User table before running tests
  beforeAll(async () => {
    // Delete all users
    await User.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  // Create User Tests
  describe("POST /api/users", () => {
    test("Should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/users")
        .send({ name: "Brandon" });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("Please provide all required fields");
    });

    test("Should return 400 for invalid email format", async () => {
      const res = await request(app)
        .post("/api/users")
        .send({ name: "John", surname: "Doe", email: "invalidEmail" });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch("Invalid email format");
    });

    test("should return 201 if user is created successfully", async () => {
      const user = { name: "John", surname: "Doe", email: "john@example.com" };
      const res = await request(app).post("/api/users").send(user);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch("User created successfully");
      expect(res.body.user).toMatchObject(user);
    });

    test("Should return 400 if user already exists", async () => {
      const user = { name: "John", surname: "Doe", email: "john@example.com" };

      // Try to create the last user again
      const res = await request(app).post("/api/users").send(user);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch("User with this email already exists");
    });
  });

  // Get All Users Tests
  describe("GET /api/users", () => {
    test("Should return 200 and a list of users", async () => {
      const res = await request(app).get("/api/users");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.users)).toBe(true);
    });
  });

  // Get User By Email Tests
  describe("GET /api/users/:email", () => {
    test("Should return 400 for invalid email format", async () => {
      const res = await request(app).get("/api/users/invalidEmail");

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("Invalid email format");
    });

    test("Should return 404 if user does not exist", async () => {
      const res = await request(app).get("/api/users/notfound@example.com");

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch("User not found");
    });

    test("Should return 200 if user exists", async () => {
      const email = "john@example.com"; // user created in POST tests
      const res = await request(app).get(`/api/users/${email}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(email);
    });
  });
});
