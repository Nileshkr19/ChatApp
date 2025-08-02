import React from "react";

const ChatHeader = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      <h2 className="text-lg font-semibold">John Doe</h2>
      <div className="text-sm text-gray-500">Online</div>
    </div>
  );
};

export default ChatHeader;
