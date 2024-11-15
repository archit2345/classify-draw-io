import { Button } from "@/components/ui/button";
import { Square, SquareDashed } from "lucide-react";
import { useDiagramStore } from "@/store/diagramStore";
import { toast } from "sonner";

export const Toolbar = () => {
  const addElement = useDiagramStore((state) => state.addElement);

  const handleAddClass = () => {
    addElement({
      type: "class",
      name: "NewClass",
      x: 100,
      y: 100,
      methods: [],
      attributes: [],
    });
    toast.success("Class added successfully");
  };

  const handleAddInterface = () => {
    addElement({
      type: "interface",
      name: "NewInterface",
      x: 100,
      y: 100,
      methods: [],
      attributes: [],
    });
    toast.success("Interface added successfully");
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 flex gap-2 z-10">
      <Button
        variant="outline"
        size="icon"
        onClick={handleAddClass}
        className="hover:bg-slate-100"
      >
        <Square className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleAddInterface}
        className="hover:bg-slate-100"
      >
        <SquareDashed className="h-4 w-4" />
      </Button>
    </div>
  );
};