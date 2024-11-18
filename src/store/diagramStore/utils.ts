import { DiagramElement, Relationship, Diagram } from "@/types/diagram";
import { DbDiagram } from "./types";
import { Json } from "@/integrations/supabase/types";

const isValidDiagramElement = (element: any): element is DiagramElement => {
  return (
    typeof element === 'object' &&
    element !== null &&
    'id' in element &&
    'type' in element &&
    'name' in element &&
    'x' in element &&
    'y' in element &&
    'methods' in element &&
    'attributes' in element
  );
};

const isValidRelationship = (rel: any): rel is Relationship => {
  return (
    typeof rel === 'object' &&
    rel !== null &&
    'id' in rel &&
    'type' in rel &&
    'sourceId' in rel &&
    'targetId' in rel
  );
};

const convertJsonToTypedArray = <T>(
  json: Json | null | undefined,
  validator: (item: any) => item is T
): T[] => {
  if (!Array.isArray(json)) {
    console.error('Invalid data structure:', json);
    return [];
  }
  
  return json.filter(validator);
};

export const convertDbDiagramToAppDiagram = (dbDiagram: DbDiagram): Diagram => {
  const elements = convertJsonToTypedArray(
    dbDiagram.elements,
    isValidDiagramElement
  );
  
  const relationships = convertJsonToTypedArray(
    dbDiagram.relationships,
    isValidRelationship
  );

  return {
    id: dbDiagram.id,
    name: dbDiagram.name,
    elements,
    relationships
  };
};