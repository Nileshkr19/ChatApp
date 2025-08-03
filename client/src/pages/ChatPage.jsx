import React, { useState, useCallback } from "react";
import Chatlist from "../components/chat/Chatlist";
import ChatWindow from "../components/chat/ChatWindow";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock data for UI demonstration
  const mockChats = [
    {
      id: "chat1",
      name: "Alice Johnson",
      avatar: "/api/placeholder/40/40",
      online: true,
      lastMessage: "Hey, how are you doing?",
      time: "2:30 PM",
      unread: 2,
      type: "direct",
      participants: [],
      lastSeen: new Date().toISOString(),
    },
    {
      id: "chat2",
      name: "Bob Wilson",
      avatar: "/api/placeholder/40/40",
      online: false,
      lastMessage: "See you tomorrow!",
      time: "1:15 PM",
      unread: 0,
      type: "direct",
      participants: [],
      lastSeen: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "chat3",
      name: "Team Chat",
      avatar: "/api/placeholder/40/40",
      online: false,
      lastMessage: "Meeting at 3 PM",
      time: "12:45 PM",
      unread: 5,
      type: "group",
      participants: [],
      lastSeen: null,
    },
  ];

  const mockMessages = [
    {
      id: "msg1",
      text: "Hey there! How's your day going?",
      sender: "other",
      timestamp: "2:25 PM",
      senderName: "Alice Johnson",
      status: "read",
      messageType: "text",
      isEdited: false,
      reactions: [],
    },
    {
      id: "msg2",
      text: "Pretty good! Just working on some projects. How about you?",
      sender: "me",
      timestamp: "2:27 PM",
      senderName: "You",
      status: "delivered",
      messageType: "text",
      isEdited: false,
      reactions: [],
    },
    {
      id: "msg3",
      text: "Same here! Been busy with the new features.",
      sender: "other",
      timestamp: "2:30 PM",
      senderName: "Alice Johnson",
      status: "read",
      messageType: "text",
      isEdited: false,
      reactions: [],
    },
  ];

  const allUsers = [
    {
      id: "user1",
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: "/api/placeholder/40/40",
      online: true,
      phone: "+1 234 567 8901",
    },
    {
      id: "user2",
      name: "Bob Wilson",
      email: "bob@example.com",
      avatar: "/api/placeholder/40/40",
      online: false,
      phone: "+1 234 567 8902",
    },
    {
      id: "user3",
      name: "Carol Davis",
      email: "carol@example.com",
      avatar: "/api/placeholder/40/40",
      online: true,
      phone: "+1 234 567 8903",
    },
  ];

  // Helper functions for UI formatting
  const formatTime = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  }, []);

  // UI event handlers
  const handleChatSelect = useCallback((chat) => {
    setSelectedChat(chat);
  }, []);

  const handleStartNewChat = useCallback(
    (contact) => {
      // Check if chat already exists
      const existingChat = mockChats.find((chat) => chat.name === contact.name);

      if (existingChat) {
        setSelectedChat(existingChat);
        return;
      }

      // Create new mock chat
      const newChat = {
        id: `chat_${Date.now()}`,
        name: contact.name,
        avatar: contact.avatar,
        online: contact.online,
        lastMessage: "No messages yet",
        time: formatTime(new Date()),
        unread: 0,
        type: "direct",
        participants: [],
        lastSeen: contact.online ? new Date().toISOString() : null,
      };

      setSelectedChat(newChat);
    },
    [formatTime]
  );

  const handleSendMessage = useCallback(
    (messageText) => {
      if (!selectedChat || !messageText.trim()) return;

      // Simulate sending message
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        console.log("Message sent:", messageText);
      }, 500);
    },
    [selectedChat]
  );

  const handleDeleteChat = useCallback(
    (chatId) => {
      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
      }
      console.log("Chat deleted:", chatId);
    },
    [selectedChat]
  );

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Chat List Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Chatlist
          contacts={mockChats}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
          allContacts={allUsers}
          onStartNewChat={handleStartNewChat}
          onDeleteChat={handleDeleteChat}
          creating={false}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            messages={selectedChat.id === "chat1" ? mockMessages : []}
            onSendMessage={handleSendMessage}
            loading={false}
            sending={loading}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">💬</div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
