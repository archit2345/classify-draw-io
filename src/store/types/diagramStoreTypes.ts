import { DiagramElement, Relationship, Diagram } from "@/types/diagram";

export interface DiagramState {
  diagrams: Diagram[];
  activeDiagramId: string | null;
  selectedElementId: string | null;
  selectedRelationshipId: string | null;
  connectionMode: string | null;
  tempSourceId: string | null;
}

export interface DiagramActions {
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