import { DiagramState, DiagramElement, Relationship, Diagram } from "@/types/diagram";
import { Database } from "@/integrations/supabase/types";

export type DbDiagram = Database['public']['Tables']['diagrams']['Row'];

export interface DiagramStore extends DiagramState {
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