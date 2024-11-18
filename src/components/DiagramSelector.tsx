import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDiagramStore } from "@/store/diagramStore";
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export const DiagramSelector = () => {
  const [newDiagramName, setNewDiagramName] = useState("");
  const diagrams = useDiagramStore((state) => state.diagrams);
  const activeDiagramId = useDiagramStore((state) => state.activeDiagramId);
  const createDiagram = useDiagramStore((state) => state.createDiagram);
  const setActiveDiagram = useDiagramStore((state) => state.setActiveDiagram);

  const handleCreateDiagram = () => {
    if (!newDiagramName.trim()) {
      toast.error("Please enter a diagram name");
      return;
    }
    createDiagram(newDiagramName);
    setNewDiagramName("");
    toast.success("Diagram created successfully");
  };

  return (
    <div className="fixed top-20 right-4 bg-white rounded-lg shadow-lg p-4 z-10 w-64">
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="New diagram name"
          value={newDiagramName}
          onChange={(e) => setNewDiagramName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateDiagram()}
        />
        <Button size="icon" onClick={handleCreateDiagram}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {diagrams.map((diagram) => (
          <Button
            key={diagram.id}
            variant={diagram.id === activeDiagramId ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => setActiveDiagram(diagram.id)}
          >
            {diagram.name}
          </Button>
        ))}
      </div>
    </div>
  );
};