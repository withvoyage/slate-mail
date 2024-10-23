import { useCallback, useRef } from "react";

import { cn } from "slate-ui";

import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";

export const ButtonBlockView = (props: NodeViewProps) => {
  const { editor, getPos, node, updateAttributes } = props;
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const { label } = node.attrs;

  const wrapperClassName = cn(
    node.attrs.align === "left" ? "ml-0" : "ml-auto",
    node.attrs.align === "right" ? "mr-0" : "mr-auto",
    node.attrs.align === "center" && "mx-auto"
  );

  const onClick = useCallback(() => {
    editor.commands.setNodeSelection(getPos());
  }, [getPos, editor.commands]);

  // Handle label update on blur
  const handleLabelChange = useCallback(() => {
    const newLabel = buttonWrapperRef.current?.innerText.trim();
    if (newLabel && newLabel !== label) {
      updateAttributes({ label: newLabel });
    }
  }, [label, updateAttributes]);

  return (
    <NodeViewWrapper>
      <NodeViewContent
        className={cn("block px-3 py-1 w-fit", wrapperClassName)}
        onClick={onClick}
        onBlur={handleLabelChange}
        style={{
          backgroundColor: node.attrs.backgroundColor,
          color: node.attrs.color,
          width: node.attrs.width,
          borderRadius: `${node.attrs.borderRadius}px`,
        }}
      />
    </NodeViewWrapper>
  );
};

export default ButtonBlockView;
