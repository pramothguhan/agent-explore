import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

interface PaperListProps {
  papers: Paper[];
}

export const PaperList = ({ papers }: PaperListProps) => {
  if (papers.length === 0) {
    return null;
  }

  const displayPapers = papers.slice(0, 5);
  const hasMore = papers.length > 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Found Papers ({papers.length})</CardTitle>
        <CardDescription>
          {hasMore ? `Showing 5 of ${papers.length} papers. All will be processed.` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {displayPapers.map((paper, index) => (
            <AccordionItem key={paper.id || index} value={`paper-${index}`}>
              <AccordionTrigger className="text-left">
                <div className="flex items-start gap-2 pr-4">
                  <span className="text-muted-foreground min-w-[2rem]">{index + 1}.</span>
                  <span className="font-medium">{paper.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pl-10">
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Authors:</strong> {paper.authors.slice(0, 3).join(", ")}
                    {paper.authors.length > 3 && "..."}
                  </p>
                </div>
                
                {paper.published && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Published:</strong> {paper.published}
                  </p>
                )}
                
                {paper.primary_category && (
                  <div>
                    <Badge variant="secondary">{paper.primary_category}</Badge>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Abstract:</strong>
                  </p>
                  <p className="text-sm mt-1">
                    {paper.abstract.slice(0, 300)}...
                  </p>
                </div>
                
                {paper.pdf_url && (
                  <a
                    href={paper.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on arXiv
                  </a>
                )}
                
                {paper.pdf_path && (
                  <div className="flex items-center gap-2 text-sm text-status-complete">
                    <FileText className="h-4 w-4" />
                    PDF Downloaded
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
