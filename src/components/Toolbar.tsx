import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const Toolbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error?.message?.includes('session_not_found')) {
        // If session is not found, just redirect to login
        navigate("/login");
        return;
      }
      if (error) {
        toast({
          title: "Error",
          description: "Failed to sign out. Please try again.",
          variant: "destructive",
        });
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error('Logout error:', error);
      navigate("/login");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-background border-b flex items-center justify-between px-4 z-50">
      <h1 className="text-xl font-bold">Class Diagram</h1>
      <Button variant="outline" onClick={handleLogout}>
        Sign Out
      </Button>
    </div>
  );
};