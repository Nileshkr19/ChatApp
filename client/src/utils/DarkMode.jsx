import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="absolute top-4 right-4 flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Dark Mode</span>
      <Switch checked={isDark} onCheckedChange={setIsDark} />
    </div>
  );
};

export default DarkModeToggle;
