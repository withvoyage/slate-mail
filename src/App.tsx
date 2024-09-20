import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  Button,
  RadioGroup,
} from 'slate-ui';

import {
  DndContext,
  DragOverlay,
} from '@dnd-kit/core';
import { render } from '@react-email/components';

import {
  doArrayMove,
  findClosestContainer,
  findNode,
  insertNode,
  Node,
  NODE_DEFAULTS,
  removeNode,
} from './components';
import { Background } from './components/Background';
import { Draggable } from './dnd';

const EditingContext = createContext<boolean>(false);
export const useIsEditing = () => {
  return useContext(EditingContext);
};

export const ActiveDragContext = createContext<{
  id: string;
  type: Node["type"];
} | null>(null);
export const useActiveDrag = () => {
  return useContext(ActiveDragContext);
};

const DEFAULT_TREE: Node = {
  id: "root",
  type: "section",
  styles: {
    padding: "20px",
  },
  children: [
    {
      id: crypto.randomUUID(),
      type: "section",
      children: [
        {
          id: crypto.randomUUID(),
          type: "heading",
          content: "Hello, world!",
          styles: {
            fontSize: "32px",
          },
        },
        {
          id: crypto.randomUUID(),
          type: "heading",
          content: "Welcome to the jungle!",
          styles: {
            fontSize: "24px",
          },
        },
      ],
      styles: {
        margin: "0 auto",
        backgroundColor: "#f0f0f0",
        width: 650,
        padding: "20px",
        borderRadius: "5px",
      },
    },
  ],
};

export function App() {
  const [tree, setTree] = useState<Node>(DEFAULT_TREE);
  const [html, setHtml] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(true);
  const [activeDrag, setActiveDrag] = useState<Node | null>(null);

  const getDragOverlayElement = useCallback(
    (tree: Node) => {
      if (!activeDrag) return null;
      if (activeDrag.id.length === 36) {
        const node = findNode(tree, activeDrag.id);
        if (!node) return null;
        const Component = NODE_DEFAULTS[node.type].component;

        return (
          <Draggable id={node.id}>
            <Component node={node} setNode={setTree} />
          </Draggable>
        );
      }
    },
    [activeDrag]
  );

  useEffect(() => {
    render(<Background node={tree} setNode={setTree} />).then((html) =>
      setHtml(html)
    );
  }, [tree]);

  const overlayElement = getDragOverlayElement(tree);

  return (
    <div className="w-screen h-screen flex flex-col gap-4">
      <DndContext
        onDragStart={(e) => {
          const { active } = e;
          // If we're dragging an existing item.
          if (active.id.toString().length === 36) {
            const node = findNode(tree, active.id.toString());
            if (!node) return;
            setActiveDrag(node);
          } else {
            // If we're dragging a new item from the top bar.
            setActiveDrag({
              id: crypto.randomUUID(),
              type: active.id as Node["type"],
              ...NODE_DEFAULTS[active.id as Node["type"]].default,
            });
          }
        }}
        onDragOver={(e) => {
          const { active, over } = e;
          if (!activeDrag) return;

          if (over && active) {
            if (over.id === active.id) return;

            // Get the closest container to the source and destination.
            const closestContainerToSource = findClosestContainer(
              tree,
              active.id.toString(),
              false
            );
            const closestContainerToDestination = findClosestContainer(
              tree,
              over.id.toString()
            );

            // If the move is just inside one container, dndkit handles that.
            if (
              closestContainerToDestination?.id === closestContainerToSource?.id
            ) {
              return;
            }

            // If an item is being dragged into a container, we need to add it to that
            // container and remove it from all others. dndkit will handle the rest
            // of the sorting logic.
            if (closestContainerToDestination) {
              setTree(
                insertNode(
                  removeNode(tree, activeDrag.id),
                  closestContainerToDestination.id,
                  activeDrag
                )
              );
            }
          }
        }}
        onDragEnd={(e) => {
          setActiveDrag(null);
          const { active, over } = e;
          if (!active || !over) return;

          const sourceContainer = findClosestContainer(
            tree,
            active.id.toString(),
            false
          );
          const destinationContainer = findClosestContainer(
            tree,
            over?.id.toString()
          );

          // If both items started in the same container, we just do an arrayMove
          // on the children.
          if (
            sourceContainer &&
            sourceContainer?.id === destinationContainer?.id
          ) {
            const activeIndex = sourceContainer.children?.findIndex(
              (child) => child.id === active.id.toString()
            );
            const overIndex = sourceContainer.children?.findIndex(
              (child) => child.id === over.id
            );
            if (activeIndex === undefined || overIndex === undefined) return;

            setTree(
              doArrayMove(tree, sourceContainer.id, activeIndex, overIndex)
            );
            return;
          }
        }}
      >
        <EditingContext.Provider value={editing}>
          <DragOverlay>{overlayElement}</DragOverlay>

          <div className="flex gap-2 p-4 border-b justify-between">
            <div className="flex gap-2">
              {Object.entries(NODE_DEFAULTS).map(([key, value]) => (
                <Draggable key={key} id={key}>
                  <Button
                    variant="secondary"
                    iconLeft={value.icon}
                    disabled={!editing}
                  >
                    {value.name}
                  </Button>
                </Draggable>
              ))}
            </div>

            <RadioGroup
              value={editing ? "editing" : "preview"}
              onChange={(e) => setEditing(e === "editing")}
              orientation="horizontal"
              items={[
                { id: "editing", name: "Editing" },
                { id: "preview", name: "Preview" },
              ]}
            />
          </div>

          {editing ? (
            <ActiveDragContext.Provider value={activeDrag}>
              <Background node={tree} setNode={setTree} />
            </ActiveDragContext.Provider>
          ) : (
            <iframe srcDoc={html} className="w-full h-full" />
          )}
        </EditingContext.Provider>
      </DndContext>
    </div>
  );
}
