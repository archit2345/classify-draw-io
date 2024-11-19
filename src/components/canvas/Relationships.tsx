import { DiagramElement, Relationship } from "@/types/diagram";
import { calculateIntersectionPoint } from "@/utils/arrowCalculations";
import { colors, getMarkerEnd, getStrokeDasharray } from "@/utils/relationshipStyles";
import { RelationshipMarkers } from "./RelationshipMarkers";

interface RelationshipsProps {
  relationships: Relationship[];
  elements: DiagramElement[];
}

export const Relationships = ({ relationships, elements }: RelationshipsProps) => {
  return relationships.map((rel) => {
    const source = elements.find((el) => el.id === rel.sourceId);
    const target = elements.find((el) => el.id === rel.targetId);
    
    if (!source || !target) return null;

    // Calculate center points
    const sourceCenter = {
      x: source.x + 128,
      y: source.y + 50
    };

    const targetCenter = {
      x: target.x + 128,
      y: target.y + 50
    };

    // Calculate intersection points with element boundaries
    const sourceIntersection = calculateIntersectionPoint(
      targetCenter.x,
      targetCenter.y,
      sourceCenter.x,
      sourceCenter.y,
      256,
      100
    );

    const targetIntersection = calculateIntersectionPoint(
      sourceCenter.x,
      sourceCenter.y,
      targetCenter.x,
      targetCenter.y,
      256,
      100
    );

    return (
      <svg 
        key={rel.id} 
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5
        }}
      >
        <RelationshipMarkers />
        <line
          x1={sourceIntersection.x}
          y1={sourceIntersection.y}
          x2={targetIntersection.x}
          y2={targetIntersection.y}
          stroke={colors[rel.type as keyof typeof colors]}
          strokeWidth="2"
          strokeDasharray={getStrokeDasharray(rel.type)}
          markerEnd={getMarkerEnd(rel.type)}
        />
      </svg>
    );
  });
};