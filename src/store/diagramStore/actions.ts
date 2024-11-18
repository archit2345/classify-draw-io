import { nanoid } from "nanoid";
import { supabase } from "@/integrations/supabase/client";
import { DiagramElement, Relationship, Diagram } from "@/types/diagram";
import { convertDbDiagramToAppDiagram } from "./utils";
import { StateCreator } from "zustand";
import { DiagramStore } from "./types";

export const createDiagramActions = (
  set: StateCreator<DiagramStore>["setState"],
  get: () => DiagramStore
) => ({
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

    set({ 
      diagrams: diagrams?.map(convertDbDiagramToAppDiagram) || [],
      activeDiagramId: diagrams && diagrams.length > 0 ? diagrams[0].id : null 
    });
  },

  createDiagram: async (name: string) => {
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

  setActiveDiagram: (id: string) =>
    set({ activeDiagramId: id, selectedElementId: null, selectedRelationshipId: null }),

  addElement: (element: Omit<DiagramElement, "id">) =>
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

  updateElement: (id: string, updates: Partial<DiagramElement>) =>
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

  removeElement: (id: string) =>
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

  addRelationship: (relationship: Omit<Relationship, "id">) =>
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

  removeRelationship: (id: string) =>
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

  setSelectedElement: (id: string | null) =>
    set({ selectedElementId: id, selectedRelationshipId: null }),

  setSelectedRelationship: (id: string | null) =>
    set({ selectedRelationshipId: id, selectedElementId: null }),

  setConnectionMode: (mode: string | null) =>
    set({ connectionMode: mode, tempSourceId: null }),

  setTempSourceId: (id: string | null) =>
    set({ tempSourceId: id }),

  resetConnections: (elementId: string) =>
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
});