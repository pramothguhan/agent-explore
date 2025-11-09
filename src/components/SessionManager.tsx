import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, FolderOpen, Plus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Session {
  session_id: string;
  topic: string;
  papers_count: number;
  chunks_count: number;
  created_at: string;
}

interface SessionManagerProps {
  sessions: Session[];
  currentSession: Session | null;
  onSelectSession: (sessionId: string | null) => void;
  onDeleteSession: (sessionId: string) => void;
}

export const SessionManager = ({ 
  sessions, 
  currentSession, 
  onSelectSession,
  onDeleteSession 
}: SessionManagerProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSessionChange = (value: string) => {
    if (value === "new") {
      onSelectSession(null);
    } else {
      onSelectSession(value);
    }
  };

  const handleDelete = () => {
    if (currentSession) {
      onDeleteSession(currentSession.session_id);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Research Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select 
          value={currentSession?.session_id || "new"} 
          onValueChange={handleSessionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a session" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Session...
              </div>
            </SelectItem>
            {sessions.map((session) => (
              <SelectItem key={session.session_id} value={session.session_id}>
                {session.topic.slice(0, 40)}...
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {currentSession && (
          <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Topic</p>
              <p className="text-sm">{currentSession.topic}</p>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">
                {currentSession.papers_count} papers
              </Badge>
              <Badge variant="secondary">
                {currentSession.chunks_count} chunks
              </Badge>
            </div>

            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Session
            </Button>
          </div>
        )}

        {!currentSession && sessions.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Select an existing session or create a new one
          </p>
        )}
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the session "{currentSession?.topic}" and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
