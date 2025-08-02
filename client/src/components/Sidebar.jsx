
import { NavLink, useLocation } from "react-router-dom";
import {
  MessageSquare,
  Video,
  Users,
  FileText,
  CheckSquare,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  LayoutDashboard,
  PenTool,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/toggle-theme";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Chats", url: "/chat", icon: MessageSquare },
  { title: "Video Calls", url: "/video", icon: Video },
  { title: "Whiteboard", url: "/whiteboard", icon: PenTool },
  { title: "Notes", url: "/notes", icon: FileText },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Files", url: "/files", icon: FolderOpen },
];




const Sidebar = ({ collapsed, onToggle })=> {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const {logout} = useAuth();
  const handleLogout = () => {
    logout();
  };
  return (
    <div
      className={cn(
        "relative flex h-full flex-col bg-card border-r transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          {!collapsed && (
            <>
              <div className="h-8 w-8 rounded-lg bg-[#6043EF] flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg  bg-gradient-primary bg-clip-text text-[#6043EF]">
                ChatFlow
              </span>
            </>
          )}
          {collapsed && (
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-20 z-10 h-8 w-8 rounded-full border bg-background shadow-md"
        onClick={onToggle}
      >
        <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
      </Button>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.url)
                ? "bg-primary text-primary-foreground shadow-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              collapsed && "justify-center px-2"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-4 space-y-4">
        {!collapsed && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
        )}

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start p-2",
                collapsed && "justify-center"
              )}
            >
              <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/32/32" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium">John Doe</span>
                    <span className="text-xs text-muted-foreground">john@example.com</span>
                  </div>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" 
              onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {collapsed && (
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;