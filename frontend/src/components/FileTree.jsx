import React, { useState } from 'react';
import { Folder, FolderOpen, FileCode, FileText, ChevronRight, ChevronDown, Search } from 'lucide-react';

// Helper to build a nested directory object from a flat array of file paths
function buildDirectoryTree(files) {
  const root = {};

  files.forEach((file) => {
    const parts = file.path.split('/');
    let current = root;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // It's a file
        current[part] = {
          __is_file: true,
          path: file.path,
          language: file.language || 'text'
        };
      } else {
        // It's a directory
        if (!current[part]) {
          current[part] = { __is_file: false, children: {} };
        }
        current = current[part].children;
      }
    });
  });

  return root;
}

function TreeNode({ name, node, filterText }) {
  const [isOpen, setIsOpen] = useState(true);

  if (node.__is_file) {
    const filename = name;
    if (filterText && !filename.toLowerCase().includes(filterText.toLowerCase()) && !node.path.toLowerCase().includes(filterText.toLowerCase())) {
      return null;
    }

    const isCode = ['python', 'js', 'ts', 'html', 'css', 'go', 'rust', 'java', 'cpp'].includes(node.language);

    return (
      <div className="flex items-center gap-2 py-1 px-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 rounded cursor-pointer transition-colors">
        {isCode ? (
          <FileCode className="w-4 h-4 text-teal-400 shrink-0" />
        ) : (
          <FileText className="w-4 h-4 text-slate-400 shrink-0" />
        )}
        <span className="truncate font-mono text-xs">{filename}</span>
        <span className="ml-auto text-[10px] text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-800">
          {node.language}
        </span>
      </div>
    );
  }

  // Directory node
  const childKeys = Object.keys(node.children || {});

  return (
    <div className="my-0.5">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 py-1 px-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 rounded cursor-pointer select-none transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        )}
        {isOpen ? (
          <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
        ) : (
          <Folder className="w-4 h-4 text-amber-400 shrink-0" />
        )}
        <span className="font-semibold text-xs text-slate-200">{name}</span>
        <span className="ml-auto text-[10px] text-slate-500 font-mono">
          ({childKeys.length})
        </span>
      </div>

      {isOpen && (
        <div className="pl-4 border-l border-slate-800 ml-3">
          {childKeys.map((childName) => (
            <TreeNode
              key={childName}
              name={childName}
              node={node.children[childName]}
              filterText={filterText}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree({ files = [] }) {
  const [filterText, setFilterText] = useState('');

  if (!files || files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500">
        <Folder className="w-10 h-10 mb-2 stroke-1 opacity-50" />
        <p className="text-sm font-medium">No repository loaded</p>
        <p className="text-xs text-slate-600 mt-1">Ingest a GitHub repository to explore its file tree.</p>
      </div>
    );
  }

  const tree = buildDirectoryTree(files);

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-800/80 overflow-hidden">
      {/* Header & Filter Bar */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5 text-teal-400" />
            Repository Files ({files.length})
          </span>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filter files..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-teal-500/50 transition-colors placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 p-2 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-slate-800">
        {Object.keys(tree).map((name) => (
          <TreeNode key={name} name={name} node={tree[name]} filterText={filterText} />
        ))}
      </div>
    </div>
  );
}
