# Local Setup & Development Guide: CodeCompass

This guide provides step-by-step instructions for running CodeCompass locally.

---

## 📋 Prerequisites

- **Python:** 3.10 or higher
- **Node.js:** v18 or higher
- **Git:** Installed on system

---

## 1. Clone Repository & Setup

```bash
git clone https://github.com/Anayat-bhat/codecompass.git
cd codecompass
```

---

## 2. Backend Setup (FastAPI)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate Python virtual environment:
   - **Windows:**
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run unit tests to verify installation:
   ```bash
   python test_chunker.py
   python test_vector_db.py
   ```

5. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   - API server running at: `http://localhost:8000`
   - Swagger Documentation: `http://localhost:8000/docs`

---

## 3. Frontend Setup (React + Vite)

1. Open a second terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   - Frontend running at: `http://localhost:5173`

---

## 🔍 Verification

Once both servers are running:
- Open `http://localhost:5173` in your browser.
- The UI should display: **Backend Status: `Connected to Backend ✅`**.
