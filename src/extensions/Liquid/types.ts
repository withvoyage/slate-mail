import { LucideIcon } from "lucide-react";

import { Editor } from "@tiptap/core";

export interface Group {
  name: string;
  title: string;
  variables: Variable[];
}

export interface Variable {
  id: string;
  name: string;
  description: string;
  aliases?: string[];
  icon: LucideIcon;
}

export interface LiquidListProps {
  editor: Editor;
  items: Group[];
  command: (variable: Variable) => void;
}
