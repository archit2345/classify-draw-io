import { DiagramElement, Relationship } from "@/types/diagram";

interface RelationshipsProps {
  relationships: Relationship[];
  elements: DiagramElement[];
}

export const Relationships = ({ relationships, elements }: RelationshipsProps) => {
  const calculateIntersectionPoint = (
    sourceX: number,
    sourceY: number,
    targetX: number,
    targetY: number,
    elementWidth: number,
    elementHeight: number
  ) => {
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const angle = Math.atan2(dy, dx);

    const halfWidth = elementWidth / 2;
    const halfHeight = elementHeight / 2;

    // Calculate intersection with element border
    const slope = Math.abs(dy / dx);
    const elementSlope = halfHeight / halfWidth;

    let x, y;
    if (slope <= elementSlope) {
      // Intersects with left/right border
      x = dx > 0 ? -halfWidth : halfWidth;
      y = slope * x;
    } else {
      // Intersects with top/bottom border
      y = dy > 0 ? -halfHeight : halfHeight;
      x = y / slope;
    }

    return {
      x: targetX + x,
      y: targetY + y
    };
  };

  const colors = {
    composition: "#3B82F6",
    aggregation: "#8B5CF6",
    association: "#10B981",
    directedAssociation: "#F59E0B",
    dependency: "#EC4899",
    realization: "#6366F1",
    generalization: "#14B8A6"
  };

  const getMarkerEnd = (type: string) => {
    const markers = {
      composition: "url(#composition)",
      aggregation: "url(#aggregation)",
      directedAssociation: "url(#arrow)",
      association: "url(#arrow)",
      dependency: "url(#dependency)",
      realization: "url(#realization)",
      generalization: "url(#generalization)"
    };
    return markers[type as keyof typeof markers] || "url(#arrow)";
  };

  const getStrokeDasharray = (type: string) => {
    return ["dependency", "realization"].includes(type) ? "5,5" : "none";
  };

  return relationships.map((rel) => {
    const source = elements.find((el) => el.id === rel.sourceId);
    const target = elements.find((el) => el.id === rel.targetId);
    
    if (!source || !target) return null;

    const sourceCenter = {
      x: source.x + 128,
      y: source.y + 50
    };

    const targetCenter = {
      x: target.x + 128,
      y: target.y + 50
    };

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
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon 
              points="0 0, 10 3.5, 0 7" 
              fill={colors[rel.type as keyof typeof colors]} 
            />
          </marker>
          <marker
            id="composition"
            markerWidth="12"
            markerHeight="12"
            refX="6"
            refY="6"
            orient="auto"
          >
            <polygon 
              points="0,6 6,0 12,6 6,12"
              fill={colors[rel.type as keyof typeof colors]}
            />
          </marker>
          <marker
            id="aggregation"
            markerWidth="12"
            markerHeight="12"
            refX="6"
            refY="6"
            orient="auto"
          >
            <polygon 
              points="0,6 6,0 12,6 6,12"
              fill="white"
              stroke={colors[rel.type as keyof typeof colors]}
            />
          </marker>
          <marker
            id="generalization"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
          >
            <polygon 
              points="0,0 10,6 0,12"
              fill="white"
              stroke={colors[rel.type as keyof typeof colors]}
            />
          </marker>
          <marker
            id="realization"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
          >
            <polygon 
              points="0,0 10,6 0,12"
              fill="white"
              stroke={colors[rel.type as keyof typeof colors]}
            />
          </marker>
          <marker
            id="dependency"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
          >
            <polygon 
              points="0,0 10,6 0,12"
              fill={colors[rel.type as keyof typeof colors]}
            />
          </marker>
        </defs>
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