import { Canvas } from "@/components/Canvas";
import { Toolbar } from "@/components/Toolbar";
import { DiagramSelector } from "@/components/DiagramSelector";
import { DiagramToolbar } from "@/components/DiagramToolbar";
import { useDiagramStore } from "@/store/diagramStore";
import { useEffect } from "react";

const Index = () => {
  const loadUserDiagrams = useDiagramStore((state) => state.loadUserDiagrams);

  useEffect(() => {
    loadUserDiagrams();
  }, [loadUserDiagrams]);

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