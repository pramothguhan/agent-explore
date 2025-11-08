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
        "bg-card border-2 border-border shadow-card",
        "hover:border-primary hover:shadow-hover hover:scale-[1.02]",
        "transition-all duration-300",
        className
      )}
    >
      {/* Thumbnail/Icon */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FileText className="h-16 w-16 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-serif font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
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
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {abstract}
          </p>
        )}
      </div>

      {/* Netflix-style preview overlay on hover */}
      <div className="absolute inset-0 bg-foreground opacity-0 group-hover:opacity-95 transition-all duration-300 flex items-end p-4">
        <div className="w-full space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h4 className="text-sm font-serif font-semibold text-background line-clamp-1">{title}</h4>
          <p className="text-xs text-background/70 line-clamp-2">{abstract}</p>
        </div>
      </div>
    </div>
  );
};
