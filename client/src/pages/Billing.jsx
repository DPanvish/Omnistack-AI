import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Building2, LoaderCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

// Helper to dynamically load the Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Billing = () => {
  const user = useAuthStore((state) => state.user);
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  
  const [processingPlan, setProcessingPlan] = useState(null);

  const handleSubscribe = async (planName) => {
    setProcessingPlan(planName);

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert('Failed to load Razorpay. Please check your internet connection.');
      setProcessingPlan(null);
      return;
    }

    try {
      const orderResponse = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: planName })
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      const options = {
        key: orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'OmniStack AI',
        description: `Upgrade to ${planName.toUpperCase()} Tier`,
        order_id: orderData.order.id, 
        
        handler: async function (response) {
          try {
            const verifyResponse = await fetch('http://localhost:5000/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: planName
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              const updatedUser = { ...user, role: verifyData.newTier || planName };
              setCredentials(updatedUser, token);
              setProcessingPlan(null);
              navigate('/dashboard');
            } else {
              alert(verifyData.message || 'Payment verification failed on server.');
              setProcessingPlan(null);
            }
          } catch (err) {
            console.error('Verification Error:', err);
            alert('An error occurred during verification. Please contact support.');
            setProcessingPlan(null);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#6366f1', 
        },
      };

      const paymentObject = new window.Razorpay(options);
      
      // Handle User closing the window or failing payment
      paymentObject.on('payment.failed', function (response) {
        alert(`Payment Failed: ${response.error.description}`);
        setProcessingPlan(null);
      });
      
      paymentObject.open();

    } catch (error) {
      console.error('Checkout Error:', error);
      alert(error.message);
      setProcessingPlan(null);
    }
  };

  const plans = [
    {
      name: 'basic',
      displayName: 'Basic',
      price: '₹999',
      period: '/month',
      description: 'Perfect for hobbyists and students starting with AI code generation.',
      icon: <Zap className="text-blue-400" size={24} />,
      features: ['100 AI Generations/month', 'MERN Stack Output', 'Standard Support', 'Community Access'],
      buttonStyle: 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1]',
      popular: false,
    },
    {
      name: 'premium',
      displayName: 'Premium',
      price: '₹2,499',
      period: '/month',
      description: 'The sweet spot for freelance developers and indie hackers.',
      icon: <Sparkles className="text-purple-400" size={24} />,
      features: ['Unlimited AI Generations', 'React Native Output', 'Priority Support', 'Early Access to New Agents', 'Advanced Architecture Planning'],
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]',
      popular: true,
    },
    {
      name: 'enterprise',
      displayName: 'Enterprise',
      price: '₹9,999',
      period: '/month',
      description: 'For teams needing maximum power and custom AI agent workflows.',
      icon: <Building2 className="text-emerald-400" size={24} />,
      features: ['Everything in Premium', 'Custom AI Agent Tuning', 'Dedicated Account Manager', 'SLA Guarantee', 'API Access'],
      buttonStyle: 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1]',
      popular: false,
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 overflow-hidden font-sans relative pb-20">
      <div className="ambient-glow glow-1 opacity-20"></div>
      <div className="ambient-glow glow-2 opacity-10"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12">
        <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white transition-colors mb-12 flex items-center space-x-2 font-medium">
          <span>← Back to Dashboard</span>
        </button>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Upgrade your <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">Workflow</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choose the plan that fits your development speed. Upgrade now and unleash the full power of OmniStack's multi-agent AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative bg-[#0a0a0a]/80 backdrop-blur-xl border ${plan.popular ? 'border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]' : 'border-white/[0.05]'} rounded-3xl p-8 flex flex-col h-full overflow-hidden`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl tracking-wider uppercase">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <div className="p-3 bg-white/[0.03] inline-block rounded-xl border border-white/[0.05] mb-4">
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-white">{plan.displayName}</h3>
                <p className="text-slate-400 text-sm mt-2 min-h-[40px]">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-slate-500 ml-2 font-medium">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-slate-300">
                    <Check size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.name)}
                disabled={processingPlan !== null || user?.role === plan.name}
                className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
                  user?.role === plan.name 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default' 
                    : plan.buttonStyle
                }`}
              >
                {processingPlan === plan.name ? (
                  <>
                    <LoaderCircle className="animate-spin" size={18} />
                    <span>Initializing...</span>
                  </>
                ) : user?.role === plan.name ? (
                  <>
                    <Check size={18} />
                    <span>Current Plan</span>
                  </>
                ) : (
                  <span>Upgrade to {plan.displayName}</span>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Billing;
