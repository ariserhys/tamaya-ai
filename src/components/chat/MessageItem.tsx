import React, { Suspense, lazy } from "react";
import { Bot, User, Download } from "lucide-react";
import { motion } from "framer-motion";

// Lazy load AnswerDisplay component
const AnswerDisplay = lazy(() => import("../AnswerDisplay"));

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  shouldShowDownload?: boolean;
}

interface MessageItemProps {
  message: Message;
  onDownload?: () => void;
}

/**
 * Component for displaying a single message in the chat interface
 */
const MessageItem: React.FC<MessageItemProps> = ({ message, onDownload }) => {
  const isUser = message.role === "user";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 500 
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: 0.1,
        type: "spring", 
        damping: 25, 
        stiffness: 300 
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`py-4 my-2 ${
        isUser
          ? "ml-4 md:ml-12 mr-2 text-primary-700 dark:text-primary-300"
          : "mr-4 md:mr-12 ml-2 text-gray-800 dark:text-gray-100"
      }`}
    >
      <div className="flex items-start gap-3">
        <motion.div 
          variants={iconVariants}
          className="flex-shrink-0"
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser
                ? "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                : "bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-300"
            }`}
          >
            {isUser ? (
              <User size={16} />
            ) : (
              <Bot size={16} />
            )}
          </div>
        </motion.div>
        <div className="flex-1 min-w-0">
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
          ) : (
            <Suspense fallback={
              <div className="flex items-center space-x-2 p-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-500"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Loading answer...</span>
              </div>
            }>
              <AnswerDisplay 
                answer={message.content}
                showDownloadButton={message.shouldShowDownload}
              />
            </Suspense>
          )}
        </div>
        
        {message.shouldShowDownload && !isUser && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDownload}
            className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
            title="Download as PDF"
          >
            <Download size={18} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default MessageItem; 