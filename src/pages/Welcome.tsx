import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

// Helper function to format username for display
const formatUserName = (userName: string): string => {
  if (!userName) return 'there';
  
  // Format the name to be properly capitalized
  const formattedName = userName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
    
  return formattedName || 'there';
};

const Welcome = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState('');
  const [isNewUser, setIsNewUser] = useState(true);
  const navigate = useNavigate();
  const helloRef = useRef<HTMLDivElement>(null);
  const [resetAnimation, setResetAnimation] = useState(false);

  useEffect(() => {
    // Get the user's name from localStorage
    const storedName = localStorage.getItem('tamaya_user_name');
    if (!storedName) {
      // If no name is stored, redirect to the name entry page
      navigate('/user-name');
      return;
    }
    
    setUserName(formatUserName(storedName));
    
    // Start the animation after a short delay
    const showTimer = setTimeout(() => {
      setShowWelcome(true);
    }, 300);

    // Navigate to chat after animation completes
    const completeTimer = setTimeout(() => {
      navigate('/chat');
    }, 7500); // Extended time to allow animation to complete

    // Periodically reset the animation
    const resetTimer = setInterval(() => {
      setResetAnimation(true);
      setTimeout(() => setResetAnimation(false), 10);
    }, 20000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(completeTimer);
      clearInterval(resetTimer);
    };
  }, [navigate]);

  // Welcome message animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1,
        delay: 5, // Delay after hello animation
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };

  // Styles for the hello animation
  const helloStyles = `
    .hello-svg {
      fill: none;
      stroke: #fff;
      stroke-linecap: round;
      stroke-miterlimit: 10;
      stroke-width: 40px;
      stroke-dasharray: 5800px;
      stroke-dashoffset: 5800px;
      animation: anim__hello linear 5s forwards;
      width: 85%;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    @keyframes anim__hello {
      0% {
        stroke-dashoffset: 5800;
      }
      25% {
        stroke-dashoffset: 5800;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }
  `;

  return (
    <>
      <style>{helloStyles}</style>
      <AnimatePresence>
        {showWelcome && !resetAnimation && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex flex-col items-center justify-center bg-[#030303] z-50"
          >
            {/* Background gradient */}
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

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center justify-center p-4 w-full">
              <div ref={helloRef} className="flex mb-8 overflow-hidden items-center justify-center w-full">
                <svg className="hello-svg" viewBox="-70 -70 1370.94 554.57">
                  <path d="M-293.58-104.62S-103.61-205.49-60-366.25c9.13-32.45,9-58.31,0-74-10.72-18.82-49.69-33.21-75.55,31.94-27.82,70.11-52.22,377.24-44.11,322.48s34-176.24,99.89-183.19c37.66-4,49.55,23.58,52.83,47.92a117.06,117.06,0,0,1-3,45.32c-7.17,27.28-20.47,97.67,33.51,96.86,66.93-1,131.91-53.89,159.55-84.49,31.1-36.17,31.1-70.64,19.27-90.25-16.74-29.92-69.47-33-92.79,16.73C62.78-179.86,98.7-93.8,159-81.63S302.7-99.55,393.3-269.92c29.86-58.16,52.85-114.71,46.14-150.08-7.44-39.21-59.74-54.5-92.87-8.7-47,65-61.78,266.62-34.74,308.53S416.62-58,481.52-130.31s133.2-188.56,146.54-256.23c14-71.15-56.94-94.64-88.4-47.32C500.53-375,467.58-229.49,503.3-127a73.73,73.73,0,0,0,23.43,33.67c25.49,20.23,55.1,16,77.46,6.32a111.25,111.25,0,0,0,30.44-19.87c37.73-34.23,29-36.71,64.58-127.53C724-284.3,785-298.63,821-259.13a71,71,0,0,1,13.69,22.56c17.68,46,6.81,80-6.81,107.89-12,24.62-34.56,42.72-61.45,47.91-23.06,4.45-48.37-.35-66.48-24.27a78.88,78.88,0,0,1-12.66-25.8c-14.75-51,4.14-88.76,11-101.41,6.18-11.39,37.26-69.61,103.42-42.24,55.71,23.05,100.66-23.31,100.66-23.31" transform="translate(311.08 476.02)" />
                </svg>
              </div>

              {/* Welcome message with gradient text */}
              <motion.div
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                className="text-center px-4"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-3 text-white">
                  {isNewUser ? (
                    <>Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3399FF] via-white/90 to-[#0071E3] font-normal">Tamaya</span>, {userName}</>
                  ) : (
                    <>Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3399FF] via-white/90 to-[#0071E3] font-normal">{userName}</span></>
                  )}
                </h2>
                <p className="text-base sm:text-lg text-white/60 max-w-md mx-auto">
                  Your personal AI learning assistant is ready to help you learn today.
                </p>
              </motion.div>

              {/* Tamaya AI logo with blue gradient button styling */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 5.5, duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275] }}
                className="mt-12 px-8 py-2.5 rounded-full bg-gradient-to-r from-[#0071E3] to-[#3399FF] text-white font-medium hover:shadow-lg hover:shadow-[#0071E3]/20 transition-all duration-300"
              >
                <span className="text-white font-medium tracking-wide flex items-center">
                  TAMAYA AI <Sparkles className="ml-2 h-4 w-4" />
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Welcome; 