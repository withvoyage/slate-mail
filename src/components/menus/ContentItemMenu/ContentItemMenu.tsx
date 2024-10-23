import { useEffect, useState } from "react";

import {
  Clipboard,
  Copy,
  GripVertical,
  Plus,
  RemoveFormatting,
  Trash2,
} from "lucide-react";
import { ActionIcon, Button, Popover } from "slate-ui";

import { Surface } from "@/components/ui/Surface";
import { Toolbar } from "@/components/ui/Toolbar";
import DragHandle from "@tiptap-pro/extension-drag-handle-react";
import { Editor } from "@tiptap/react";

import useContentItemActions from "./hooks/useContentItemActions";
import { useData } from "./hooks/useData";

export type ContentItemMenuProps = {
  editor: Editor;
};

export const ContentItemMenu = ({ editor }: ContentItemMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const data = useData();
  const actions = useContentItemActions(
    editor,
    data.currentNode,
    data.currentNodePos
  );

  useEffect(() => {
    if (menuOpen) {
      editor.commands.setMeta("lockDragHandle", true);
    } else {
      editor.commands.setMeta("lockDragHandle", false);
    }
  }, [editor, menuOpen]);

  return (
    <DragHandle
      pluginKey="ContentItemMenu"
      editor={editor}
      onNodeChange={data.handleNodeChange}
      tippyOptions={{
        offset: [-2, 16],
        zIndex: 45,
        maxWidth: 1000,
      }}
    >
      <div className="flex items-center gap-0.5">
        <ActionIcon icon={Plus} onClick={actions.handleAdd} />
        <Popover
          content={
            <Surface className="p-2 flex gap-1 flex-col bg-white min-w-[16rem]">
              <Button
                iconLeft={RemoveFormatting}
                onClick={actions.resetTextFormatting}
                variant="subtle"
                className="hover:bg-muted"
              >
                Clear formatting
              </Button>
              <Button
                iconLeft={Clipboard}
                variant="subtle"
                className="hover:bg-muted"
                onClick={actions.copyNodeToClipboard}
              >
                Copy to clipboard
              </Button>
              <Button
                iconLeft={Copy}
                onClick={actions.duplicateNode}
                variant="subtle"
              >
                Duplicate
              </Button>
              <Toolbar.Divider horizontal />
              <Button
                variant="subtle"
                iconLeft={Trash2}
                onClick={() => {
                  actions.deleteNode();
                  setMenuOpen(false);
                }}
                className="text-red-500 bg-red-500 hover:bg-red-500 bg-opacity-10 hover:bg-opacity-20"
              >
                Delete
              </Button>
            </Surface>
          }
          open={menuOpen}
          side={"bottom"}
          onOpenChange={setMenuOpen}
        >
          <ActionIcon icon={GripVertical} />
        </Popover>
      </div>
    </DragHandle>
  );
};
