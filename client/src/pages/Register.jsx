import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import useAuthStore from '../store/authStore';
import { Sparkles, ArrowRight, LoaderCircle, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Registration failed');
      return result;
    },
    onSuccess: (data) => {
      setCredentials({ name: data.name, email: data.email, role: data.subscriptionTier }, data.token);
      navigate('/dashboard');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    // Premium Background & Layout
    <div className="min-h-screen flex items-center justify-center bg-[#030712] text-slate-200 p-4 relative overflow-hidden font-sans">
      
      {/* Ambient Glows */}
      <div className="ambient-glow glow-1 opacity-20"></div>
      <div className="ambient-glow glow-2 opacity-20"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        // Glassmorphic Card
        className="w-full max-w-lg bg-white/[0.02] backdrop-blur-3xl border border-white/[0.05] rounded-3xl shadow-2xl p-10 lg:p-12 z-10 relative overflow-hidden"
      >
        {/* Sublte top highlight border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center space-x-2 mb-4 p-2.5 px-4 bg-purple-500/10 rounded-full border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
          >
              <UserPlus size={18} className="text-purple-400" />
              <span className="text-sm font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Access OmniStack Force
              </span>
          </motion.div>
          <h2 className="text-4xl font-extrabold bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent tracking-tighter">
            Initiate Forge
          </h2>
          <p className="text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">Create your account and start generating productions apps instantly.</p>
        </div>

        {registerMutation.isError && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 text-sm text-center">
            {registerMutation.error.message}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Full Name</label>
            <input 
              type="text" 
              placeholder="Panvish Developer"
              // Premium Input Styling
              className="w-full px-5 py-3.5 bg-black/30 backdrop-blur-sm border border-white/[0.05] rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:outline-none transition-all duration-150"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="you@nexus.dev"
              className="w-full px-5 py-3.5 bg-black/30 backdrop-blur-sm border border-white/[0.05] rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:outline-none transition-all duration-150"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-5 py-3.5 bg-black/30 backdrop-blur-sm border border-white/[0.05] rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:outline-none transition-all duration-150"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={registerMutation.isPending}
            // Premium Button style (using Purple gradient to match UserPlus icon)
            className="w-full group py-4 mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-2"
          >
            {registerMutation.isPending ? (
              <>
                <LoaderCircle className="animate-spin" size={20} />
                <span>Creating Account...</span>
              </>
            ) : (
                <>
                  <span>Begin Creation</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 mt-10 text-sm">
          Already a creator? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold tracking-tight">Sign in instead</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;