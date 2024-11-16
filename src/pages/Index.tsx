import { Canvas } from "@/components/Canvas";
import { Toolbar } from "@/components/Toolbar";
import { DiagramSelector } from "@/components/DiagramSelector";
import { useDiagramStore } from "@/store/diagramStore";
import { useEffect } from "react";

const Index = () => {
  const diagrams = useDiagramStore((state) => state.diagrams);
  const createDiagram = useDiagramStore((state) => state.createDiagram);

  useEffect(() => {
    if (diagrams.length === 0) {
      createDiagram("Untitled Diagram");
    }
  }, [diagrams.length, createDiagram]);

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-canvas-bg">
      <Toolbar />
      <DiagramSelector />
      <Canvas />
    </div>
  );
};

export default Index;