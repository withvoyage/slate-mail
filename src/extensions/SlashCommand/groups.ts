import {
  Columns2,
  Heading1,
  Heading2,
  Heading3,
  Image,
  List,
  ListOrdered,
  Minus,
  MousePointer2,
} from "lucide-react";

import { Group } from "./types";

export const GROUPS: Group[] = [
  {
    name: "format",
    title: "Format",
    commands: [
      {
        name: "heading1",
        label: "Heading 1",
        icon: Heading1,
        description: "High priority section title",
        aliases: ["h1"],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 1 }).run();
        },
      },
      {
        name: "bulletList",
        label: "Bullet List",
        icon: List,
        description: "Unordered list of items",
        aliases: ["ul"],
        action: (editor) => {
          editor.chain().focus().toggleBulletList().run();
        },
      },
      {
        name: "heading2",
        label: "Heading 2",
        icon: Heading2,
        description: "Medium priority section title",
        aliases: ["h2"],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 2 }).run();
        },
      },
      {
        name: "numberedList",
        label: "Numbered List",
        icon: ListOrdered,
        description: "Ordered list of items",
        aliases: ["ol"],
        action: (editor) => {
          editor.chain().focus().toggleOrderedList().run();
        },
      },
      {
        name: "heading3",
        label: "Heading 3",
        icon: Heading3,
        description: "Low priority section title",
        aliases: ["h3"],
        action: (editor) => {
          editor.chain().focus().setHeading({ level: 3 }).run();
        },
      },
    ],
  },
  {
    name: "insert",
    title: "Insert",
    commands: [
      {
        name: "image",
        label: "Image",
        icon: Image,
        description: "Insert an image",
        aliases: ["img"],
        action: (editor) => {
          editor.chain().focus().setImageUpload().run();
        },
      },
      {
        name: "columns",
        label: "Columns",
        icon: Columns2,
        description: "Add two column content",
        aliases: ["cols"],
        shouldBeHidden: (editor) => editor.isActive("columns"),
        action: (editor) => {
          editor
            .chain()
            .focus()
            .setColumns()
            .focus(editor.state.selection.head - 1)
            .run();
        },
      },
      {
        name: "divider",
        label: "Divider",
        icon: Minus,
        description: "Insert a horizontal divider",
        aliases: ["hr"],
        action: (editor) => {
          editor.chain().focus().setHorizontalRule().run();
        },
      },
      {
        name: "button",
        label: "Button",
        icon: MousePointer2,
        description: "Insert a button",
        action: (editor) => {
          editor.chain().focus().setButton("Click me").run();
        },
      },
    ],
  },
];

export default GROUPS;
