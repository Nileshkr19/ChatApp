import {
  Bell,
  Plus,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  MessageSquare,
  Video,
  PenTool,
  FileText,
  CheckSquare,
  LayoutDashboard,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export const Navbar = ({ title }) => {
  // Dynamic icon based on title
  const getPageIcon = (pageTitle) => {
    switch (pageTitle?.toLowerCase()) {
      case "dashboard":
        return <LayoutDashboard className="w-6 h-6" />;
      case "chat":
        return <MessageSquare className="w-6 h-6" />;
      case "video call":
        return <Video className="w-6 h-6" />;
      case "whiteboard":
        return <PenTool className="w-6 h-6" />;
      case "notes":
        return <FileText className="w-6 h-6" />;
      case "tasks":
        return <CheckSquare className="w-6 h-6" />;

      case "files":
        return <FolderOpen className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Logo, Icon and Title with fixed width */}
        <div className="flex items-center gap-3 w-80">
          {getPageIcon(title) && (
            <div className="text-primary flex-shrink-0">
              {getPageIcon(title)}
            </div>
          )}
          <h1 className="text-xl font-semibold text-nowrap overflow-hidden text-ellipsis">
            {title}
          </h1>
        </div>

        {/* Center - Search with fixed positioning */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations, files, or people..."
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Right side - Actions with fixed width */}
        <div className="flex items-center gap-2 w-80 justify-end">
          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" />
                New Chat
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Video className="mr-2 h-4 w-4" />
                Start Video Call
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Create Note
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CheckSquare className="mr-2 h-4 w-4" />
                New Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                3
              </Badge>
            </Button>
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
