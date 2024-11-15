import { Button } from "../ui/button";
import { GripVertical, X, Link2 } from "lucide-react";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { DiagramElement } from "@/types/diagram";

interface ElementHeaderProps {
  element: DiagramElement;
  isEditing: boolean;
  newName: string;
  setIsEditing: (value: boolean) => void;
  setNewName: (value: string) => void;
  handleNameSubmit: () => void;
  handleConnect: () => void;
  handleResetConnections: () => void;
  removeElement: (id: string) => void;
  connectionMode: string | null;
}

export const ElementHeader = ({
  element,
  isEditing,
  newName,
  setIsEditing,
  setNewName,
  handleNameSubmit,
  handleConnect,
  handleResetConnections,
  removeElement,
  connectionMode,
}: ElementHeaderProps) => {
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
  );
};