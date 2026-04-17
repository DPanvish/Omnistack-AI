import { motion } from 'framer-motion';
import { LayoutDashboard, Code, CreditCard, LogOut, Settings, Sparkles, Zap } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 flex relative overflow-hidden font-sans">
      
      {/* Ambient Background Effects */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] z-0"></div>

      {/* Glassmorphic Sidebar */}
      <aside className="w-64 bg-white/[0.02] backdrop-blur-3xl border-r border-white/[0.05] hidden md:flex flex-col z-10 relative">
        <div className="p-8">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
              OmniStack
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button className="w-full flex items-center space-x-3 px-4 py-3 bg-white/[0.05] text-white rounded-xl border border-white/[0.05] shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all">
            <LayoutDashboard size={18} className="text-indigo-400" />
            <span className="font-medium text-sm">Dashboard</span>
          </button>
          <button onClick={() => navigate("/studio")} className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all group">
            <Code size={18} className="group-hover:text-purple-400 transition-colors" />
            <span className="font-medium text-sm">AI Studio</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all group">
            <CreditCard size={18} className="group-hover:text-emerald-400 transition-colors" />
            <span className="font-medium text-sm">Billing</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all group">
            <Settings size={18} className="group-hover:text-slate-300 transition-colors" />
            <span className="font-medium text-sm">Settings</span>
          </button>
        </nav>

        <div className="p-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 z-10 relative overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-indigo-400 text-sm font-medium tracking-wider uppercase mb-1">Overview</p>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">
              Welcome, {user?.name?.split(' ')[0] || 'Creator'}.
            </h2>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="px-5 py-2.5 bg-white/[0.03] backdrop-blur-md border border-white/[0.05] rounded-full flex items-center space-x-3 shadow-lg"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Tier: {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Free'}
            </span>
          </motion.div>
        </header>

        {/* Staggered Grid */}
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show" 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Action Card (Premium Glowing Border effect) */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 lg:col-span-2 group relative p-[1px] rounded-3xl bg-gradient-to-b from-white/[0.1] to-transparent overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
            <div className="relative h-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.05] p-8 rounded-[23px] flex flex-col items-start justify-center overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
              
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-6">
                <Code className="text-indigo-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Initialize Studio</h3>
              <p className="text-slate-400 mb-8 max-w-md leading-relaxed">
                Harness the OmniStack AI multi-agent system. Generate complete MERN architectures, responsive React components, or React Native screens in seconds.
              </p>
              <button onClick={() => navigate("/studio")} className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 transition-transform active:scale-95">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl space-x-2">
                  <Sparkles size={16} />
                  <span>Enter AI Studio</span>
                </span>
              </button>
            </div>
          </motion.div>

          {/* Usage Stats Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-8 rounded-3xl shadow-2xl flex flex-col relative overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="text-purple-400" size={20} />
              <h3 className="text-lg font-semibold text-slate-200">API Usage</h3>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center">
              {/* Circular Progress Visual (Simulated) */}
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeDasharray="283" strokeDashoffset="283" className="text-purple-500 transition-all duration-1000 ease-out" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white">0</span>
                  <span className="text-xs text-slate-500 font-medium mt-1">/ 10</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm font-medium">Credits remaining</p>
            </div>

            {user?.role === 'free' && (
              <button className="mt-6 w-full py-3 bg-white/[0.05] hover:bg-white/[0.1] text-white font-medium rounded-xl transition-all border border-white/[0.05] hover:border-white/[0.1]">
                Upgrade Plan
              </button>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;