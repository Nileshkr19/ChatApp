import { createTestUsers, createChat, loginUser } from "../support/helpers";

describe("Message Routes Tests", () => {
  let chatId;
  let user1, user2, userId1, userId2;

  before(() => {
    // Create test users and a chat
    return createTestUsers()
      .then((userData) => {
        user1 = userData.user1;
        user2 = userData.user2;
        userId1 = userData.userId1;
        userId2 = userData.userId2;

        // Create a chat for message testing
        return createChat(user1, userId2);
      })
      .then((createdChatId) => {
        chatId = createdChatId;
      });
  });

  it("should send a message to chat", () => {
    loginUser(user1)
      .then(() => {
        return cy.request({
          method: "POST",
          url: `/api/v1/messages`,
          body: {
            chatId: chatId,
            content: "Hello, this is a test message!",
          },
        });
      })
      .then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body.data.message).to.have.property(
          "content",
          "Hello, this is a test message!"
        );
      });
  });

  it("should fetch all messages from chat", () => {
    loginUser(user1)
      .then(() => {
        return cy.request({
          method: "GET",
          url: `/api/v1/messages/${chatId}`,
        });
      })
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.data.messages).to.be.an("array");
      });
  });
});
