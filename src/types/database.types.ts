export interface Database {
  public: {
    Tables: {
      diagrams: {
        Row: {
          id: string;
          name: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          name: string;
          user_id: string;
        };
      };
      elements: {
        Row: {
          id: string;
          diagram_id: string;
          type: "class" | "interface" | "textbox";
          name?: string;
          x: number;
          y: number;
          methods?: any[];
          attributes?: any[];
          text?: string;
        };
        Insert: {
          diagram_id: string;
          type: "class" | "interface" | "textbox";
          name?: string;
          x: number;
          y: number;
          methods?: any[];
          attributes?: any[];
          text?: string;
        };
      };
      relationships: {
        Row: {
          id: string;
          diagram_id: string;
          source_id: string;
          target_id: string;
          type: string;
        };
        Insert: {
          diagram_id: string;
          source_id: string;
          target_id: string;
          type: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}