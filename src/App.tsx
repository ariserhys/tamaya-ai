import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState, createContext } from "react";
import { Loader2 } from "lucide-react";

// Create loading indicator component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-3 text-sm text-gray-600">Loading...</span>
  </div>
);

// Use lazy loading for page components
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Chat = lazy(() => import("./pages/Chat"));
const SimpleChatUI = lazy(() => import("./components/SimpleChatUI"));
const UserNameEntry = lazy(() => import("./pages/UserNameEntry"));
const Welcome = lazy(() => import("./pages/Welcome"));

const queryClient = new QueryClient();

export const OverlayContext = createContext<{ overlayOpen: boolean; setOverlayOpen: (v: boolean) => void }>({ overlayOpen: false, setOverlayOpen: () => {} });

const App = () => {
  const [overlayOpen, setOverlayOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <OverlayContext.Provider value={{ overlayOpen, setOverlayOpen }}>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/simple-chat" element={<SimpleChatUI />} />
              <Route path="/user-name" element={<UserNameEntry />} />
              <Route path="/welcome" element={<Welcome />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        </OverlayContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
