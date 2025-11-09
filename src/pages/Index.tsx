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
import { sessionApi, paperApi, vectorStoreApi, analysisApi } from "@/lib/api";
import type { Paper, Session, WorkflowResults } from "@/lib/api";

// Types imported from api.ts

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

  // Load sessions on mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const sessionsList = await sessionApi.list();
        setSessions(sessionsList);
      } catch (error) {
        console.error('Failed to load sessions:', error);
        toast({
          title: "Warning",
          description: "Could not connect to backend. Using demo mode.",
          variant: "destructive",
        });
      } finally {
        setIsPageLoading(false);
      }
    };

    loadSessions();
  }, [toast]);

  // Handler functions
  const handleSelectSession = async (sessionId: string | null) => {
    if (sessionId === null) {
      setCurrentSession(null);
      setPapers([]);
      setWorkflowResults(null);
      setVectorStoreReady(false);
      setVectorStoreChunks(0);
      setPapersWithPdfs(0);
    } else {
      try {
        // Load session details
        const session = await sessionApi.get(sessionId);
        setCurrentSession(session);

        // Load papers for this session
        const sessionPapers = await sessionApi.getPapers(sessionId);
        setPapers(sessionPapers);
        setPapersWithPdfs(sessionPapers.filter(p => p.pdf_path).length);

        // Check vector store status
        const stats = await vectorStoreApi.getStats(sessionId);
        setVectorStoreReady(stats.exists);
        setVectorStoreChunks(stats.chunks_count);

        // Load previous analysis results if available
        const results = await analysisApi.getResults(sessionId);
        if (results) {
          setWorkflowResults(results);
        }

        toast({
          title: "Session loaded",
          description: `Loaded ${session.topic}`,
        });
      } catch (error) {
        console.error('Failed to load session:', error);
        toast({
          title: "Error",
          description: "Failed to load session details",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await sessionApi.delete(sessionId);
      setSessions(sessions.filter(s => s.session_id !== sessionId));
      
      if (currentSession?.session_id === sessionId) {
        setCurrentSession(null);
        setPapers([]);
        setWorkflowResults(null);
      }
      
      toast({
        title: "Session deleted",
        description: "The research session has been removed",
      });
    } catch (error) {
      console.error('Failed to delete session:', error);
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async (query: string, maxPapers: number) => {
    setIsSearching(true);
    try {
      // Create session if needed
      let session = currentSession;
      if (!session) {
        session = await sessionApi.create(query);
        setSessions([...sessions, session]);
        setCurrentSession(session);
      }

      // Fetch papers from arXiv
      const results = await paperApi.fetchFromArxiv(query, maxPapers, session.session_id);
      setPapers(results);
      
      // Update session papers count
      if (session) {
        const updatedSession = { ...session, papers_count: results.length };
        setCurrentSession(updatedSession);
        setSessions(sessions.map(s => s.session_id === session.session_id ? updatedSession : s));
      }
      
      toast({
        title: "Papers found",
        description: `Found ${results.length} papers from arXiv`,
      });
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Failed to search papers",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownloadPDFs = async () => {
    if (!currentSession) return;

    setIsProcessing(true);
    setProgress(0);
    
    try {
      const result = await paperApi.downloadPDFs(
        currentSession.session_id,
        (current, total, status) => {
          setStatusText(status);
          setProgress((current / total) * 100);
        }
      );
      
      // Reload papers to get updated pdf_path
      const updatedPapers = await sessionApi.getPapers(currentSession.session_id);
      setPapers(updatedPapers);
      setPapersWithPdfs(updatedPapers.filter(p => p.pdf_path).length);
      
      toast({
        title: "PDFs downloaded",
        description: `Downloaded ${result.downloaded} of ${papers.length} PDFs`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download PDFs",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setStatusText("");
    }
  };

  const handleBuildVectorStore = async () => {
    if (!currentSession) return;

    setIsProcessing(true);
    setProgress(0);
    
    try {
      const result = await vectorStoreApi.build(
        currentSession.session_id,
        (current, total, status) => {
          setStatusText(status);
          setProgress((current / total) * 100);
        }
      );
      
      setVectorStoreReady(true);
      setVectorStoreChunks(result.chunks_count);
      
      // Update session
      const updatedSession = { ...currentSession, chunks_count: result.chunks_count };
      setCurrentSession(updatedSession);
      setSessions(sessions.map(s => s.session_id === currentSession.session_id ? updatedSession : s));
      
      toast({
        title: "Vector store ready",
        description: `Created ${result.chunks_count} searchable chunks with ${result.embedding_dim}-dim embeddings`,
      });
    } catch (error) {
      console.error('Build failed:', error);
      toast({
        title: "Build failed",
        description: error instanceof Error ? error.message : "Failed to build vector store",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setStatusText("");
    }
  };

  const handleVectorQuery = async (query: string, k: number) => {
    if (!currentSession) {
      throw new Error("No active session");
    }

    try {
      return await vectorStoreApi.query(currentSession.session_id, query, k);
    } catch (error) {
      console.error('Query failed:', error);
      toast({
        title: "Query failed",
        description: error instanceof Error ? error.message : "Failed to query vector store",
        variant: "destructive",
      });
      return [];
    }
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
      const results = await analysisApi.startAnalysis({
        sessionId: currentSession.session_id,
        query: currentSession.topic,
        model,
        temperature: temperature[0],
        workflowType,
      });
      
      setWorkflowResults(results);
      toast({
        title: "Analysis complete",
        description: "Agent collaboration finished successfully",
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to complete analysis",
        variant: "destructive",
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
