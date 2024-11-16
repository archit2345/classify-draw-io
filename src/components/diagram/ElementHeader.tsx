import { DiagramElement } from "@/types/diagram";
import { useDiagramStore } from "@/store/diagramStore";
import { Button } from "../ui/button";
import { GripVertical, X, Link2 } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  element: DiagramElement;
}

export const ElementHeader = ({ element }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(element.name);
  
  const removeElement = useDiagramStore((state) => state.removeElement);
  const connectionMode = useDiagramStore((state) => state.connectionMode);
  const addRelationship = useDiagramStore((state) => state.addRelationship);
  const tempSourceId = useDiagramStore((state) => state.tempSourceId);
  const setTempSourceId = useDiagramStore((state) => state.setTempSourceId);
  const resetConnections = useDiagramStore((state) => state.resetConnections);
  const updateElement = useDiagramStore((state) => state.updateElement);

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

  const handleNameSubmit = () => {
    updateElement(element.id, { name: newName });
    setIsEditing(false);
  };

  return (
    <div className="p-2 border-b border-slate-200 font-medium flex items-center justify-between">
      <GripVertical className="h-4 w-4 text-slate-400 cursor-grab" />
      <div className="flex-1 text-center" onDoubleClick={() => setIsEditing(true)}>
        {element.type === "interface" && (
          <div className="text-xs text-slate-500">«interface»</div>
        )}
        {isEditing ? (
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
            autoFocus
          />
        ) : (
          element.name
        )}
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
              onClick={() => resetConnections(element.id)}
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
  );
};