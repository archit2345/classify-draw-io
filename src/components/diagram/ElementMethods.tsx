import { Method, Visibility } from "@/types/diagram";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDiagramStore } from "@/store/diagramStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Props {
  elementId: string;
  methods: Method[];
  isInterface?: boolean;
}

export const ElementMethods = ({ elementId, methods = [], isInterface = false }: Props) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newMethod, setNewMethod] = useState<Partial<Method>>({
    name: "",
    visibility: "public",
    returnType: "void",
    parameters: "",
    isAbstract: false,
  });

  const updateElement = useDiagramStore((state) => state.updateElement);

  const handleAddMethod = () => {
    if (!newMethod.name) return;

    const method: Method = {
      id: uuidv4(),
      name: newMethod.name,
      visibility: newMethod.visibility as Visibility,
      returnType: newMethod.returnType || "void",
      parameters: newMethod.parameters || "",
      isAbstract: newMethod.isAbstract || false,
    };

    updateElement(elementId, {
      methods: [...methods, method],
    });

    setNewMethod({
      name: "",
      visibility: "public",
      returnType: "void",
      parameters: "",
      isAbstract: false,
    });
    setIsAdding(false);
  };

  const handleRemoveMethod = (methodId: string) => {
    updateElement(elementId, {
      methods: methods.filter((m) => m.id !== methodId),
    });
  };

  return (
    <div className="p-2 border-t border-slate-200">
      <div className="text-sm font-medium mb-2">Methods</div>
      <div className="space-y-2">
        {methods.map((method) => (
          <div key={method.id} className="flex items-center gap-2">
            <div className="flex-1 text-sm">
              {method.visibility === "private" && "-"}
              {method.visibility === "protected" && "#"}
              {method.visibility === "public" && "+"}
              {method.visibility === "static" && "$"}
              {method.name}({method.parameters}): {method.returnType}
              {method.isAbstract && " [abstract]"}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveMethod(method.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      {isAdding ? (
        <div className="space-y-2 mt-2">
          <div className="flex gap-2">
            <Select
              value={newMethod.visibility}
              onValueChange={(value: Visibility) =>
                setNewMethod({ ...newMethod, visibility: value })
              }
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="protected">Protected</SelectItem>
                <SelectItem value="static">Static</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Method name"
              value={newMethod.name}
              onChange={(e) =>
                setNewMethod({ ...newMethod, name: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Return type"
              value={newMethod.returnType}
              onChange={(e) =>
                setNewMethod({ ...newMethod, returnType: e.target.value })
              }
            />
            <Input
              placeholder="Parameters"
              value={newMethod.parameters}
              onChange={(e) =>
                setNewMethod({ ...newMethod, parameters: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddMethod}>Add</Button>
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => setIsAdding(true)}
        >
          Add Method
        </Button>
      )}
    </div>
  );
};