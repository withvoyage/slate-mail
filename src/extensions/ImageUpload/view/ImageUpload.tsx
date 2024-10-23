import { useCallback } from "react";

import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";

import { ImageUploader } from "./ImageUploader";

export const ImageUpload = ({ getPos, editor, extension }: NodeViewProps) => {
  const onUpload = useCallback(
    (url: string) => {
      if (url) {
        editor
          .chain()
          .setImageBlock({ src: url })
          .deleteRange({ from: getPos(), to: getPos() })
          .focus()
          .run();
      }
    },
    [getPos, editor]
  );

  return (
    <NodeViewWrapper>
      <div className="p-0 m-0" data-drag-handle>
        <ImageUploader
          onUpload={onUpload}
          upload={extension.options.onImageUpload}
        />
      </div>
    </NodeViewWrapper>
  );
};

export default ImageUpload;
