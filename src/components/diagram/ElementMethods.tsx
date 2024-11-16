import { DiagramElement } from "@/types/diagram";
import { useDiagramStore } from "@/store/diagramStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  element: DiagramElement;
  isInterface?: boolean;
}

export const ElementMethods = ({ element, isInterface = false }: Props) => {
  const [newMethod, setNewMethod] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState<string>("public");
  const updateElement = useDiagramStore((state) => state.updateElement);

  const handleAddMethod = () => {
    if (!newMethod) return;
    const [name, returnType] = newMethod.split(" ");
    if (!name || !returnType) {
      toast.error("Format: name returnType (e.g., getName string)");
      return;
    }

    const method = {
      id: nanoid(),
      visibility: selectedVisibility as "public" | "private" | "protected" | "static",
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
    <div className="p-2">
      <div className="px-2 py-1 bg-slate-100 font-medium text-sm mb-2">Methods</div>
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
          placeholder={isInterface ? "methodName returnType" : "methodName returnType"}
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
          {getVisibilitySymbol(method.visibility)}
          {method.name}({method.parameters}): {method.returnType}
        </div>
      ))}
    </div>
  );
};