import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          await supabase.auth.signOut();
          return;
        }
        if (session) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        toast({
          title: "Authentication Error",
          description: "Please try signing in again.",
          variant: "destructive",
        });
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/");
      } else if (event === 'TOKEN_REFRESHED' && !session) {
        await supabase.auth.signOut();
        toast({
          title: "Session Expired",
          description: "Please sign in again.",
          variant: "destructive",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome to Class Diagram</h1>
          <p className="text-muted-foreground">Sign in or create an account to continue</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-100">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#8B5CF6',
                    brandAccent: '#7C3AED',
                    brandButtonText: 'white',
                    defaultButtonBackground: 'white',
                    defaultButtonBackgroundHover: '#F9FAFB',
                    inputBackground: 'white',
                    inputBorder: '#E5E7EB',
                    inputBorderHover: '#D1D5DB',
                    inputBorderFocus: '#8B5CF6',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'w-full px-4 py-2 rounded-lg font-medium transition-colors',
                input: 'w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow',
                label: 'block text-sm font-medium text-gray-700 mb-1',
              },
            }}
            theme="light"
            providers={[]}
            redirectTo={window.location.origin}
            localization={{
              variables: {
                sign_up: {
                  email_label: "Email",
                  password_label: "Create a Password",
                  button_label: "Sign Up",
                  loading_button_label: "Signing Up ...",
                  social_provider_text: "Sign in with {{provider}}",
                  link_text: "Don't have an account? Sign up"
                },
                sign_in: {
                  email_label: "Email",
                  password_label: "Your Password",
                  button_label: "Sign In",
                  loading_button_label: "Signing In ...",
                  social_provider_text: "Sign in with {{provider}}",
                  link_text: "Already have an account? Sign in"
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;