import { Button } from "@/components/ui/button";
import { Search, Plus, User, Sparkles } from "lucide-react";
import { NavLink } from "./NavLink";

interface NavigationProps {
  onAddPapers?: () => void;
}

export const Navigation = ({ onAddPapers }: NavigationProps) => {
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
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button 
            onClick={onAddPapers}
            size="icon" 
            className="rounded-full shadow-none"
          >
            <Plus className="h-5 w-5" />
          </Button>
          
          <NavLink to="/auth">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
              <User className="h-5 w-5" />
            </Button>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
