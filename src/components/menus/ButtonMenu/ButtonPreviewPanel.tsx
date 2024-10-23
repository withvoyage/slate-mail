import { memo, useCallback, useState } from "react";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Link,
  PaintBucket,
  Palette,
  Scan,
} from "lucide-react";
import { ActionIcon, ColorPicker, Popover, Slider } from "slate-ui";

import { Toolbar } from "@/components/ui/Toolbar";
import { Editor, useEditorState } from "@tiptap/react";

const MemoActionIcon = memo(ActionIcon);
const MemoColorPicker = memo(ColorPicker);
const MemoSlider = memo(Slider);

export type ButtonPreviewPanelProps = {
  url: string;
  onEdit: () => void;
  editor: Editor;
};

export const ButtonPreviewPanel = ({
  onEdit,
  editor,
}: ButtonPreviewPanelProps) => {
  const [isSettingBorderRadius, setIsSettingBorderRadius] = useState(false);
  const {
    isButtonLeft,
    isButtonCenter,
    isButtonRight,
    color,
    backgroundColor,
    borderRadius,
  } = useEditorState({
    editor,
    selector: (ctx) => ({
      isButtonLeft: ctx.editor.isActive("buttonBlock", { align: "left" }),
      isButtonCenter: ctx.editor.isActive("buttonBlock", { align: "center" }),
      isButtonRight: ctx.editor.isActive("buttonBlock", { align: "right" }),
      backgroundColor: ctx.editor.getAttributes("buttonBlock").backgroundColor,
      color: ctx.editor.getAttributes("buttonBlock").color,
      borderRadius: ctx.editor.getAttributes("buttonBlock").borderRadius,
    }),
  });

  const onAlignButtonLeft = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setButtonBlockAlign("left")
      .run();
  }, [editor]);

  const onAlignButtonCenter = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setButtonBlockAlign("center")
      .run();
  }, [editor]);

  const onAlignButtonRight = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setButtonBlockAlign("right")
      .run();
  }, [editor]);

  const onColorChange = useCallback(
    (color: string) => {
      editor
        .chain()
        .focus(undefined, { scrollIntoView: false })
        .setButtonBlockColor(color)
        .run();
    },
    [editor]
  );

  const onBackgroundColorChange = useCallback(
    (color: string) => {
      editor
        .chain()
        .focus(undefined, { scrollIntoView: false })
        .setButtonBlockBackgroundColor(color)
        .run();
    },
    [editor]
  );

  const onBorderRadiusChange = useCallback(
    (borderRadius: number) => {
      editor
        .chain()
        .focus(undefined, { scrollIntoView: false })
        .setButtonBlockBorderRadius(borderRadius)
        .run();
    },
    [editor]
  );

  return (
    <Toolbar.Wrapper>
      <Popover
        side="top"
        className="z-[10000] p-1 shadow"
        content={
          <MemoColorPicker
            value={backgroundColor}
            onChange={onBackgroundColorChange}
            side="top"
          />
        }
      >
        <MemoActionIcon
          icon={PaintBucket}
          tooltip="Background Color"
          variant="subtle"
        />
      </Popover>
      <Popover
        side="top"
        className="z-[10000] p-1 shadow"
        content={
          <MemoColorPicker value={color} onChange={onColorChange} side="top" />
        }
      >
        <MemoActionIcon icon={Palette} tooltip="Text Color" variant="subtle" />
      </Popover>

      <MemoActionIcon
        tooltip="Border Radius"
        variant={isSettingBorderRadius ? "secondary" : "subtle"}
        onClick={() => setIsSettingBorderRadius((v) => !v)}
        icon={Scan}
      />

      {isSettingBorderRadius && (
        <>
          <MemoSlider
            value={[borderRadius]}
            onValueChange={(v) => onBorderRadiusChange(v[0])}
            className="w-48 mx-2"
            min={0}
            max={16}
          />
          <span className="text-xs text-muted">{borderRadius}px</span>
        </>
      )}
      <Toolbar.Divider />
      {!isSettingBorderRadius && (
        <>
          <MemoActionIcon
            tooltip="Align image left"
            variant={isButtonLeft ? "secondary" : "subtle"}
            onClick={onAlignButtonLeft}
            icon={AlignLeft}
          />
          <MemoActionIcon
            tooltip="Align image center"
            variant={isButtonCenter ? "secondary" : "subtle"}
            onClick={onAlignButtonCenter}
            icon={AlignCenter}
          />
          <MemoActionIcon
            tooltip="Align image right"
            variant={isButtonRight ? "secondary" : "subtle"}
            onClick={onAlignButtonRight}
            icon={AlignRight}
          />
        </>
      )}
      <Toolbar.Divider />

      <MemoActionIcon
        variant="subtle"
        icon={Link}
        onClick={onEdit}
        tooltip="Edit Link"
      />
    </Toolbar.Wrapper>
  );
};
