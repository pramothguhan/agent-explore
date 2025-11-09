import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResearchQueryProps {
  onSearch: (query: string, maxPapers: number) => Promise<void>;
  isSearching: boolean;
  hasSession: boolean;
}

export const ResearchQuery = ({ onSearch, isSearching, hasSession }: ResearchQueryProps) => {
  const [query, setQuery] = useState("");
  const [maxPapers, setMaxPapers] = useState(10);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Query required",
        description: "Please enter a research question or topic",
        variant: "destructive",
      });
      return;
    }

    await onSearch(query, maxPapers);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start New Research</CardTitle>
        <CardDescription>
          {hasSession 
            ? "Continue with current session or start a new search"
            : "Create a new research session by searching for papers"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="query">Research Question / Topic</Label>
          <Input
            id="query"
            placeholder="e.g., Quantum computing for drug discovery"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isSearching && handleSearch()}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-papers">Number of Papers</Label>
          <Input
            id="max-papers"
            type="number"
            min={2}
            max={20}
            value={maxPapers}
            onChange={(e) => setMaxPapers(parseInt(e.target.value) || 10)}
          />
        </div>

        <Button 
          onClick={handleSearch} 
          disabled={isSearching}
          className="w-full"
        >
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching arXiv...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search Papers
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
