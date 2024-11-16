import { DiagramElement } from "@/types/diagram";
import { useDiagramStore } from "@/store/diagramStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";

interface Props {
  element: DiagramElement;
  isInterface?: boolean;
}

export const ElementMethods = ({ element, isInterface = false }: Props) => {
  const [newMethod, setNewMethod] = useState("");
  const updateElement = useDiagramStore((state) => state.updateElement);

  const handleAddMethod = () => {
    if (!newMethod) return;
    const [visibility, name, returnType] = newMethod.split(" ");
    if (!visibility || !name || !returnType) {
      toast.error("Format: visibility name returnType (e.g., + getName string)");
      return;
    }

    const method = {
      id: nanoid(),
      visibility: visibility === "+" ? "public" : visibility === "-" ? "private" : "protected",
      name,
      returnType,
      parameters: "",
      isAbstract: isInterface
    };

    updateElement(element.id, {
      methods: [...element.methods, method]
    });
    setNewMethod("");
    toast.success("Method added successfully");
  };

  return (
    <div className="p-2">
      <div className="flex items-center gap-2 mb-2">
        <Input
          placeholder={isInterface ? "+ methodName returnType" : "+ methodName returnType"}
          value={newMethod}
          onChange={(e) => setNewMethod(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddMethod()}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleAddMethod}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {element.methods.map((method) => (
        <div
          key={method.id}
          className={cn(
            "text-sm",
            (method.isAbstract || isInterface) && "italic"
          )}
        >
          {method.visibility === "private" && "-"}
          {method.visibility === "public" && "+"}
          {method.visibility === "protected" && "#"}
          {method.name}({method.parameters}): {method.returnType}
        </div>
      ))}
    </div>
  );
};