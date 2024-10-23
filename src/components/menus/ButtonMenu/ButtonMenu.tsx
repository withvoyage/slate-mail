import React, { useCallback, useState } from "react";

import { MenuProps } from "@/components/menus/types";
import { BubbleMenu as BaseBubbleMenu, useEditorState } from "@tiptap/react";

import { ButtonEditorPanel } from "./ButtonEditorPanel";
import { ButtonPreviewPanel } from "./ButtonPreviewPanel";

export const ButtonMenu = ({ editor, appendTo }: MenuProps): JSX.Element => {
  const [showEdit, setShowEdit] = useState(false);
  const { link, target } = useEditorState({
    editor,
    selector: (ctx) => {
      const attrs = ctx.editor.getAttributes("buttonBlock");
      return { link: attrs.link, target: attrs.target, align: attrs.align };
    },
  });

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive("buttonBlock");
    return isActive;
  }, [editor]);

  const handleEdit = useCallback(() => {
    setShowEdit(true);
  }, []);

  const onSetButton = useCallback(
    (url: string, newTab?: boolean) => {
      editor
        .chain()
        .focus()
        .setButtonBlockLink(url)
        .setButtonBlockTarget(newTab ? "_blank" : "_self")
        .run();
      setShowEdit(false);
    },
    [editor]
  );

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey="buttonMenu"
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        zIndex: 45,
        popperOptions: {
          modifiers: [
            {
              name: "preventOverflow",
              options: {
                boundary: "viewport",
                padding: 8,
              },
            },
            {
              name: "flip",
              options: {
                fallbackPlacements: ["bottom-start", "top-end", "bottom-end"],
              },
            },
          ],
        },
        maxWidth: 1000,
        appendTo: () => {
          return appendTo?.current;
        },
        onHidden: () => {
          setShowEdit(false);
        },
        placement: "top",
      }}
    >
      {showEdit ? (
        <ButtonEditorPanel
          initialUrl={link}
          initialOpenInNewTab={target === "_blank"}
          onSetButton={onSetButton}
        />
      ) : (
        <ButtonPreviewPanel url={link} onEdit={handleEdit} editor={editor} />
      )}
    </BaseBubbleMenu>
  );
};

export default ButtonMenu;
