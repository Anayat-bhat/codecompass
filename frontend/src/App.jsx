import React, { useState, useEffect } from 'react';
import { Compass, Database, Layers, CheckCircle2, AlertCircle, Loader2, Cpu, ExternalLink, GitBranch } from 'lucide-react';
import FileTree from './components/FileTree';
import Chat from './components/Chat';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

function App() {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [repoUrl, setRepoUrl] = useState('https://github.com/fastapi/fastapi');
  const [ingesting, setIngesting] = useState(false);
  const [ingestResult, setIngestResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Check backend health on load
  useEffect(() => {
    fetch(`${BACKEND_URL}/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      })
      .catch(() => setBackendStatus('error'));
  }, []);

  const handleIngest = async (e) => {
    if (e) e.preventDefault();
    if (!repoUrl.trim() || ingesting) return;

    setIngesting(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: repoUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to ingest repository');
      }

      setIngestResult(data);
    } catch (err) {
      setErrorMessage(err.message || 'Error connecting to ingestion endpoint.');
    } finally {
      setIngesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 p-0.5 shadow-lg shadow-teal-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-teal-400">
                <Compass className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">CodeCompass</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-teal-400 font-mono">
                  v1.0 MVP
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Code-Aware RAG Intelligence & Interactive Repository Onboarding
              </p>
            </div>
          </div>

          {/* Backend Health Badge */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-mono border transition-all ${
                backendStatus === 'connected'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : backendStatus === 'checking'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus === 'connected'
                    ? 'bg-emerald-400 animate-ping'
                    : backendStatus === 'checking'
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
              />
              {backendStatus === 'connected'
                ? 'Backend Connected'
                : backendStatus === 'checking'
                ? 'Checking API...'
                : 'Backend Disconnected'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Repo Ingestion Bar */}
        <section className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl backdrop-blur-md">
          <form onSubmit={handleIngest} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <GithubIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Enter public GitHub repo URL (e.g., https://github.com/fastapi/fastapi)"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500/50 transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={ingesting || !repoUrl.trim()}
              className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-slate-950 font-extrabold text-sm px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 shadow-lg shadow-teal-500/10 cursor-pointer"
            >
              {ingesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                  Ingesting Repository...
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4" />
                  Ingest & Index
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              {errorMessage}
            </div>
          )}

          {/* Success Ingest Stats Banner */}
          {ingestResult && (
            <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Repository</span>
                <p className="text-xs font-bold text-teal-400 font-mono truncate">
                  {ingestResult.owner}/{ingestResult.repo}
                </p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Files Parsed</span>
                <p className="text-xs font-bold text-slate-200 font-mono">
                  {ingestResult.file_count} files
                </p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">AST Chunks</span>
                <p className="text-xs font-bold text-indigo-400 font-mono">
                  {ingestResult.chunk_count} chunks
                </p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Vector Store</span>
                <p className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ChromaDB Ready
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Dashboard Grid: File Tree + RAG Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: File Tree */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <FileTree files={ingestResult?.files || []} />
          </div>

          {/* Right Column: RAG Intelligence Chat */}
          <div className="lg:col-span-8">
            <Chat
              repoIngested={!!ingestResult}
              repoInfo={ingestResult ? { owner: ingestResult.owner, repo: ingestResult.repo } : null}
              backendUrl={BACKEND_URL}
            />
          </div>
        </div>
      </main>

      {/* Mandatory Challenge Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/60 py-4 px-4 sm:px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-slate-300">
            Built with Claude as part of the AB Talks 60-Day Claude AI Challenge.
          </p>
          <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
            <span>CodeCompass v1.0 MVP</span>
            <span>•</span>
            <span>ChromaDB Vector Store</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
