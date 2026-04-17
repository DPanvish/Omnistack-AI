import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import { Sparkles, Send, FileCode2, FolderTree, Code2, Play, Terminal, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Studio = () => {
  const [prompt, setPrompt] = useState('');
  // Store files as an object: { "src/App.jsx": "code...", "package.json": "code..." }
  const [files, setFiles] = useState({
    "README.md": "# OmniStack Workspace\n\n1. Type a prompt on the left.\n2. Watch the multi-agent AI build your architecture.\n3. Browse generated files here."
  });
  const [activeFile, setActiveFile] = useState("README.md");
  
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const generateCodeMutation = useMutation({
    mutationFn: async (userPrompt) => {
      const res = await fetch('http://localhost:5000/api/ai/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to generate code');
      return result;
    },
    onSuccess: (data) => {
      if (data.files && Object.keys(data.files).length > 0) {
        setFiles(data.files);
        // Automatically open the first generated file (usually package.json or App.jsx)
        setActiveFile(Object.keys(data.files)[0]); 
      }
    },
    onError: (error) => {
      setFiles({
        "error.log": `// Error during generation:\n${error.message}`
      });
      setActiveFile("error.log");
    }
  });

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    generateCodeMutation.mutate(prompt);
  };

  // Helper to determine language for Monaco based on file extension
  const getLanguage = (fileName) => {
    if (fileName.endsWith('.jsx') || fileName.endsWith('.js')) return 'javascript';
    if (fileName.endsWith('.css')) return 'css';
    if (fileName.endsWith('.json')) return 'json';
    if (fileName.endsWith('.html')) return 'html';
    return 'markdown';
  };

  return (
    <div className="h-screen flex flex-col bg-[#030712] text-slate-200 overflow-hidden font-sans relative">
      <div className="ambient-glow glow-1 opacity-10"></div>
      
      {/* Top Nav */}
      <header className="h-14 border-b border-white/[0.05] bg-[#0a0a0a] flex items-center justify-between px-4 z-10">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
            ← Dashboard
          </button>
          <div className="flex items-center space-x-2 bg-white/[0.03] px-3 py-1.5 rounded-md border border-white/[0.05]">
            <FolderTree size={16} className="text-indigo-400" />
            <span className="text-sm font-medium text-slate-300">workspace_xyz</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-md text-sm font-semibold flex items-center space-x-2 transition-colors">
            <Play size={14} />
            <span>Deploy</span>
          </button>
        </div>
      </header>

      {/* Main IDE Area */}
      <main className="flex-1 flex overflow-hidden z-10">
        
        {/* Pane 1: AI Command Center (Left) */}
        <aside className="w-[350px] border-r border-white/[0.05] bg-[#0a0a0a]/80 backdrop-blur-xl flex flex-col relative z-20">
          <div className="p-5 border-b border-white/[0.05] flex items-center space-x-2">
            <Sparkles size={18} className="text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Architect</h3>
          </div>
          
          <div className="flex-1 p-5 overflow-y-auto">
            {/* Future Chat History could go here */}
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 mb-4">
              <p className="text-sm text-indigo-300/80 leading-relaxed">
                Describe the web app you want to build. OmniStack will generate the complete file structure and code.
              </p>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-5 border-t border-white/[0.05] bg-black/40">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Build a React authentication flow with a Tailwind login screen..."
              className="w-full h-32 p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl resize-none focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] text-sm text-slate-200 placeholder:text-slate-600 transition-all shadow-inner mb-4"
            />
            <button 
              onClick={handleGenerate}
              disabled={generateCodeMutation.isPending || !prompt.trim()}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold rounded-lg shadow-lg transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-2"
            >
              {generateCodeMutation.isPending ? (
                <span className="flex items-center space-x-2 animate-pulse">
                  <Terminal size={16} />
                  <span>Building App...</span>
                </span>
              ) : (
                <>
                  <span>Generate Application</span>
                  <Send size={16} />
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Pane 2: File Explorer (Middle) */}
        <aside className="w-[250px] border-r border-white/[0.05] bg-[#0f111a] flex flex-col">
          <div className="p-3 border-b border-white/[0.05]">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-2">Explorer</span>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {Object.keys(files).map((fileName) => (
              <button
                key={fileName}
                onClick={() => setActiveFile(fileName)}
                className={`w-full flex items-center space-x-2 px-4 py-1.5 text-sm transition-colors ${
                  activeFile === fileName 
                    ? 'bg-indigo-500/20 text-indigo-300 border-r-2 border-indigo-400' 
                    : 'text-slate-400 hover:bg-white/[0.02] hover:text-slate-200'
                }`}
              >
                <FileCode2 size={14} className={activeFile === fileName ? 'text-indigo-400' : 'text-slate-500'} />
                <span className="truncate">{fileName}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Pane 3: Code Editor (Right) */}
        <section className="flex-1 flex flex-col bg-[#1e1e1e]">
          {/* Editor Tabs */}
          <div className="flex bg-[#181818] overflow-x-auto custom-scrollbar">
            {Object.keys(files).map((fileName) => (
               <div 
                  key={fileName}
                  onClick={() => setActiveFile(fileName)}
                  className={`px-4 py-2 flex items-center space-x-2 cursor-pointer border-r border-white/[0.05] min-w-max text-sm ${
                    activeFile === fileName 
                      ? 'bg-[#1e1e1e] text-indigo-400 border-t-2 border-t-indigo-500' 
                      : 'bg-[#181818] text-slate-500 hover:bg-[#1a1a1a]'
                  }`}
               >
                 <Code2 size={14} />
                 <span>{fileName}</span>
               </div>
            ))}
          </div>
          
          <div className="flex-1 relative">
            <AnimatePresence>
              {generateCodeMutation.isPending && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#1e1e1e]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-indigo-400 font-medium">Agents are structuring files...</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <Editor
              height="100%"
              language={getLanguage(activeFile)}
              theme="vs-dark"
              value={files[activeFile]}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Studio;