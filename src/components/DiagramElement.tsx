import { DiagramElement as DiagramElementType } from "@/types/diagram";
import { useDiagramStore } from "@/store/diagramStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { nanoid } from "nanoid";
import { ElementHeader } from "./diagram/ElementHeader";
import { ElementAttributes } from "./diagram/ElementAttributes";
import { ElementMethods } from "./diagram/ElementMethods";

interface Props {
  element: DiagramElementType;
}

export const DiagramElement = ({ element }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(element.name);
  const [newAttribute, setNewAttribute] = useState("");
  const [newMethod, setNewMethod] = useState("");

  const selectedElementId = useDiagramStore((state) => state.selectedElementId);
  const setSelectedElement = useDiagramStore((state) => state.setSelectedElement);
  const removeElement = useDiagramStore((state) => state.removeElement);
  const connectionMode = useDiagramStore((state) => state.connectionMode);
  const addRelationship = useDiagramStore((state) => state.addRelationship);
  const tempSourceId = useDiagramStore((state) => state.tempSourceId);
  const setTempSourceId = useDiagramStore((state) => state.setTempSourceId);
  const resetConnections = useDiagramStore((state) => state.resetConnections);
  const updateElement = useDiagramStore((state) => state.updateElement);

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

  const handleNameSubmit = () => {
    updateElement(element.id, { name: newName });
    setIsEditing(false);
  };

  const handleAddAttribute = () => {
    if (!newAttribute) return;
    const [visibility, name, type] = newAttribute.split(" ");
    if (!visibility || !name || !type) {
      toast.error("Format: visibility name type (e.g., + name string)");
      return;
    }
    updateElement(element.id, {
      attributes: [...element.attributes, { 
        id: nanoid(), 
        visibility: visibility === "+" ? "public" : 
                   visibility === "-" ? "private" : 
                   visibility === "*" ? "static" : "protected", 
        name, 
        type 
      }]
    });
    setNewAttribute("");
  };

  const handleAddMethod = () => {
    if (!newMethod) return;
    const [visibility, name, returnType] = newMethod.split(" ");
    if (!visibility || !name || !returnType) {
      toast.error("Format: visibility name returnType (e.g., + getName string)");
      return;
    }
    updateElement(element.id, {
      methods: [...element.methods, { 
        id: nanoid(), 
        visibility: visibility === "+" ? "public" : 
                   visibility === "-" ? "private" : 
                   visibility === "*" ? "static" : "protected", 
        name, 
        returnType, 
        parameters: "" 
      }]
    });
    setNewMethod("");
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
      <ElementHeader
        element={element}
        isEditing={isEditing}
        newName={newName}
        setIsEditing={setIsEditing}
        setNewName={setNewName}
        handleNameSubmit={handleNameSubmit}
        handleConnect={handleConnect}
        handleResetConnections={handleResetConnections}
        removeElement={removeElement}
        connectionMode={connectionMode}
      />
      
      {element.type === "class" && (
        <ElementAttributes
          element={element}
          newAttribute={newAttribute}
          setNewAttribute={setNewAttribute}
          handleAddAttribute={handleAddAttribute}
        />
      )}

      <ElementMethods
        element={element}
        newMethod={newMethod}
        setNewMethod={setNewMethod}
        handleAddMethod={handleAddMethod}
      />
    </div>
  );
};