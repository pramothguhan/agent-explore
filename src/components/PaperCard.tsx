import { FileText, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaperCardProps {
  title: string;
  authors: string[];
  year: string;
  abstract?: string;
  thumbnail?: string;
  onClick?: () => void;
  className?: string;
}

export const PaperCard = ({
  title,
  authors,
  year,
  abstract,
  thumbnail,
  onClick,
  className
}: PaperCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "paper-card group relative h-[320px] cursor-pointer overflow-hidden rounded-lg",
        "bg-card border border-border shadow-card",
        "hover:border-primary/50",
        className
      )}
    >
      {/* Thumbnail/Icon */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FileText className="h-16 w-16 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span className="line-clamp-1">{authors.join(", ")}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{year}</span>
        </div>
        
        {abstract && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {abstract}
          </p>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
