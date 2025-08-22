import React from "react";
import {
  Upload,
  File,
  Image,
  FileText,
  Download,
  Trash2,
  Search,
  Grid,
  List,
  MoreVertical,
  FolderPlus,
  Folder,
} from "lucide-react";

const FilesView = () => {
  // Static data for UI display
  const viewMode = "grid";
  const searchQuery = "";
  const selectedFiles = ["1"];
  const showCreateFolder = false;
  const newFolderName = "";

  // Mock files for UI display
  const mockFiles = [
    {
      id: "1",
      name: "Project Requirements.pdf",
      type: "file",
      size: 2048000,
      uploadedBy: "Alice Johnson",
      uploadedAt: new Date(Date.now() - 86400000),
      mimeType: "application/pdf",
      url: "#",
    },
    {
      id: "2",
      name: "Design Mockups",
      type: "folder",
      uploadedBy: "Bob Smith",
      uploadedAt: new Date(Date.now() - 172800000),
    },
    {
      id: "3",
      name: "screenshot.png",
      type: "file",
      size: 1024000,
      uploadedBy: "Carol Davis",
      uploadedAt: new Date(Date.now() - 3600000),
      mimeType: "image/png",
      url: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    },
    {
      id: "4",
      name: "meeting-notes.txt",
      type: "file",
      size: 5120,
      uploadedBy: "David Wilson",
      uploadedAt: new Date(Date.now() - 7200000),
      mimeType: "text/plain",
      url: "#",
    },
  ];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file) => {
    if (file.type === "folder") {
      return <Folder className="w-8 h-8 text-blue-500" />;
    }

    if (file.mimeType?.startsWith("image/")) {
      return <Image className="w-8 h-8 text-green-500" />;
    }

    if (
      file.mimeType === "application/pdf" ||
      file.mimeType?.includes("document")
    ) {
      return <FileText className="w-8 h-8 text-red-500" />;
    }

    return <File className="w-8 h-8 text-gray-500" />;
  };

  const filteredFiles = mockFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Files</h2>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FolderPlus className="w-4 h-4" />
              <span>New Folder</span>
            </button>
            <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Upload Files</span>
              <input type="file" multiple className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Files Content */}
      <div className="flex-1 p-4">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`bg-white rounded-lg border-2 p-4 hover:shadow-md transition-all cursor-pointer ${
                  selectedFiles.includes(file.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  {file.type === "file" &&
                  file.mimeType?.startsWith("image/") &&
                  file.url ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded-lg mb-2"
                    />
                  ) : (
                    <div className="mb-2">{getFileIcon(file)}</div>
                  )}

                  <h3 className="text-sm font-medium text-gray-900 truncate w-full mb-1">
                    {file.name}
                  </h3>

                  {file.size && (
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-1">
                    {file.uploadedBy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Size
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Uploaded By
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr
                      key={file.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            readOnly
                          />
                          {getFileIcon(file)}
                          <span className="font-medium text-gray-900">
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {file.size ? formatFileSize(file.size) : "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {file.uploadedBy}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {file.uploadedAt.toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {file.type === "file" && (
                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <File className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No files found
            </h3>
            <p className="text-gray-500">Upload some files to get started</p>
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Folder
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  placeholder="Enter folder name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesView;
