import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDiagramStore } from "@/store/diagramStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const DiagramSelector = () => {
  const { diagrams, activeDiagramId, createDiagram, setActiveDiagram } = useDiagramStore();

  const handleCreateDiagram = () => {
    createDiagram();
    toast.success("New diagram created");
  };

  return (
    <div className="fixed top-4 right-4 flex gap-2 z-10">
      <Select
        value={activeDiagramId || ""}
        onValueChange={(value) => setActiveDiagram(value)}
      >
        <SelectTrigger className="w-[200px] bg-white">
          <SelectValue placeholder="Select a diagram" />
        </SelectTrigger>
        <SelectContent>
          {diagrams.map((diagram) => (
            <SelectItem key={diagram.id} value={diagram.id}>
              {diagram.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="secondary"
        onClick={handleCreateDiagram}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        New Diagram
      </Button>
    </div>
  );
};