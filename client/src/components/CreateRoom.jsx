import React, { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { useDispatch } from "react-redux";
import { createRoom } from "../features/room/roomSlice";
import { Toast } from "@/components/Toast";

export const CreateRoom = ({ onClose, onRoomCreated }) => {
  // --- STEP 1: State for the form data ---
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    roomType: "PUBLIC",
  });

  // --- STEP 2: State to hold the successfully created room ---
  const [newlyCreatedRoom, setNewlyCreatedRoom] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [toastInfo, setToastInfo] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- STEP 3: Update the submit handler ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setToastInfo({
        show: true,
        message: "Please enter a room name.",
        type: "error",
      });
      return;
    }
    setIsLoading(true);
    const payload = {
      name: formData.name,
      description: formData.description,
      roomType: formData.roomType,
    };

    dispatch(createRoom(payload))
      .unwrap()
      .then((createdRoomData) => {
        // Instead of closing, set the new room data to change the view
        setNewlyCreatedRoom(createdRoomData.room);
        if (onRoomCreated) {
          onRoomCreated(createdRoomData.room);
        }
      })
      .catch((err) => {
        setToastInfo({
          show: true,
          message: err.message || "Failed to create room.",
          type: "error",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // --- STEP 4: Add a function to copy the code ---
  const handleCopyCode = () => {
    if (newlyCreatedRoom?.roomCode) {
      navigator.clipboard.writeText(newlyCreatedRoom.roomCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4 animate-slide-up">
        {/* --- STEP 5: Conditional Rendering --- */}
        {newlyCreatedRoom && newlyCreatedRoom.roomType === "PRIVATE" ? (
          // --- SUCCESS VIEW for Private Rooms ---
          <div>
            <h3 className="text-lg font-semibold text-white text-center mb-2">
              Room Created!
            </h3>
            <p className="text-center text-gray-300 mb-4">
              Share this code with others to join:
            </p>
            <div className="flex items-center justify-center space-x-2 bg-slate-700 p-3 rounded-lg">
              <span className="text-xl font-mono tracking-widest text-white">
                {newlyCreatedRoom.roomCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                {isCopied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : newlyCreatedRoom ? (
          // --- SUCCESS VIEW for Public Rooms ---
          <div>
            <h3 className="text-lg font-semibold text-white text-center mb-2">
              Room Created!
            </h3>
            <p className="text-center text-gray-300 mb-4">
              Your public room is now live.
            </p>
            <button
              onClick={onClose}
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          // --- FORM VIEW ---
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Create New Room
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Form fields remain the same */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Room Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Project Phoenix Team"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="What is this room about?"
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Room Type
                  </label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">
                      Private (requires code to join)
                    </option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {isLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  )}
                  {isLoading ? "Creating..." : "Create Room"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
      {toastInfo.show && (
        <Toast
          message={toastInfo.message}
          type={toastInfo.type}
          onClose={() => setToastInfo({ ...toastInfo, show: false })}
        />
      )}
    </div>
  );
};
