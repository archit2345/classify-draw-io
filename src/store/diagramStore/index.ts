import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DiagramStore } from "./types";
import { createDiagramActions } from "./actions";

export const useDiagramStore = create<DiagramStore>()(
  persist(
    (set, get) => ({
      diagrams: [],
      activeDiagramId: null,
      selectedElementId: null,
      selectedRelationshipId: null,
      connectionMode: null,
      tempSourceId: null,
      ...createDiagramActions(set, get),
    }),
    {
      name: 'diagram-storage',
    }
  )
);