import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, BookOpen, BrainCircuit, FileText, AlignLeft, LayoutGrid } from "lucide-react";
import { useTextareaAutosize } from "@/hooks/useTextareaAutosize";
import { motion, AnimatePresence } from "framer-motion";

export type ResponseType = "recommended" | "quiz" | "detailed";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  responseType: ResponseType;
  onResponseTypeSelect: (type: ResponseType) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  canGeneratePdf?: boolean;
  onGeneratePdf?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  onSend,
  isLoading,
  responseType,
  onResponseTypeSelect,
  onKeyDown,
  canGeneratePdf,
  onGeneratePdf,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showOptions, setShowOptions] = useState(false);
  
  // Apply the autoresize hook to the textarea
  useTextareaAutosize(textareaRef, inputValue.length);
  
  // Focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Define animation variants
  const optionsVariants = {
    hidden: { opacity: 0, y: 20, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: 10, 
      height: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const typeOptionVariants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.95, y: 0 }
  };

  const getTypeButtonStyles = (type: ResponseType) => {
    const baseClasses = "rounded-full px-3 py-1.5 text-xs transition-all duration-200 flex items-center gap-1.5 font-medium";
    
    switch(type) {
      case "recommended":
        return `${baseClasses} ${
          responseType === "recommended"
            ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 shadow-sm shadow-primary-200/50 dark:shadow-primary-900/20"
            : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`;
      case "quiz":
        return `${baseClasses} ${
          responseType === "quiz"
            ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 shadow-sm shadow-green-200/50 dark:shadow-green-900/20"
            : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`;
      case "detailed":
        return `${baseClasses} ${
          responseType === "detailed"
            ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 shadow-sm shadow-purple-200/50 dark:shadow-purple-900/20"
            : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-3 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 z-10 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
      <AnimatePresence>
        {showOptions && (
          <motion.div 
            variants={optionsVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mb-2 overflow-hidden"
          >
            <div className="flex justify-center px-2 py-1">
              <div className="inline-flex p-1 rounded-full bg-gray-100/90 dark:bg-gray-800/90 shadow-sm items-center gap-1 flex-wrap justify-center">
                <motion.button
                  variants={typeOptionVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className={getTypeButtonStyles("recommended")}
                  onClick={() => onResponseTypeSelect("recommended")}
                >
                  <LayoutGrid size={14} />
                  Recommended
                </motion.button>
                
                <motion.button
                  variants={typeOptionVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className={getTypeButtonStyles("quiz")}
                  onClick={() => onResponseTypeSelect("quiz")}
                >
                  <BookOpen size={14} />
                  Quiz
                </motion.button>
                
                <motion.button
                  variants={typeOptionVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className={getTypeButtonStyles("detailed")}
                  onClick={() => onResponseTypeSelect("detailed")}
                >
                  <FileText size={14} />
                  Detailed Notes
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex space-x-2 items-end">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setShowOptions(true)}
            onClick={() => setShowOptions(true)}
            placeholder="Ask Tamaya anything about your studies..."
            className="min-h-[60px] max-h-[200px] resize-none border border-gray-200 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-500 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 pr-12 shadow-sm"
            disabled={isLoading}
          />
          <div className="absolute right-3 bottom-3 flex items-center">
            <motion.button
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowOptions(!showOptions)}
              className={`text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400 p-1 rounded-full ${showOptions ? 'bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400' : ''}`}
              title="Response options"
            >
              <BrainCircuit size={18} />
            </motion.button>
          </div>
        </div>
        <motion.button
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          onClick={onSend}
          disabled={!inputValue.trim() || isLoading}
          className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white rounded-xl h-[60px] min-w-[60px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-primary-200 dark:shadow-primary-900/30"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default ChatInput; 