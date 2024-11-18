import { Button } from "@/components/ui/button";
import { useDiagramStore } from "@/store/diagramStore";
import { Square, Boxes, Link2 } from "lucide-react";

export const DiagramToolbar = () => {
  const setConnectionMode = useDiagramStore((state) => state.setConnectionMode);
  const addElement = useDiagramStore((state) => state.addElement);

  const handleAddClass = () => {
    addElement({
      name: "NewClass",
      type: "class",
      x: 100,
      y: 100,
      attributes: [],
      methods: []
    });
  };

  const handleAddInterface = () => {
    addElement({
      name: "NewInterface",
      type: "interface",
      x: 100,
      y: 100,
      attributes: [],
      methods: []
    });
  };

  return (
    <div className="fixed top-20 left-4 bg-white rounded-lg shadow-lg p-2 z-10">
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddClass}
          title="Add Class"
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddInterface}
          title="Add Interface"
        >
          <Boxes className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setConnectionMode("inheritance")}
          title="Add Relationship"
        >
          <Link2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};