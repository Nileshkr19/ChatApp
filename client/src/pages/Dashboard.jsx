import React from "react";
import {
  MessageSquare,
  Users,
  Video,
  FileText,
  TrendingUp,
  Clock,
  CheckSquare,
  Activity,
  Calendar,
  Bell,
  Plus,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  // Sample data
  const stats = [
    {
      title: "Total Messages",
      value: "2,847",
      change: "+12%",
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Contacts",
      value: "164",
      change: "+8%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Video Calls",
      value: "23",
      change: "+25%",
      icon: Video,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Shared Files",
      value: "89",
      change: "+5%",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const recentChats = [
    {
      id: 1,
      name: "Sarah Wilson",
      message: "Hey! Are we still on for the meeting tomorrow?",
      time: "2 min ago",
      avatar: "/api/placeholder/40/40",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "John Smith",
      message: "Thanks for sharing the documents 📄",
      time: "15 min ago",
      avatar: "/api/placeholder/40/40",
      unread: 0,
      online: true,
    },
    {
      id: 3,
      name: "Team Design",
      message: "Alex: The new mockups are ready for review",
      time: "1 hour ago",
      avatar: "/api/placeholder/40/40",
      unread: 5,
      online: false,
    },
    {
      id: 4,
      name: "Emma Davis",
      message: "Perfect! Let's schedule that call 📞",
      time: "2 hours ago",
      avatar: "/api/placeholder/40/40",
      unread: 1,
      online: true,
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Review project proposal",
      time: "Today, 2:00 PM",
      priority: "high",
      completed: false,
    },
    {
      id: 2,
      title: "Team standup meeting",
      time: "Tomorrow, 9:00 AM",
      priority: "medium",
      completed: false,
    },
    {
      id: 3,
      title: "Update documentation",
      time: "Tomorrow, 3:00 PM",
      priority: "low",
      completed: true,
    },
    {
      id: 4,
      title: "Client presentation",
      time: "Friday, 11:00 AM",
      priority: "high",
      completed: false,
    },
  ];

  const activityData = [
    { day: "Mon", messages: 45 },
    { day: "Tue", messages: 52 },
    { day: "Wed", messages: 38 },
    { day: "Thu", messages: 61 },
    { day: "Fri", messages: 55 },
    { day: "Sat", messages: 23 },
    { day: "Sun", messages: 31 },
  ];

  return (
    <div className="flex-1 space-y-6 p-6 bg-gray-50 dark:bg-black min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your conversations.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last
                month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Chats */}
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Conversations</CardTitle>
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback>
                        {chat.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {chat.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {chat.time}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.message}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <Badge
                      variant="destructive"
                      className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {chat.unread}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Messages sent this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activityData.map((data, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 text-sm text-muted-foreground">
                    {data.day}
                  </div>
                  <div className="flex-1">
                    <Progress
                      value={(data.messages / 70) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="w-8 text-sm font-medium">{data.messages}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Total: <span className="font-medium">305 messages</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Start New Chat
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Video className="mr-2 h-4 w-4" />
              Start Video Call
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Create Note
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Tasks</CardTitle>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          task.completed
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {task.time}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={task.completed ? "text-green-600" : ""}
                  >
                    <CheckSquare className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
