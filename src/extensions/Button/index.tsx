import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import ButtonBlockView from "./view";

export interface ButtonOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    button: {
      /**
       * Inserts a button into the editor.
       */
      setButton: (label: string) => ReturnType;
      /**
       * Sets the alignment of the button.
       */
      setButtonBlockAlign: (align: string) => ReturnType;
      /**
       * Sets the link of the button.
       */
      setButtonBlockLink: (link: string) => ReturnType;
      /**
       * Sets the target of the button.
       */
      setButtonBlockTarget: (target: string) => ReturnType;
      /**
       * Sets the background color of the button.
       */
      setButtonBlockBackgroundColor: (backgroundColor: string) => ReturnType;
      /**
       * Sets the color of the button.
       */
      setButtonBlockColor: (color: string) => ReturnType;
      /**
       * Sets the border radius of the button.
       */
      setButtonBlockBorderRadius: (borderRadius: number) => ReturnType;
    };
  }
}

export const ButtonBlock = Node.create<ButtonOptions>({
  name: "buttonBlock",
  content: "inline*",
  group: "block",
  defining: true,
  selectable: true,

  addAttributes() {
    return {
      align: {
        default: "left",
        parseHTML: (element) => element.getAttribute("data-align"),
        renderHTML: (attributes) => ({
          "data-align": attributes.align,
          align: attributes.align,
          style:
            attributes.align === "center"
              ? "margin: 0 auto;"
              : attributes.align === "right"
              ? "margin-left: auto;"
              : "margin-right: auto;",
        }),
      },
      link: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-link"),
        renderHTML: (attributes) => ({
          "data-link": attributes.link,
          href: attributes.link,
        }),
      },
      target: {
        default: "_self",
        parseHTML: (element) => element.getAttribute("data-target"),
        renderHTML: (attributes) => ({
          "data-target": attributes.target,
          target: attributes.target,
        }),
      },
      backgroundColor: {
        default: "#000000",
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => ({
          "data-background-color": attributes.backgroundColor,
          style: `background-color: ${attributes.backgroundColor};`,
        }),
      },
      color: {
        default: "#ffffff",
        parseHTML: (element) => element.getAttribute("data-color"),
        renderHTML: (attributes) => ({
          "data-color": attributes.color,
          style: `color: ${attributes.color};`,
        }),
      },
      borderRadius: {
        default: 8,
        parseHTML: (element) => element.getAttribute("data-border-radius"),
        renderHTML: (attributes) => ({
          "data-border-radius": attributes.borderRadius,
          style: `border-radius: ${attributes.borderRadius}px;`,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='buttonBlock']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "a",
      {
        href: HTMLAttributes.link,
        target: HTMLAttributes.target,
        style: `display: block; width: fit-content; ${
          HTMLAttributes.align == "center"
            ? "margin: 0 auto"
            : HTMLAttributes.align == "right"
            ? "margin-left: auto"
            : "margin-right: auto"
        };`,
      },
      [
        "button",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          style:
            "border: none; padding: 4px 12px; cursor: pointer; font-size: 16px; line-height: 1.5;",
        }),
        0,
      ],
    ];
  },

  addCommands() {
    return {
      setButton:
        (label) =>
        ({ commands }) => {
          return commands.insertContent(
            `<div data-type="buttonBlock" data-align="center" data-background-color="#000000" data-color="#ffffff" data-border-radius="8"><button>${label}</button></div>`
          );
        },
      setButtonBlockAlign:
        (align) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { align });
        },
      setButtonBlockLink:
        (link) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { link });
        },
      setButtonBlockTarget:
        (target) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { target });
        },
      setButtonBlockBackgroundColor:
        (backgroundColor) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { backgroundColor });
        },
      setButtonBlockColor:
        (color) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { color });
        },
      setButtonBlockBorderRadius:
        (borderRadius) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, { borderRadius });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ButtonBlockView);
  },
});
