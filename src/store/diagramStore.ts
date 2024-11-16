import { create } from "zustand";
import { DiagramState, Diagram, DiagramElement, Relationship } from "@/types/diagram";
import { nanoid } from "nanoid";
import { persist } from "zustand/middleware";

const createNewDiagram = (): Diagram => ({
  id: nanoid(),
  name: `Diagram ${new Date().toLocaleString()}`,
  elements: [],
  relationships: [],
});

interface DiagramStore extends DiagramState {
  createDiagram: () => void;
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
}

export const useDiagramStore = create<DiagramStore>()(
  persist(
    (set) => ({
      diagrams: [createNewDiagram()],
      activeDiagramId: null,
      selectedElementId: null,
      selectedRelationshipId: null,
      connectionMode: null,
      tempSourceId: null,

      createDiagram: () =>
        set((state) => {
          const newDiagram = createNewDiagram();
          return {
            diagrams: [...state.diagrams, newDiagram],
            activeDiagramId: newDiagram.id,
          };
        }),

      setActiveDiagram: (id) =>
        set({ activeDiagramId: id, selectedElementId: null, selectedRelationshipId: null }),

      addElement: (element) =>
        set((state) => ({
          diagrams: state.diagrams.map((diagram) =>
            diagram.id === state.activeDiagramId
              ? {
                  ...diagram,
                  elements: [...diagram.elements, { ...element, id: nanoid() }],
                }
              : diagram
          ),
        })),

      updateElement: (id, updates) =>
        set((state) => ({
          diagrams: state.diagrams.map((diagram) =>
            diagram.id === state.activeDiagramId
              ? {
                  ...diagram,
                  elements: diagram.elements.map((el) =>
                    el.id === id ? { ...el, ...updates } : el
                  ),
                }
              : diagram
          ),
        })),

      removeElement: (id) =>
        set((state) => ({
          diagrams: state.diagrams.map((diagram) =>
            diagram.id === state.activeDiagramId
              ? {
                  ...diagram,
                  elements: diagram.elements.filter((el) => el.id !== id),
                  relationships: diagram.relationships.filter(
                    (rel) => rel.sourceId !== id && rel.targetId !== id
                  ),
                }
              : diagram
          ),
        })),

      addRelationship: (relationship) =>
        set((state) => ({
          diagrams: state.diagrams.map((diagram) =>
            diagram.id === state.activeDiagramId
              ? {
                  ...diagram,
                  relationships: [
                    ...diagram.relationships,
                    { ...relationship, id: nanoid() },
                  ],
                }
              : diagram
          ),
        })),

      removeRelationship: (id) =>
        set((state) => ({
          diagrams: state.diagrams.map((diagram) =>
            diagram.id === state.activeDiagramId
              ? {
                  ...diagram,
                  relationships: diagram.relationships.filter((rel) => rel.id !== id),
                }
              : diagram
          ),
        })),

      setSelectedElement: (id) =>
        set({ selectedElementId: id, selectedRelationshipId: null }),

      setSelectedRelationship: (id) =>
        set({ selectedRelationshipId: id, selectedElementId: null }),

      setConnectionMode: (mode) => set({ connectionMode: mode, tempSourceId: null }),

      setTempSourceId: (id) => set({ tempSourceId: id }),

      resetConnections: (elementId) =>
        set((state) => ({
          diagrams: state.diagrams.map((diagram) =>
            diagram.id === state.activeDiagramId
              ? {
                  ...diagram,
                  relationships: diagram.relationships.filter(
                    (rel) => rel.sourceId !== elementId && rel.targetId !== elementId
                  ),
                }
              : diagram
          ),
        })),
    }),
    {
      name: "diagram-storage",
    }
  )
);