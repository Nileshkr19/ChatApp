import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Users,
  Plus,
  Hash,
  Lock,
  Settings,
  Search,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { CreateRoom } from "@/components/CreateRoom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRooms } from "@/features/room/roomSlice";

const Sidebar = () => {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const dispatch = useDispatch();

  const {
    rooms = [],
    loading,
    error,
  } = useSelector((state) => state.rooms || {});
  const { user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    dispatch(fetchRooms())
      .unwrap()
      .then()
      .catch((error) => {
        console.error("Failed to fetch rooms:", error);
      });
  }, [dispatch]);

  const mockUser = {
    name: user?.name || "John Doe",
    status: "Online",
    avatar:
      user?.avatar ||
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  };

  // Function to open the create room modal
  const handleOpenCreateRoom = () => {
    setShowCreateRoom(true);
  };

  // Function to close the create room modal
  const handleCloseCreateRoom = () => {
    setShowCreateRoom(false);
  };

  // Handle successful room creation
  const handleRoomCreated = (newRoom) => {
    // Optionally, you can do something with the new room
    console.log("New room created:", newRoom);
  
    dispatch(fetchRooms());
    setShowCreateRoom(false);
  };

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">CollabChat</h1>
          </div>
          <button className="p-1 text-gray-400 hover:text-white transition-colors lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search rooms..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Rooms Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between w-full text-left mb-3 text-gray-300 hover:text-white transition-colors">
              <div className="flex items-center space-x-2">
                <ChevronDown className="w-4 h-4" />
                <span className="font-medium">Rooms</span>
              </div>
              <button
                className="p-1 hover:bg-slate-700 rounded transition-colors"
                onClick={handleOpenCreateRoom}
                title="Create new room"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {/* Loading state */}
              {loading && (
                <div className="text-gray-400 px-3 py-2 text-sm">
                  Loading rooms...
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="text-red-400 px-3 py-2 text-sm">
                  Error: {error}
                </div>
              )}

              {/* Rooms list */}
              {!loading &&
                !error &&
                rooms.length > 0 &&
                rooms.map((room, index) => (
                  <button
                    key={room.id}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      index === 0
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {room.roomType === "PRIVATE" || room.isPrivate ? (
                        <Lock className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <Hash className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span className="truncate">{room.name}</span>
                    </div>
                    {room.color && (
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: room.color || "#3B82F6" }}
                      />
                    )}
                  </button>
                ))}

              {/* Empty state */}
              {!loading && !error && rooms.length === 0 && (
                <div className="text-gray-400 px-3 py-2 text-sm">
                  No rooms yet. Create your first room!
                </div>
              )}
            </div>
          </div>

          {/* Direct Messages Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between w-full text-left mb-3 text-gray-300 hover:text-white transition-colors">
              <div className="flex items-center space-x-2">
                <ChevronDown className="w-4 h-4" />
                <span className="font-medium">Direct Messages</span>
              </div>
              <button className="p-1 hover:bg-slate-700 rounded transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-3 px-3 py-2 text-gray-400 text-sm">
                <Users className="w-4 h-4" />
                <span>No direct messages yet</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={mockUser.avatar}
              alt={mockUser.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {mockUser.name}
            </p>
            <p className="text-xs text-gray-400 truncate">{mockUser.status}</p>
          </div>
          <button className="p-1 text-gray-400 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CreateRoom Modal - Only render when showCreateRoom is true */}
      {showCreateRoom && (
        <CreateRoom
          onClose={handleCloseCreateRoom}
          onRoomCreated={handleRoomCreated}
        />
      )}
    </div>
  );
};

export default Sidebar;
