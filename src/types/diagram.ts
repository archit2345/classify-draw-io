export type Visibility = "public" | "private" | "protected";

export interface Method {
  id: string;
  name: string;
  visibility: Visibility;
  returnType: string;
  parameters: string;
  isAbstract?: boolean;
}

export interface Attribute {
  id: string;
  name: string;
  visibility: Visibility;
  type: string;
}

export interface DiagramElement {
  id: string;
  type: "class" | "interface";
  name: string;
  x: number;
  y: number;
  methods: Method[];
  attributes: Attribute[];
}

export interface Relationship {
  id: string;
  type: string;
  sourceId: string;
  targetId: string;
}

export interface DiagramState {
  elements: DiagramElement[];
  relationships: Relationship[];
  selectedElementId: string | null;
  selectedRelationshipId: string | null;
  connectionMode: string | null;
  tempSourceId: string | null;
}