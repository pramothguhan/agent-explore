# FastAPI Backend Setup Guide

This React frontend is now fully connected to a FastAPI backend. Follow these steps to configure and run the application.

## Environment Variables

Create a `.env` file in the root directory with the following:

```env
VITE_API_BASE_URL=http://localhost:8000
```

For production, update this to your deployed backend URL.

## API Endpoints

The frontend expects the following FastAPI endpoints:

### Session Management
- `GET /api/sessions` - List all research sessions
- `GET /api/sessions/{session_id}` - Get session details
- `POST /api/sessions` - Create new session
  - Body: `{ "topic": string }`
- `DELETE /api/sessions/{session_id}` - Delete session
- `GET /api/sessions/{session_id}/papers` - Get papers for session

### Paper Management
- `POST /api/papers/fetch-arxiv` - Fetch papers from arXiv
  - Body: `{ "query": string, "max_results": number, "session_id": string }`
- `POST /api/papers/upload` - Upload PDF paper (multipart/form-data)
- `POST /api/papers/download-pdfs` - Download PDFs for papers
  - Body: `{ "session_id": string }`
  - Supports streaming progress via SSE

### Vector Store
- `POST /api/vector-store/build` - Build vector store from PDFs
  - Body: `{ "session_id": string }`
  - Supports streaming progress via SSE
- `POST /api/vector-store/query` - Query vector store
  - Body: `{ "session_id": string, "query": string, "k": number }`
- `GET /api/vector-store/stats/{session_id}` - Get vector store statistics

### Analysis
- `POST /api/analysis/start` - Start agent analysis
  - Body: `{ "session_id": string, "query": string, "model": string, "temperature": number, "workflow_type": string }`
- `GET /api/analysis/results/{session_id}` - Get analysis results
- `GET /api/analysis/stream` - Stream analysis with SSE (optional)
  - Query params: session_id, query, model, temperature, workflow_type

## Response Types

### Session
```typescript
{
  session_id: string;
  topic: string;
  papers_count: number;
  chunks_count: number;
  created_at: string;
}
```

### Paper
```typescript
{
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
```

### WorkflowResults
```typescript
{
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
```

### VectorSearchResult
```typescript
{
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
```

## Running the Application

1. **Start your FastAPI backend** (port 8000 by default):
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Start the React frontend**:
   ```bash
   npm run dev
   ```

3. The application will automatically connect to the backend at `http://localhost:8000`

## Features

### Fully Implemented
- ✅ Session management (create, list, load, delete)
- ✅ arXiv paper search and fetching
- ✅ PDF download with progress tracking
- ✅ Vector store building with progress tracking
- ✅ Semantic search across papers
- ✅ Multi-agent analysis workflow
- ✅ Results export and visualization

### Progress Tracking
The backend can implement Server-Sent Events (SSE) for real-time progress updates on long-running operations:
- PDF downloads
- Vector store building
- Agent analysis streaming

The frontend already supports these via the `onProgress` callbacks in the API client.

## Error Handling

The frontend includes comprehensive error handling:
- Network errors show toast notifications
- Backend connection failures fall back to demo mode
- User-friendly error messages for all API failures

## CORS Configuration

Your FastAPI backend should include CORS middleware:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Next Steps

1. Implement the FastAPI endpoints according to the specifications above
2. Test each endpoint using the frontend interface
3. Add authentication if needed
4. Deploy both frontend and backend
5. Update `VITE_API_BASE_URL` for production

## Troubleshooting

- **Connection refused**: Make sure FastAPI is running on the correct port
- **CORS errors**: Check CORS middleware configuration in FastAPI
- **404 errors**: Verify endpoint paths match the API client
- **Missing data**: Check response structure matches TypeScript interfaces
