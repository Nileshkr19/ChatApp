import { emitToUser } from "./index.js";

export default function callSocket(io, socket) {
  // Caller initiates a call
  socket.on("call_user", ({ toUserId, callType, fromUser }) => {
    emitToUser(toUserId, "incoming_call", { fromUser, callType });
  });

  // Callee answers the call
  socket.on("answer_call", ({ toUserId, answer }) => {
    emitToUser(toUserId, "call_accepted", { answer });
  });

  // Exchange ICE candidates for WebRTC
  socket.on("ice_candidate", ({ toUserId, candidate }) => {
    emitToUser(toUserId, "ice_candidate", { candidate });
  });

  // Call ended
  socket.on("end_call", ({ toUserId }) => {
    emitToUser(toUserId, "call_ended", { from: socket.userId });
  });
}
