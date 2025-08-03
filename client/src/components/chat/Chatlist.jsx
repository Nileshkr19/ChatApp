import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ContactSelectionModal from "./ContactSlectionModal";

const Chatlist = ({
  contacts,
  selectedChat,
  onChatSelect,
  allContacts,
  onStartNewChat,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartNewChat = (contact) => {
    onStartNewChat(contact);
    setIsContactModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Chats
          </h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsContactModalOpen(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Search for finding conversations */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* List of conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? "No conversations found" : "No conversations yet"}
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onChatSelect(contact)}
              className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                selectedChat?.id === contact.id
                  ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500"
                  : ""
              }`}
            >
              {/* Contact info */}
              <div className="relative mr-3">
                <Avatar>
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>
                    {contact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {contact.name}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {contact.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {contact.lastMessage}
                </p>
              </div>

              {contact.unread > 0 && (
                <Badge
                  variant="destructive"
                  className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs ml-2"
                >
                  {contact.unread > 99 ? "99+" : contact.unread}
                </Badge>
              )}
            </div>
          ))
        )}
      </div>

      {/* Contact Selection Modal */}
      <ContactSelectionModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        allContacts={allContacts}
        existingChats={contacts}
        onSelectContact={handleStartNewChat}
      />
    </div>
  );
};

export default Chatlist;
