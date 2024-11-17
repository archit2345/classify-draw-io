import { DiagramElement as DiagramElementType } from "@/types/diagram";
import { useDiagramStore } from "@/store/diagramStore";
import { cn } from "@/lib/utils";
import { ElementHeader } from "./diagram/ElementHeader";
import { ElementAttributes } from "./diagram/ElementAttributes";
import { ElementMethods } from "./diagram/ElementMethods";

interface Props {
  element: DiagramElementType;
}

export const DiagramElement = ({ element }: Props) => {
  const selectedElementId = useDiagramStore((state) => state.selectedElementId);
  const setSelectedElement = useDiagramStore((state) => state.setSelectedElement);

  const isSelected = selectedElementId === element.id;

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData("text/plain", element.id);
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
      <ElementHeader element={element} />
      {element.type === "interface" ? (
        <ElementMethods elementId={element.id} methods={element.methods} isInterface={true} />
      ) : (
        <>
          <ElementAttributes elementId={element.id} attributes={element.attributes} />
          <ElementMethods elementId={element.id} methods={element.methods} isInterface={false} />
        </>
      )}
    </div>
  );
};