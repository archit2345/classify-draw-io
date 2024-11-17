import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDiagramStore } from "@/store/diagramStore";
import { Save, Plus, Link2 } from "lucide-react";

export const Toolbar = () => {
  const navigate = useNavigate();
  const setConnectionMode = useDiagramStore((state) => state.setConnectionMode);
  const addElement = useDiagramStore((state) => state.addElement);
  const activeDiagramId = useDiagramStore((state) => state.activeDiagramId);
  const diagrams = useDiagramStore((state) => state.diagrams);
  const connectionMode = useDiagramStore((state) => state.connectionMode);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out. Please try again.");
    } else {
      navigate("/login");
    }
  };

  const handleAddClass = () => {
    addElement({
      type: "class",
      name: "NewClass",
      x: 100,
      y: 100,
      methods: [],
      attributes: []
    });
    toast.success("Class added successfully");
  };

  const handleAddInterface = () => {
    addElement({
      type: "interface",
      name: "NewInterface",
      x: 100,
      y: 100,
      methods: [],
      attributes: []
    });
    toast.success("Interface added successfully");
  };

  const handleConnectionMode = (type: string) => {
    setConnectionMode(connectionMode === type ? null : type);
    if (connectionMode === type) {
      toast.info("Connection mode disabled");
    } else {
      toast.info(`${type} connection mode enabled`);
    }
  };

  const handleSaveDiagram = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      const activeDiagram = diagrams.find(d => d.id === activeDiagramId);
      if (!activeDiagram) {
        toast.error("No active diagram to save");
        return;
      }

      const { error } = await supabase
        .from('diagrams')
        .upsert({
          id: activeDiagram.id,
          user_id: user.id,
          name: activeDiagram.name,
          content: JSON.stringify({
            elements: activeDiagram.elements,
            relationships: activeDiagram.relationships
          }),
          updated_at: new Date().toISOString()
        });

      if (error) {
        toast.error("Failed to save diagram");
        console.error(error);
      } else {
        toast.success("Diagram saved successfully");
      }
    } catch (error) {
      toast.error("Failed to save diagram");
      console.error(error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-background border-b flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold mr-4">Class Diagram</h1>
        <Button variant="outline" onClick={handleAddClass}>
          <Plus className="h-4 w-4 mr-2" />
          Add Class
        </Button>
        <Button variant="outline" onClick={handleAddInterface}>
          <Plus className="h-4 w-4 mr-2" />
          Add Interface
        </Button>
        <Button 
          variant={connectionMode === "inheritance" ? "default" : "outline"}
          onClick={() => handleConnectionMode("inheritance")}
        >
          <Link2 className="h-4 w-4 mr-2" />
          Inheritance
        </Button>
        <Button 
          variant={connectionMode === "composition" ? "default" : "outline"}
          onClick={() => handleConnectionMode("composition")}
        >
          <Link2 className="h-4 w-4 mr-2" />
          Composition
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleSaveDiagram}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};