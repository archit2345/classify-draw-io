import { DiagramElement } from "@/types/diagram";
import { useDiagramStore } from "@/store/diagramStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { nanoid } from "nanoid";

interface Props {
  element: DiagramElement;
}

export const ElementAttributes = ({ element }: Props) => {
  const [newAttribute, setNewAttribute] = useState("");
  const updateElement = useDiagramStore((state) => state.updateElement);

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
        visibility: visibility === "+" ? "public" : visibility === "-" ? "private" : "protected",
        name, 
        type 
      }]
    });
    setNewAttribute("");
  };

  return (
    <div className="p-2 border-b border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <Input
          placeholder="+ attributeName type"
          value={newAttribute}
          onChange={(e) => setNewAttribute(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddAttribute()}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleAddAttribute}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {element.attributes.map((attr) => (
        <div key={attr.id} className="text-sm">
          {attr.visibility === "private" && "-"}
          {attr.visibility === "public" && "+"}
          {attr.visibility === "protected" && "#"}
          {attr.name}: {attr.type}
        </div>
      ))}
    </div>
  );
};