import React, { memo, useState } from "react";

import {
  AlignHorizontalDistributeCenter,
  AlignHorizontalDistributeEnd,
  AlignHorizontalDistributeStart,
  MoveHorizontal,
  Scan,
} from "lucide-react";
import { ActionIcon, Slider } from "slate-ui";
import { v4 as uuid } from "uuid";

import { MenuProps } from "@/components/menus/types";
import { Toolbar } from "@/components/ui/Toolbar";
import { BubbleMenu as BaseBubbleMenu } from "@tiptap/react";

import { useImageMenu } from "./hooks";

const MemoSlider = memo(Slider);
const MemoActionIcon = memo(ActionIcon);

export const ImageBlockMenu = ({ editor }: MenuProps): JSX.Element => {
  const [sliderState, setSliderState] = useState<"width" | "radius" | null>(
    null
  );
  const {
    shouldShow,
    isImageCenter,
    isImageLeft,
    isImageRight,
    onAlignImageCenter,
    onAlignImageLeft,
    onAlignImageRight,
    onWidthChange,
    width,
    onRadiusChange,
    borderRadius,
  } = useImageMenu(editor);

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`imageBlockMenu-${uuid()}`}
      shouldShow={shouldShow}
      updateDelay={100}
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
    >
      <Toolbar.Wrapper className="pr-1">
        <MemoActionIcon
          tooltip="Align image left"
          variant={isImageLeft ? "secondary" : "subtle"}
          onClick={onAlignImageLeft}
          icon={AlignHorizontalDistributeStart}
        />
        <MemoActionIcon
          tooltip="Align image center"
          variant={isImageCenter ? "secondary" : "subtle"}
          onClick={onAlignImageCenter}
          icon={AlignHorizontalDistributeCenter}
        />
        <MemoActionIcon
          tooltip="Align image right"
          variant={isImageRight ? "secondary" : "subtle"}
          onClick={onAlignImageRight}
          icon={AlignHorizontalDistributeEnd}
        />
        <Toolbar.Divider />
        <MemoActionIcon
          icon={MoveHorizontal}
          onClick={() =>
            setSliderState((p) => (p === "width" ? null : "width"))
          }
          tooltip="Change width"
          variant={sliderState === "width" ? "secondary" : "subtle"}
        />
        <MemoActionIcon
          icon={Scan}
          onClick={() =>
            setSliderState((p) => (p === "radius" ? null : "radius"))
          }
          tooltip="Change radius"
          variant={sliderState === "radius" ? "secondary" : "subtle"}
        />
        {sliderState === "width" && (
          <>
            <MemoSlider
              value={[width]}
              onValueChange={(v) => onWidthChange(v[0])}
              min={10}
              max={100}
              className="w-36 mx-2"
            />
            <span className="text-sm mr-2">{width}%</span>
          </>
        )}
        {sliderState === "radius" && (
          <>
            <MemoSlider
              value={[borderRadius]}
              onValueChange={(v) => onRadiusChange(v[0])}
              min={0}
              max={100}
              className="w-36 mx-2"
            />
            <span className="text-sm mr-2">{borderRadius}px</span>
          </>
        )}
      </Toolbar.Wrapper>
    </BaseBubbleMenu>
  );
};

export default ImageBlockMenu;
