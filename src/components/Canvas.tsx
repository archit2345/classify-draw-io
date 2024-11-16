import { DiagramElement } from "./DiagramElement";
import { useDiagramStore } from "@/store/diagramStore";
import { useEffect } from "react";

export const Canvas = () => {
  const elements = useDiagramStore((state) => state.elements);
  const relationships = useDiagramStore((state) => state.relationships);
  const connectionMode = useDiagramStore((state) => state.connectionMode);
  const updateElement = useDiagramStore((state) => state.updateElement);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementId = e.dataTransfer.getData("text/plain");
    const element = elements.find(el => el.id === elementId);
    
    if (element) {
      const canvasRect = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - 128;
      const newY = e.clientY - canvasRect.top - 50;
      
      updateElement(elementId, {
        x: Math.max(0, newX),
        y: Math.max(0, newY)
      });
    }
  };

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

    // Calculate intersection points with element borders
    const halfWidth = elementWidth / 2;
    const halfHeight = elementHeight / 2;

    // Check which border the line intersects with
    const tanAngle = Math.abs(Math.tan(angle));
    let x, y;

    if (tanAngle < halfHeight / halfWidth) {
      // Intersects with left/right border
      x = dx > 0 ? -halfWidth : halfWidth;
      y = x * Math.tan(angle);
    } else {
      // Intersects with top/bottom border
      y = dy > 0 ? -halfHeight : halfHeight;
      x = y / Math.tan(angle);
    }

    return {
      x: targetX + x,
      y: targetY + y
    };
  };

  const renderRelationships = () => {
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

      // Calculate intersection points
      const sourceIntersection = calculateIntersectionPoint(
        targetCenter.x,
        targetCenter.y,
        sourceCenter.x,
        sourceCenter.y,
        256, // element width
        100  // approximate element height
      );

      const targetIntersection = calculateIntersectionPoint(
        sourceCenter.x,
        sourceCenter.y,
        targetCenter.x,
        targetCenter.y,
        256,
        100
      );

      const colors = {
        association: "#3B82F6",
        inheritance: "#10B981",
        composition: "#F59E0B",
        aggregation: "#8B5CF6",
        dependency: "#EC4899",
        realisation: "#6366F1"
      };

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
              id={`arrowhead-${rel.type}`}
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
          </defs>
          <line
            x1={sourceIntersection.x}
            y1={sourceIntersection.y}
            x2={targetIntersection.x}
            y2={targetIntersection.y}
            stroke={colors[rel.type as keyof typeof colors]}
            strokeWidth="2"
            markerEnd={`url(#arrowhead-${rel.type})`}
          />
        </svg>
      );
    });
  };

  return (
    <div 
      className="w-full h-screen bg-canvas-bg relative overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage:
            "linear-gradient(to right, var(--tw-colors-canvas-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--tw-colors-canvas-grid) 1px, transparent 1px)",
        }}
      />
      {renderRelationships()}
      {elements.map((element) => (
        <DiagramElement key={element.id} element={element} />
      ))}
    </div>
  );
};