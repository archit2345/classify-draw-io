import { DiagramElement } from "@/types/diagram";
import { useDiagramStore } from "@/store/diagramStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  element: DiagramElement;
}

export const ElementAttributes = ({ element }: Props) => {
  const [newAttribute, setNewAttribute] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState<string>("public");
  const updateElement = useDiagramStore((state) => state.updateElement);

  const handleAddAttribute = () => {
    if (!newAttribute) return;
    const [name, type] = newAttribute.split(" ");
    if (!name || !type) {
      toast.error("Format: name type (e.g., name string)");
      return;
    }
    updateElement(element.id, {
      attributes: [...element.attributes, { 
        id: nanoid(), 
        visibility: selectedVisibility as "public" | "private" | "protected" | "static",
        name, 
        type 
      }]
    });
    setNewAttribute("");
  };

  const getVisibilitySymbol = (visibility: string) => {
    switch (visibility) {
      case "public": return "+";
      case "private": return "-";
      case "protected": return "#";
      case "static": return "*";
      default: return "+";
    }
  };

  return (
    <div className="border-b border-slate-200">
      <div className="px-2 py-1 bg-slate-100 font-medium text-sm">Attributes</div>
      <div className="p-2">
        <div className="flex items-center gap-2 mb-2">
          <Select
            value={selectedVisibility}
            onValueChange={setSelectedVisibility}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="protected">Protected</SelectItem>
              <SelectItem value="static">Static</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="attributeName type"
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
            {getVisibilitySymbol(attr.visibility)}
            {attr.name}: {attr.type}
          </div>
        ))}
      </div>
    </div>
  );
};