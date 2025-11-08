import { Navigation } from "@/components/Navigation";
import { AgentCard } from "@/components/AgentCard";
import { CategoryRow } from "@/components/CategoryRow";
import { AgentConversation } from "@/components/AgentConversation";
import { PaperUploadModal } from "@/components/PaperUploadModal";
import { PaperDetailModal } from "@/components/PaperDetailModal";
import { CategorySkeleton } from "@/components/PaperSkeleton";
import { AgentLoadingList } from "@/components/AgentSkeleton";
import { PageLoadingSkeleton } from "@/components/PageLoadingSkeleton";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

// Mock data
const mockPapers = [
  {
    id: "1",
    title: "Attention Is All You Need: Transformers for Renewable Energy",
    authors: ["John Doe", "Jane Smith"],
    year: "2024",
    abstract: "Exploring the application of transformer architecture in optimizing renewable energy distribution...",
  },
  {
    id: "2",
    title: "Deep Reinforcement Learning for Battery Lifecycle Optimization",
    authors: ["Alice Chen", "Bob Wilson"],
    year: "2024",
    abstract: "A novel approach to extending battery life through predictive maintenance using deep RL...",
  },
  {
    id: "3",
    title: "Agentic AI Systems for Climate Modeling",
    authors: ["Maria Garcia", "Tom Brown"],
    year: "2023",
    abstract: "Multi-agent systems that collaborate to improve climate prediction accuracy...",
  },
  {
    id: "4",
    title: "Graph Neural Networks for Grid Integration",
    authors: ["David Lee", "Sarah Johnson"],
    year: "2024",
    abstract: "Using GNNs to optimize smart grid performance and energy distribution...",
  },
  {
    id: "5",
    title: "Predictive Maintenance in Energy Storage Systems",
    authors: ["Michael Zhang", "Emma Davis"],
    year: "2023",
    abstract: "Machine learning approaches to predict and prevent battery system failures...",
  },
];

const mockMessages = [
  {
    id: "1",
    agent: "researcher" as const,
    content: "Found common themes: energy efficiency improved 20-30% using AI optimization, predictive maintenance reduced costs by 15%",
    timestamp: "3:32:37 PM",
  },
  {
    id: "2",
    agent: "critic" as const,
    content: "Reviewing findings for gaps and inconsistencies...",
    timestamp: "3:32:37 PM",
  },
  {
    id: "3",
    agent: "critic" as const,
    content: "Question: Sample sizes vary greatly (50-5000). How does this affect reliability? Gap: Limited long-term deployment data (>2 years)",
    timestamp: "3:32:39 PM",
  },
  {
    id: "4",
    agent: "synthesizer" as const,
    content: "Generating collective insights from all findings...",
    timestamp: "3:32:39 PM",
  },
];

const categories = [
  "AI for Climate Modeling",
  "Battery Efficiency",
  "Smart Grid Optimization",
  "Renewable Energy Storage",
];

const Index = () => {
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [paperDetailOpen, setPaperDetailOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<typeof mockPapers[0] | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulate initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleStartAnalysis = () => {
    setAnalysisOpen(true);
    setIsAnalyzing(true);
    
    // Simulate analysis completion
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 5000);
  };

  const handlePaperClick = (id: string) => {
    const paper = mockPapers.find(p => p.id === id);
    if (paper) {
      setSelectedPaper(paper);
      setPaperDetailOpen(true);
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Handle chat message
      setChatMessage("");
    }
  };

  if (isPageLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onAddPapers={() => setUploadOpen(true)} />

      <main className="container px-6 py-8 space-y-12">
        {/* Hero Section */}
        <section className="space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-foreground leading-tight">
            Multi-Agent Research Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            Leverage AI agents to analyze research papers, identify patterns, and generate collective insights.
            Browse curated categories and start your analysis journey.
          </p>
        </section>

        {/* Categories with Papers */}
        <section className="space-y-8">
          {isCategoriesLoading ? (
            <>
              <CategorySkeleton />
              <CategorySkeleton />
              <CategorySkeleton />
            </>
          ) : (
            categories.map((category, index) => (
              <CategoryRow
                key={category}
                title={category}
                papers={mockPapers}
                onStartAnalysis={handleStartAnalysis}
                onPaperClick={handlePaperClick}
              />
            ))
          )}
        </section>
      </main>

      {/* Analysis Dialog */}
      <Dialog open={analysisOpen} onOpenChange={setAnalysisOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl">Agent Analysis</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="agents" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="conversation">Conversation</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="agents" className="flex-1 overflow-y-auto custom-scrollbar mt-4">
              {isAnalyzing ? (
                <AgentLoadingList />
              ) : (
                <div className="space-y-4">
                  <AgentCard
                    name="Researcher"
                    description="Analyzes papers and extracts key findings"
                    status="complete"
                    icon="researcher"
                  />
                  <AgentCard
                    name="Critic"
                    description="Questions assumptions and identifies gaps"
                    status="complete"
                    icon="critic"
                  />
                  <AgentCard
                    name="Synthesizer"
                    description="Generates collective insights"
                    status="complete"
                    icon="synthesizer"
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="conversation" className="flex-1 overflow-y-auto custom-scrollbar mt-4">
              <AgentConversation messages={mockMessages} />
            </TabsContent>

            <TabsContent value="insights" className="flex-1 overflow-y-auto custom-scrollbar mt-4">
              <div className="space-y-4 p-4 rounded-lg border border-border bg-card/50">
                <h3 className="text-xl font-semibold">Collective Insights: AI for Energy Systems</h3>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-agent-researcher mb-2">Key Findings</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      AI-driven optimization in renewable energy storage shows consistent efficiency gains across
                      multiple studies (20-30% improvement). The most significant impact comes from predictive
                      load balancing, battery lifecycle optimization, and grid integration algorithms.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-agent-critic mb-2">Research Gaps</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      ⚠️ Critical limitation: Only 2 of 10 papers have data beyond 24 months. Long-term degradation
                      effects unclear. Economic models often exclude implementation costs ($50K-500K).
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-agent-synthesizer mb-2">Emerging Patterns</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Most studies use reinforcement learning with simulation environments</li>
                      <li>• Results hold from residential (5kW) to utility scale (50MW)</li>
                      <li>• Benefits appear within 6-12 months of deployment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col mt-4">
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-4">
                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    Ask questions about the analysis, request clarifications, or explore specific aspects of the research...
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask about the research findings..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Paper Upload Modal */}
      <PaperUploadModal open={uploadOpen} onOpenChange={setUploadOpen} />

      {/* Paper Detail Modal */}
      <PaperDetailModal 
        open={paperDetailOpen} 
        onOpenChange={setPaperDetailOpen}
        paper={selectedPaper}
        onStartAnalysis={handleStartAnalysis}
      />
    </div>
  );
};

export default Index;
