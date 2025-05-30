import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, Trash2, LogOut, X, History } from "lucide-react";
import { Message } from "./MessageItem";
import { motion, AnimatePresence } from "framer-motion";

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

interface ChatSidebarProps {
  chatHistory: ChatHistory[];
  currentChatId: string;
  pendingDeleteChatId: string | null;
  onNewChat: () => void;
  onSwitchChat: (chatId: string) => void;
  onDeleteChat: (chatId: string, event: React.MouseEvent) => void;
  onConfirmDelete: (chatId: string) => void;
  onCancelDelete: () => void;
  onSignOut: () => void;
  onCloseSidebar: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatHistory,
  currentChatId,
  pendingDeleteChatId,
  onNewChat,
  onSwitchChat,
  onDeleteChat,
  onConfirmDelete,
  onCancelDelete,
  onSignOut,
  onCloseSidebar,
}) => {
  // Animation variants
  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    },
    exit: { 
      x: "-100%", 
      opacity: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={sidebarVariants}
    >
      {/* Backdrop when sidebar is open */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm md:bg-black/10" onClick={onCloseSidebar} />
      
      <motion.div 
        className="relative w-[280px] max-w-[80vw] h-full bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Chat History</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCloseSidebar}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </motion.button>
        </div>

        <div className="p-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onNewChat}
              className="w-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/60 transition-colors"
            >
              <PlusCircle size={16} className="mr-2" />
              New Chat
            </Button>
          </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <AnimatePresence initial={false}>
            {chatHistory.length === 0 ? (
              <motion.p 
                variants={itemVariants}
                className="text-sm text-gray-500 dark:text-gray-400 text-center my-10"
              >
                No chat history yet
              </motion.p>
            ) : (
              <div className="space-y-1">
                {chatHistory.map((chat) => (
                  <motion.div
                    key={chat.id}
                    variants={itemVariants}
                    layoutId={`chat-${chat.id}`}
                    className={`relative group p-2 rounded-lg flex justify-between items-center cursor-pointer transition-all duration-200 border ${
                      chat.id === currentChatId
                        ? "bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-900 text-primary-800 dark:text-primary-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800/60 border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    }`}
                    onClick={() => chat.id !== currentChatId && onSwitchChat(chat.id)}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <MessageSquare size={16} className={`flex-shrink-0 mr-2 ${
                        chat.id === currentChatId
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`} />
                      <span className="truncate text-sm font-medium">{chat.title}</span>
                    </div>
                    
                    {/* Delete button/confirmation */}
                    {pendingDeleteChatId === chat.id ? (
                      <div className="flex items-center space-x-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onConfirmDelete(chat.id);
                          }}
                          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 rounded-md"
                        >
                          Yes
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onCancelDelete();
                          }}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-md"
                        >
                          No
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => onDeleteChat(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onSignOut}
              variant="outline"
              className="w-full text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatSidebar; 