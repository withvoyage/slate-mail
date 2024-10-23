import { useCallback } from 'react';

import {
  Editor,
  useEditorState,
} from '@tiptap/react';

export function useImageMenu(editor: Editor) {
  const shouldShow = useCallback(() => {
    const isActive = editor.isActive("imageBlock");

    return isActive;
  }, [editor]);

  const onAlignImageLeft = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("left")
      .run();
  }, [editor]);

  const onAlignImageCenter = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("center")
      .run();
  }, [editor]);

  const onAlignImageRight = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("right")
      .run();
  }, [editor]);

  const onWidthChange = useCallback(
    (value: number) => {
      editor
        .chain()
        .focus(undefined, { scrollIntoView: false })
        .setImageBlockWidth(value)
        .run();
    },
    [editor]
  );

  const onRadiusChange = useCallback(
    (value: number) => {
      editor
        .chain()
        .focus(undefined, { scrollIntoView: false })
        .setImageBlockBorderRadius(value)
        .run();
    },
    [editor]
  );

  const { isImageCenter, isImageLeft, isImageRight, width, borderRadius } =
    useEditorState({
      editor,
      selector: (ctx) => {
        return {
          isImageLeft: ctx.editor.isActive("imageBlock", { align: "left" }),
          isImageCenter: ctx.editor.isActive("imageBlock", { align: "center" }),
          isImageRight: ctx.editor.isActive("imageBlock", { align: "right" }),
          width: parseInt(ctx.editor.getAttributes("imageBlock")?.width || 0),
          borderRadius: parseInt(
            ctx.editor.getAttributes("imageBlock")?.borderRadius || 0
          ),
        };
      },
    });

  return {
    shouldShow,
    onAlignImageLeft,
    onAlignImageCenter,
    onAlignImageRight,
    onWidthChange,
    isImageCenter,
    isImageLeft,
    isImageRight,
    width,
    borderRadius,
    onRadiusChange,
  };
}
