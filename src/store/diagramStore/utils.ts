import { DiagramElement, Relationship, Diagram } from "@/types/diagram";
import { DbDiagram } from "./types";

export const convertDbDiagramToAppDiagram = (dbDiagram: DbDiagram): Diagram => {
  const elements = dbDiagram.elements as unknown as DiagramElement[];
  const relationships = dbDiagram.relationships as unknown as Relationship[];
  
  if (!Array.isArray(elements) || !Array.isArray(relationships)) {
    console.error('Invalid diagram data structure:', dbDiagram);
    return {
      id: dbDiagram.id,
      name: dbDiagram.name,
      elements: [],
      relationships: []
    };
  }

  return {
    id: dbDiagram.id,
    name: dbDiagram.name,
    elements,
    relationships
  };
};