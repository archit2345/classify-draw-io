import { colors } from "@/utils/relationshipStyles";

export const RelationshipMarkers = () => {
  return (
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
          fill="currentColor"
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
          fill="currentColor"
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
          stroke="currentColor"
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
          stroke="currentColor"
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
          stroke="currentColor"
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
          fill="currentColor"
        />
      </marker>
    </defs>
  );
};