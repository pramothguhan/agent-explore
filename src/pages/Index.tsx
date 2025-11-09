import { Navigation } from "@/components/Navigation";
import { SessionManager } from "@/components/SessionManager";
import { ResearchQuery } from "@/components/ResearchQuery";
import { PaperList } from "@/components/PaperList";
import { PDFProcessor } from "@/components/PDFProcessor";
import { VectorStoreQuery } from "@/components/VectorStoreQuery";
import { AgentCard } from "@/components/AgentCard";
import { AgentLoadingList } from "@/components/AgentSkeleton";
import { ResultsView } from "@/components/ResultsView";
import { PageLoadingSkeleton } from "@/components/PageLoadingSkeleton";
import { PaperUploadModal } from "@/components/PaperUploadModal";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Rocket } from "lucide-react";

// Types
interface Paper {
  id?: string;
  arxiv_id?: string;
  title: string;
  authors: string[];
  year?: string;
  published?: string;
  primary_category?: string;
  abstract: string;
  pdf_url?: string;
  pdf_path?: string;
}

interface Session {
  session_id: string;
  topic: string;
  papers_count: number;
  chunks_count: number;
  created_at: string;
}

interface WorkflowResults {
  query: string;
  conversation_history: Array<{
    agent: string;
    role: string;
    message: string;
    responding_to?: string;
  }>;
  insight_report?: string;
  synthesis: string;
  follow_up_questions: string[];
}

const Index = () => {
  const { toast } = useToast();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  // Session state
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  
  // Papers state
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // PDF processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [papersWithPdfs, setPapersWithPdfs] = useState(0);
  const [vectorStoreReady, setVectorStoreReady] = useState(false);
  const [vectorStoreChunks, setVectorStoreChunks] = useState(0);
  
  // Agent analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [workflowResults, setWorkflowResults] = useState<WorkflowResults | null>(null);
  const [model, setModel] = useState("gpt-4-turbo-preview");
  const [temperature, setTemperature] = useState([0.7]);
  const [workflowType, setWorkflowType] = useState("standard");

  // Simulate initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
      // TODO: Load sessions from API
      // fetchSessions();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handler functions
  const handleSelectSession = (sessionId: string | null) => {
    if (sessionId === null) {
      setCurrentSession(null);
      setPapers([]);
      setWorkflowResults(null);
    } else {
      // TODO: Load session from API
      const session = sessions.find(s => s.session_id === sessionId);
      if (session) {
        setCurrentSession(session);
        // TODO: Load papers for this session
      }
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    // TODO: Call API to delete session
    setSessions(sessions.filter(s => s.session_id !== sessionId));
    if (currentSession?.session_id === sessionId) {
      setCurrentSession(null);
      setPapers([]);
    }
    toast({
      title: "Session deleted",
      description: "The research session has been removed",
    });
  };

  const handleSearch = async (query: string, maxPapers: number) => {
    setIsSearching(true);
    try {
      // TODO: Call FastAPI endpoint /api/papers/fetch-arxiv
      // const response = await fetch(`${API_BASE_URL}/api/papers/fetch-arxiv`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ query, max_results: maxPapers })
      // });
      // const data = await response.json();
      
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockResults: Paper[] = Array(maxPapers).fill(null).map((_, i) => ({
        id: `paper-${i}`,
        arxiv_id: `2024.${String(i).padStart(5, '0')}`,
        title: `Research Paper ${i + 1}: ${query}`,
        authors: ['Author A', 'Author B'],
        published: '2024-01-15',
        primary_category: 'cs.AI',
        abstract: `This paper explores ${query} using advanced methods...`,
        pdf_url: `https://arxiv.org/pdf/2024.${String(i).padStart(5, '0')}`,
      }));
      
      setPapers(mockResults);
      
      // Create session if needed
      if (!currentSession) {
        const newSession: Session = {
          session_id: `session-${Date.now()}`,
          topic: query,
          papers_count: mockResults.length,
          chunks_count: 0,
          created_at: new Date().toISOString(),
        };
        setSessions([...sessions, newSession]);
        setCurrentSession(newSession);
      }
      
      toast({
        title: "Papers found",
        description: `Found ${mockResults.length} papers`,
      });
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Failed to search papers",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownloadPDFs = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // TODO: Call FastAPI endpoint to download PDFs
      for (let i = 0; i < papers.length; i++) {
        setStatusText(`Downloading ${i + 1}/${papers.length}: ${papers[i].title.slice(0, 40)}...`);
        setProgress(((i + 1) / papers.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Update papers with pdf_path
      setPapers(papers.map(p => ({ ...p, pdf_path: `/path/to/${p.arxiv_id}.pdf` })));
      setPapersWithPdfs(papers.length);
      
      toast({
        title: "PDFs downloaded",
        description: `Downloaded ${papers.length} PDFs`,
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setStatusText("");
    }
  };

  const handleBuildVectorStore = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // TODO: Call FastAPI endpoint to build vector store
      setStatusText("Processing PDFs and building embeddings...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      setProgress(100);
      
      setVectorStoreReady(true);
      setVectorStoreChunks(papers.length * 50); // Mock: ~50 chunks per paper
      
      toast({
        title: "Vector store ready",
        description: `Created ${papers.length * 50} searchable chunks`,
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setStatusText("");
    }
  };

  const handleVectorQuery = async (query: string, k: number) => {
    // TODO: Call FastAPI endpoint /api/vector-store/query
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Array(k).fill(null).map((_, i) => ({
      text: `Relevant passage ${i + 1} about "${query}"...`,
      score: 0.9 - (i * 0.1),
      meta: {
        paper_title: papers[i % papers.length]?.title || 'Unknown',
        position: Math.random(),
        word_count: 150 + Math.floor(Math.random() * 100),
        has_equations: Math.random() > 0.5,
        has_citations: Math.random() > 0.7,
      }
    }));
  };

  const handleStartAnalysis = async () => {
    if (!currentSession || papers.length === 0) {
      toast({
        title: "Cannot start analysis",
        description: "Please search for papers first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // TODO: Call FastAPI endpoint /api/analysis/category
      // const response = await fetch(`${API_BASE_URL}/api/analysis/category`, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     query: currentSession.topic,
      //     model,
      //     temperature: temperature[0],
      //     workflow_type: workflowType
      //   })
      // });
      
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const mockResults: WorkflowResults = {
        query: currentSession.topic,
        conversation_history: [
          {
            agent: "Researcher",
            role: "Research Agent",
            message: "Analyzed papers and found key patterns in the data...",
          },
          {
            agent: "Critic",
            role: "Critical Analyst",
            message: "Identified several gaps in the methodology...",
            responding_to: "Researcher",
          },
          {
            agent: "Synthesizer",
            role: "Synthesis Agent",
            message: "Generating comprehensive insights from all findings...",
          }
        ],
        insight_report: "The research reveals significant advances in the field with consistent improvements across multiple metrics.",
        synthesis: "This analysis demonstrates clear patterns and actionable insights for future research directions.",
        follow_up_questions: [
          "What are the long-term implications?",
          "How does this scale to larger datasets?",
          "What are the computational requirements?"
        ]
      };
      
      setWorkflowResults(mockResults);
      toast({
        title: "Analysis complete",
        description: "Agent collaboration finished successfully",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isPageLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onAddPapers={() => setUploadOpen(true)} />

      <main className="container px-6 py-8">
        {/* Hero Section */}
        <section className="space-y-6 animate-fade-in mb-12">
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-foreground leading-tight">
            Research Agent System
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            AI agents with advanced document processing. Search papers, build vector stores, and leverage multi-agent collaboration for deep research insights.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <SessionManager
              sessions={sessions}
              currentSession={currentSession}
              onSelectSession={handleSelectSession}
              onDeleteSession={handleDeleteSession}
            />

            {/* Configuration */}
            <div className="space-y-4 p-6 rounded-lg border border-border bg-card">
              <h3 className="font-semibold">Configuration</h3>
              
              <div className="space-y-2">
                <Label htmlFor="model">LLM Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger id="model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4-turbo-preview">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Temperature: {temperature[0].toFixed(1)}</Label>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  min={0}
                  max={1}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workflow">Workflow Type</Label>
                <Select value={workflowType} onValueChange={setWorkflowType}>
                  <SelectTrigger id="workflow">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="interactive">Interactive (with refinement)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="research" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="research">New Research</TabsTrigger>
                <TabsTrigger value="processing">PDF Processing</TabsTrigger>
                <TabsTrigger value="analysis">Agent Analysis</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>

              <TabsContent value="research" className="space-y-6 mt-6">
                <ResearchQuery
                  onSearch={handleSearch}
                  isSearching={isSearching}
                  hasSession={currentSession !== null}
                />
                <PaperList papers={papers} />
              </TabsContent>

              <TabsContent value="processing" className="space-y-6 mt-6">
                {!currentSession ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Create a session in the "New Research" tab first
                  </div>
                ) : (
                  <>
                    <PDFProcessor
                      papersCount={papers.length}
                      papersWithPdfs={papersWithPdfs}
                      vectorStoreReady={vectorStoreReady}
                      vectorStoreChunks={vectorStoreChunks}
                      onDownloadPDFs={handleDownloadPDFs}
                      onBuildVectorStore={handleBuildVectorStore}
                      isProcessing={isProcessing}
                      progress={progress}
                      statusText={statusText}
                    />
                    <VectorStoreQuery
                      vectorStoreReady={vectorStoreReady}
                      onQuery={handleVectorQuery}
                    />
                  </>
                )}
              </TabsContent>

              <TabsContent value="analysis" className="space-y-6 mt-6">
                {!currentSession || papers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Search for papers first to run analysis
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 rounded-lg border border-border bg-card">
                      <div>
                        <h3 className="font-semibold mb-1">Ready to Analyze</h3>
                        <p className="text-sm text-muted-foreground">
                          {papers.length} papers loaded • {model} • Temperature: {temperature[0].toFixed(1)}
                        </p>
                      </div>
                      <Button onClick={handleStartAnalysis} disabled={isAnalyzing} size="lg">
                        {isAnalyzing ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Rocket className="mr-2 h-5 w-5" />
                            Start Analysis
                          </>
                        )}
                      </Button>
                    </div>

                    {isAnalyzing && <AgentLoadingList />}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="results" className="mt-6">
                <ResultsView
                  results={workflowResults}
                  sessionTopic={currentSession?.topic || ""}
                  sessionId={currentSession?.session_id || ""}
                  onNewAnalysis={() => setWorkflowResults(null)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Paper Upload Modal */}
      <PaperUploadModal open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
};

export default Index;
