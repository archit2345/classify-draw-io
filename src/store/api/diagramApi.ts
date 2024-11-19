import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/database.types";
import { toast } from "sonner";

const refreshSessionIfNeeded = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No active session');
  }

  const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
  const fiveMinutes = 5 * 60 * 1000;
  
  if (Date.now() + fiveMinutes >= expiresAt) {
    const { data: { session: refreshedSession }, error: refreshError } = 
      await supabase.auth.refreshSession();
    if (refreshError || !refreshedSession) {
      await supabase.auth.signOut();
      throw new Error('Session refresh failed');
    }
  }
};

export const fetchDiagrams = async () => {
  await refreshSessionIfNeeded();

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
  await refreshSessionIfNeeded();

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
  await refreshSessionIfNeeded();

  const { data: relationships, error: relationshipsError } = await supabase
    .from('relationships')
    .select('*')
    .eq('diagram_id', diagramId);

  if (relationshipsError) {
    throw relationshipsError;
  }

  return relationships;
};