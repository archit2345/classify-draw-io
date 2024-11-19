import { create } from "zustand";
import { DiagramState, DiagramElement, Relationship, Diagram } from "@/types/diagram";
import { nanoid } from "nanoid";
import { persist } from "zustand/middleware";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DiagramStore extends DiagramState {
  createDiagram: (name: string) => Promise<void>;
  setActiveDiagram: (id: string) => void;
  addElement: (element: Omit<DiagramElement, "id">) => Promise<void>;
  updateElement: (id: string, updates: Partial<DiagramElement>) => void;
  removeElement: (id: string) => void;
  addRelationship: (relationship: Omit<Relationship, "id">) => Promise<void>;
  removeRelationship: (id: string) => void;
  setSelectedElement: (id: string | null) => void;
  setSelectedRelationship: (id: string | null) => void;
  setConnectionMode: (mode: string | null) => void;
  setTempSourceId: (id: string | null) => void;
  resetConnections: (elementId: string) => void;
  loadUserDiagrams: () => Promise<void>;
}

export const useDiagramStore = create<DiagramStore>()(
  persist(
    (set, get) => ({
      diagrams: [],
      activeDiagramId: null,
      selectedElementId: null,
      selectedRelationshipId: null,
      connectionMode: null,
      tempSourceId: null,

      loadUserDiagrams: async () => {
        try {
          const { data: diagrams, error: diagramsError } = await supabase
            .from('diagrams')
            .select('*')
            .order('created_at', { ascending: true });

          if (diagramsError) throw diagramsError;

          const diagramsWithData = await Promise.all(
            diagrams.map(async (diagram) => {
              const { data: elements, error: elementsError } = await supabase
                .from('elements')
                .select('*')
                .eq('diagram_id', diagram.id);

              const { data: relationships, error: relationshipsError } = await supabase
                .from('relationships')
                .select('*')
                .eq('diagram_id', diagram.id);

              if (elementsError) throw elementsError;
              if (relationshipsError) throw relationshipsError;

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
        } catch (error) {
          console.error('Error loading diagrams:', error);
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
