import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileCode, Sparkles, AlertCircle, Loader2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export default function Chat({ repoIngested, repoInfo, backendUrl = 'http://localhost:8000' }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: repoIngested
        ? `Repository **${repoInfo?.owner || ''}/${repoInfo?.repo || 'codebase'}** is indexed and ready! Ask me anything about the structure, functions, or logic in this repository.`
        : 'Welcome to **CodeCompass** 🧭! Paste a GitHub repository URL above to get started, or ask general questions about code navigation.',
      sources: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const textToSubmit = queryText || inputQuery;
    if (!textToSubmit.trim() || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSubmit,
      sources: []
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSubmit, top_k: 5 })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to process request' }));
        throw new Error(errorData.detail || 'Server error');
      }

      const data = await response.json();

      const aiMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'No answer generated.',
        sources: data.sources || []
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ **Error:** ${err.message || 'Could not communicate with CodeCompass backend server.'}`,
          sources: [],
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSourceExpand = (msgId, srcIdx) => {
    const key = `${msgId}-${srcIdx}`;
    setExpandedSources((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    'Explain the high-level architecture of this codebase.',
    'Where are the main API endpoints or routes defined?',
    'What external dependencies or libraries does this repo use?'
  ];

  return (
    <div className="flex flex-col h-[600px] bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              CodeCompass Intelligence Chat
              <span className="text-[10px] font-normal px-2 py-0.5 bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">
                RAG Active
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {repoIngested ? `Ingested: ${repoInfo?.owner}/${repoInfo?.repo}` : 'No repository active'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : msg.isError
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div className={`max-w-[82%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                      : msg.isError
                      ? 'bg-rose-950/40 text-rose-200 border border-rose-800/50 rounded-tl-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Sources & Citations Section */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2.5 w-full bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-teal-400">
                        <FileCode className="w-3.5 h-3.5" />
                        Retrieved Code Citations ({msg.sources.length})
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {msg.sources.map((src, idx) => {
                        const expandKey = `${msg.id}-${idx}`;
                        const isExpanded = expandedSources[expandKey];
                        return (
                          <div
                            key={idx}
                            className="bg-slate-900/90 rounded border border-slate-800 overflow-hidden text-xs"
                          >
                            <div
                              onClick={() => toggleSourceExpand(msg.id, idx)}
                              className="flex items-center justify-between px-2.5 py-1.5 cursor-pointer hover:bg-slate-850 transition-colors"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="font-mono text-teal-300 font-medium text-[11px] truncate">
                                  📄 {src.file_path}
                                </span>
                                <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                                  Chunk #{src.chunk_index}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-400">
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="p-2 bg-slate-950 border-t border-slate-800 relative">
                                <button
                                  onClick={() => copyToClipboard(src.snippet, expandKey)}
                                  className="absolute right-2 top-2 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded flex items-center gap-1"
                                >
                                  {copiedId === expandKey ? (
                                    <Check className="w-3 h-3 text-teal-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                  {copiedId === expandKey ? 'Copied' : 'Copy'}
                                </button>
                                <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
                                  {src.snippet}
                                </pre>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator Bubble */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-teal-300">
              <Loader2 className="w-4 h-4 animate-spin" />
              Performing RAG vector retrieval & analyzing code context...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar (visible when input is empty & repo ingested) */}
      {repoIngested && messages.length <= 2 && !loading && (
        <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800 flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs bg-slate-800/80 hover:bg-slate-700/80 text-teal-300 hover:text-teal-200 px-2.5 py-1 rounded-full border border-slate-700/50 transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-teal-400" />
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder={
            repoIngested
              ? 'Ask a question about this repository (e.g. Where is routing handled?).'
              : 'Paste repository URL above first, or type a general query...'
          }
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          disabled={loading}
          className="flex-1 bg-slate-950 text-slate-100 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500/50 transition-colors placeholder:text-slate-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className="bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/10"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
