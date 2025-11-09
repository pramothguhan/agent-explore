import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Download, Database, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PDFProcessorProps {
  papersCount: number;
  papersWithPdfs: number;
  vectorStoreReady: boolean;
  vectorStoreChunks: number;
  onDownloadPDFs: () => Promise<void>;
  onBuildVectorStore: () => Promise<void>;
  isProcessing: boolean;
  progress: number;
  statusText: string;
}

export const PDFProcessor = ({
  papersCount,
  papersWithPdfs,
  vectorStoreReady,
  vectorStoreChunks,
  onDownloadPDFs,
  onBuildVectorStore,
  isProcessing,
  progress,
  statusText,
}: PDFProcessorProps) => {
  return (
    <div className="space-y-6">
      {/* Vector Store Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vector Store Status</span>
            {vectorStoreReady ? (
              <Badge className="bg-status-complete">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready
              </Badge>
            ) : (
              <Badge variant="secondary">
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Built
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vectorStoreReady ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Vector store is ready with {vectorStoreChunks} chunks
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Build the vector store to enable semantic search
            </p>
          )}
        </CardContent>
      </Card>

      {/* PDF Download */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download PDFs
          </CardTitle>
          <CardDescription>
            Download research papers from arXiv
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {papersCount === 0 ? (
            <Alert>
              <AlertDescription>
                Search for papers first in the "New Research" section
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Papers ready to download</span>
                <Badge variant="secondary">{papersCount} papers</Badge>
              </div>
              
              {papersWithPdfs > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Already downloaded</span>
                  <Badge className="bg-status-complete">{papersWithPdfs} PDFs</Badge>
                </div>
              )}

              <Button
                onClick={onDownloadPDFs}
                disabled={isProcessing || papersCount === 0}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDFs
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Build Vector Store */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Build Vector Store
          </CardTitle>
          <CardDescription>
            Process PDFs and create searchable embeddings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {papersWithPdfs === 0 ? (
            <Alert>
              <AlertDescription>
                Download PDFs first to build the vector store
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Ready to process {papersWithPdfs} PDFs
                </p>
                
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>✨ Advanced text cleaning & normalization</p>
                  <p>🔪 Semantic chunking with overlap</p>
                  <p>📊 Comprehensive metadata enrichment</p>
                  <p>🧠 384-dim embedding generation</p>
                  <p>⚡ Fast FAISS indexing</p>
                </div>
              </div>

              <Button
                onClick={onBuildVectorStore}
                disabled={isProcessing || papersWithPdfs === 0}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Building...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Build Vector Store
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6 space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground text-center">{statusText}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
