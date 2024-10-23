import { History } from "@tiptap/extension-history";

import {
  Color,
  Column,
  Columns,
  Document,
  Dropcursor,
  Emoji,
  emojiSuggestion,
  Focus,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalRule,
  ImageBlock,
  ImageUpload,
  Link,
  Liquid,
  Placeholder,
  Selection,
  SlashCommand,
  StarterKit,
  TextAlign,
  TextStyle,
  TrailingNode,
  Typography,
  Underline,
  UniqueID,
} from "./";
import { ButtonBlock } from "./Button";
import { LiquidNode } from "./Liquid";
import { Group } from "./Liquid/types";

export const ExtensionKit = (liquidGroups: Group[]) => [
  Document,
  Columns,
  Column,
  Selection,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  HorizontalRule,
  UniqueID.configure({
    types: ["paragraph", "heading", "blockquote", "codeBlock"],
  }),
  StarterKit.configure({
    document: false,
    dropcursor: false,
    heading: false,
    horizontalRule: false,
    blockquote: false,
    history: false,
    codeBlock: false,
  }),
  TextStyle,
  FontSize,
  FontFamily,
  Color,
  TrailingNode,
  Link.configure({
    openOnClick: false,
  }),
  Highlight.configure({ multicolor: true }),
  Underline,
  ImageBlock,
  ImageUpload,
  Emoji.configure({
    enableEmoticons: true,
    suggestion: emojiSuggestion,
  }),
  TextAlign.extend({
    addKeyboardShortcuts() {
      return {};
    },
  }).configure({
    types: ["heading", "paragraph"],
  }),
  Liquid.configure({
    liquidGroups,
  }),
  LiquidNode,
  ButtonBlock,
  Typography,
  Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: () => "",
  }),
  SlashCommand,
  Focus,
  Dropcursor.configure({
    width: 2,
    class: "ProseMirror-dropcursor border bg-muted rounded-full",
  }),
  History.configure({
    depth: 10,
  }),
];

export default ExtensionKit;
