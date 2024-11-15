import { DiagramElement } from "./DiagramElement";
import { useDiagramStore } from "@/store/diagramStore";

export const Canvas = () => {
  const elements = useDiagramStore((state) => state.elements);

  return (
    <div className="w-full h-screen bg-canvas-bg relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage:
            "linear-gradient(to right, var(--tw-colors-canvas-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--tw-colors-canvas-grid) 1px, transparent 1px)",
        }}
      />
      {elements.map((element) => (
        <DiagramElement key={element.id} element={element} />
      ))}
    </div>
  );
};