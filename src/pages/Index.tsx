import { Canvas } from "@/components/Canvas";
import { Toolbar } from "@/components/Toolbar";
import { DiagramSelector } from "@/components/DiagramSelector";
import { DiagramToolbar } from "@/components/DiagramToolbar";
import { useDiagramStore } from "@/store/diagramStore";
import { useEffect } from "react";

const Index = () => {
  const diagrams = useDiagramStore((state) => state.diagrams);
  const createDiagram = useDiagramStore((state) => state.createDiagram);
  const loadUserDiagrams = useDiagramStore((state) => state.loadUserDiagrams);

  useEffect(() => {
    loadUserDiagrams();
  }, [loadUserDiagrams]);

  useEffect(() => {
    if (diagrams.length === 0) {
      createDiagram("Untitled Diagram");
    }
  }, [diagrams.length, createDiagram]);

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-canvas-bg">
      <Toolbar />
      <DiagramSelector />
      <DiagramToolbar />
      <Canvas />
    </div>
  );
};

export default Index;