import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import { Sparkles, Send, Bot, Code2, Copy, Check, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Studio = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('// Your generated MERN stack code will appear here...\n\n// 1. Enter a prompt on the left.\n// 2. Click Generate.\n// 3. Watch OmniStack build your architecture.');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const generateCodeMutation = useMutation({
    mutationFn: async (userPrompt) => {
      // Simulating network/AI delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(`// Generated Code for: ${userPrompt}\n\nimport React from 'react';\n\nconst GeneratedComponent = () => {\n  return (\n    <div className="p-4 bg-slate-900 text-white rounded-lg">\n      <h1>Hello from OmniStack AI</h1>\n      <p>This component was dynamically generated.</p>\n    </div>\n  );\n};\n\nexport default GeneratedComponent;`);
        }, 2000);
      });
    },
    onSuccess: (data) => {
      setGeneratedCode(data);
    }
  });

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    generateCodeMutation.mutate(prompt);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-[#030712] text-slate-200 overflow-hidden font-sans relative">
      {/* Ambient Background */}
      <div className="ambient-glow glow-1 opacity-10"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] z-0 pointer-events-none"></div>

      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-white/[0.05] bg-white/[0.01] backdrop-blur-md flex items-center justify-between px-6 z-10">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
            ← Back to Dashboard
          </button>
          <div className="h-4 w-[1px] bg-white/[0.1]"></div>
          <div className="flex items-center space-x-2">
            <Bot size={18} className="text-indigo-400" />
            <span className="font-semibold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              OmniStack Studio
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              <span>AI Engine Ready</span>
            </span>
        </div>
      </header>

      {/* Main Studio Area */}
      <main className="flex-1 flex overflow-hidden z-10">
        
        {/* Left Panel: Prompt Input */}
        <aside className="w-1/3 lg:w-[400px] border-r border-white/[0.05] bg-black/20 backdrop-blur-xl flex flex-col relative">
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
              <Sparkles size={18} className="text-purple-400" />
              <span>Architect Prompt</span>
            </h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Describe the component, backend logic, or full mobile screen you want to generate. Be specific about the MERN stack or React Native details.
            </p>
            
            <div className="flex-1 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Create a secure Express.js REST API with JWT authentication and MongoDB connection..."
                className="relative w-full h-full p-5 bg-[#0a0a0a] border border-white/[0.1] rounded-2xl resize-none focus:outline-none focus:border-indigo-500/50 text-slate-200 placeholder:text-slate-600 transition-all shadow-inner"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={generateCodeMutation.isPending || !prompt.trim()}
              className="mt-6 w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.2)] transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-2"
            >
              {generateCodeMutation.isPending ? (
                <span className="flex items-center space-x-2 animate-pulse">
                  <Terminal size={18} />
                  <span>Synthesizing Code...</span>
                </span>
              ) : (
                <>
                  <span>Generate Code</span>
                  <Send size={18} />
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Right Panel: Code Editor */}
        <section className="flex-1 flex flex-col bg-[#1e1e1e]"> {/* Monaco's default dark color */}
          <div className="h-12 border-b border-white/[0.05] bg-[#181818] flex items-center justify-between px-4">
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <Code2 size={16} />
              <span>generated_output.jsx</span>
            </div>
            <button 
              onClick={handleCopy}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.1] rounded-md transition-colors flex items-center space-x-1 text-sm"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          
          <div className="flex-1 relative">
            {generateCodeMutation.isPending && (
              <div className="absolute inset-0 bg-[#1e1e1e]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p className="text-indigo-400 font-medium animate-pulse">AI Agents are writing your code...</p>
              </div>
            )}
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={generatedCode}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 24 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
              }}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Studio;