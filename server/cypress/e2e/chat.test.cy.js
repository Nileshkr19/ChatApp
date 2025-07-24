import { createTestUsers, loginUser } from "../support/helpers";

describe("Chat Routes with Dynamic Users", () => {
  let userId1;
  let userId2;
  let chatId;
  let user1, user2; // Store user credentials

  before(() => {
    return createTestUsers().then((userData) => {
      user1 = userData.user1;
      user2 = userData.user2;
      userId1 = userData.userId1;
      userId2 = userData.userId2;
    });
  });

  it("should create a chat", () => {
    loginUser(user1)
      .then(() => {
        return cy.request({
          method: "POST",
          url: "/api/v1/chats",
          body: { userId: userId2 },
        });
      })
      .then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.data.chat).to.have.property("id");
        chatId = res.body.data.chat.id;
      });
  });

  it("should fetch all chats", () => {
    loginUser(user1)
      .then(() => {
        return cy.request({
          method: "GET",
          url: "/api/v1/chats",
        });
      })
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.data.chats).to.be.an("array");
      });
  });

  it("should fetch chat by ID", () => {
    loginUser(user1)
      .then(() => {
        return cy.request({
          method: "GET",
          url: `/api/v1/chats/${chatId}`,
        });
      })
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.data.chat).to.have.property("id", chatId);
      });
  });

  it("should delete the chat", () => {
    loginUser(user1)
      .then(() => {
        return cy.request({
          method: "DELETE",
          url: `/api/v1/chats/${chatId}`,
        });
      })
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.message).to.include("deleted");
      });
  });
});
