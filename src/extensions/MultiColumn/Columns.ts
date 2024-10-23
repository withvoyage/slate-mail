import { Node } from "@tiptap/core";

export enum ColumnLayout {
  SidebarLeft = "sidebar-left",
  SidebarRight = "sidebar-right",
  TwoColumn = "two-column",
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    columns: {
      setColumns: () => ReturnType;
      setLayout: (layout: ColumnLayout) => ReturnType;
    };
  }
}

export const Columns = Node.create({
  name: "columns",

  group: "columns",

  content: "column column",

  defining: true,

  isolating: true,

  addAttributes() {
    return {
      layout: {
        default: ColumnLayout.TwoColumn,
      },
    };
  },

  addCommands() {
    return {
      setColumns:
        () =>
        ({ commands }) =>
          commands.insertContent(
            `<table data-type="columns">
              <tbody>
                <tr>
                  <td data-type="column">
                    <p></p>
                  </td>
                  <td data-type="column">
                    <p></p>
                  /td>
                </tr>
              </tbody>
            </table>`
          ),
      setLayout:
        (layout: ColumnLayout) =>
        ({ commands }) =>
          commands.updateAttributes("columns", { layout }),
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "table",
      {
        "data-type": "columns",
        class: `layout-${HTMLAttributes.layout}`,
        style: "width: 100%; table-layout: fixed;",
      },
      ["tbody", {}, ["tr", {}, 0]],
    ];
  },

  parseHTML() {
    return [
      {
        tag: 'table[data-type="columns"]',
      },
    ];
  },
});

export default Columns;
