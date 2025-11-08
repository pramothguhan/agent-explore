import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUp, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaperUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  "AI for Climate Modeling",
  "Battery Efficiency",
  "Smart Grid Optimization",
  "Renewable Energy Storage",
];

export const PaperUploadModal = ({ open, onOpenChange }: PaperUploadModalProps) => {
  const [arxivTopic, setArxivTopic] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleArxivFetch = () => {
    if (!arxivTopic || !selectedCategory) {
      toast({
        title: "Missing information",
        description: "Please enter a topic and select a category.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Fetching papers...",
      description: `Searching arXiv for papers about "${arxivTopic}"`,
    });

    // Mock: In production, call backend API
    setTimeout(() => {
      toast({
        title: "Papers added!",
        description: `Added 15 papers to ${selectedCategory}`,
      });
      onOpenChange(false);
    }, 2000);
  };

  const handleFileUpload = () => {
    if (!file || !selectedCategory) {
      toast({
        title: "Missing information",
        description: "Please select a PDF file and category.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Uploading paper...",
      description: `Processing ${file.name}`,
    });

    // Mock: In production, upload to backend
    setTimeout(() => {
      toast({
        title: "Paper uploaded!",
        description: `Added to ${selectedCategory}`,
      });
      onOpenChange(false);
      setFile(null);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Research Papers</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="arxiv" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="arxiv">arXiv Search</TabsTrigger>
            <TabsTrigger value="manual">Manual Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="arxiv" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Research Topic or Keywords</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="topic"
                  placeholder="e.g., transformer neural networks, climate modeling"
                  value={arxivTopic}
                  onChange={(e) => setArxivTopic(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-arxiv">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category-arxiv">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground">
              We'll fetch the top 10-20 papers from arXiv matching your topic and add them to the selected category.
            </p>

            <Button onClick={handleArxivFetch} className="w-full">
              Fetch Papers from arXiv
            </Button>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="file">Upload PDF</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <FileUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Label htmlFor="file" className="cursor-pointer">
                  <p className="text-sm font-medium mb-1">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground">PDF files only</p>
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-manual">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category-manual">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleFileUpload} className="w-full">
              Upload Paper
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
