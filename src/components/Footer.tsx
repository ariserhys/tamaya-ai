import React from "react";
import { Heart, Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-8 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 rounded-full h-9 w-9 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-700" aria-hidden="true" />
            </div>
            <p className="text-gray-700 font-medium">
              <span className="tamaya-text">TAMAYA</span> <span className="text-gray-500 font-normal">AI Learning Assistant</span>
            </p>
          </div>
          
          <div>
            <p className="text-gray-600 flex items-center gap-2">
              Developed with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> by{" "}
              <span className="font-medium text-gray-700">Abhishek Yadav</span>
            </p>
          </div>
        </div>
        
        <div className="text-center border-t border-gray-100 pt-6">
          <p className="text-gray-500 text-xs">
            © {currentYear} <span className="tamaya-text">TAMAYA</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 