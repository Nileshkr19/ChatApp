import React from "react";
import {
  Pen,
  Square,
  Circle,
  Type,
  StickyNote,
  Eraser,
  Undo,
  Redo,
  Download,
  Palette,
  MousePointer,
} from "lucide-react";

const WhiteboardView = () => {
  // Static data for UI display
  const currentTool = "pen";
  const currentColor = "#000000";
  const strokeWidth = 2;
  const showTextInput = false;
  const textInput = "";

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#FFC0CB",
  ];

  const tools = [
    { id: "select", icon: MousePointer, label: "Select" },
    { id: "pen", icon: Pen, label: "Pen" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "text", icon: Type, label: "Text" },
    { id: "sticky", icon: StickyNote, label: "Sticky Note" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Tools */}
            <div className="flex items-center space-x-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    className={`p-2 rounded-lg transition-colors ${
                      currentTool === tool.id
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    title={tool.label}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>

            {/* Stroke Width */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Size:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                className="w-20"
                readOnly
              />
              <span className="text-sm text-gray-600 w-6">{strokeWidth}</span>
            </div>

            {/* Colors */}
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-gray-600" />
              <div className="flex space-x-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded border-2 ${
                      currentColor === color
                        ? "border-gray-400"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Undo"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Redo"
            >
              <Redo className="w-5 h-5" />
            </button>
            <button className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              Clear
            </button>
            <button
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <div className="w-full h-full bg-white border border-gray-200 cursor-crosshair relative overflow-hidden">
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(#ccc 1px, transparent 1px),
                linear-gradient(90deg, #ccc 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Sample Drawing Elements */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Sample rectangle */}
            <rect
              x="100"
              y="100"
              width="150"
              height="100"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
            />

            {/* Sample circle */}
            <circle
              cx="400"
              cy="150"
              r="50"
              fill="none"
              stroke="#FF0000"
              strokeWidth="2"
            />

            {/* Sample text */}
            <text x="300" y="300" fontSize="16" fill="#0000FF">
              Sample Text
            </text>

            {/* Sample pen stroke */}
            <path
              d="M 150 250 Q 200 200 250 250 T 350 250"
              fill="none"
              stroke="#00FF00"
              strokeWidth="3"
            />
          </svg>

          {/* Sample Sticky Note */}
          <div
            className="absolute bg-yellow-300 border border-yellow-500 rounded shadow-lg p-3"
            style={{
              top: "350px",
              left: "150px",
              width: "150px",
              height: "100px",
            }}
          >
            <div className="text-sm text-gray-800">Sample sticky note</div>
          </div>
        </div>

        {/* Text Input Modal */}
        {showTextInput && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-80">
              <h3 className="text-lg font-semibold mb-4">Add Text</h3>
              <textarea
                value={textInput}
                placeholder="Enter your text..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                readOnly
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Add Text
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhiteboardView;
