import { Button } from "@/components/ui/button";
import { Upload, Sparkles, LogOut } from "lucide-react";
import { NavLink } from "./NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
  onAddPapers?: () => void;
}

export const Navigation = ({ onAddPapers }: NavigationProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-serif font-semibold text-foreground">
            ResearchAgent
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-foreground"
          >
            Categories
          </NavLink>
          <NavLink
            to="/analytics"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-foreground"
          >
            Analytics
          </NavLink>
          <NavLink
            to="/profile"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeClassName="text-foreground"
          >
            Profile
          </NavLink>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-muted-foreground hidden md:block">
              {user.name}
            </span>
          )}
          <Button
            onClick={onAddPapers}
            variant="default"
            size="sm"
            className="gap-2 shadow-none"
          >
            <Upload className="h-4 w-4" />
            Add Papers
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};
