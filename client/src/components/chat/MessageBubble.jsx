import React from "react";
import { Check, CheckCheck, Clock } from "lucide-react";

const MessageBubble = ({ message, isFirstFromSender }) => {
  const isMyMessage = message.sender === "me";

  return (
    <div
      className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-1`}
    >
      <div
        className={`max-w-xs lg:max-w-md group ${
          isMyMessage ? "ml-12" : "mr-12"
        }`}
      >
        <div
          className={`relative px-4 py-2 rounded-2xl shadow-sm ${
            isMyMessage
              ? "bg-blue-500 text-white rounded-br-md"
              : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md"
          } ${
            isFirstFromSender
              ? ""
              : isMyMessage
              ? "rounded-br-2xl"
              : "rounded-bl-2xl"
          }`}
        >
          {/* Message Text */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>

          {/* Message Info */}
          <div
            className={`flex items-center justify-end mt-1 space-x-1 ${
              isMyMessage ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <span className="text-xs font-medium opacity-70">
              {message.timestamp}
            </span>

            {isMyMessage && (
              <div className="flex items-center">
                {message.status === "sending" && (
                  <Clock className="h-3 w-3 opacity-60" />
                )}
                {message.status === "sent" && (
                  <Check className="h-3 w-3 opacity-60" />
                )}
                {message.status === "delivered" && (
                  <CheckCheck className="h-3 w-3 opacity-60" />
                )}
                {message.status === "read" && (
                  <CheckCheck className="h-3 w-3 text-blue-200" />
                )}
                {!message.status && (
                  <CheckCheck className="h-3 w-3 opacity-60" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Message reactions (if any) */}
        {message.reactions && message.reactions.length > 0 && (
          <div
            className={`flex space-x-1 mt-1 ${
              isMyMessage ? "justify-end" : "justify-start"
            }`}
          >
            {message.reactions.map((reaction, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-600 rounded-full px-2 py-1 shadow-sm"
              >
                <span className="text-xs">{reaction}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
