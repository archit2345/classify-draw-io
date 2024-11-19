import { Button } from "@/components/ui/button";
import { useDiagramStore } from "@/store/diagramStore";
import { Square, Boxes, ArrowRight, Download, Type } from "lucide-react";
import html2canvas from "html2canvas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { nanoid } from "nanoid";

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

  const handleAddTextBox = () => {
    addElement({
      id: nanoid(),
      type: "textbox",
      x: 100,
      y: 100,
      text: ""
    });
  };

  const handleExport = async () => {
    const canvas = document.querySelector('.diagram-canvas') as HTMLElement;
    if (!canvas) return;

    try {
      const result = await html2canvas(canvas, {
        backgroundColor: null,
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = 'class-diagram.png';
      link.href = result.toDataURL('image/png');
      link.click();
      toast.success('Diagram exported successfully');
    } catch (error) {
      toast.error('Failed to export diagram');
    }
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
          onClick={handleAddTextBox}
          title="Add Text Box"
        >
          <Type className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              title="Add Relationship"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setConnectionMode("composition")}>
              Composition
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConnectionMode("aggregation")}>
              Aggregation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConnectionMode("association")}>
              Association
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConnectionMode("directedAssociation")}>
              Directed Association
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConnectionMode("dependency")}>
              Dependency
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConnectionMode("realization")}>
              Realization
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConnectionMode("generalization")}>
              Generalization
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          size="icon"
          onClick={handleExport}
          title="Export Diagram"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};