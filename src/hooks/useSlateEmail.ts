import { useMemo } from "react";

import { Doc as YDoc } from "yjs";

import { ExtensionKit } from "@/extensions/extension-kit";
import { Group } from "@/extensions/Liquid/types";
import { seedContent } from "@/utils";
import type { Editor } from "@tiptap/core";
import { JSONContent, useEditor } from "@tiptap/react";

export interface UseSlateEmailProps {
  defaultValue?: JSONContent;
  onCreate?: (editor: Editor) => void;
  onUpdate?: (editor: Editor) => void;
  liquidGroups?: Group[];
  onImageUpload?: (file: File) => Promise<string>;
}

export const useSlateEmail = ({
  defaultValue,
  onCreate,
  onUpdate,
  liquidGroups,
  onImageUpload,
}: UseSlateEmailProps) => {
  const ydoc = useMemo(() => new YDoc(), []);

  const editor = useEditor(
    {
      immediatelyRender: true,
      shouldRerenderOnTransaction: false,
      autofocus: true,
      onCreate: (ctx) => {
        if (ctx.editor.isEmpty) {
          ctx.editor.commands.setContent(defaultValue || seedContent);
          ctx.editor.commands.focus("start", { scrollIntoView: true });
          onCreate?.(ctx.editor);
        }
        if (onUpdate) {
          ctx.editor.on("update", () => onUpdate(ctx.editor));
        }
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
    [ydoc]
  );

  return { editor };
};
