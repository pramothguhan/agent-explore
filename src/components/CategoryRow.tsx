import { Button } from "@/components/ui/button";
import { PaperCard } from "./PaperCard";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useRef } from "react";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: string;
  abstract?: string;
  thumbnail?: string;
}

interface CategoryRowProps {
  title: string;
  papers: Paper[];
  onStartAnalysis?: () => void;
  onPaperClick?: (paperId: string) => void;
}

export const CategoryRow = ({ title, papers, onStartAnalysis, onPaperClick }: CategoryRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Category Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif font-semibold text-foreground">{title}</h2>
        {onStartAnalysis && (
          <Button
            onClick={onStartAnalysis}
            variant="outline"
            className="gap-2 border-2 shadow-none"
          >
            <Play className="h-4 w-4" />
            Start Analysis
          </Button>
        )}
      </div>

      {/* Papers Carousel */}
      <div className="relative group/carousel">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-full w-12 bg-gradient-to-r from-background to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-start"
        >
          <div className="h-10 w-10 rounded-full bg-card/80 hover:bg-card flex items-center justify-center shadow-lg">
            <ChevronLeft className="h-6 w-6" />
          </div>
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full w-12 bg-gradient-to-l from-background to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center justify-end"
        >
          <div className="h-10 w-10 rounded-full bg-card/80 hover:bg-card flex items-center justify-center shadow-lg">
            <ChevronRight className="h-6 w-6" />
          </div>
        </button>

        {/* Papers Grid */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {papers.map((paper) => (
            <div key={paper.id} className="flex-shrink-0 w-[280px]">
              <PaperCard
                title={paper.title}
                authors={paper.authors}
                year={paper.year}
                abstract={paper.abstract}
                thumbnail={paper.thumbnail}
                onClick={() => onPaperClick?.(paper.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
