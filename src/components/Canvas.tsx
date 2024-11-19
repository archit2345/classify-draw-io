import { DiagramElement } from "./DiagramElement";
import { TextBox } from "./canvas/TextBox";
import { Relationships } from "./canvas/Relationships";
import { useDiagramStore } from "@/store/diagramStore";
import { Button } from "./ui/button";
import { FileJson } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Canvas = () => {
  const activeDiagramId = useDiagramStore((state) => state.activeDiagramId);
  const diagrams = useDiagramStore((state) => state.diagrams);
  const activeDiagram = diagrams.find(d => d.id === activeDiagramId);
  const elements = activeDiagram?.elements || [];
  const relationships = activeDiagram?.relationships || [];

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

  return (
    <div 
      className="w-full h-screen bg-canvas-bg relative overflow-hidden diagram-canvas"
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
      <Relationships relationships={relationships} elements={elements} />
      {elements.map((element) => (
        element.type === "textbox" ? (
          <TextBox key={element.id} element={element} />
        ) : (
          <DiagramElement key={element.id} element={element} />
        )
      ))}
      
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 bg-white shadow-lg"
          >
            <FileJson className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Diagram JSON</DialogTitle>
          </DialogHeader>
          <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto max-h-[500px]">
            {JSON.stringify(activeDiagram, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
};