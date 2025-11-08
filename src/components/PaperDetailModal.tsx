import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Calendar, Play, Link2, BookMarked, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PaperDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paper: {
    id: string;
    title: string;
    authors: string[];
    year: string;
    abstract?: string;
  } | null;
  onStartAnalysis: () => void;
}

export const PaperDetailModal = ({ open, onOpenChange, paper, onStartAnalysis }: PaperDetailModalProps) => {
  if (!paper) return null;

  const handleAnalysis = () => {
    onOpenChange(false);
    onStartAnalysis();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-card">
        <div className="relative">
          {/* Header Image */}
          <div className="relative h-64 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 text-primary/20" />
            
            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-16rem)] custom-scrollbar">
            {/* Title */}
            <div>
              <h2 className="text-3xl font-bold mb-4 leading-tight">{paper.title}</h2>
              
              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{paper.authors.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{paper.year}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Abstract */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Abstract</h3>
              <p className="text-muted-foreground leading-relaxed">
                {paper.abstract || "No abstract available for this paper."}
              </p>
            </div>

            {/* Key Insights (Mock) */}
            <div>
              <h3 className="text-lg font-semibold mb-3">AI-Generated Insights</h3>
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">
                  Neural Networks
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Energy Optimization
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Reinforcement Learning
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                This paper explores novel approaches to energy system optimization using deep learning techniques...
              </p>
            </div>

            {/* Reasoning Trace (Mock) */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Reasoning Trace</h3>
              <div className="bg-secondary/50 rounded-lg p-4 space-y-2 text-sm">
                <p className="text-muted-foreground">
                  <span className="text-agent-researcher font-semibold">Researcher:</span> Identified key methodology in sections 3-4...
                </p>
                <p className="text-muted-foreground">
                  <span className="text-agent-critic font-semibold">Critic:</span> Sample size may limit generalizability...
                </p>
                <p className="text-muted-foreground">
                  <span className="text-agent-synthesizer font-semibold">Synthesizer:</span> Results align with 3 other papers in this category...
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleAnalysis} className="flex-1 bg-primary hover:bg-primary/90">
                <Play className="h-4 w-4 mr-2" />
                Run Multi-Agent Analysis
              </Button>
              <Button variant="outline" className="flex-1">
                <Link2 className="h-4 w-4 mr-2" />
                View Related Papers
              </Button>
              <Button variant="outline" className="flex-1">
                <BookMarked className="h-4 w-4 mr-2" />
                Add to Library
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
