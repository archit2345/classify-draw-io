import { create } from "zustand";
import { DiagramState, DiagramElement, Relationship } from "@/types/diagram";
import { nanoid } from "nanoid";

interface DiagramStore extends DiagramState {
  addElement: (element: Omit<DiagramElement, "id">) => void;
  updateElement: (id: string, updates: Partial<DiagramElement>) => void;
  removeElement: (id: string) => void;
  addRelationship: (relationship: Omit<Relationship, "id">) => void;
  removeRelationship: (id: string) => void;
  setSelectedElement: (id: string | null) => void;
  setSelectedRelationship: (id: string | null) => void;
}

export const useDiagramStore = create<DiagramStore>((set) => ({
  elements: [],
  relationships: [],
  selectedElementId: null,
  selectedRelationshipId: null,

  addElement: (element) =>
    set((state) => ({
      elements: [...state.elements, { ...element, id: nanoid() }],
    })),

  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    })),

  removeElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      relationships: state.relationships.filter(
        (rel) => rel.sourceId !== id && rel.targetId !== id
      ),
    })),

  addRelationship: (relationship) =>
    set((state) => ({
      relationships: [...state.relationships, { ...relationship, id: nanoid() }],
    })),

  removeRelationship: (id) =>
    set((state) => ({
      relationships: state.relationships.filter((rel) => rel.id !== id),
    })),

  setSelectedElement: (id) =>
    set({ selectedElementId: id, selectedRelationshipId: null }),

  setSelectedRelationship: (id) =>
    set({ selectedRelationshipId: id, selectedElementId: null }),
}));