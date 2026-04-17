import { motion } from 'framer-motion';
import { LayoutDashboard, Code, CreditCard, LogOut, Settings } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            OmniStack AI
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button className="w-full flex items-center space-x-3 px-4 py-3 bg-indigo-500/10 text-indigo-400 rounded-lg transition-colors">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-lg transition-colors">
            <Code size={20} />
            <span className="font-medium">AI Studio</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-lg transition-colors">
            <CreditCard size={20} />
            <span className="font-medium">Billing</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-lg transition-colors">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Welcome back, {user?.name || 'Developer'}</h2>
            <p className="text-slate-400 mt-1">Here is what's happening with your projects today.</p>
          </div>
          <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-sm font-medium uppercase tracking-wider text-slate-300">
              Tier: {user?.role || 'Free'}
            </span>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-1 md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-center items-start shadow-xl"
          >
            <h3 className="text-xl font-semibold text-white mb-2">Create a New Project</h3>
            <p className="text-slate-400 mb-6 max-w-md">
              Use the OmniStack AI engine to generate full MERN stack boilerplate, or stunning frontend components in seconds.
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg transform transition-all active:scale-[0.98] flex items-center space-x-2">
              <Code size={20} />
              <span>Enter AI Studio</span>
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col"
          >
            <h3 className="text-lg font-semibold text-slate-300 mb-4">API Usage</h3>
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="text-5xl font-bold text-white mb-2">0<span className="text-2xl text-slate-500">/10</span></div>
              <p className="text-slate-400 text-sm">Generations used this month</p>
            </div>
            {user?.role === 'free' && (
              <button className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 font-medium rounded-lg transition-colors border border-slate-700">
                Upgrade to Pro
              </button>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;