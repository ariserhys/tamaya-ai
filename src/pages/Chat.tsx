import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import SimpleChatUI from "@/components/SimpleChatUI";

const Chat = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [notesType, setNotesType] = useState<string | null>(null);

  // Clear any toast notifications that might be showing on initial load
  useEffect(() => {
    toast.dismiss();
  }, []);

  useEffect(() => {
    // Check if user has entered their name
    const userName = localStorage.getItem('tamaya_user_name');
    if (!userName) {
      navigate('/user-name');
      return;
    }
    
    // Check for query parameters in URL
    const urlPrompt = searchParams.get('prompt');
    const urlType = searchParams.get('type');
    
    // Check for pending question from localStorage
    const storedQuestion = localStorage.getItem('tamaya_pending_question');
    const storedType = localStorage.getItem('tamaya_redirect_type');
    
    if (urlPrompt) {
      console.log("Found URL prompt:", urlPrompt);
      setPendingQuestion(urlPrompt);
      if (urlType) {
        console.log("Setting notes type from URL:", urlType);
        setNotesType(urlType);
      }
    } else if (storedQuestion) {
      console.log("Found stored question:", storedQuestion);
      setPendingQuestion(storedQuestion);
      setNotesType(storedType);
      // Clear the stored questions so they don't keep triggering
      localStorage.removeItem('tamaya_pending_question');
      localStorage.removeItem('tamaya_redirect_type');
    }
    
    setLoading(false);
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin text-white border-t-2 border-blue-500 rounded-full" />
          <p className="text-white">Loading chat...</p>
        </div>
      </div>
    );
  }

  return <SimpleChatUI initialQuestion={pendingQuestion} initialType={notesType} />;
};

export default Chat; 