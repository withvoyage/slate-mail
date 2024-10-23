import { memo } from "react";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Palette,
  Strikethrough,
  Underline,
  X,
} from "lucide-react";
import { ActionIcon, ColorPicker, Popover } from "slate-ui";

import { ContentTypePicker } from "@/components/menus/TextMenu/components/ContentTypePicker";
import { EditLinkPopover } from "@/components/menus/TextMenu/components/EditLinkPopover";
import { FontSizePicker } from "@/components/menus/TextMenu/components/FontSizePicker";
import { useTextmenuCommands } from "@/components/menus/TextMenu/hooks/useTextmenuCommands";
import { useTextmenuContentTypes } from "@/components/menus/TextMenu/hooks/useTextmenuContentTypes";
import { useTextmenuStates } from "@/components/menus/TextMenu/hooks/useTextmenuStates";
import { MenuProps } from "@/components/menus/types";
import { Toolbar } from "@/components/ui/Toolbar";
import { BubbleMenu } from "@tiptap/react";

// We memorize the button so each button is not rerendered
// on every editor state change
const MemoActionIcon = memo(ActionIcon);
const MemoColorPicker = memo(ColorPicker);
const MemoFontSizePicker = memo(FontSizePicker);
const MemoContentTypePicker = memo(ContentTypePicker);

export const TextMenu = ({ editor }: MenuProps) => {
  const commands = useTextmenuCommands(editor);
  const states = useTextmenuStates(editor);
  const blockOptions = useTextmenuContentTypes(editor);

  return (
    <BubbleMenu
      tippyOptions={{
        zIndex: 45,
        maxWidth: 1000,
        popperOptions: {
          placement: "top-start",
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
      }}
      editor={editor}
      pluginKey="textMenu"
      shouldShow={states.shouldShow}
      updateDelay={100}
    >
      <Toolbar.Wrapper>
        <MemoContentTypePicker options={blockOptions} />

        <MemoFontSizePicker
          onChange={commands.onSetFontSize}
          value={states.currentSize || ""}
        />
        <Toolbar.Divider />
        <MemoActionIcon
          tooltip="Bold (Mod + B)"
          onClick={commands.onBold}
          variant={states.isBold ? "secondary" : "subtle"}
          icon={Bold}
        />
        <MemoActionIcon
          tooltip="Italic (Mod + I)"
          onClick={commands.onItalic}
          variant={states.isItalic ? "secondary" : "subtle"}
          icon={Italic}
        />
        <MemoActionIcon
          tooltip="Underline (Mod + U)"
          onClick={commands.onUnderline}
          variant={states.isUnderline ? "secondary" : "subtle"}
          icon={Underline}
        />
        <MemoActionIcon
          tooltip="Strikehrough (Mod + Shift + S)"
          onClick={commands.onStrike}
          variant={states.isStrike ? "secondary" : "subtle"}
          icon={Strikethrough}
        />

        <EditLinkPopover onSetLink={commands.onLink} />
        <Popover
          content={
            <div className="flex gap-1">
              <ActionIcon icon={X} onClick={commands.onClearColor} />
              <MemoColorPicker
                value={states.currentColor}
                onChange={commands.onChangeColor}
              />
            </div>
          }
          side="bottom"
          className="shadow-lg bg-white p-1"
        >
          <MemoActionIcon
            variant={!!states.currentColor ? "secondary" : "subtle"}
            tooltip="Text color"
            icon={Palette}
          />
        </Popover>
        <Toolbar.Divider />

        <MemoActionIcon
          tooltip="Align left"
          onClick={commands.onAlignLeft}
          variant={states.isAlignLeft ? "secondary" : "subtle"}
          icon={AlignLeft}
        />
        <MemoActionIcon
          tooltip="Align center"
          onClick={commands.onAlignCenter}
          variant={states.isAlignCenter ? "secondary" : "subtle"}
          icon={AlignCenter}
        />
        <MemoActionIcon
          tooltip="Align right"
          onClick={commands.onAlignRight}
          variant={states.isAlignRight ? "secondary" : "subtle"}
          icon={AlignRight}
        />
        <MemoActionIcon
          tooltip="Justify"
          onClick={commands.onAlignJustify}
          variant={states.isAlignJustify ? "secondary" : "subtle"}
          icon={AlignJustify}
        />
      </Toolbar.Wrapper>
    </BubbleMenu>
  );
};
