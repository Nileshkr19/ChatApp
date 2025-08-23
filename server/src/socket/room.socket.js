// socket/room.socket.js
export default function roomSocket(io, socket) {

  // ✅ When a user joins a room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId.toString()); // join the room
    console.log(`👤 User ${socket.userId} joined room: ${roomId}`);

    // Notify all room members
    io.to(roomId.toString()).emit("userJoined", {
      userId: socket.userId,
      roomId,
    });
  });

  // ✅ When a user leaves a room
  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId.toString());
    console.log(`👤 User ${socket.userId} left room: ${roomId}`);

    // Notify other room members
    io.to(roomId.toString()).emit("userLeft", {
      userId: socket.userId,
      roomId,
    });
  });

  // ✅ Kicking a user (server-side validation required in controller usually)
  socket.on("kickMember", ({ roomId, memberId }) => {
    io.to(memberId.toString()).emit("kicked", { roomId });
    io.to(roomId.toString()).emit("memberKicked", { memberId, roomId });
  });
}
