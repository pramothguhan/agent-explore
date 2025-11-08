import { FileText, MessageSquare, Lightbulb, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  name: string;
  description: string;
  status: "complete" | "progress" | "pending";
  icon: "researcher" | "critic" | "synthesizer";
  className?: string;
}

const iconMap = {
  researcher: FileText,
  critic: MessageSquare,
  synthesizer: Lightbulb,
};

const colorMap = {
  researcher: "bg-agent-researcher/10 text-agent-researcher border-agent-researcher/20",
  critic: "bg-agent-critic/10 text-agent-critic border-agent-critic/20",
  synthesizer: "bg-agent-synthesizer/10 text-agent-synthesizer border-agent-synthesizer/20",
};

export const AgentCard = ({ name, description, status, icon, className }: AgentCardProps) => {
  const Icon = iconMap[icon];
  
  return (
    <div className={cn(
      "agent-card relative overflow-hidden rounded-xl border-2 p-6",
      "bg-gradient-to-br from-card/50 to-card shadow-card",
      colorMap[icon],
      className
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          "flex h-14 w-14 items-center justify-center rounded-lg",
          icon === "researcher" && "bg-agent-researcher/20",
          icon === "critic" && "bg-agent-critic/20",
          icon === "synthesizer" && "bg-agent-synthesizer/20"
        )}>
          <Icon className="h-7 w-7" />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground">{name}</h3>
            {status === "complete" && (
              <div className="flex items-center gap-1.5 text-status-complete">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Complete</span>
              </div>
            )}
            {status === "progress" && (
              <div className="flex items-center gap-1.5 text-status-progress">
                <div className="h-2 w-2 rounded-full bg-status-progress animate-pulse-glow" />
                <span className="text-sm font-medium">In Progress</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};
