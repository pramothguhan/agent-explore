import { FileText, MessageSquare, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  agent: "researcher" | "critic" | "synthesizer";
  content: string;
  timestamp: string;
}

interface AgentConversationProps {
  messages: Message[];
  isAnalyzing?: boolean;
}

const agentConfig = {
  researcher: {
    name: "Researcher",
    icon: FileText,
    color: "text-agent-researcher",
    bgColor: "bg-agent-researcher/10",
  },
  critic: {
    name: "Critic",
    icon: MessageSquare,
    color: "text-agent-critic",
    bgColor: "bg-agent-critic/10",
  },
  synthesizer: {
    name: "Synthesizer",
    icon: Lightbulb,
    color: "text-agent-synthesizer",
    bgColor: "bg-agent-synthesizer/10",
  },
};

export const AgentConversation = ({ messages, isAnalyzing }: AgentConversationProps) => {
  return (
    <div className="space-y-4 custom-scrollbar">
      {messages.length === 0 && !isAnalyzing ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <p>Start analysis to see agent conversation...</p>
        </div>
      ) : (
        <>
          {messages.map((message, index) => {
            const config = agentConfig[message.agent];
            const Icon = config.icon;
            
            return (
              <div
                key={message.id}
                className={cn(
                  "rounded-lg border border-border p-4 animate-fade-in",
                  config.bgColor
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("flex-shrink-0 rounded-lg p-2", config.bgColor)}>
                    <Icon className={cn("h-5 w-5", config.color)} />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={cn("font-semibold", config.color)}>
                        {config.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp}
                      </span>
                    </div>
                    
                    <p className="text-sm text-foreground leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {isAnalyzing && (
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-status-progress animate-pulse-glow" />
                <span className="text-sm">Analyzing papers...</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
