import { mergeAttributes } from '@tiptap/core';
import type { Level } from '@tiptap/extension-heading';
import TiptapHeading from '@tiptap/extension-heading';

export const Heading = TiptapHeading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const nodeLevel = parseInt(node.attrs.level, 10) as Level;
    const hasLevel = this.options.levels.includes(nodeLevel);
    const level = hasLevel ? nodeLevel : this.options.levels[0];
    const margin = level <= 3 ? 24 : 16;

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        style: `margin-top: ${margin}px; margin-bottom: 0px;`,
      }),
      0,
    ];
  },
});

export default Heading;
