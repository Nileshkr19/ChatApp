// Shared helper functions for tests

/**
 * Creates two test users and returns their data
 * @returns {Object} Object containing user1, user2, userId1, userId2
 */
export function createTestUsers() {
  const timestamp = Date.now();
  const user1 = {
    name: "User1",
    email: `user1_${timestamp}@test.com`,
    password: "Test@1234",
    bio: "Test user 1",
  };
  const user2 = {
    name: "User2",
    email: `user2_${timestamp}@test.com`,
    password: "Test@1234",
    bio: "Test user 2",
  };

  let userId1, userId2;

  return cy
    .request("POST", "/api/v1/users/register", user1)
    .then((res1) => {
      expect(res1.status).to.eq(201);
      userId1 = res1.body.data.user.id;

      return cy.request("POST", "/api/v1/users/register", user2);
    })
    .then((res2) => {
      expect(res2.status).to.eq(201);
      userId2 = res2.body.data.user.id;

      return { user1, user2, userId1, userId2 };
    });
}

/**
 * Creates a chat between two users
 * @param {Object} user1 - First user credentials
 * @param {string} userId2 - Second user's ID
 * @returns {string} chatId
 */
export function createChat(user1, userId2) {
  return cy
    .request("POST", "/api/v1/users/login", {
      email: user1.email,
      password: user1.password,
    })
    .then((resLogin) => {
      expect(resLogin.status).to.eq(200);

      return cy.request({
        method: "POST",
        url: "/api/v1/chats",
        body: { userId: userId2 },
      });
    })
    .then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.data.chat).to.have.property("id");
      return res.body.data.chat.id;
    });
}

/**
 * Logs in a user and returns the response
 * @param {Object} user - User credentials
 * @returns {Object} Login response
 */
export function loginUser(user) {
  return cy
    .request("POST", "/api/v1/users/login", {
      email: user.email,
      password: user.password,
    })
    .then((res) => {
      expect(res.status).to.eq(200);
      return res;
    });
}

/**
 * Creates a single test user with unique timestamp
 * @param {string} namePrefix - Prefix for the user name (default: "Test User")
 * @returns {Object} Object containing user data and userId
 */
export function createSingleTestUser(namePrefix = "Test User") {
  const timestamp = Date.now();
  const user = {
    name: `${namePrefix}`,
    email: `test_${timestamp}@example.com`,
    password: "Test@1234",
    bio: "Automated test user",
  };

  return cy.request("POST", "/api/v1/users/register", user).then((res) => {
    expect(res.status).to.eq(201);
    return { user, userId: res.body.data.user.id, response: res };
  });
}

/**
 * Registers a user (can handle existing user scenario)
 * @param {Object} user - User data to register
 * @returns {Object} Registration response
 */
export function registerUser(user) {
  return cy.request({
    method: "POST",
    url: "/api/v1/users/register",
    body: user,
    failOnStatusCode: false,
  });
}

/**
 * Login with email and password (for testing login failures too)
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Login response
 */
export function loginWithCredentials(email, password) {
  return cy.request({
    method: "POST",
    url: "/api/v1/users/login",
    body: { email, password },
    failOnStatusCode: false,
  });
}
