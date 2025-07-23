import { Server } from "socket.io";

let io;

const initSocket = (server) =>{
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173', 'http://localhost:3000'], // Add both ports
            credentials: true,
        }
    });

    io.on("connection", (socket) => {
        console.log(`🟢 User connected: ${socket.id}`);

        // Handle user joining a room
        socket.on("join" , ({userId}) => {
            socket.join(userId);
            console.log(`🔴 User ${userId} joined: ${socket.id}`);
        });

        // Handle sending messages
        socket.on("send_message", ({toUserId, message, fromUser}) => {
            io.to(toUserId).emit("receive_message", {
                message,
                fromUser,
                timestamp: new Date().toISOString(),
            });
        });

        // seen / Delivered message
        socket.on("message_seen", ({messageId, byUserId} ) => {
            io.to(byUserId).emit("message_seen_ack", {messageId});
        });
        socket.on("message_delivered", ({messageId, toUserId} ) => {
            io.to(toUserId).emit("message_delivered_ack", {messageId});
        });

        // video call and audio call
        socket.on("call_user", ({toUserId, callType, fromUser}) =>{
            io.to(toUserId).emit("Incoming_call", {fromUser, callType});
        });
        socket.on("answer_call", ({toUserId, answer}) =>{
            io.to(toUserId).emit("call_accepted", {fromUser, answer});
        });
        socket.on("ice_candidate", ({toUserId, candidate}) => {
            io.to(toUserId).emit("ice_candidate", {candidate});
        });

        socket.on("disconnect", () => {
            console.log(`🔴 User disconnected: ${socket.id}`);
        });
    });
}
const getIo = () => io;

export { initSocket, getIo }