import tippy from "tippy.js";

import { Editor, Extension, Node } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import { ReactNodeViewRenderer, ReactRenderer } from "@tiptap/react";
import Suggestion, {
  SuggestionKeyDownProps,
  SuggestionProps,
} from "@tiptap/suggestion";

import LiquidList from "./LiquidList";
import { Group } from "./types";
import { LiquidNodeView } from "./view";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    liquidNode: {
      setLiquid: (label: string, liquid: string) => ReturnType;
    };
  }
}

const extensionName = "liquid";
let popup: any;

export const Liquid = Extension.create({
  name: extensionName,
  priority: 200,

  addOptions() {
    return {
      liquidGroups: [] as Group[],
    };
  },

  onCreate() {
    popup = tippy("body", {
      interactive: true,
      trigger: "manual",
      placement: "bottom-start",
      maxWidth: "16rem",
      offset: [16, 8],
      zIndex: 45,
      popperOptions: {
        strategy: "fixed",
        modifiers: [
          {
            name: "flip",
            enabled: false,
          },
        ],
      },
    });
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: "{",
        pluginKey: new PluginKey(extensionName),
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          const isRootDepth = $from.depth === 1;

          const afterContent = $from.parent.textContent?.substring(
            $from.parent.textContent?.indexOf("{")
          );
          const isValidAfterContent = !afterContent?.endsWith("  ");

          console.log("allow", isRootDepth, isValidAfterContent);

          return isRootDepth && isValidAfterContent;
        },
        command: ({ editor, props }: { editor: Editor; props: any }) => {
          const { view, state } = editor;
          const { $head, $from } = view.state.selection;
          const end = $from.pos;
          const from = $head?.nodeBefore
            ? end -
              ($head.nodeBefore.text?.substring(
                $head.nodeBefore.text?.indexOf("{")
              ).length ?? 0)
            : $from.start();

          const tr = state.tr.deleteRange(from, end);
          view.dispatch(tr);
          console.log("command", props);
          editor.commands.setLiquid(props.name, `{{ ${props.id} }}`);
          view.focus();
        },
        items: ({ query }: { query: string }) => {
          const groups = this.options.liquidGroups as Group[];

          const withFilteredVariables = groups.map((group) => ({
            ...group,
            variables: group.variables.filter((variable) => {
              const labelNormalized = variable.name.toLowerCase().trim();
              const queryNormalized = query.toLowerCase().trim();

              return labelNormalized.includes(queryNormalized);
            }),
          }));
          const withoutEmptyGroups = withFilteredVariables.filter((group) => {
            if (group.variables.length > 0) {
              return true;
            }

            return false;
          });
          return withoutEmptyGroups;
        },
        render: () => {
          let component: any;
          let scrollHandler: (() => void) | null = null;

          return {
            onStart: (props: SuggestionProps) => {
              component = new ReactRenderer(LiquidList, {
                props,
                editor: props.editor,
              });

              const { view } = props.editor;
              const editorNode = view.dom as HTMLElement;

              const getReferenceClientRect = () => {
                if (!props.clientRect) {
                  return props.editor.storage[extensionName].rect;
                }

                const rect = props.clientRect();

                if (!rect) {
                  return props.editor.storage[extensionName].rect;
                }

                let yPos = rect.y;

                if (
                  rect.top + component.element.offsetHeight + 40 >
                  window.innerHeight
                ) {
                  const diff =
                    rect.top +
                    component.element.offsetHeight -
                    window.innerHeight +
                    40;
                  yPos = rect.y - diff;
                }

                // Account for when the editor is bound inside a container that doesn't go all the way to the edge of the screen
                const editorXOffset = editorNode.getBoundingClientRect().x;
                return new DOMRect(rect.x, yPos, rect.width, rect.height);
              };
              scrollHandler = () => {
                popup?.[0].setProps({
                  getReferenceClientRect,
                });
              };
              view.dom.parentElement?.addEventListener("scroll", scrollHandler);

              popup?.[0].setProps({
                getReferenceClientRect,
                appendTo: () => document.body,
                content: component.element,
              });
              popup?.[0].show();
            },

            onUpdate(props: SuggestionProps) {
              component.updateProps(props);

              const { view } = props.editor;

              const editorNode = view.dom as HTMLElement;

              const getReferenceClientRect = () => {
                if (!props.clientRect) {
                  return props.editor.storage[extensionName].rect;
                }

                const rect = props.clientRect();

                if (!rect) {
                  return props.editor.storage[extensionName].rect;
                }

                // Account for when the editor is bound inside a container that doesn't go all the way to the edge of the screen
                return new DOMRect(rect.x, rect.y, rect.width, rect.height);
              };

              let scrollHandler = () => {
                popup?.[0].setProps({
                  getReferenceClientRect,
                });
              };

              view.dom.parentElement?.addEventListener("scroll", scrollHandler);

              // eslint-disable-next-line no-param-reassign
              props.editor.storage[extensionName].rect = props.clientRect
                ? getReferenceClientRect()
                : {
                    width: 0,
                    height: 0,
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                  };
              popup?.[0].setProps({
                getReferenceClientRect,
              });
            },
            onKeyDown(props: SuggestionKeyDownProps) {
              if (props.event.key === "Escape") {
                popup?.[0].hide();

                return true;
              }

              if (!popup?.[0].state.isShown) {
                popup?.[0].show();
              }

              return component.ref?.onKeyDown(props);
            },
            onExit(props) {
              popup?.[0].hide();
              if (scrollHandler) {
                const { view } = props.editor;
                view.dom.parentElement?.removeEventListener(
                  "scroll",
                  scrollHandler
                );
              }
              component.destroy();
            },
          };
        },
      }),
    ];
  },

  addStorage() {
    return {
      rect: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    };
  },
});

export const LiquidNode = Node.create({
  name: "liquidNode",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      label: {
        default: null,
      },
      liquid: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "span",
        getAttrs: (dom) => {
          const label = dom.getAttribute("data-label");
          const liquid = dom.getAttribute("data-liquid");
          return { liquid, label };
        },
      },
    ];
  },
  renderHTML({ node }) {
    return [
      "span",
      { "data-label": node.attrs.label, "data-liquid": node.attrs.liquid },
      node.attrs.liquid,
    ];
  },
  addCommands() {
    return {
      setLiquid:
        (label: string, liquid: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "liquidNode",
            attrs: { label, liquid },
          });
        },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(LiquidNodeView);
  },
});
