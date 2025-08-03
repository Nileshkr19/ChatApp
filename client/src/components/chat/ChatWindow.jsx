import React, { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";

const ChatWindow = ({ chat, messages, onSendMessage }) => {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (messageText) => {
    onSendMessage(messageText);

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      {/* Chat Header */}
      <div className="flex-shrink-0">
        <ChatHeader chat={chat} />
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-6 space-y-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.03'%3E%3Cpath d='m0 40 40-40H20L0 20M40 40V20l-20 20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Start chatting with {chat.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Send a message to begin the conversation
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Date Separator */}
            <div className="flex justify-center">
              <div className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm px-4 py-1 rounded-full">
                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  Today
                </span>
              </div>
            </div>

            {/* Messages */}
            {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              const isFirstFromSender =
                index === 0 || messages[index - 1].sender !== message.sender;

              return (
                <div key={message.id} className={isLastMessage ? "pb-2" : ""}>
                  <MessageBubble
                    message={message}
                    isFirstFromSender={isFirstFromSender}
                  />
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="animate-fadeIn">
                <TypingIndicator />
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
