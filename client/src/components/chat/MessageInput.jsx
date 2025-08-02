import React, { useState } from "react";

const MessageInput = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      // Send message API / Socket here
      console.log("Sent:", message);
      setMessage("");
    }
  };

  return (
    <div className="p-4 bg-white border-t flex gap-2">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 border rounded-md"
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 rounded-md"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
