import { Attribute } from "@/types/diagram";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDiagramStore } from "@/store/diagramStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Props {
  elementId: string;
  attributes: Attribute[];
}

export const ElementAttributes = ({ elementId, attributes }: Props) => {
  const [newAttribute, setNewAttribute] = useState<Partial<Attribute>>({
    name: "",
    type: "",
    visibility: "public"
  });

  const updateElement = useDiagramStore((state) => state.updateElement);

  const handleAddAttribute = () => {
    if (!newAttribute.name || !newAttribute.type) return;

    const attribute: Attribute = {
      id: uuidv4(),
      name: newAttribute.name,
      type: newAttribute.type,
      visibility: newAttribute.visibility as "public" | "private" | "protected" | "static"
    };

    updateElement(elementId, {
      attributes: [...attributes, attribute]
    });

    setNewAttribute({
      name: "",
      type: "",
      visibility: "public"
    });
  };

  const handleRemoveAttribute = (id: string) => {
    updateElement(elementId, {
      attributes: attributes.filter(attr => attr.id !== id)
    });
  };

  const visibilitySymbols = {
    public: "+",
    private: "-",
    protected: "#",
    static: "$"
  };

  return (
    <div className="p-2 space-y-2">
      <div className="text-sm font-medium">Attributes</div>
      {attributes.map((attr) => (
        <div key={attr.id} className="flex items-center gap-2">
          <div className="flex-1 text-sm">
            {visibilitySymbols[attr.visibility]} {attr.name}: {attr.type}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveAttribute(attr.id)}
          >
            Remove
          </Button>
        </div>
      ))}
      <div className="flex gap-2">
        <Select
          value={newAttribute.visibility}
          onValueChange={(value) =>
            setNewAttribute({ ...newAttribute, visibility: value })
          }
        >
          <SelectTrigger className="w-[100px]">
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
          placeholder="Name"
          value={newAttribute.name}
          onChange={(e) =>
            setNewAttribute({ ...newAttribute, name: e.target.value })
          }
        />
        <Input
          placeholder="Type"
          value={newAttribute.type}
          onChange={(e) =>
            setNewAttribute({ ...newAttribute, type: e.target.value })
          }
        />
        <Button onClick={handleAddAttribute}>Add</Button>
      </div>
    </div>
  );
};
