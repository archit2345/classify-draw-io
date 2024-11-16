import { Canvas } from "@/components/Canvas";
import { Toolbar } from "@/components/Toolbar";

const Index = () => {
  return (
    <div className="h-screen w-screen overflow-hidden relative bg-canvas-bg">
      <Toolbar />
      <Canvas />
    </div>
  );
};

export default Index;