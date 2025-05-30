import { HeroGeometric } from "@/components/ui/component";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  
  const handleTryClick = () => {
    // Check if user has a saved name
    const userName = localStorage.getItem('tamaya_user_name');
    
    // Redirect to appropriate page
    if (userName) {
      navigate('/welcome');
    } else {
      navigate('/user-name');
    }
  };

  // Add overflow hidden to body when component mounts to prevent scrollbar issues on mobile
  useEffect(() => {
    document.body.classList.add('mobile-container');
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('mobile-container');
    };
  }, []);

  return (
    <main className="min-h-screen">
    <HeroGeometric
      badge="Tamaya AI"
      title1="Elevate Your"
      title2="Learning Experience"
      onTryClick={handleTryClick}
      developerUrl="https://thedevabhishekyadav.vercel.app/"
    />
    </main>
  );
};

export default Index;
