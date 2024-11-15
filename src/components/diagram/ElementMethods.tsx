import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import { DiagramElement } from "@/types/diagram";
import { cn } from "@/lib/utils";

interface ElementMethodsProps {
  element: DiagramElement;
  newMethod: string;
  setNewMethod: (value: string) => void;
  handleAddMethod: () => void;
}

export const ElementMethods = ({
  element,
  newMethod,
  setNewMethod,
  handleAddMethod,
}: ElementMethodsProps) => {
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
    <div className="p-2">
      <div className="flex items-center gap-2 mb-2">
        <Input
          placeholder="+ methodName returnType"
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
            method.isAbstract && "italic"
          )}
        >
          {getVisibilitySymbol(method.visibility)}{method.name}({method.parameters}): {method.returnType}
        </div>
      ))}
    </div>
  );
};