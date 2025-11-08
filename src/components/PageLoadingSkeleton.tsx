import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

export const PageLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Navigation skeleton */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-white animate-pulse-glow" />
            </div>
            <Skeleton className="h-6 w-32 bg-gaming-purple/20" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-24 bg-gaming-blue/20 rounded-full" />
            <Skeleton className="h-10 w-10 bg-gaming-cyan/20 rounded-full" />
          </div>
        </div>
      </nav>

      <main className="container px-6 py-8 space-y-12">
        {/* Hero skeleton */}
        <section className="space-y-6">
          <Skeleton className="h-16 w-3/4 bg-gradient-to-r from-gaming-purple/20 via-gaming-blue/20 to-gaming-cyan/20" />
          <Skeleton className="h-24 w-full max-w-3xl bg-gaming-orange/10" />
        </section>

        {/* Categories skeleton */}
        <section className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-64 bg-gaming-green/20" />
                <Skeleton className="h-10 w-32 bg-gaming-yellow/20 rounded-full" />
              </div>
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4].map((j) => (
                  <div
                    key={j}
                    className="min-w-[280px] h-[400px] rounded-lg border border-border bg-gradient-to-br from-gaming-purple/10 via-gaming-blue/10 to-gaming-cyan/10 animate-pulse-glow"
                  >
                    <Skeleton className="h-[240px] w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};
