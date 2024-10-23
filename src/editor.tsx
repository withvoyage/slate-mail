import { useRef } from "react";

import { SlateProvider } from "slate-ui";

import { Editor, EditorContent, JSONContent } from "@tiptap/react";

import { ContentItemMenu, LinkMenu, TextMenu } from "./components";
import { ButtonMenu } from "./components/menus/ButtonMenu";
import ImageBlockMenu from "./extensions/ImageBlock/components/ImageBlockMenu";

export type SlateEmailEditorContent = JSONContent;

export interface SlateEmailEditorProps {
  editor: Editor;
  className?: string;
}

export const SlateEmailEditor = ({
  editor,
  className,
}: SlateEmailEditorProps) => {
  const menuContainerRef = useRef(null);

  return (
    <SlateProvider>
      <div ref={menuContainerRef} className={className}>
        <EditorContent editor={editor} />
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
        <ButtonMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </SlateProvider>
  );
};
