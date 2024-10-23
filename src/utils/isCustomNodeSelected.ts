import { HorizontalRule, ImageBlock, ImageUpload, Link } from "@/extensions";
import { ButtonBlock } from "@/extensions/Button";
import { LiquidNode } from "@/extensions/Liquid";
import { Editor } from "@tiptap/react";

export const isCustomNodeSelected = (editor: Editor, node: HTMLElement) => {
  const customNodes = [
    HorizontalRule.name,
    ImageBlock.name,
    ImageUpload.name,
    ImageBlock.name,
    Link.name,
    ButtonBlock.name,
    LiquidNode.name,
  ];

  return customNodes.some((type) => editor.isActive(type));
};

export default isCustomNodeSelected;
