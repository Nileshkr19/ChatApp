import {
  createSingleTestUser,
  registerUser,
  loginUser,
  loginWithCredentials,
} from "../support/helpers";

describe("User Authentication Flow", () => {
  let testUser, userId;

  before(() => {
    // Create a unique test user using helper function
    return createSingleTestUser("Cypress Test User").then((userData) => {
      testUser = userData.user;
      userId = userData.userId;
    });
  });

  beforeEach(() => {
    cy.clearCookies(); // Clean state before each test
  });

  // -------- SIGN UP TEST --------
  it("should register a new user", () => {
    const newUser = {
      name: "Another Test User",
      email: `test${Date.now()}@example.com`,
      password: "Test@1234",
      bio: "Another automated test user",
    };

    registerUser(newUser).then((res) => {
      expect([201, 400]).to.include(res.status);
      if (res.status === 201) {
        expect(res.body.message).to.include("User registered successfully");
        expect(res.body.data.user.email).to.eq(newUser.email);
      } else {
        expect(res.body.message).to.include("User already exists");
      }
    });
  });

  // -------- LOGIN TEST --------
  it("should login successfully with valid credentials", () => {
    loginUser(testUser).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.data.user.email).to.eq(testUser.email);
    });
  });

  // -------- AUTHORIZED ROUTE TEST --------
  it("should access /me when authenticated", () => {
    loginUser(testUser).then((res) => {
      expect(res.status).to.eq(200);

      // After login, use session cookie to fetch /me
      cy.request({
        method: "GET",
        url: "/api/v1/users/me",
      }).then((profileRes) => {
        expect(profileRes.status).to.eq(200);
        expect(profileRes.body.data.user.email).to.eq(testUser.email);
      });
    });
  });

  // -------- UNAUTHORIZED ROUTE TEST --------
  it("should return 401 when accessing /me without login", () => {
    cy.request({
      method: "GET",
      url: "/api/v1/users/me",
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body.message).to.include("Access token is missing or invalid");
    });
  });

  // -------- LOGOUT TEST --------
  it("should logout user and block further access", () => {
    loginUser(testUser);

    // Logout
    cy.request("POST", "/api/v1/users/logout").then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.message).to.eq("User logged out successfully");
    });

    // Access protected route after logout
    cy.request({
      method: "GET",
      url: "/api/v1/users/me",
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401);
    });
  });

  // -------- INVALID LOGIN TEST --------
  it("should fail login with wrong credentials", () => {
    loginWithCredentials("wrong@example.com", "badpassword").then((res) => {
      expect(res.status).to.be.oneOf([400, 401, 404]);
      expect(res.body.success).to.be.false;
    });
  });
});
