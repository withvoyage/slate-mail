import { useRef } from "react";

import { Sparkles } from "lucide-react";
import { cn } from "slate-ui";

import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";

const colorClasses = [
  "bg-sky-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-cyan-600",
];

export function LiquidNodeView(props: NodeViewProps) {
  const { node } = props;
  const { label } = node.attrs;
  const spanRef = useRef<HTMLSpanElement>(null);

  const colorClass = colorClasses[label.length % colorClasses.length];

  return (
    <NodeViewWrapper
      as="span"
      ref={spanRef}
      className={cn(
        "px-1.5 py-0.5 text-sm leading-none w-fit rounded-lg text-white",
        colorClass
      )}
    >
      <Sparkles className="inline w-3 h-3 mb-0.5 mr-1" />
      {label}
    </NodeViewWrapper>
  );
}
