# RAG-it

A Retrieval-Augmented Generation application that lets users upload PDFs content to create personal AI knowledge bases with intelligent chat capabilities. **All user data is securely stored and protected.**

## What It Does

RAG-it processes your documents, converts them into searchable vector databases, and allows you to have conversations with an AI that can reference your specific content. Each user gets their own isolated knowledge base with persistent chat history. **Data privacy and security are enforced at every step.**

## Live Application Deployments

- Frontend: ragit.netlify.app
- Backend: Deployed on Render with Docker

## Tech Stack

### Frontend
- React
- CSS
- JWT token management
- Fetch API for HTTP requests

### Backend
- Flask web framework
- PostgreSQL database
- JWT authentication
- LangChain for RAG orchestration
- Azure OpenAI GPT-4o for responses
- Azure OpenAI text-embedding-3-small for embeddings
- ChromaDB for vector storage
- PyMuPDF for PDF processing
<!-- - BeautifulSoup4 for web scraping -->
- Werkzeug for security utilities

## How It Works

1. User registers/logs in through JWT authentication
2. Upload PDFs for content ingestion
3. Documents are processed, chunked, and converted to embeddings
4. Embeddings stored in **user-specific, secured ChromaDB vectorstore**
5. Chat queries trigger similarity search to find relevant content
6. AI generates responses using retrieved context and chat history

## Key Features

- User-specific vector databases for privacy and security
- Persistent chat history across sessions
- PDF upload content ingestion
- Context-aware conversations
- Mobile-responsive interface
- Secure authentication with password hashing and token-based access
- All user data encrypted and isolated for complete security

## Architecture

The application uses a standard RAG pipeline: document ingestion → text chunking → embedding generation → vector storage → retrieval → AI response generation. Each user maintains **separate, secured vectorstores and chat histories** to ensure complete data isolation and protection.
