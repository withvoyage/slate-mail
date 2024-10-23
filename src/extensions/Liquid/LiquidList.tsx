import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { Button, cn } from "slate-ui";

import { Surface } from "@/components/ui/Surface";

import { LiquidListProps, Variable } from "./types";

export const LiquidList = React.forwardRef((props: LiquidListProps, ref) => {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const activeItem = useRef<HTMLButtonElement>(null);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedVariableIndex, setSelectedVariableIndex] = useState(0);

  // Anytime the groups change, i.e. the user types to narrow it down, we want to
  // reset the current selection to the first menu item
  useEffect(() => {
    setSelectedGroupIndex(0);
    setSelectedVariableIndex(0);
  }, [props.items]);

  const selectItem = useCallback(
    (groupIndex: number, variableIndex: number) => {
      const variable = props.items[groupIndex].variables[variableIndex];
      props.command(variable);
    },
    [props]
  );

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
      if (event.key === "ArrowDown") {
        if (!props.items.length) {
          return false;
        }
        const variables = props.items[selectedGroupIndex].variables;
        let newVariableIndex = selectedVariableIndex + 1;
        let newGroupIndex = selectedGroupIndex;
        if (variables.length - 1 < newVariableIndex) {
          newVariableIndex = 0;
          newGroupIndex = selectedGroupIndex + 1;
        }
        if (props.items.length - 1 < newGroupIndex) {
          newGroupIndex = 0;
        }
        setSelectedVariableIndex(newVariableIndex);
        setSelectedGroupIndex(newGroupIndex);

        return true;
      }

      if (event.key === "ArrowUp") {
        if (!props.items.length) {
          return false;
        }

        let newVariableIndex = selectedVariableIndex - 1;
        let newGroupIndex = selectedGroupIndex;

        if (newVariableIndex < 0) {
          newGroupIndex = selectedGroupIndex - 1;
          newVariableIndex =
            props.items[newGroupIndex]?.variables.length - 1 || 0;
        }

        if (newGroupIndex < 0) {
          newGroupIndex = props.items.length - 1;
          newVariableIndex = props.items[newGroupIndex].variables.length - 1;
        }

        setSelectedVariableIndex(newVariableIndex);
        setSelectedGroupIndex(newGroupIndex);

        return true;
      }

      if (event.key === "Enter") {
        if (
          !props.items.length ||
          selectedGroupIndex === -1 ||
          selectedVariableIndex === -1
        ) {
          return false;
        }

        selectItem(selectedGroupIndex, selectedVariableIndex);

        return true;
      }

      return false;
    },
  }));

  useEffect(() => {
    if (activeItem.current && scrollContainer.current) {
      const offsetTop = activeItem.current.offsetTop;
      const offsetHeight = activeItem.current.offsetHeight;

      scrollContainer.current.scrollTop = offsetTop - offsetHeight;
    }
  }, [selectedVariableIndex, selectedGroupIndex]);

  const createVariableClickHandler = useCallback(
    (groupIndex: number, variableIndex: number) => {
      return () => {
        selectItem(groupIndex, variableIndex);
      };
    },
    [selectItem]
  );

  if (!props.items.length) {
    return null;
  }

  return (
    <Surface
      ref={scrollContainer}
      className="max-h-[min(80vh,24rem)] overflow-auto flex-wrap mb-8"
    >
      <div className="grid grid-cols-2 gap-1 p-2">
        {props.items.map((group, groupIndex: number) => (
          <React.Fragment key={`${group.title}-wrapper`}>
            <div
              className="text-muted col-span-2 text-xs mt-4 font-semibold select-none uppercase first:mt-0.5"
              key={`${group.title}`}
            >
              {group.title}
            </div>
            {group.variables.map(
              (variable: Variable, variableIndex: number) => {
                const selected =
                  selectedGroupIndex === groupIndex &&
                  selectedVariableIndex === variableIndex;
                return (
                  <Button
                    key={variable.id}
                    ref={selected ? activeItem : null}
                    iconLeft={variable.icon}
                    variant={selected ? "primary" : "subtle"}
                    className={cn(!selected && "hover:bg-muted")}
                    onClick={createVariableClickHandler(
                      groupIndex,
                      variableIndex
                    )}
                  >
                    {variable.name}
                  </Button>
                );
              }
            )}
          </React.Fragment>
        ))}
      </div>
    </Surface>
  );
});

LiquidList.displayName = "LiquidList";

export default LiquidList;
