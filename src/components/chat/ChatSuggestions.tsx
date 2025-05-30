import React from "react";
import { Sparkles } from "lucide-react";

interface SuggestionProps {
  text: string;
  onClick: (text: string) => void;
}

export interface ChatSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (text: string) => void;
}

const Suggestion: React.FC<SuggestionProps> = ({ text, onClick }) => {
  return (
    <button
      className="flex items-center p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 
                 text-left text-sm text-gray-700 shadow-sm border border-purple-100 
                 hover:shadow-md hover:border-purple-200 transition-all mb-2 w-full"
      onClick={() => onClick(text)}
    >
      <Sparkles
        size={16}
        className="text-purple-400 mr-2 flex-shrink-0"
      />
      <span className="line-clamp-2">{text}</span>
    </button>
  );
};

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
}) => {
  return (
    <div className="mt-2 mb-4 grid gap-3 sm:grid-cols-1 md:grid-cols-2">
      {suggestions.map((suggestion, index) => (
        <Suggestion
          key={index}
          text={suggestion}
          onClick={onSuggestionClick}
        />
      ))}
    </div>
  );
};

export default ChatSuggestions; 