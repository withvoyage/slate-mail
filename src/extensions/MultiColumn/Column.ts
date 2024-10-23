import { mergeAttributes, Node } from "@tiptap/core";

export const Column = Node.create({
  name: "column",
  content: "block+",
  isolating: true,

  renderHTML({ HTMLAttributes }) {
    return [
      "td",
      mergeAttributes(HTMLAttributes, { "data-type": "column" }),
      0,
    ];
  },

  parseHTML() {
    return [
      {
        tag: 'td[data-type="column"]',
      },
    ];
  },
});

export default Column;
