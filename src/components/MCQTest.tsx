import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight, HelpCircle, RefreshCw, Trophy, BrainCircuit, X, PenLine, XCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OverlayContext } from '@/App';

export interface MCQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface MCQTestProps {
  questions: MCQuestion[];
  onComplete?: (score: number, total: number) => void;
  onClose?: () => void;
  onNewChat?: () => void;
  className?: string;
}

/**
 * Tamaya's exam-focused multiple choice question test component
 * Optimized for quick knowledge assessment before exams
 * Enhanced for accessibility and better user experience
 */
export const MCQTest: React.FC<MCQTestProps> = ({
  questions,
  onComplete,
  onClose,
  onNewChat,
  className
}) => {
  const { setOverlayOpen } = useContext(OverlayContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>(Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [isInitialQuestion, setIsInitialQuestion] = useState(true);
  
  // Limit to exactly 10 questions
  const filteredQuestions = questions.slice(0, Math.min(questions.length, 10));
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  
  // Focus management for accessibility - only after navigating between questions
  useEffect(() => {
    // Don't focus anything on initial render
    if (isInitialQuestion) {
      setIsInitialQuestion(false);
      return;
    }
    
    // Only focus when navigating between questions
    if (!isTransitioning && optionsRef.current[0]) {
      setTimeout(() => {
        optionsRef.current[0]?.focus();
      }, 100);
    }
  }, [currentQuestionIndex, isTransitioning, isInitialQuestion]);

  // Reset refs array when options change - restore this important effect
  useEffect(() => {
    optionsRef.current = optionsRef.current.slice(0, currentQuestion?.options.length);
  }, [currentQuestion]);

  useEffect(() => { setOverlayOpen(true); return () => setOverlayOpen(false); }, [setOverlayOpen]);

  const calculateScore = useCallback(() => {
    return selectedOptions.reduce((acc, selected, index) => {
      // Only count questions that exist in our filtered list
      if (index < filteredQuestions.length) {
        return acc + (selected === filteredQuestions[index].correctAnswer ? 1 : 0);
      }
      return acc;
    }, 0);
  }, [selectedOptions, filteredQuestions]);

  const completeTest = useCallback(() => {
    setShowResults(true);
    
    // Calculate score
    const score = calculateScore();
    
    if (onComplete) {
      onComplete(score, filteredQuestions.length);
    }
  }, [calculateScore, onComplete, filteredQuestions.length, setShowResults]);

  // Optional timer functionality
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      completeTest();
    }
  }, [timeRemaining, completeTest]);

  const handleOptionSelect = (optionIndex: number) => {
    // If user has already selected an option for this question, don't allow changing it
    if (selectedOptions[currentQuestionIndex] !== -1) {
      return;
    }
    
    const newSelections = [...selectedOptions];
    newSelections[currentQuestionIndex] = optionIndex;
    setSelectedOptions(newSelections);
    
    // Automatic advance to next question after a short delay if not on last question
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setTimeout(() => {
        goToNextQuestion();
      }, 800); // Delay to show selection before advancing
    }
  };

  const goToNextQuestion = () => {
    if (isTransitioning) return;
    
    // Prevent moving forward if no option is selected
    if (selectedOptions[currentQuestionIndex] === -1) return;
    
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setDirection('next');
      setIsTransitioning(true);
      setShowExplanation(false);
      
      setTimeout(() => {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      completeTest();
    }
  };

  const goToPreviousQuestion = () => {
    if (isTransitioning) return;
    
    if (currentQuestionIndex > 0) {
      setDirection('prev');
      setIsTransitioning(true);
      setShowExplanation(false);
      
      setTimeout(() => {
        setCurrentQuestionIndex(prevIndex => prevIndex - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptions(Array(filteredQuestions.length).fill(-1));
    setShowResults(false);
    setShowExplanation(false);
    setTimeRemaining(null);
  };

  const startTimedQuiz = (minutes: number) => {
    setTimeRemaining(minutes * 60);
    resetTest();
  };

  // Handle keyboard navigation in the quiz
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // If an option is already selected, only allow navigation between questions
    if (selectedOptions[currentQuestionIndex] !== -1 && 
        (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      return;
    }
    
    let nextIndex, prevIndex;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = Math.min(index + 1, currentQuestion.options.length - 1);
        optionsRef.current[nextIndex]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        prevIndex = Math.max(index - 1, 0);
        optionsRef.current[prevIndex]?.focus();
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        handleOptionSelect(index);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (selectedOptions[currentQuestionIndex] !== -1) {
          goToNextQuestion();
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        goToPreviousQuestion();
        break;
    }
  };

  // Format seconds to MM:SS format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle empty questions array
  if (!questions || questions.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn("p-6 bg-[#0a0a0a] rounded-xl shadow-md border border-white/10 text-center relative max-w-lg w-full", className)}
      >
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
            <span className="sr-only">Close</span>
          </button>
        )}
        <div className="mb-4">
          <BrainCircuit className="h-12 w-12 mx-auto text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-2 text-white">No quiz questions available</h3>
        <p className="text-gray-400 mb-4">
          We couldn't generate quiz questions for this topic. This might be due to an unexpected response format.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Button 
            onClick={() => onComplete && onComplete(0, 0)} 
            className="gap-2 transition-all hover:scale-105 bg-gradient-to-r from-[#0071E3] to-[#0077ED] hover:shadow-lg hover:shadow-[#0071E3]/20 text-white border-none"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span>Try again</span>
          </Button>
          
          {onClose && (
            <Button 
              onClick={onClose}
              variant="outline" 
              className="gap-2 transition-all bg-transparent text-white/80 border border-white/20 hover:bg-white/10 hover:text-white"
            >
              <span>Cancel</span>
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / filteredQuestions.length) * 100);
    
    let message = "";
    if (percentage >= 80) {
      message = "Excellent! You're well-prepared for your exam.";
    } else if (percentage >= 60) {
      message = "Good job! Review the concepts you missed before your exam.";
    } else {
      message = "More review needed. Focus on the explanations for the questions you missed.";
    }
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn("bg-[#0a0a0a] p-8 sm:p-12 rounded-3xl shadow-lg border-0 relative w-full max-w-4xl h-full max-h-full flex flex-col", className)}
        role="region"
        aria-label="Quiz results"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          border: 'none',
          overflow: 'hidden auto'
        }}
      >
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
            <span className="sr-only">Close</span>
          </button>
        )}
        <div className="flex-1 overflow-y-auto w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2 bg-white/5 rounded-full mb-4">
            <Trophy className="h-10 w-10 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h2>
          <div className="text-lg text-white/80">
            Your Score: <span className="font-bold">{score}/{filteredQuestions.length}</span>
          </div>
          
          <div className="w-full max-w-xs mx-auto mt-4 bg-white/5 rounded-full h-4 overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                percentage >= 80 ? "bg-emerald-500" : 
                percentage >= 60 ? "bg-amber-500" : 
                "bg-rose-500"
              )}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-white/60">{percentage}%</div>
        </div>
        
        <p className="text-center text-white/80 mb-6">
          {message}
        </p>
        
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-white/90 border-b border-white/10 pb-2">Question Summary</h3>
          
          {filteredQuestions.map((q, idx) => {
            const selected = selectedOptions[idx];
            const isCorrect = selected === q.correctAnswer;
            
            return (
              <div key={q.id} className="text-white/80">
                <div className="flex gap-2 items-start mb-2">
                  <div className={cn(
                    "flex-shrink-0 mt-1 flex items-center justify-center rounded-full w-5 h-5 text-xs",
                    isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                  )}>
                    {isCorrect ? <Check size={12} /> : <X size={12} />}
                  </div>
                  <div className="font-medium text-white">
                    {idx + 1}. {q.question}
                  </div>
                </div>
                {!isCorrect && (
                  <div className="ml-7 text-sm">
                    {selected !== -1 ? (
                      <p className="text-rose-400">You selected: {q.options[selected]}</p>
                    ) : (
                      <p className="text-rose-400">No answer selected</p>
                    )}
                    <p className="text-emerald-400">Correct answer: {q.options[q.correctAnswer]}</p>
                    {q.explanation && (
                      <p className="mt-1 text-white/70 bg-white/5 p-2 rounded border border-white/10">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Button 
            onClick={resetTest}
            className="gap-2 transition-all bg-gradient-to-r from-[#0071E3] to-[#0077ED] hover:shadow-lg hover:shadow-[#0071E3]/20 text-white"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span>Retry Quiz</span>
          </Button>
          
          <Button 
            onClick={() => startTimedQuiz(5)}
            className="gap-2 transition-all bg-[#0071E3] hover:bg-[#0077ED] hover:shadow-lg hover:shadow-[#0071E3]/20 text-white"
          >
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>Timed Quiz (5 min)</span>
          </Button>
          
          {onNewChat && (
            <Button 
              onClick={onNewChat}
              variant="outline" 
              className="gap-2 transition-all bg-transparent text-white/80 border border-white/20 hover:bg-white/10 hover:text-white"
            >
              <PenLine className="h-4 w-4" aria-hidden="true" />
              <span>New Topic</span>
            </Button>
          )}
          
          {onClose && (
            <Button 
              onClick={onClose}
              variant="outline" 
              className="gap-2 transition-all bg-transparent text-white/80 border border-white/20 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span>Close</span>
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  // Main quiz interface
  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] rounded-3xl overflow-hidden relative text-white p-1 quiz-modal-content">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
        <div 
          className="h-full bg-gradient-to-r from-[#0071E3] to-[#0077ED]"
          style={{ width: `${((currentQuestionIndex) / filteredQuestions.length) * 100}%` }}
        ></div>
      </div>
      
      {/* Header section */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-[#0071E3]" />
          <span className="font-semibold text-white">Knowledge Check</span>
        </div>
        <div className="flex items-center gap-3">
          {timeRemaining !== null && (
            <div className="text-sm bg-white/10 px-2 py-1 rounded-md flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-white/70" />
              <span className={cn(
                "font-mono",
                timeRemaining < 60 ? "text-rose-400" : timeRemaining < 180 ? "text-amber-400" : "text-white/80"
              )}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
          <div className="text-sm text-white/60">
            {currentQuestionIndex + 1} / {filteredQuestions.length}
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="text-white/60 hover:text-white"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Question content */}
      <div className="flex-1 px-4 py-4 md:px-6 md:py-6 overflow-y-auto">
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: direction === 'next' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 'next' ? -20 : 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-white mb-4 md:mb-6 quiz-modal-question">
              {currentQuestion.question}
            </h2>
            
            <div className="space-y-2 sm:space-y-3 mb-6 md:mb-8">
              {currentQuestion.options.map((option, optionIndex) => {
                const isSelected = selectedOptions[currentQuestionIndex] === optionIndex;
                const isCorrect = currentQuestion.correctAnswer === optionIndex;
                
                return (
                  <button
                    key={optionIndex}
                    ref={el => optionsRef.current[optionIndex] = el}
                    onClick={() => handleOptionSelect(optionIndex)}
                    disabled={isTransitioning || selectedOptions[currentQuestionIndex] !== -1}
                    className={cn(
                      "w-full text-left p-3 sm:p-4 rounded-xl transition-all border flex items-start gap-3 text-sm sm:text-base touch-manipulation quiz-modal-option",
                      isSelected ? (
                        isCorrect 
                          ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                          : "bg-rose-500/10 border-rose-500/30 text-white"
                      ) : selectedOptions[currentQuestionIndex] !== -1 
                          ? "bg-white/5 border-white/10 text-white/40 cursor-not-allowed" 
                          : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20",
                      "active:scale-[0.99] active:bg-white/15",
                      // Clearer focus ring for accessibility
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]/50 focus-visible:ring-offset-1 focus-visible:ring-offset-black"
                    )}
                    onKeyDown={(e) => handleKeyDown(e, optionIndex)}
                    aria-checked={isSelected}
                    role="radio"
                  >
                    <div className={cn(
                      "flex-shrink-0 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 mt-0.5 rounded-full border transition-all",
                      isSelected 
                        ? (isCorrect 
                            ? "border-emerald-500 bg-emerald-500/20" 
                            : "border-rose-500 bg-rose-500/20")
                        : "border-white/30 bg-transparent"
                    )}>
                      {isSelected && (isCorrect 
                        ? <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400" /> 
                        : <X className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-rose-400" />
                      )}
                    </div>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Explanation section */}
            {selectedOptions[currentQuestionIndex] !== -1 && currentQuestion.explanation && (
              <div className={cn(
                "mt-2 transition-all overflow-hidden",
                showExplanation ? "max-h-96" : "max-h-0"
              )}>
                <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
                  <h3 className="text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-amber-400" />
                    Explanation
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Footer with navigation */}
      <div className="border-t border-white/10 p-3 sm:p-4 flex items-center justify-between quiz-modal-footer">
        <div className="flex items-center gap-3">
          {selectedOptions[currentQuestionIndex] !== -1 && currentQuestion.explanation && (
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs sm:text-sm text-white/60 hover:text-white flex items-center gap-1"
            >
              <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">{showExplanation ? "Hide" : "Show"} Explanation</span>
              <span className="xs:hidden">{showExplanation ? "Hide" : "Show"}</span>
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0 || isTransitioning}
            className={cn(
              "flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all touch-manipulation",
              currentQuestionIndex === 0 
                ? "text-white/30 cursor-not-allowed" 
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white active:bg-white/15"
            )}
            aria-label="Previous question"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          
          <button
            onClick={currentQuestionIndex === filteredQuestions.length - 1 ? completeTest : goToNextQuestion}
            disabled={selectedOptions[currentQuestionIndex] === -1 || isTransitioning}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all text-xs sm:text-sm font-medium touch-manipulation",
              selectedOptions[currentQuestionIndex] === -1
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "bg-gradient-to-r from-[#0071E3] to-[#0077ED] text-white hover:shadow-sm hover:shadow-[#0071E3]/20 active:scale-[0.98]"
            )}
          >
            <span>{currentQuestionIndex === filteredQuestions.length - 1 ? "Complete Quiz" : "Next"}</span>
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MCQTest; 