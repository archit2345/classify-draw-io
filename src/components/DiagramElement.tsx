import { DiagramElement as DiagramElementType } from "@/types/diagram";
import { useDiagramStore } from "@/store/diagramStore";
import { cn } from "@/lib/utils";
import { GripVertical, X, Link2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface Props {
  element: DiagramElementType;
}

export const DiagramElement = ({ element }: Props) => {
  const selectedElementId = useDiagramStore((state) => state.selectedElementId);
  const setSelectedElement = useDiagramStore((state) => state.setSelectedElement);
  const removeElement = useDiagramStore((state) => state.removeElement);
  const connectionMode = useDiagramStore((state) => state.connectionMode);
  const addRelationship = useDiagramStore((state) => state.addRelationship);
  const tempSourceId = useDiagramStore((state) => state.tempSourceId);
  const setTempSourceId = useDiagramStore((state) => state.setTempSourceId);
  const resetConnections = useDiagramStore((state) => state.resetConnections);

  const isSelected = selectedElementId === element.id;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", element.id);
  };

  const handleConnect = () => {
    if (!tempSourceId) {
      setTempSourceId(element.id);
      toast.info("Select second element to complete connection");
    } else if (tempSourceId !== element.id) {
      addRelationship({
        sourceId: tempSourceId,
        targetId: element.id,
        type: connectionMode
      });
      setTempSourceId(null);
      toast.success("Connection created successfully");
    }
  };

  const handleResetConnections = () => {
    resetConnections(element.id);
    toast.success("Connections reset successfully");
  };

  return (
    <div
      className={cn(
        "absolute bg-white rounded-lg shadow-lg w-64 cursor-move animate-element-appear",
        isSelected && "ring-2 ring-element-selected",
        element.type === "interface" ? "border-dashed" : "border-solid",
        "border-2 border-element-border"
      )}
      style={{ left: element.x, top: element.y }}
      onClick={() => setSelectedElement(element.id)}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="p-2 border-b border-slate-200 font-medium flex items-center justify-between">
        <GripVertical className="h-4 w-4 text-slate-400 cursor-grab" />
        <div className="flex-1 text-center">
          {element.type === "interface" && (
            <div className="text-xs text-slate-500">«interface»</div>
          )}
          {element.name}
        </div>
        <div className="flex gap-1">
          {connectionMode && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleConnect}
              >
                <Link2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleResetConnections}
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => removeElement(element.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {element.type === "class" && element.attributes.length > 0 && (
        <div className="p-2 border-b border-slate-200">
          {element.attributes.map((attr) => (
            <div key={attr.id} className="text-sm">
              {attr.visibility === "private" && "-"}
              {attr.visibility === "public" && "+"}
              {attr.visibility === "protected" && "#"}
              {attr.name}: {attr.type}
            </div>
          ))}
        </div>
      )}

      <div className="p-2">
        {element.methods.map((method) => (
          <div
            key={method.id}
            className={cn(
              "text-sm",
              method.isAbstract && "italic"
            )}
          >
            {method.visibility === "private" && "-"}
            {method.visibility === "public" && "+"}
            {method.visibility === "protected" && "#"}
            {method.name}({method.parameters}): {method.returnType}
          </div>
        ))}
      </div>
    </div>
  );
};