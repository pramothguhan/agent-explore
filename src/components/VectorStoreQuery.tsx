import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SearchResult {
  text: string;
  score: number;
  meta: {
    paper_title: string;
    position: number;
    word_count: number;
    has_equations?: boolean;
    has_citations?: boolean;
  };
}

interface VectorStoreQueryProps {
  vectorStoreReady: boolean;
  onQuery: (query: string, k: number) => Promise<SearchResult[]>;
}

export const VectorStoreQuery = ({ vectorStoreReady, onQuery }: VectorStoreQueryProps) => {
  const [query, setQuery] = useState("");
  const [numResults, setNumResults] = useState([5]);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const searchResults = await onQuery(query, numResults[0]);
      setResults(searchResults);
    } finally {
      setIsSearching(false);
    }
  };

  if (!vectorStoreReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Query Vector Store</CardTitle>
          <CardDescription>Build the vector store first to enable semantic search</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Query Vector Store</CardTitle>
        <CardDescription>Search for relevant passages across all papers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vector-query">Search Query</Label>
          <Input
            id="vector-query"
            placeholder="e.g., What are the main findings about..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isSearching && handleSearch()}
          />
        </div>

        <div className="space-y-2">
          <Label>Number of Results: {numResults[0]}</Label>
          <Slider
            value={numResults}
            onValueChange={setNumResults}
            min={1}
            max={20}
            step={1}
          />
        </div>

        <Button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="w-full"
        >
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </Button>

        {results.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="font-semibold">Results ({results.length})</h4>
            <Accordion type="single" collapsible className="w-full">
              {results.map((result, index) => (
                <AccordionItem key={index} value={`result-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-start gap-2 pr-4">
                      <span className="text-muted-foreground">#{index + 1}</span>
                      <div className="flex-1">
                        <p className="font-medium">{result.meta.paper_title}</p>
                        <p className="text-sm text-muted-foreground">Score: {result.score.toFixed(3)}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pl-10">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary">
                        Position: {(result.meta.position * 100).toFixed(1)}%
                      </Badge>
                      <Badge variant="secondary">
                        {result.meta.word_count} words
                      </Badge>
                      {result.meta.has_equations && (
                        <Badge variant="secondary">Has Equations</Badge>
                      )}
                      {result.meta.has_citations && (
                        <Badge variant="secondary">Has Citations</Badge>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">{result.text}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
