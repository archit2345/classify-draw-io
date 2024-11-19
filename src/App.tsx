import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Index from "./pages/Index";
import Login from "./pages/Login";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          await supabase.auth.signOut().catch(() => {
            // Ignore signOut errors as we're already handling the session issue
          });
          setIsAuthenticated(false);
          return;
        }
        
        // Check if token is about to expire (within 5 minutes)
        const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
        const fiveMinutes = 5 * 60 * 1000;
        if (Date.now() + fiveMinutes >= expiresAt) {
          const { data: { session: refreshedSession }, error: refreshError } = 
            await supabase.auth.refreshSession();
          if (refreshError || !refreshedSession) {
            await supabase.auth.signOut();
            setIsAuthenticated(false);
            return;
          }
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth error:", error);
        setIsAuthenticated(false);
        toast({
          title: "Session Expired",
          description: "Please sign in again.",
          variant: "destructive",
        });
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        setIsAuthenticated(false);
      } else if (session) {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  if (isAuthenticated === null) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;