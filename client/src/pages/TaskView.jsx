import React from "react";
import {
  Plus,
  Calendar,
  User,
  Flag,
  CheckCircle,
  Circle,
  Clock,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";

const TasksView = () => {
  // Static data for UI display
  const showCreateTask = false;
  const filter = "all";
  const searchQuery = "";
  const newTask = {
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignedTo: [],
  };

  // Mock tasks for UI display
  const mockTasks = [
    {
      id: "1",
      title: "Design new user interface",
      description: "Create mockups for the new dashboard design",
      status: "in-progress",
      priority: "high",
      assignedTo: [],
      dueDate: new Date(Date.now() + 86400000 * 3),
      createdAt: new Date(),
      roomId: "1",
      tags: ["design", "ui"],
    },
    {
      id: "2",
      title: "Implement authentication system",
      description: "Set up user login and registration functionality",
      status: "todo",
      priority: "high",
      assignedTo: [],
      dueDate: new Date(Date.now() + 86400000 * 7),
      createdAt: new Date(),
      roomId: "1",
      tags: ["backend", "security"],
    },
    {
      id: "3",
      title: "Write project documentation",
      description: "Document the API endpoints and usage examples",
      status: "completed",
      priority: "medium",
      assignedTo: [],
      dueDate: new Date(Date.now() - 86400000),
      createdAt: new Date(),
      roomId: "1",
      tags: ["documentation"],
    },
    {
      id: "4",
      title: "Code review and testing",
      description: "Review pull requests and run automated tests",
      status: "todo",
      priority: "medium",
      assignedTo: [],
      dueDate: new Date(Date.now() + 86400000 * 2),
      createdAt: new Date(),
      roomId: "1",
      tags: ["testing"],
    },
    {
      id: "5",
      title: "Deploy to production",
      description: "Deploy the latest version to production servers",
      status: "in-progress",
      priority: "low",
      assignedTo: [],
      dueDate: new Date(Date.now() + 86400000 * 5),
      createdAt: new Date(),
      roomId: "1",
      tags: ["deployment"],
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const tasksByStatus = {
    todo: mockTasks.filter((task) => task.status === "todo"),
    "in-progress": mockTasks.filter((task) => task.status === "in-progress"),
    completed: mockTasks.filter((task) => task.status === "completed"),
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
          </div>

          {/* Filter */}
          <select
            value={filter}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {/* To Do Column */}
          <div className="bg-white rounded-lg border border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">To Do</h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                  {tasksByStatus.todo.length}
                </span>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {tasksByStatus.todo.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <button className="flex-shrink-0 mr-3 mt-1">
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 text-xs">
                        <span
                          className={`px-2 py-1 rounded-full ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-white rounded-lg border border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">In Progress</h3>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
                  {tasksByStatus["in-progress"].length}
                </span>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {tasksByStatus["in-progress"].map((task) => (
                <div
                  key={task.id}
                  className="bg-blue-50 rounded-lg p-4 border border-blue-200 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <button className="flex-shrink-0 mr-3 mt-1">
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 text-xs">
                        <span
                          className={`px-2 py-1 rounded-full ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Column */}
          <div className="bg-white rounded-lg border border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Completed</h3>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm">
                  {tasksByStatus.completed.length}
                </span>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {tasksByStatus.completed.map((task) => (
                <div
                  key={task.id}
                  className="bg-green-50 rounded-lg p-4 border border-green-200 hover:shadow-sm transition-shadow opacity-75"
                >
                  <div className="flex items-start justify-between mb-2">
                    <button className="flex-shrink-0 mr-3 mt-1">
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1 line-through">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 text-xs">
                        <span
                          className={`px-2 py-1 rounded-full ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Task
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  placeholder="Enter task title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  placeholder="Enter task description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  readOnly
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksView;
