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
      // Get the drop coordinates relative to the canvas
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      updateElement(elementId, { x, y });
    }
  };

  const renderRelationships = () => {
    return relationships.map((rel) => {
      const source = elements.find((el) => el.id === rel.sourceId);
      const target = elements.find((el) => el.id === rel.targetId);
      
      if (!source || !target) return null;

      // Calculate center points
      const sourceX = source.x + 128; // half of w-64
      const sourceY = source.y + 50;  // approximate half height
      const targetX = target.x + 128;
      const targetY = target.y + 50;

      // Get color based on relationship type
      const colors = {
        association: "#3B82F6", // blue
        inheritance: "#10B981", // green
        composition: "#F59E0B", // amber
        aggregation: "#8B5CF6", // purple
        dependency: "#EC4899",  // pink
        realisation: "#6366F1"  // indigo
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
            x1={sourceX}
            y1={sourceY}
            x2={targetX}
            y2={targetY}
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
