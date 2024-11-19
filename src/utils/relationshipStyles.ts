export const colors = {
  composition: "#3B82F6",
  aggregation: "#8B5CF6",
  association: "#10B981",
  directedAssociation: "#F59E0B",
  dependency: "#EC4899",
  realization: "#6366F1",
  generalization: "#14B8A6"
};

export const getMarkerEnd = (type: string) => {
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

export const getStrokeDasharray = (type: string) => {
  return ["dependency", "realization"].includes(type) ? "5,5" : "none";
};