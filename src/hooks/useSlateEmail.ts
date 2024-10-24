import { useEffect } from "react";

import { ExtensionKit } from "@/extensions/extension-kit";
import { Group } from "@/extensions/Liquid/types";
import { seedContent } from "@/utils";
import type { Editor } from "@tiptap/core";
import { JSONContent, useEditor } from "@tiptap/react";

export interface UseSlateEmailProps {
  defaultValue?: JSONContent;
  onCreate?: (editor: Editor) => void;
  liquidGroups?: Group[];
  onImageUpload?: (file: File) => Promise<string>;
  onUpdate?: (editor: Editor) => void;
}

export const useSlateEmail = ({
  defaultValue,
  onCreate,
  liquidGroups,
  onImageUpload,
  onUpdate,
}: UseSlateEmailProps) => {
  const editor = useEditor(
    {
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      onCreate: (ctx) => {
        ctx.editor.commands.setContent(defaultValue || seedContent);
        ctx.editor.commands.focus("start", { scrollIntoView: true });
        onCreate?.(ctx.editor);
      },
      extensions: ExtensionKit({
        liquidGroups: liquidGroups || [],
        onImageUpload,
      }),
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          class: "min-h-full",
        },
      },
    },
    []
  );

  useEffect(() => {
    if (onUpdate) {
      const fn = () => editor.isInitialized && onUpdate(editor);
      editor.on("update", fn);

      return () => {
        editor.off("update", fn);
      };
    }
  }, [onUpdate, editor]);

  return { editor };
};
