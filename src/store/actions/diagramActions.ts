import { supabase } from "@/integrations/supabase/client";
import { DiagramState } from "../types/diagramStoreTypes";
import { fetchDiagrams, fetchElementsForDiagram, fetchRelationshipsForDiagram } from "../api/diagramApi";
import { toast } from "sonner";

export const createDiagramActions = (set: any, get: () => DiagramState) => ({
  setActiveDiagram: (id: string) => set({ activeDiagramId: id }),

  loadUserDiagrams: async () => {
    try {
      const diagrams = await fetchDiagrams();
      const diagramsWithData = await Promise.all(
        diagrams.map(async (diagram) => {
          const elements = await fetchElementsForDiagram(diagram.id);
          const relationships = await fetchRelationshipsForDiagram(diagram.id);
          return {
            ...diagram,
            elements: elements || [],
            relationships: relationships || [],
          };
        })
      );

      set({ diagrams: diagramsWithData });
      if (diagramsWithData.length > 0 && !get().activeDiagramId) {
        set({ activeDiagramId: diagramsWithData[0].id });
      }
    } catch (error: any) {
      console.error('Error loading diagrams:', error);
      toast.error('Failed to load diagrams');
      if (error.message === 'Authentication failed') {
        window.location.href = '/login';
      }
    }
  },

  createDiagram: async (name: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: diagram, error } = await supabase
        .from('diagrams')
        .insert({ name, user_id: user.id })
        .select()
        .single();

      if (error) throw error;

      if (diagram) {
        set((state: DiagramState) => ({
          diagrams: [...state.diagrams, { ...diagram, elements: [], relationships: [] }],
          activeDiagramId: diagram.id,
        }));
      }
    } catch (error) {
      console.error('Error creating diagram:', error);
      toast.error('Failed to create diagram');
    }
  },
});