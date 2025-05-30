import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { X, Download, Info, Zap, BookOpen, Lightbulb, Brain, Users, Server, ArrowRight, Shield, Eye, PenLine, Image } from 'lucide-react';
import { Concept } from '@/types/concept';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { OverlayContext } from '@/App';
import { generatePdfFromElement } from '@/utils/pdfGenerator';

// Direct, reliable image URLs by topic category
const TOPIC_IMAGES: Record<string, string[]> = {
  default: [
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1500989145603-8e7ef71d639e?ixlib=rb-4.0.3"
  ],
  technology: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1526374870839-e155464bb9b2?ixlib=rb-4.0.3"
  ],
  programming: [
    "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3"
  ],
  python: [
    "https://images.unsplash.com/photo-1526379879527-8559ecfcb0c8?ixlib=rb-4.0.3",
    "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3"
  ],
  javascript: [
    "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3",
    "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg",
    "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3"
  ],
  java: [
    "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg",
    "https://images.unsplash.com/photo-1588239034647-25783cbfcfc1?ixlib=rb-4.0.3",
    "https://images.pexels.com/photos/4709286/pexels-photo-4709286.jpeg"
  ],
  science: [
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3"
  ],
  history: [
    "https://images.unsplash.com/photo-1461360370896-8bfd4dc0c7c8?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1503058474900-cb76710f9cd1?ixlib=rb-4.0.3"
  ],
  art: [
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1503455637927-730bce8583c0?ixlib=rb-4.0.3"
  ],
  nature: [
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-4.0.3"
  ],
  animals: [
    "https://images.unsplash.com/photo-1551946581-f7a62cd2f00b?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1555169062-013468b47731?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3"
  ],
  dog: [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3"
  ],
  cat: [
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?ixlib=rb-4.0.3"
  ],
  food: [
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3"
  ],
  travel: [
    "https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?ixlib=rb-4.0.3"
  ],
  sports: [
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?ixlib=rb-4.0.3"
  ],
  health: [
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3"
  ],
  education: [
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3"
  ],
  business: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3"
  ]
};

// Topic mapping keywords to match search terms to image categories
const TOPIC_KEYWORDS: Record<string, string[]> = {
  technology: ["computer", "software", "hardware", "code", "digital", "innovation", "device", "electronic", "tech", "ai", "artificial intelligence"],
  programming: ["programming", "code", "software", "development", "developer", "coding"],
  python: ["python", "django", "flask", "pandas", "numpy"],
  javascript: ["javascript", "js", "typescript", "es6", "node", "frontend", "web development"],
  java: ["java", "spring", "jvm", "kotlin", "android development"],
  science: ["research", "experiment", "theory", "discovery", "laboratory", "chemistry", "physics", "biology", "scientist", "hypothesis", "science"],
  history: ["ancient", "century", "era", "past", "historical", "civilization", "archaeology", "heritage", "tradition", "timeline", "history"],
  art: ["painting", "drawing", "sculpture", "creative", "artist", "gallery", "museum", "exhibition", "contemporary", "design", "art"],
  nature: ["forest", "mountain", "river", "lake", "ocean", "tree", "flower", "garden", "landscape", "environment", "wildlife", "nature"],
  animals: ["animal", "wildlife", "species", "mammal", "bird", "fish", "insect", "reptile", "habitat", "ecosystem"],
  dog: ["dog", "puppy", "canine", "pet", "breed"],
  cat: ["cat", "kitten", "feline", "pet"],
  food: ["eat", "cook", "recipe", "meal", "restaurant", "ingredient", "dish", "cuisine", "nutrition", "diet", "food"],
  travel: ["journey", "tourism", "vacation", "destination", "tour", "hotel", "trip", "adventure", "explore", "tourist", "travel"],
  sports: ["game", "competition", "athlete", "team", "exercise", "tournament", "player", "fitness", "championship", "olympic", "sport"],
  health: ["medical", "medicine", "disease", "doctor", "patient", "healthy", "fitness", "wellness", "therapy", "treatment", "health"],
  education: ["learning", "student", "teacher", "school", "university", "knowledge", "study", "academic", "research", "classroom", "education"],
  business: ["company", "finance", "economy", "market", "investment", "entrepreneur", "corporate", "startup", "management", "strategy", "business"]
};

interface NotesInterfaceProps {
  question: string;
  answer: string;
  concepts: Concept[];
  onClose?: () => void;
  onNewChat?: () => void;
}

const NotesInterface: React.FC<NotesInterfaceProps> = ({ question, answer, concepts, onClose, onNewChat }) => {
  const { setOverlayOpen } = useContext(OverlayContext);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  
  useEffect(() => { setOverlayOpen(true); return () => setOverlayOpen(false); }, [setOverlayOpen]);
  const notesRef = useRef<HTMLDivElement>(null);
  
  // Set a timeout to stop loading if image takes too long to load
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isImageLoading) {
      timer = setTimeout(() => {
        setIsImageLoading(false);
      }, 5000); // 5 second timeout
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isImageLoading]);
  
  // Function to extract the main topic from the question
  const extractMainTopic = useCallback((questionText: string): string => {
    // Common prefixes in questions to remove
    const prefixes = [
      "what is ", "what are ", "explain ", "how does ", "how do ", "how to ", 
      "tell me about ", "describe ", "can you explain ", "can you tell me about ",
      "what's ", "whats ", "who is ", "who are ", "where is ", "where are ", 
      "when is ", "when are ", "why is ", "why are ", "which is ", "which are "
    ];
    
    // Make question lowercase for easier processing
    let processedQuestion = questionText.toLowerCase();
    
    // Remove question marks and other punctuation
    processedQuestion = processedQuestion.replace(/[?!.,;:]/g, '');
    
    // Try to remove prefixes to get to the main topic
    for (const prefix of prefixes) {
      if (processedQuestion.startsWith(prefix)) {
        processedQuestion = processedQuestion.substring(prefix.length);
        break;
      }
    }
    
    // Remove common suffixes
    const suffixes = [" mean", " work", " function", " used for", " used to", " for", " to"];
    for (const suffix of suffixes) {
      if (processedQuestion.endsWith(suffix)) {
        processedQuestion = processedQuestion.substring(0, processedQuestion.length - suffix.length);
        break;
      }
    }
    
    // Handle special cases
    if (processedQuestion.includes("vs")) {
      // For comparison questions, take the first term
      processedQuestion = processedQuestion.split("vs")[0].trim();
    }
    
    // Get only the main topic (usually first 2-3 words)
    const words = processedQuestion.split(" ");
    if (words.length > 3) {
      // If there are more than 3 words, only take the first 2-3 meaningful words
      const meaningfulWords = words.filter(word => word.length > 2 && !["the", "and", "or", "is", "are", "was", "were", "a", "an"].includes(word));
      processedQuestion = meaningfulWords.slice(0, 2).join(" ");
    }
    
    return processedQuestion.trim();
  }, []);
  
  // Find the best topic match for a search term
  const findBestImageCategory = useCallback((term: string): string => {
    const lowerTerm = term.toLowerCase();
    
    // First try exact matches with our topic keys
    if (TOPIC_IMAGES[lowerTerm]) {
      return lowerTerm;
    }
    
    // Then try keyword matching
    for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerTerm.includes(keyword) || keyword.includes(lowerTerm)) {
          return topic;
        }
      }
    }
    
    // Default fallback
    return "default";
  }, []);
  
  // Get a random image URL from the appropriate category
  const getTopicImage = useCallback((term: string): string => {
    const category = findBestImageCategory(term);
    const images = TOPIC_IMAGES[category] || TOPIC_IMAGES.default;
    return images[Math.floor(Math.random() * images.length)];
  }, [findBestImageCategory]);
  
  // Get relevant image when question changes
  useEffect(() => {
    if (question) {
      const mainTopic = extractMainTopic(question);
      setSearchTerm(mainTopic);
      
      if (mainTopic) {
        setIsImageLoading(true);
        setImageUrl(getTopicImage(mainTopic));
      }
    }
  }, [question, getTopicImage, extractMainTopic]);
  
  const handleDownload = async () => {
    if (!notesRef.current) return;
    setIsPdfLoading(true);
    try {
      const safeFilename = `${question.substring(0, 50).replace(/[^a-zA-Z0-9\s\-_]/g, '')}_notes.pdf`;
      await generatePdfFromElement(notesRef.current, { 
        filename: safeFilename,
        title: question,
        imageQuality: 0.95,
        scale: 2
      });
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="min-h-[80vh] max-h-[95vh] sm:max-h-[90vh] w-full max-w-5xl flex flex-col md:flex-row mx-auto my-2 sm:my-4 md:my-8 relative rounded-xl sm:rounded-2xl bg-[#0a0a0a] text-white overflow-hidden shadow-2xl border border-white/10">
        {/* Header / Image Area */}
        <div 
          className={`w-full md:w-1/3 relative overflow-hidden h-36 sm:h-48 md:h-auto flex-shrink-0 bg-gradient-to-br from-indigo-900/30 to-violet-900/30`}
        >
          {imageUrl && (
            <img 
              src={`${imageUrl}?auto=format&w=600&q=75`}
              alt={question}
              className="object-cover w-full h-full opacity-40 absolute inset-0 z-0"
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80 z-10"></div>
          
          <div className="relative z-20 p-4 sm:p-6 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white/90 mb-1 sm:mb-2 tracking-tight">
                <PenLine className="inline-block h-4 w-4 sm:h-5 sm:w-5 mr-2 text-indigo-400" aria-hidden="true" />
                Study Notes
              </h2>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white/80 leading-tight line-clamp-2 sm:line-clamp-3">
                {question}
              </h3>
            </div>
            
            <div className="mt-auto">
              {isImageLoading ? (
                <div className="bg-white/10 animate-pulse h-5 w-20 rounded-md"></div>
              ) : (
                <div className="flex items-center gap-1 text-xs sm:text-sm text-white/50">
                  <Image className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  {searchTerm ? `Topic: ${searchTerm}` : "Image related to topic"}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col max-h-[calc(95vh-9rem)] sm:max-h-[calc(90vh-12rem)] md:max-h-[90vh] overflow-hidden">
          <div className="sticky top-0 z-30 flex items-center justify-between gap-2 p-3 sm:p-4 border-b border-white/10 backdrop-blur-sm bg-black/30">
            {/* Left section: Controls */}
            <div className="flex items-center gap-2">
              {onNewChat && (
                <button
                  onClick={onNewChat}
                  className="rounded-full flex items-center justify-center h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 transition-colors active:bg-white/20 touch-manipulation"
                  aria-label="New Chat"
                >
                  <PenLine className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
            
            {/* Right section: Download & Close */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={handleDownload}
                disabled={isPdfLoading}
                className="rounded-full flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm text-white/70 hover:text-white hover:bg-white/10 active:bg-white/20 border border-white/10 transition-colors touch-manipulation"
                aria-label="Download as PDF"
              >
                {isPdfLoading ? (
                  <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-white/70 animate-spin"></div>
                ) : (
                  <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                )}
                <span className="sm:inline-block sm:ml-1">PDF</span>
              </button>
              
              {onClose && (
                <button
                  onClick={onClose}
                  className="rounded-full flex items-center justify-center h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6">
            <div 
              ref={notesRef}
              className="prose prose-invert max-w-none w-full prose-sm sm:prose prose-headings:text-indigo-400 prose-a:text-indigo-400 prose-strong:text-white/90 prose-code:text-violet-300 prose-pre:bg-black/50 prose-pre:text-xs sm:prose-pre:text-sm prose-pre:border prose-pre:border-white/10 prose-headings:leading-tight prose-p:text-white/80 prose-p:leading-relaxed prose-li:text-white/80 prose-li:leading-relaxed prose-headings:font-medium prose-h2:mt-6 prose-h3:mt-5"
            >
              <MarkdownRenderer content={answer} className="in-notes" />
            </div>
          </div>
          
          {/* Key Concepts Section */}
          {concepts && concepts.length > 0 && (
            <div className="border-t border-white/10 p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-medium text-white/70 mb-1.5 sm:mb-2 flex items-center gap-1">
                <Lightbulb className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400" aria-hidden="true" />
                <span>Key Concepts</span>
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {concepts.map((concept, index) => (
                  <div 
                    key={index}
                    className="text-[10px] sm:text-xs text-white/80 bg-white/5 hover:bg-white/10 active:bg-white/15 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-white/10 transition-colors touch-manipulation"
                  >
                    {concept.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesInterface; 