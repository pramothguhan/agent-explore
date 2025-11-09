// API client for FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Types
export interface Paper {
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

export interface Session {
  session_id: string;
  topic: string;
  papers_count: number;
  chunks_count: number;
  created_at: string;
}

export interface WorkflowResults {
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

export interface VectorSearchResult {
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

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Session Management
export const sessionApi = {
  // List all sessions
  async list(): Promise<Session[]> {
    return apiRequest<Session[]>('/api/sessions');
  },

  // Get a specific session
  async get(sessionId: string): Promise<Session> {
    return apiRequest<Session>(`/api/sessions/${sessionId}`);
  },

  // Create a new session
  async create(topic: string): Promise<Session> {
    return apiRequest<Session>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ topic }),
    });
  },

  // Delete a session
  async delete(sessionId: string): Promise<void> {
    return apiRequest<void>(`/api/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },

  // Get papers for a session
  async getPapers(sessionId: string): Promise<Paper[]> {
    return apiRequest<Paper[]>(`/api/sessions/${sessionId}/papers`);
  },
};

// Paper Management
export const paperApi = {
  // Fetch papers from arXiv
  async fetchFromArxiv(query: string, maxResults: number, sessionId?: string): Promise<Paper[]> {
    return apiRequest<Paper[]>('/api/papers/fetch-arxiv', {
      method: 'POST',
      body: JSON.stringify({
        query,
        max_results: maxResults,
        session_id: sessionId,
      }),
    });
  },

  // Upload a paper
  async upload(file: File, sessionId: string): Promise<Paper> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', sessionId);

    const response = await fetch(`${API_BASE_URL}/api/papers/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Download PDFs for papers in a session
  async downloadPDFs(
    sessionId: string,
    onProgress?: (current: number, total: number, status: string) => void
  ): Promise<{ downloaded: number; failed: number }> {
    const response = await fetch(`${API_BASE_URL}/api/papers/download-pdfs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    // If server supports streaming progress, handle it
    const reader = response.body?.getReader();
    if (reader && onProgress) {
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.current && data.total) {
                onProgress(data.current, data.total, data.status || '');
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    }

    return response.json();
  },
};

// Vector Store
export const vectorStoreApi = {
  // Build vector store from papers
  async build(
    sessionId: string,
    onProgress?: (current: number, total: number, status: string) => void
  ): Promise<{ chunks_count: number; embedding_dim: number }> {
    const response = await fetch(`${API_BASE_URL}/api/vector-store/build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    });

    if (!response.ok) {
      throw new Error(`Build failed: ${response.statusText}`);
    }

    // Handle streaming progress if available
    const reader = response.body?.getReader();
    if (reader && onProgress) {
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.current && data.total) {
                onProgress(data.current, data.total, data.status || '');
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    }

    return response.json();
  },

  // Query vector store
  async query(sessionId: string, query: string, k: number = 5): Promise<VectorSearchResult[]> {
    return apiRequest<VectorSearchResult[]>('/api/vector-store/query', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        query,
        k,
      }),
    });
  },

  // Get vector store stats
  async getStats(sessionId: string): Promise<{ exists: boolean; chunks_count: number }> {
    return apiRequest(`/api/vector-store/stats/${sessionId}`);
  },
};

// Analysis
export const analysisApi = {
  // Start analysis for a category/session
  async startAnalysis(params: {
    sessionId: string;
    query: string;
    model?: string;
    temperature?: number;
    workflowType?: string;
  }): Promise<WorkflowResults> {
    return apiRequest<WorkflowResults>('/api/analysis/start', {
      method: 'POST',
      body: JSON.stringify({
        session_id: params.sessionId,
        query: params.query,
        model: params.model || 'gpt-4-turbo-preview',
        temperature: params.temperature || 0.7,
        workflow_type: params.workflowType || 'standard',
      }),
    });
  },

  // Get analysis results
  async getResults(sessionId: string): Promise<WorkflowResults | null> {
    try {
      return apiRequest<WorkflowResults>(`/api/analysis/results/${sessionId}`);
    } catch (error) {
      return null;
    }
  },

  // Stream analysis with SSE (for real-time updates)
  streamAnalysis(
    params: {
      sessionId: string;
      query: string;
      model?: string;
      temperature?: number;
      workflowType?: string;
    },
    onMessage: (data: any) => void,
    onComplete: (results: WorkflowResults) => void,
    onError: (error: Error) => void
  ): () => void {
    const eventSource = new EventSource(
      `${API_BASE_URL}/api/analysis/stream?` +
        new URLSearchParams({
          session_id: params.sessionId,
          query: params.query,
          model: params.model || 'gpt-4-turbo-preview',
          temperature: String(params.temperature || 0.7),
          workflow_type: params.workflowType || 'standard',
        })
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'complete') {
          onComplete(data.results);
          eventSource.close();
        } else {
          onMessage(data);
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      onError(new Error('Stream connection error'));
      eventSource.close();
    };

    // Return cleanup function
    return () => eventSource.close();
  },
};

// Export configured API base URL for reference
export { API_BASE_URL };
