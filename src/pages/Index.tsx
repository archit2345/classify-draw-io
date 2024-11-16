import { Canvas } from "@/components/Canvas";
import { Toolbar } from "@/components/Toolbar";
import { DiagramSelector } from "@/components/DiagramSelector";

const Index = () => {
  return (
    <div className="h-screen w-screen overflow-hidden relative bg-canvas-bg">
      <Toolbar />
      <DiagramSelector />
      <Canvas />
    </div>
  );
};

export default Index;