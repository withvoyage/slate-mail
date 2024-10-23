import { mergeAttributes } from '@tiptap/core';
import TiptapHorizontalRule from '@tiptap/extension-horizontal-rule';

export const HorizontalRule = TiptapHorizontalRule.extend({
  renderHTML() {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-type": this.name,
        style: "margin-top: 32px; margin-bottom: 32px;",
      }),
      [
        "hr",
        {
          style: "border: 0; border-top: 1px solid #ddd;",
        },
      ],
    ];
  },
});

export default HorizontalRule;
