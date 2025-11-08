import { Skeleton } from "@/components/ui/skeleton";

export const PaperSkeleton = () => {
  return (
    <div className="group/card relative rounded-lg overflow-hidden bg-card border border-border min-w-[280px] h-[400px] flex-shrink-0">
      {/* Image skeleton with gaming color animation */}
      <div className="relative h-[240px] bg-gradient-to-br from-gaming-purple/20 via-gaming-blue/20 to-gaming-cyan/20 animate-pulse-glow">
        <Skeleton className="absolute inset-0" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-3/4 bg-gaming-orange/20" />
          <Skeleton className="h-8 w-8 rounded-full bg-gaming-green/20" />
        </div>
        <Skeleton className="h-4 w-1/2 bg-gaming-purple/20" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full bg-gaming-blue/20" />
          <Skeleton className="h-3 w-5/6 bg-gaming-cyan/20" />
        </div>
      </div>
    </div>
  );
};

export const CategorySkeleton = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64 bg-gaming-purple/20" />
        <Skeleton className="h-10 w-32 bg-gaming-blue/20" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <PaperSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
