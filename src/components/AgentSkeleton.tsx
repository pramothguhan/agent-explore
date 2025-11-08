import { Skeleton } from "@/components/ui/skeleton";
import { FileText, MessageSquare, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentSkeletonProps {
  type: "researcher" | "critic" | "synthesizer";
}

const agentConfig = {
  researcher: {
    icon: FileText,
    color: "gaming-blue",
    bgColor: "bg-gaming-blue/10",
    borderColor: "border-gaming-blue/30",
  },
  critic: {
    icon: MessageSquare,
    color: "gaming-purple",
    bgColor: "bg-gaming-purple/10",
    borderColor: "border-gaming-purple/30",
  },
  synthesizer: {
    icon: Lightbulb,
    color: "gaming-cyan",
    bgColor: "bg-gaming-cyan/10",
    borderColor: "border-gaming-cyan/30",
  },
};

export const AgentSkeleton = ({ type }: AgentSkeletonProps) => {
  const config = agentConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-xl border-2 p-6 animate-fade-in",
        config.bgColor,
        config.borderColor
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("flex h-14 w-14 items-center justify-center rounded-lg animate-pulse-glow", config.bgColor)}>
          <Icon className={cn("h-7 w-7", `text-${config.color}`)} />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className={cn("h-6 w-32", `bg-${config.color}/20`)} />
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full animate-pulse-glow", `bg-${config.color}`)} />
              <Skeleton className={cn("h-4 w-24", `bg-${config.color}/20`)} />
            </div>
          </div>
          <Skeleton className={cn("h-4 w-full", `bg-${config.color}/20`)} />
          <Skeleton className={cn("h-4 w-3/4", `bg-${config.color}/20`)} />
        </div>
      </div>
    </div>
  );
};

export const AgentLoadingList = () => {
  return (
    <div className="space-y-4">
      <AgentSkeleton type="researcher" />
      <AgentSkeleton type="critic" />
      <AgentSkeleton type="synthesizer" />
    </div>
  );
};
