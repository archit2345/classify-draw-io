import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { DiagramState, DiagramActions } from "./types/diagramStoreTypes";
import { fetchDiagrams, fetchElementsForDiagram, fetchRelationshipsForDiagram } from "./api/diagramApi";
import { supabase } from "@/integrations/supabase/client";

export const useDiagramStore = create<DiagramState & DiagramActions>()(
  persist(
    (set, get) => ({
      diagrams: [],
      activeDiagramId: null,
      selectedElementId: null,
      selectedRelationshipId: null,
      connectionMode: null,
      tempSourceId: null,

      setActiveDiagram: (id) => set({ activeDiagramId: id }),

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
          if (error.message === 'No active session' || error.message === 'Session refresh failed') {
            await supabase.auth.signOut();
          }
          toast.error('Failed to load diagrams');
        }
      },

      createDiagram: async (name) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('No user found');

          const { data: diagram, error } = await supabase
            .from('diagrams')
            .insert({ name, user_id: user.id })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            diagrams: [...state.diagrams, { ...diagram, elements: [], relationships: [] }],
            activeDiagramId: diagram.id,
          }));
        } catch (error) {
          console.error('Error creating diagram:', error);
          toast.error('Failed to create diagram');
        }
      },

      addElement: async (element) => {
        const activeDiagramId = get().activeDiagramId;
        if (!activeDiagramId) return;

        try {
          const { data: newElement, error } = await supabase
            .from('elements')
            .insert({
              diagram_id: activeDiagramId,
              ...element,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            diagrams: state.diagrams.map(diagram =>
              diagram.id === activeDiagramId
                ? { ...diagram, elements: [...diagram.elements, newElement] }
                : diagram
            ),
          }));
        } catch (error) {
          console.error('Error adding element:', error);
          toast.error('Failed to add element');
        }
      },

      addRelationship: async (relationship) => {
        const activeDiagramId = get().activeDiagramId;
        if (!activeDiagramId) return;

        try {
          const { data: newRelationship, error } = await supabase
            .from('relationships')
            .insert({
              diagram_id: activeDiagramId,
              source_id: relationship.sourceId,
              target_id: relationship.targetId,
              type: relationship.type,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            diagrams: state.diagrams.map(diagram =>
              diagram.id === activeDiagramId
                ? { ...diagram, relationships: [...diagram.relationships, newRelationship] }
                : diagram
            ),
          }));
        } catch (error) {
          console.error('Error adding relationship:', error);
          toast.error('Failed to add relationship');
        }
      },

      updateElement: (id, updates) =>
        set((state) => {
          const updatedDiagrams = state.diagrams.map(diagram =>
            diagram.id === state.activeDiagramId
              ? {
                  ...diagram,
                  elements: diagram.elements.map(el =>
                    el.id === id ? { ...el, ...updates } : el
                  ),
                }
              : diagram
          );

          return { diagrams: updatedDiagrams };
        }),

      removeElement: (id) =>
        set((state) => {
          const updatedDiagrams = state.diagrams.map(diagram =>
            diagram.id === state.activeDiagramId
              ? {
                  ...diagram,
                  elements: diagram.elements.filter(el => el.id !== id),
                  relationships: diagram.relationships.filter(
                    rel => rel.sourceId !== id && rel.targetId !== id
                  ),
                }
              : diagram
          );

          return { diagrams: updatedDiagrams };
        }),

      removeRelationship: (id) =>
        set((state) => {
          const updatedDiagrams = state.diagrams.map(diagram =>
            diagram.id === state.activeDiagramId
              ? {
                  ...diagram,
                  relationships: diagram.relationships.filter(rel => rel.id !== id),
                }
              : diagram
          );

          return { diagrams: updatedDiagrams };
        }),

      setSelectedElement: (id) =>
        set({ selectedElementId: id, selectedRelationshipId: null }),

      setSelectedRelationship: (id) =>
        set({ selectedRelationshipId: id, selectedElementId: null }),

      setConnectionMode: (mode) =>
        set({ connectionMode: mode, tempSourceId: null }),

      setTempSourceId: (id) =>
        set({ tempSourceId: id }),

      resetConnections: (elementId) =>
        set((state) => {
          const updatedDiagrams = state.diagrams.map(diagram =>
            diagram.id === state.activeDiagramId
              ? {
                  ...diagram,
                  relationships: diagram.relationships.filter(
                    rel => rel.sourceId !== elementId && rel.targetId !== elementId
                  ),
                }
              : diagram
          );

          return { diagrams: updatedDiagrams };
        }),

    }),
    {
      name: 'diagram-storage',
    }
  )
);