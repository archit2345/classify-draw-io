import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/database.types";
import { toast } from "sonner";

const handleSessionError = async (error: any) => {
  console.error('Session error:', error);
  await supabase.auth.signOut();
  window.location.href = '/login';
  throw new Error('Authentication failed');
};

const ensureValidSession = async () => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    await handleSessionError(sessionError || new Error('No active session'));
    return;
  }

  if (session.expires_at) {
    const expiresAt = session.expires_at * 1000;
    const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;

    if (expiresAt < fiveMinutesFromNow) {
      const { data: { session: newSession }, error: refreshError } = 
        await supabase.auth.refreshSession();
      
      if (refreshError || !newSession) {
        await handleSessionError(refreshError || new Error('Session refresh failed'));
        return;
      }
    }
  }
};

export const fetchDiagrams = async () => {
  try {
    await ensureValidSession();
    
    const { data, error } = await supabase
      .from('diagrams')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      if (error.code === '401') {
        await handleSessionError(error);
      }
      toast.error('Failed to fetch diagrams');
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching diagrams:', error);
    throw error;
  }
};

export const fetchElementsForDiagram = async (diagramId: string) => {
  try {
    await ensureValidSession();

    const { data, error } = await supabase
      .from('elements')
      .select('*')
      .eq('diagram_id', diagramId);

    if (error) {
      if (error.code === '401') {
        await handleSessionError(error);
      }
      toast.error('Failed to fetch elements');
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching elements:', error);
    throw error;
  }
};

export const fetchRelationshipsForDiagram = async (diagramId: string) => {
  try {
    await ensureValidSession();

    const { data, error } = await supabase
      .from('relationships')
      .select('*')
      .eq('diagram_id', diagramId);

    if (error) {
      if (error.code === '401') {
        await handleSessionError(error);
      }
      toast.error('Failed to fetch relationships');
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching relationships:', error);
    throw error;
  }
};