import { motion } from 'framer-motion';
import { LayoutDashboard, Code, CreditCard, LogOut, Settings, Sparkles, Zap, FolderDot, Clock } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 flex relative overflow-hidden font-sans">
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] z-0"></div>

      {/* Sidebar */}
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
          <button onClick={() => navigate('/studio')} className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all group">
            <Code size={18} className="group-hover:text-purple-400 transition-colors" />
            <span className="font-medium text-sm">AI Studio</span>
          </button>
          <button onClick={() => navigate('/billing')} className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all group">
            <CreditCard size={18} className="group-hover:text-emerald-400 transition-colors" />
            <span className="font-medium text-sm">Billing</span>
          </button>
        </nav>

        <div className="p-4">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
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
        </header>

        {/* Top Stats Grid */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Main Action Card */}
          <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2 group relative p-[1px] rounded-3xl bg-gradient-to-b from-white/[0.1] to-transparent overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
            <div className="relative h-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.05] p-8 rounded-[23px] flex flex-col items-start justify-center overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-6">
                <Code className="text-indigo-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Initialize Studio</h3>
              <p className="text-slate-400 mb-8 max-w-md leading-relaxed">
                Harness the OmniStack AI multi-agent system. Generate complete MERN architectures or components.
              </p>
              <button onClick={() => navigate('/studio')} className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 transition-transform active:scale-95">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl space-x-2">
                  <Sparkles size={16} />
                  <span>Enter AI Studio</span>
                </span>
              </button>
            </div>
          </motion.div>

          {/* Usage Stats Card */}
          <motion.div variants={itemVariants} className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] p-8 rounded-3xl shadow-2xl flex flex-col relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="text-purple-400" size={20} />
              <h3 className="text-lg font-semibold text-slate-200">API Usage</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="text-4xl font-extrabold text-white mb-2">Active</div>
              <p className="text-slate-400 text-sm font-medium">Tier: {user?.role?.toUpperCase() || 'FREE'}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Projects Section */}
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <div className="flex items-center space-x-2 mb-6">
            <FolderDot className="text-indigo-400" size={20} />
            <h3 className="text-xl font-bold text-white">Recent Workspaces</h3>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : projects?.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-10 text-center">
              <p className="text-slate-400">No projects yet. Head to the Studio to generate your first app!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects?.map((project) => (
                <motion.div 
                  key={project._id}
                  variants={itemVariants}
                  onClick={() => navigate('/studio', { state: { project } })} 
                  className="bg-[#0a0a0a]/60 backdrop-blur-md border border-white/[0.05] hover:border-indigo-500/50 p-6 rounded-2xl cursor-pointer transition-all group"
                >
                  <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">{project.name}</h4>
                  <p className="text-sm text-slate-400 mb-4">{Object.keys(project.files).length} files generated</p>
                  <div className="flex items-center text-xs text-slate-500 space-x-1">
                    <Clock size={12} />
                    <span>Last updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;