import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import { DiagramElement } from "@/types/diagram";

interface ElementAttributesProps {
  element: DiagramElement;
  newAttribute: string;
  setNewAttribute: (value: string) => void;
  handleAddAttribute: () => void;
}

export const ElementAttributes = ({
  element,
  newAttribute,
  setNewAttribute,
  handleAddAttribute,
}: ElementAttributesProps) => {
  const getVisibilitySymbol = (visibility: string) => {
    switch (visibility) {
      case "private": return "-";
      case "public": return "+";
      case "protected": return "#";
      case "static": return "*";
      default: return "+";
    }
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
          {getVisibilitySymbol(attr.visibility)}{attr.name}: {attr.type}
        </div>
      ))}
    </div>
  );
};