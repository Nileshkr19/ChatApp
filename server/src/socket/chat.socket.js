const chatSocket = (io, socket) => {
    socket.on("joinChat", (chatId) => {
        socket.join(chatId.toString());
        console.log(`👤 User ${socket.userId} joined chat: ${chatId}`);

        io.to(chatId.toString()).emit("userJoinedChat", {
            userId: socket.userId,
            chatId, 
        });
    });

    socket.on("leaveChat", (chatId) => {
        socket.leave(chatId.toString());
        console.log(`👤 User ${socket.userId} left chat: ${chatId}`);

        io.to(chatId.toString()).emit("userLeftChat", {
            userId: socket.userId,
            chatId,
        });
    });


    socket.on("typing", (chatId) => {
        socket.to(chatId.toString()).emit("typing", {
            userId: socket.userId,
            chatId,
        });
    });

    socket.on("stopTyping", (chatId) => {
        socket.to(chatId.toString()).emit("stopTyping", {
            userId: socket.userId,
            chatId,
        });
    });

    socket.on("setActiveChat", (chatId) => {
        socket.activeChatId = chatId;
        console.log(`👤 User ${socket.userId} set active chat: ${chatId}`);
    });
}
export default chatSocket;