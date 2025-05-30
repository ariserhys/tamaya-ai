import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Notebook, PenLine, ArrowRight, User as UserIcon, X, Sparkles } from 'lucide-react';
import NotesInterface from './NotesInterface';
import { getGeminiAnswer, NotesType } from '../services/geminiService';
import { getMCQs } from '../services/mcqService';
import { toast } from '@/components/ui/sonner';
import { Concept } from '@/types/concept';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import MCQTest, { MCQuestion } from './MCQTest';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import UserPanel from './UserPanel';

const responseTypes = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'quiz', label: 'Quiz' },
  { key: 'detailed', label: 'Detailed' },
] as const;

type ResponseType = typeof responseTypes[number]['key'];

const notesTypeMap: Record<ResponseType, NotesType> = {
  recommended: 'Recommended',
  quiz: 'MCQ',
  detailed: 'detailed',
};

interface NoteHistoryItem {
  id: string;
  question: string;
  answer: string;
  concepts: Concept[];
  type: string;
  date: string;
}

interface SimpleChatUIProps {
  initialQuestion?: string | null;
  initialType?: string | null;
}

const SimpleChatUI: React.FC<SimpleChatUIProps> = ({ initialQuestion = null, initialType = null }) => {
  const [activeTab, setActiveTab] = useState<ResponseType>('recommended');
  const [inputValue, setInputValue] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [notesData, setNotesData] = useState<NoteHistoryItem | null>(null);
  const [history, setHistory] = useState<NoteHistoryItem[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<MCQuestion[] | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputPlaceholders] = useState([
    "Ask me anything...",
    "What do you want to learn today?",
    "Need help with a concept?",
    "Try 'Explain quantum computing'",
    "How about 'Summarize photosynthesis'?"
  ]);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(inputPlaceholders[0]);
  const [typingEffect, setTypingEffect] = useState(false);
  const prevActiveTab = useRef<ResponseType>(activeTab);

  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add class to body for mobile optimization
  useEffect(() => {
    document.body.classList.add('mobile-container');
    
    // Add iOS safe area styles
    const metaViewport = document.querySelector('meta[name=viewport]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover');
    }
    
    return () => {
      document.body.classList.remove('mobile-container');
    };
  }, []);

  // Handle keyboard open/close on mobile
  useEffect(() => {
    function handleVisualViewport() {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        
        // If viewport height is significantly less than window height, keyboard is likely open
        if (windowHeight - viewportHeight > 150) {
          // Keyboard is open
          document.body.classList.add('keyboard-open');
        } else {
          // Keyboard is closed
          document.body.classList.remove('keyboard-open');
        }
      }
    }
    
    // Add visual viewport event listener for keyboard detection
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewport);
    }
    
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewport);
      }
    };
  }, []);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tamaya_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  // Handle initial question from redirection
  useEffect(() => {
    // Just set the input value if an initial question is provided
    if (initialQuestion) {
      console.log("Setting initial question:", initialQuestion);
      // Make sure to use initialQuestion directly, not dependent on any state
      setInputValue(initialQuestion);
      
      // Set the appropriate tab if provided
      if (initialType === 'recommended' || initialType === 'detailed' || initialType === 'quiz') {
        setActiveTab(initialType as ResponseType);
      }
      
      // Force focus the input field
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }
  }, [initialQuestion, initialType]); // Only depend on the props

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tamaya_history', JSON.stringify(history));
  }, [history]);

  // Rotate through different input placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder(prev => {
        const currentIndex = inputPlaceholders.indexOf(prev);
        const nextIndex = (currentIndex + 1) % inputPlaceholders.length;
        return inputPlaceholders[nextIndex];
      });
      setTypingEffect(true);
      setTimeout(() => setTypingEffect(false), 300);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [inputPlaceholders]);

  // Add keyboard shortcuts for common actions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + / for new chat
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        handleNewChat();
      }
      // Ctrl/Cmd + Enter to submit (when input is focused)
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && document.activeElement === inputRef.current) {
        e.preventDefault();
        handleCreate();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle tab change - this needs to work with the activeTab state
  useEffect(() => {
    if (prevActiveTab.current !== activeTab) {
      prevActiveTab.current = activeTab;
    }
  }, [activeTab]);

  // Show toast when tab changes
  useEffect(() => {
    if (prevActiveTab.current !== activeTab && prevActiveTab.current) {
      const tabLabel = responseTypes.find(r => r.key === activeTab)?.label;
      
      // Dismiss all existing toasts first
      toast.dismiss();
      
      // Then show the new toast with dark styling
      toast.success(`Switched to ${tabLabel} mode`, {
        style: {
          backgroundColor: '#111111',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        },
        duration: 2000, // shorter duration
        position: 'bottom-center',
        icon: <Sparkles size={18} className="text-[#0071E3]" />,
      });
    }
  }, [activeTab, responseTypes]);

  // Memoize handlers for better performance
  const handleTabChange = useCallback((type: ResponseType) => {
    setActiveTab(type);
  }, []);

  // Add subtle ripple animation to buttons
  const createRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isMobile) return; // Only on mobile devices
    
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 50%;
      transform: scale(0);
      pointer-events: none;
      animation: ripple-animation 0.6s linear;
    `;
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, [isMobile]);

  const handleNewChat = () => {
    setInputValue('');
    setNotesData(null);
    setShowNotes(false);
    setQuizQuestions(null);
    
    // Focus the input field after clearing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleCreate = async () => {
    if (!inputValue.trim()) return;
    setIsCreating(true);
    try {
      const notesType = notesTypeMap[activeTab];
      if (activeTab === 'quiz') {
        // Fetch MCQs and show quiz modal
        const questions = await getMCQs(inputValue.trim(), 10);
        setQuizQuestions(questions);
        setShowNotes(false);
      } else {
        // Normal notes flow
        const result = await getGeminiAnswer(inputValue.trim(), notesType);
        const newNote: NoteHistoryItem = {
          id: Date.now().toString(),
          question: inputValue.trim(),
          answer: result.answer,
          concepts: result.concepts,
          type: notesType,
          date: new Date().toLocaleString(),
        };
        setNotesData(newNote);
        setShowNotes(true);
        setHistory(prev => [newNote, ...prev]);
      }
    } catch (err) {
      toast.error('Failed to generate notes. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenHistoryNote = (note: NoteHistoryItem) => {
    setNotesData(note);
    setShowNotes(true);
    setShowSidebar(false); // Close sidebar on mobile after selection
  };

  const handleDeleteHistoryNote = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
  };

  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#030303] px-4 pb-safe relative">
      {/* Ambient background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0071E3]/[0.03] via-transparent to-[#0071E3]/[0.03] blur-3xl" />
        
        <motion.div 
          initial={{ opacity: 0.2 }}
          animate={{ 
            opacity: [0.2, 0.3, 0.2],
            y: [0, 10, 0],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-[30%] -right-[20%] w-[70%] h-[70%] bg-[#0071E3]/[0.04] rounded-full blur-3xl"
        />
        
        <motion.div 
          initial={{ opacity: 0.2 }}
          animate={{ 
            opacity: [0.2, 0.3, 0.2],
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute -bottom-[30%] -left-[20%] w-[70%] h-[70%] bg-[#0071E3]/[0.04] rounded-full blur-3xl"
        />
      </div>

      {/* Floating action buttons - optimized for mobile */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 flex flex-col gap-3 sm:gap-4 z-50 pb-safe">
        <div className="relative group">
          <button
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-[#0071E3] hover:bg-[#0077ED] shadow-lg hover:shadow-[#0071E3]/25 backdrop-blur-sm border border-white/10 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#0071E3]/70 focus:ring-offset-2 focus:ring-offset-black active:scale-95 touch-manipulation overflow-hidden relative"
            title="Open History/Notes"
            onClick={() => setShowSidebar(v => !v)}
            aria-label="Open notes history"
            onMouseDown={createRipple}
          >
            <Notebook size={22} className="text-white" />
          </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:block">
            Notes History
          </div>
        </div>
        <div className="relative group">
          <button
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/15 shadow-lg backdrop-blur-sm border border-white/10 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black active:scale-95 touch-manipulation overflow-hidden relative"
            title="New Chat"
            onClick={handleNewChat}
            aria-label="Start new chat"
            onMouseDown={createRipple}
          >
            <PenLine size={22} className="text-white" />
          </button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:block">
            New Chat
          </div>
          <div className="absolute right-full mr-3 bottom-0 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:block">
            Shortcut: Ctrl+/
          </div>
        </div>
      </div>

      {/* Sidebar for history/notes */}
      <AnimatePresence>
      {showSidebar && (
        <div className="fixed inset-0 bg-black/60 z-40 flex backdrop-blur-sm">
            <motion.div 
              initial={{ x: '-100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-[90%] sm:w-80 max-w-full h-full bg-[#0a0a0a] shadow-2xl p-4 sm:p-6 flex flex-col gap-3 border-r border-white/10 overflow-hidden pt-safe pb-safe pl-safe"
            >
            <div className="flex items-center justify-between mb-3 sm:mb-4 px-3">
              <span className="text-base sm:text-lg font-semibold text-white">History & Notes</span>
              <button 
                onClick={() => setShowSidebar(false)} 
                  className="text-gray-400 hover:text-white p-2 -mr-2 rounded-full hover:bg-white/5 transition-colors touch-manipulation"
                aria-label="Close sidebar"
                >
                  <X size={20} />
                </button>
            </div>

            <UserPanel />

            <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 sm:gap-3 pb-6 overscroll-contain px-3">
              {history.length === 0 && (
                <div className="text-gray-500 text-center py-8 text-sm sm:text-base">No notes yet.</div>
              )}
                {history.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUpVariants}
                    className="flex items-center justify-between bg-white/5 rounded-lg px-3.5 py-2.5 cursor-pointer hover:bg-white/10 transition-all duration-200 active:bg-white/15 touch-manipulation"
                  onClick={() => handleOpenHistoryNote(item)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm sm:text-base truncate">{item.question}</div>
                      <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{item.date} &middot; {item.type}</div>
                  </div>
                  <button
                      className="text-red-400 hover:text-red-600 p-2 -mr-2 rounded-full hover:bg-white/5 active:bg-white/10 transition-colors touch-manipulation ml-2"
                    title="Delete"
                    aria-label="Delete note"
                    onClick={e => { e.stopPropagation(); handleDeleteHistoryNote(item.id); }}
                    >
                      <X size={16} className="stroke-current" />
                    </button>
                  </motion.div>
              ))}
            </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1" 
              onClick={() => setShowSidebar(false)} 
            />
        </div>
      )}
      </AnimatePresence>

      {/* Animated overlay for creating notes */}
      <AnimatePresence>
      {isCreating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-4 p-8 bg-[#0a0a0a]/90 rounded-2xl shadow-2xl border border-white/10"
            >
            <div className="w-12 h-12 border-4 border-gray-700 border-t-[#0071E3] rounded-full animate-spin mb-2" />
            <div className="text-lg font-medium text-white">
              {activeTab === 'quiz' ? 'Generating Quiz...' : 'Creating your notes...'}
            </div>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>

      {/* NotesInterface modal */}
      {showNotes && notesData && (
        <NotesInterface
          question={notesData.question}
          answer={notesData.answer}
          concepts={notesData.concepts}
          onClose={() => setShowNotes(false)}
          onNewChat={handleNewChat}
        />
      )}

      {/* Quiz Questions modal */}
      <AnimatePresence>
      {quizQuestions && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-2 md:px-0"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="w-full max-w-2xl max-h-[90vh] bg-[#111] rounded-3xl shadow-2xl p-0 overflow-hidden border border-white/10 hide-scrollbar overscroll-contain"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
            <MCQTest
              questions={quizQuestions}
              onClose={() => setQuizQuestions(null)}
              onNewChat={handleNewChat}
            />
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex flex-col items-center w-full max-w-xl mx-auto px-2 sm:px-4 pt-safe relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-center bg-clip-text text-transparent bg-gradient-to-r from-[#3399FF] via-white/90 to-[#0071E3]">TAMAYA AI</h1>
            <motion.div 
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 5
              }}
            >
              <Sparkles size={24} className="text-[#0071E3]" />
            </motion.div>
          </div>
        <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-1 text-center">Last-Minute Learning, Maximized by AI</p>
          <p className="text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8 text-center italic">Developed by Abhishek</p>
        </motion.div>
        
        <motion.div 
          className="w-full flex flex-col items-center gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Input bar - optimized for mobile */}
          <div
            className={cn(
              "w-full flex items-center rounded-full px-4 sm:px-6 pr-1 sm:pr-2 mb-2 shadow-lg transition-all duration-300",
              "bg-white/5 border border-white/10 h-14 sm:h-16 relative overflow-hidden",
              inputFocused ? "ring-2 ring-[#0071E3]/30 shadow-2xl border-white/20 bg-white/8" : "",
              !inputFocused && "hover:shadow-2xl hover:-translate-y-0.5"
            )}
          >
            {inputFocused && (
              <motion.div 
                className="absolute inset-0 bg-[#0071E3]/5 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={typingEffect ? "" : currentPlaceholder}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              className="flex-1 bg-transparent outline-none border-none text-white placeholder-gray-400 text-base sm:text-lg pr-2 sm:pr-4 focus:outline-none focus:ring-0 focus:border-none h-full"
              style={{ boxShadow: 'none' }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
                  e.preventDefault();
                  handleCreate();
                }
              }}
              aria-label="Ask Tamaya AI a question"
            />
            <button
              className={cn(
                "rounded-full flex items-center justify-center h-12 w-12 sm:h-12 sm:w-12 transition-all duration-200 active:scale-95 touch-manipulation relative overflow-hidden",
                !inputValue.trim() 
                  ? "bg-gray-200/20 text-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-[#0071E3] to-[#3399FF] text-white hover:shadow-lg hover:shadow-[#0071E3]/20"
              )}
              disabled={!inputValue.trim()}
              onClick={handleCreate}
              aria-label="Submit question"
              onMouseDown={createRipple}
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          
          {/* Tab Bar - optimized for mobile */}
          <div className="flex items-center gap-2.5 justify-center mb-2 flex-wrap">
            {responseTypes.map((type, index) => (
              <motion.button
                key={type.key}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={fadeInUpVariants}
                className={cn(
                  "px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/10 active:bg-white/15 touch-manipulation min-w-[100px] relative overflow-hidden",
                  activeTab === type.key
                    ? "bg-white/10 text-white border border-white/20 shadow-lg"
                    : "bg-transparent text-gray-400"
                )}
                onClick={() => handleTabChange(type.key)}
                onMouseDown={createRipple}
                aria-pressed={activeTab === type.key}
                aria-label={`${type.label} response mode`}
              >
                {activeTab === type.key && (
                  <motion.div 
                    className="absolute inset-0 bg-[#0071E3]/5 pointer-events-none"
                    layoutId="activeTab"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                {type.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Add empty space at bottom for better aesthetics and to ensure content isn't hidden behind floating buttons */}
      <div className="h-24 sm:h-28" />

      {/* Keyboard shortcuts tooltip - only shown on desktop */}
      <div className="fixed bottom-2 left-4 text-xs text-gray-500 opacity-60 hidden sm:block">
        <div>Ctrl+/ - New Chat</div>
        <div>Ctrl+Enter - Submit</div>
      </div>
    </div>
  );
};

// Add CSS to help with mobile device notches and keyboards
const styles = document.createElement('style');
styles.innerHTML = `
  /* Safe area insets support */
  .pt-safe {
    padding-top: env(safe-area-inset-top, 0px);
  }
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  .pl-safe {
    padding-left: env(safe-area-inset-left, 0px);
  }
  .pr-safe {
    padding-right: env(safe-area-inset-right, 0px);
  }
  
  /* Keyboard open adjustments */
  body.keyboard-open .fixed.bottom-4,
  body.keyboard-open .fixed.bottom-6 {
    opacity: 0;
    pointer-events: none;
  }
  
  /* Better touch interactions */
  @media (pointer: coarse) {
    button, input, a {
      cursor: default !important;
    }
    
    button:active, a:active {
      transform: scale(0.97);
    }
  }
  
  /* Momentum scrolling for iOS */
  .overscroll-contain {
    -webkit-overflow-scrolling: touch;
  }
  
  /* Prevent unwanted highlights on mobile taps */
  * {
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Ripple animation */
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(styles);

export default SimpleChatUI; 