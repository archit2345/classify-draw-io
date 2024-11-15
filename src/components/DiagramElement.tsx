import { DiagramElement as DiagramElementType } from "@/types/diagram";
import { useDiagramStore } from "@/store/diagramStore";
import { cn } from "@/lib/utils";

interface Props {
  element: DiagramElementType;
}

export const DiagramElement = ({ element }: Props) => {
  const selectedElementId = useDiagramStore((state) => state.selectedElementId);
  const setSelectedElement = useDiagramStore((state) => state.setSelectedElement);

  const isSelected = selectedElementId === element.id;

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
    >
      <div className="p-2 border-b border-slate-200 font-medium">
        {element.type === "interface" && (
          <div className="text-xs text-slate-500">«interface»</div>
        )}
        {element.name}
      </div>
      
      {element.type === "class" && element.attributes.length > 0 && (
        <div className="p-2 border-b border-slate-200">
          {element.attributes.map((attr) => (
            <div key={attr.id} className="text-sm">
              {attr.visibility === "private" && "-"}
              {attr.visibility === "public" && "+"}
              {attr.visibility === "protected" && "#"}
              {attr.name}: {attr.type}
            </div>
          ))}
        </div>
      )}

      <div className="p-2">
        {element.methods.map((method) => (
          <div
            key={method.id}
            className={cn(
              "text-sm",
              method.isAbstract && "italic"
            )}
          >
            {method.visibility === "private" && "-"}
            {method.visibility === "public" && "+"}
            {method.visibility === "protected" && "#"}
            {method.name}({method.parameters}): {method.returnType}
          </div>
        ))}
      </div>
    </div>
  );
};