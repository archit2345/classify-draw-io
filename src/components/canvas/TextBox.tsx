import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useDiagramStore } from "@/store/diagramStore";

interface TextBoxProps {
  element: {
    id: string;
    x: number;
    y: number;
    text: string;
  };
}

export const TextBox = ({ element }: TextBoxProps) => {
  const [text, setText] = useState(element.text);
  const updateElement = useDiagramStore((state) => state.updateElement);

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData("text/plain", element.id);
  };

  return (
    <div
      className="absolute bg-white/80 backdrop-blur-sm rounded-lg shadow-lg w-64"
      style={{ left: element.x, top: element.y }}
      draggable
      onDragStart={handleDragStart}
    >
      <Textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          updateElement(element.id, { text: e.target.value });
        }}
        className="min-h-[100px] resize-none"
        placeholder="Add notes here..."
      />
    </div>
  );
};