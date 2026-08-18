import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Check, 
  Copy, 
  Download, 
  Code2, 
  HelpCircle, 
  BookOpen, 
  Layers, 
  Terminal, 
  ArrowRight,
  Loader2,
  AlertCircle,
  FolderGit2
} from 'lucide-react';

export default function OnboardingBrief({ 
  briefData, 
  loading, 
  onGenerateBrief, 
  onAskQuestion,
  repoUrl 
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('doc'); // 'doc' | 'stack' | 'questions'

  const briefText = briefData?.onboarding_brief || '';
  const analysis = briefData?.analysis || null;
  const questions = briefData?.suggested_questions || [];

  const handleCopy = () => {
    if (!briefText) return;
    navigator.clipboard.writeText(briefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!briefText) return;
    const blob = new Blob([briefText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ONBOARDING-${briefData?.repo || 'REPO'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col min-h-[600px] transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">Repository Onboarding Brief</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono">
                AI Auto-Generated
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Instant developer documentation, tech stack analysis & entry points
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!briefData && !loading && (
            <button
              onClick={onGenerateBrief}
              className="bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-teal-500/10 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              Generate Brief
            </button>
          )}

          {briefData && (
            <>
              <button
                onClick={handleCopy}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Copy brief as Markdown"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Download ONBOARDING.md"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Download .md</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Internal Section Navigation Tabs */}
      {briefData && (
        <div className="flex items-center gap-2 mt-4 border-b border-slate-800/60 pb-2">
          <button
            onClick={() => setActiveTab('doc')}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'doc'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Onboarding Document</span>
          </button>

          <button
            onClick={() => setActiveTab('stack')}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'stack'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tech Stack & Entry Points</span>
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Suggested Questions ({questions.length})</span>
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <Sparkles className="w-6 h-6 text-teal-400 absolute animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-slate-200">Analyzing Codebase & Synthesizing Brief...</p>
            <p className="text-xs text-slate-500">Inspecting AST chunks, entry points, and dependency trees</p>
          </div>
        </div>
      )}

      {/* Empty State (No Brief Generated Yet) */}
      {!briefData && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 my-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-indigo-400 shadow-inner">
            <FolderGit2 className="w-8 h-8" />
          </div>
          <div className="max-w-md space-y-2">
            <h3 className="text-base font-bold text-slate-200">No Onboarding Brief Generated</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ingest a GitHub repository above and click <span className="text-teal-400 font-semibold">"Generate Brief"</span> to synthesize an architectural breakdown, language analysis, and key entry points.
            </p>
          </div>
          <button
            onClick={onGenerateBrief}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Auto-Generate Onboarding Brief
          </button>
        </div>
      )}

      {/* Brief Content Display */}
      {briefData && !loading && (
        <div className="flex-1 mt-4 space-y-6 overflow-y-auto max-h-[650px] pr-2">
          {/* TAB 1: Complete Onboarding Document */}
          {activeTab === 'doc' && (
            <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4 font-mono">
              <div className="prose prose-invert max-w-none space-y-3">
                {briefText.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={idx} className="text-lg font-bold text-teal-400 border-b border-slate-800 pb-2">{paragraph.replace('# ', '')}</h1>;
                  }
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={idx} className="text-sm font-bold text-indigo-300 mt-4 mb-2 flex items-center gap-2">{paragraph.replace('## ', '')}</h2>;
                  }
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={idx} className="text-xs font-bold text-slate-200 mt-3">{paragraph.replace('### ', '')}</h3>;
                  }
                  if (paragraph.startsWith('```')) {
                    const code = paragraph.replace(/```[a-z]*/, '').replace(/```$/, '').strip ? paragraph.replace(/```[a-z]*/, '').replace(/```$/, '').strip() : paragraph;
                    return (
                      <pre key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-800 overflow-x-auto text-teal-300 text-xs">
                        <code>{code}</code>
                      </pre>
                    );
                  }
                  return <p key={idx} className="text-slate-300 text-xs leading-normal">{paragraph}</p>;
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Tech Stack & Entry Points Breakdown */}
          {activeTab === 'stack' && analysis && (
            <div className="space-y-5">
              {/* Language Distribution Progress Bars */}
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-teal-400" />
                  Language & File Distribution
                </h3>
                <div className="space-y-2">
                  {analysis.languages.map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300 font-semibold">{item.language}</span>
                        <span className="text-slate-400">{item.count} files ({item.percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(item.percentage, 5)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Identified Entry Points & Config Files */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    Entry Points ({analysis.entry_points.length})
                  </h4>
                  {analysis.entry_points.length > 0 ? (
                    <ul className="space-y-1 text-xs font-mono text-slate-300">
                      {analysis.entry_points.map((ep, i) => (
                        <li key={i} className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 text-teal-300">
                          📄 {ep}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No explicit entry point file detected</p>
                  )}
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Configurations ({analysis.config_files.length})
                  </h4>
                  {analysis.config_files.length > 0 ? (
                    <ul className="space-y-1 text-xs font-mono text-slate-300">
                      {analysis.config_files.map((cf, i) => (
                        <li key={i} className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 text-indigo-300">
                          ⚙️ {cf}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Standard build configs</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Suggested Onboarding Questions */}
          {activeTab === 'questions' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Click any question below to immediately send it to the <span className="text-teal-400 font-semibold">CodeCompass RAG Chat</span> engine:
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {questions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAskQuestion && onAskQuestion(q)}
                    className="group bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/50 p-3.5 rounded-xl text-left text-xs text-slate-200 transition-all flex items-center justify-between cursor-pointer shadow-sm"
                  >
                    <span className="font-medium group-hover:text-indigo-200 transition-colors flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-teal-400 shrink-0" />
                      {q}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
