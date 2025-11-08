import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUp, Search, FolderPlus, FolderOpen, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaperUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const existingCategories = [
  "AI for Climate Modeling",
  "Battery Efficiency",
  "Smart Grid Optimization",
  "Renewable Energy Storage",
];

export const PaperUploadModal = ({ open, onOpenChange }: PaperUploadModalProps) => {
  const [step, setStep] = useState<"category-type" | "details">("category-type");
  const [categoryType, setCategoryType] = useState<"new" | "existing" | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [arxivTopic, setArxivTopic] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleCategoryTypeSelect = (type: "new" | "existing") => {
    setCategoryType(type);
    setStep("details");
  };

  const handleBack = () => {
    setStep("category-type");
    setCategoryType(null);
  };

  const resetForm = () => {
    setStep("category-type");
    setCategoryType(null);
    setArxivTopic("");
    setNewCategoryName("");
    setSelectedCategory("");
    setFile(null);
  };

  const handleArxivFetch = () => {
    if (!arxivTopic.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a research topic",
        variant: "destructive",
      });
      return;
    }
    
    const category = categoryType === "new" ? newCategoryName : selectedCategory;
    if (!category) {
      toast({
        title: "Missing information",
        description: `Please ${categoryType === "new" ? "enter a category name" : "select a category"}`,
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
        description: `Added 15 papers to ${category}`,
      });
      resetForm();
      onOpenChange(false);
    }, 2000);
  };

  const handleFileUpload = () => {
    if (!file) {
      toast({
        title: "Missing information",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }
    
    const category = categoryType === "new" ? newCategoryName : selectedCategory;
    if (!category) {
      toast({
        title: "Missing information",
        description: `Please ${categoryType === "new" ? "enter a category name" : "select a category"}`,
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
        description: `Added to ${category}`,
      });
      resetForm();
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Add Research Papers</DialogTitle>
        </DialogHeader>
        
        {step === "category-type" ? (
          <div className="space-y-4 py-6">
            <p className="text-muted-foreground text-center mb-6">
              Would you like to create a new category or add to an existing one?
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => handleCategoryTypeSelect("new")}
                className="group p-8 rounded-lg border-2 border-border hover:border-primary bg-card hover:bg-primary/5 transition-all duration-300 flex flex-col items-center gap-4"
              >
                <div className="p-4 rounded-full bg-gaming-purple/10 group-hover:bg-gaming-purple/20 transition-colors">
                  <FolderPlus className="h-10 w-10 text-gaming-purple" />
                </div>
                <div className="text-center">
                  <h3 className="font-serif font-semibold text-lg mb-2">New Category</h3>
                  <p className="text-sm text-muted-foreground">Create a new research category</p>
                </div>
              </button>
              
              <button
                onClick={() => handleCategoryTypeSelect("existing")}
                className="group p-8 rounded-lg border-2 border-border hover:border-primary bg-card hover:bg-primary/5 transition-all duration-300 flex flex-col items-center gap-4"
              >
                <div className="p-4 rounded-full bg-gaming-cyan/10 group-hover:bg-gaming-cyan/20 transition-colors">
                  <FolderOpen className="h-10 w-10 text-gaming-cyan" />
                </div>
                <div className="text-center">
                  <h3 className="font-serif font-semibold text-lg mb-2">Existing Category</h3>
                  <p className="text-sm text-muted-foreground">Add to an existing category</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <>
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-2 w-fit gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            {categoryType === "new" && (
              <div className="space-y-2 mb-4 p-4 rounded-lg bg-gaming-purple/5 border border-gaming-purple/20">
                <Label htmlFor="new-category" className="text-gaming-purple font-semibold">New Category Name</Label>
                <Input
                  id="new-category"
                  placeholder="e.g., Quantum Computing"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="border-gaming-purple/30 focus:border-gaming-purple"
                />
              </div>
            )}
            
            {categoryType === "existing" && (
              <div className="space-y-2 mb-4 p-4 rounded-lg bg-gaming-cyan/5 border border-gaming-cyan/20">
                <Label htmlFor="existing-category" className="text-gaming-cyan font-semibold">Select Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-gaming-cyan/30 focus:border-gaming-cyan">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
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
                
                <p className="text-sm text-muted-foreground">
                  We'll fetch the top 10-20 papers from arXiv matching your topic and add them to {categoryType === "new" ? "your new category" : "the selected category"}.
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
                
                <p className="text-sm text-muted-foreground">
                  Upload a research paper PDF and assign it to {categoryType === "new" ? "your new category" : "the selected category"}.
                </p>
                
                <Button onClick={handleFileUpload} className="w-full">
                  Upload Paper
                </Button>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
