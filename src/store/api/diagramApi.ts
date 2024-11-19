import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const fetchDiagrams = async () => {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session) {
    throw new Error('No active session');
  }

  // Check if token is about to expire (within 5 minutes)
  const expiresAt = session.session.expires_at ? session.session.expires_at * 1000 : 0;
  const fiveMinutes = 5 * 60 * 1000;
  
  if (Date.now() + fiveMinutes >= expiresAt) {
    const { data: { session: refreshedSession }, error: refreshError } = 
      await supabase.auth.refreshSession();
    if (refreshError || !refreshedSession) {
      await supabase.auth.signOut();
      throw new Error('Session refresh failed');
    }
  }

  const { data: diagrams, error: diagramsError } = await supabase
    .from('diagrams')
    .select('*')
    .order('created_at', { ascending: true });

  if (diagramsError) {
    throw diagramsError;
  }

  return diagrams;
};

export const fetchElementsForDiagram = async (diagramId: string) => {
  const { data: elements, error: elementsError } = await supabase
    .from('elements')
    .select('*')
    .eq('diagram_id', diagramId);

  if (elementsError) {
    throw elementsError;
  }

  return elements;
};

export const fetchRelationshipsForDiagram = async (diagramId: string) => {
  const { data: relationships, error: relationshipsError } = await supabase
    .from('relationships')
    .select('*')
    .eq('diagram_id', diagramId);

  if (relationshipsError) {
    throw relationshipsError;
  }

  return relationships;
};