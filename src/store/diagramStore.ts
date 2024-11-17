import { create } from "zustand";
import { DiagramState, DiagramElement, Relationship, Diagram } from "@/types/diagram";
import { nanoid } from "nanoid";
import { persist } from "zustand/middleware";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data: diagrams, error } = await supabase
            .from('diagrams')
            .select('*')
            .eq('user_id', user.id);

          if (error) throw error;
          
          set({ diagrams: diagrams || [] });
          if (diagrams && diagrams.length > 0 && !get().activeDiagramId) {
            set({ activeDiagramId: diagrams[0].id });
          }
        } catch (error) {
          console.error('Error loading diagrams:', error);
          toast.error('Failed to load diagrams');
        }
      },

      createDiagram: async (name) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            toast.error('Please sign in to create diagrams');
            return;
          }

          const newDiagram = {
            id: nanoid(),
            name,
            elements: [],
            relationships: [],
            user_id: user.id,
          };

          const { error } = await supabase
            .from('diagrams')
            .insert([newDiagram]);

          if (error) throw error;

          set((state) => ({
            diagrams: [...state.diagrams, newDiagram],
            activeDiagramId: state.diagrams.length === 0 ? newDiagram.id : state.activeDiagramId,
          }));

          toast.success('Diagram created successfully');
        } catch (error) {
          console.error('Error creating diagram:', error);
          toast.error('Failed to create diagram');
        }
      },

      setActiveDiagram: (id) => 
        set({ activeDiagramId: id, selectedElementId: null, selectedRelationshipId: null }),

      addElement: async (element) => {
        const activeDiagram = get().diagrams.find(d => d.id === get().activeDiagramId);
        if (!activeDiagram) return;

        const newElement = { ...element, id: nanoid() };
        const updatedDiagrams = get().diagrams.map(diagram =>
          diagram.id === get().activeDiagramId
            ? { ...diagram, elements: [...diagram.elements, newElement] }
            : diagram
        );

        try {
          const { error } = await supabase
            .from('diagrams')
            .update({ elements: [...activeDiagram.elements, newElement] })
            .eq('id', activeDiagram.id);

          if (error) throw error;
          set({ diagrams: updatedDiagrams });
        } catch (error) {
          console.error('Error adding element:', error);
          toast.error('Failed to add element');
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
