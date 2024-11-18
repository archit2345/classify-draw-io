import { create } from "zustand";
import { DiagramState, DiagramElement, Relationship, Diagram } from "@/types/diagram";
import { nanoid } from "nanoid";
import { persist } from "zustand/middleware";
import { supabase } from "@/integrations/supabase/client";

interface DiagramStore extends DiagramState {
  createDiagram: (name: string) => Promise<void>;
  setActiveDiagram: (id: string) => void;
  addElement: (element: Omit<DiagramElement, "id">) => void;
  updateElement: (id: string, updates: Partial<DiagramElement>) => void;
  removeElement: (id: string) => void;
  addRelationship: (relationship: Omit<Relationship, "id">) => void;
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
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data: diagrams, error } = await supabase
          .from('diagrams')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error loading diagrams:', error);
          return;
        }

        set({ diagrams: diagrams || [] });
      },

      createDiagram: async (name) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const newDiagram = {
          id: nanoid(),
          name,
          elements: [],
          relationships: [],
          user_id: session.user.id
        };

        const { error } = await supabase
          .from('diagrams')
          .insert([newDiagram]);

        if (error) {
          console.error('Error creating diagram:', error);
          return;
        }

        set((state) => ({
          diagrams: [...state.diagrams, newDiagram],
          activeDiagramId: state.diagrams.length === 0 ? newDiagram.id : state.activeDiagramId,
        }));
      },

      setActiveDiagram: (id) =>
        set({ activeDiagramId: id, selectedElementId: null, selectedRelationshipId: null }),

      addElement: (element) =>
        set((state) => {
          const activeDiagram = state.diagrams.find(d => d.id === state.activeDiagramId);
          if (!activeDiagram) return state;

          const updatedDiagrams = state.diagrams.map(diagram =>
            diagram.id === state.activeDiagramId
              ? { ...diagram, elements: [...diagram.elements, { ...element, id: nanoid() }] }
              : diagram
          );

          return { diagrams: updatedDiagrams };
        }),

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

      addRelationship: (relationship) =>
        set((state) => {
          const updatedDiagrams = state.diagrams.map(diagram =>
            diagram.id === state.activeDiagramId
              ? {
                  ...diagram,
                  relationships: [...diagram.relationships, { ...relationship, id: nanoid() }],
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