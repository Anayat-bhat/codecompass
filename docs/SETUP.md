# Local Setup Guide: CodeCompass

This guide explains how to get CodeCompass running on your local machine.

## Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Git

## 1. Clone the Repository
```bash
git clone https://github.com/Anayat-bhat/codecompass.git
cd codecompass
```

## 2. Backend Setup (FastAPI)
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install fastapi uvicorn python-dotenv openai pinecone-client requests
   ```
4. Configure environment variables (see `ENVIRONMENT.md`).
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be running at `http://localhost:8000`.

## 3. Frontend Setup (React/Vite)
1. Navigate to the frontend folder (in a new terminal):
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:5173`.
