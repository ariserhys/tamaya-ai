import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const UserNameEntry = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user already has a name saved
    const savedName = localStorage.getItem('tamaya_user_name');
    if (savedName) {
      // If name exists, redirect to welcome page
      navigate('/welcome');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    
    // Save name to localStorage
    localStorage.setItem('tamaya_user_name', name.trim());
    
    // Show success toast
    toast.success('Welcome to Tamaya AI!', {
      style: {
        backgroundColor: '#111111',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
      },
      duration: 2000,
      position: 'bottom-center',
      icon: <Sparkles size={18} className="text-[#0071E3]" />,
    });
    
    // Navigate to welcome page instead of chat
    setTimeout(() => {
      navigate('/welcome');
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#030303] px-4 pb-safe relative">
      {/* Ambient background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0071E3]/[0.03] via-transparent to-[#0071E3]/[0.03] blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#3399FF] via-white/90 to-[#0071E3]">
            Welcome to Tamaya
          </h1>
          <p className="text-white/70">Let us know your name to get started</p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg"
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-[#0071E3] to-[#3399FF] text-white font-medium py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-[#0071E3]/20 transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
            ) : (
              <Sparkles size={18} className="mr-2" />
            )}
            {loading ? 'Saving...' : 'Continue to Tamaya AI'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UserNameEntry; 