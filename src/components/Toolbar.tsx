import { Button } from "@/components/ui/button";
import { Square, SquareDashed, ArrowRight, GitFork } from "lucide-react";
import { useDiagramStore } from "@/store/diagramStore";

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
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 flex gap-2">
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
      <div className="w-px bg-slate-200" />
      <Button variant="outline" size="icon" className="hover:bg-slate-100">
        <ArrowRight className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="hover:bg-slate-100">
        <GitFork className="h-4 w-4" />
      </Button>
    </div>
  );
};