import { useState, useEffect } from 'react';
import { User, Edit, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/sonner';

const UserPanel = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user name from localStorage
    const storedName = localStorage.getItem('tamaya_user_name');
    setUserName(storedName);
    
    // If no name is stored, redirect to the user name entry page
    if (!storedName) {
      navigate('/user-name');
    }
  }, [navigate]);

  const handleEditClick = () => {
    setNewName(userName || '');
    setEditMode(true);
  };

  const handleSaveName = () => {
    if (newName.trim()) {
      localStorage.setItem('tamaya_user_name', newName.trim());
      setUserName(newName.trim());
      setEditMode(false);
      toast.success('Name updated!', {
        style: {
          backgroundColor: '#111111',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        },
        duration: 2000,
        position: 'bottom-center',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  if (!userName && !editMode) {
    return null;
  }

  return (
    <div className="border-b border-white/10 pb-3 mb-2 px-3">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-[#0071E3] to-[#3399FF] rounded-full w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          {editMode ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#0071E3]/30"
                autoFocus
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveName}
                className="p-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-full"
              >
                <Check size={16} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCancelEdit}
                className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full"
              >
                <X size={16} />
              </motion.button>
            </div>
          ) : (
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center">
                <span className="font-medium text-white text-sm sm:text-base truncate">
                  {userName}
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditClick}
                  className="p-1.5 ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                >
                  <Edit size={14} />
                </motion.button>
              </div>
              <span className="text-xs text-gray-400">User</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPanel; 