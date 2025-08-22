import React from "react";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Download,
  MessageCircle,
} from "lucide-react";

const ChatView = () => {
  // Static mock data for UI display
  const mockMessages = [
    {
      id: "1",
      content: "Hey everyone! Welcome to the team collaboration space.",
      userId: "2",
      timestamp: new Date(Date.now() - 3600000),
      type: "text",
    },
    {
      id: "2",
      content:
        "Thanks for setting this up! Looking forward to working together.",
      userId: "1",
      timestamp: new Date(Date.now() - 3000000),
      type: "text",
    },
    {
      id: "3",
      content: "I've uploaded the project requirements document.",
      userId: "3",
      timestamp: new Date(Date.now() - 1800000),
      type: "file",
      fileName: "Project_Requirements.pdf",
      fileSize: 2048000,
    },
  ];

  const mockCurrentRoom = {
    id: "1",
    name: "General",
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getUserName = (userId) => {
    const userNames = {
      1: "You",
      2: "Alice Johnson",
      3: "Bob Smith",
      4: "Carol Davis",
    };
    return userNames[userId] || "Unknown User";
  };

  const getUserAvatar = (userId) => {
    const avatars = {
      1: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
      2: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
      3: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
    };
    return (
      avatars[userId] ||
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop"
    );
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Messages Area - Takes remaining space */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockMessages.map((message) => (
          <div key={message.id} className="flex items-start space-x-3 group">
            <img
              src={getUserAvatar(message.userId)}
              alt={getUserName(message.userId)}
              className="w-8 h-8 rounded-full flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-gray-900">
                  {getUserName(message.userId)}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(message.timestamp)}
                </span>
              </div>

              {message.type === "text" && (
                <div className="bg-gray-50 rounded-lg px-3 py-2 max-w-2xl">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              )}

              {message.type === "file" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Paperclip className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {message.fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {message.fileSize && formatFileSize(message.fileSize)}
                      </p>
                    </div>
                    <button className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="bg-gray-100 rounded-lg px-3 py-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Input - Always at bottom */}
      <div className="border-t border-gray-200 bg-white p-4 mt-auto">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative">
              <textarea
                placeholder={`Message #${mockCurrentRoom.name}`}
                rows={1}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />

              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                  <Smile className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>

        <input type="file" className="hidden" multiple />
      </div>
    </div>
  );
};

export default ChatView;
