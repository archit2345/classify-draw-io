import { Button } from "@/components/ui/button";
import { Square, SquareDashed, Link } from "lucide-react";
import { useDiagramStore } from "@/store/diagramStore";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Circle } from "lucide-react";

export const Toolbar = () => {
  const addElement = useDiagramStore((state) => state.addElement);
  const setConnectionMode = useDiagramStore((state) => state.setConnectionMode);
  const connectionMode = useDiagramStore((state) => state.connectionMode);

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

  const relationshipTypes = [
    { type: "association", color: "#3B82F6" }, // blue
    { type: "inheritance", color: "#10B981" }, // green
    { type: "composition", color: "#F59E0B" }, // amber
    { type: "aggregation", color: "#8B5CF6" }, // purple
    { type: "dependency", color: "#EC4899" },  // pink
    { type: "realisation", color: "#6366F1" }  // indigo
  ];

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
      <div className="w-px bg-slate-200" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "hover:bg-slate-100",
              connectionMode && "bg-slate-100"
            )}
          >
            <Link className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {relationshipTypes.map(({ type, color }) => (
            <DropdownMenuItem
              key={type}
              onClick={() => setConnectionMode(type)}
              className="flex items-center gap-2"
            >
              <Circle className="h-3 w-3" fill={color} stroke="none" />
              <span className="capitalize">{type}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            onClick={() => setConnectionMode(null)}
            className="border-t"
          >
            Exit Connection Mode
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};