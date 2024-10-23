import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import { Button } from "slate-ui";

import { EmojiListProps } from "@/extensions/EmojiSuggestion/types";
import { EmojiItem } from "@tiptap-pro/extension-emoji";
import { SuggestionKeyDownProps } from "@tiptap/suggestion";

const EmojiList = forwardRef(
  (
    props: EmojiListProps,
    ref: ForwardedRef<{ onKeyDown: (evt: SuggestionKeyDownProps) => boolean }>
  ) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => setSelectedIndex(0), [props.items]);

    const selectItem = useCallback(
      (index: number) => {
        const item = props.items[index];

        if (item) {
          props.command({ name: item.name });
        }
      },
      [props]
    );

    useImperativeHandle(
      ref,
      () => {
        const scrollIntoView = (index: number) => {
          const item = props.items[index];

          if (item) {
            const node = document.querySelector(
              `[data-emoji-name="${item.name}"]`
            );

            if (node) {
              node.scrollIntoView({ block: "nearest" });
            }
          }
        };

        const upHandler = () => {
          const newIndex =
            (selectedIndex + props.items.length - 1) % props.items.length;
          setSelectedIndex(newIndex);
          scrollIntoView(newIndex);
        };

        const downHandler = () => {
          const newIndex = (selectedIndex + 1) % props.items.length;
          setSelectedIndex(newIndex);
          scrollIntoView(newIndex);
        };

        const enterHandler = () => {
          selectItem(selectedIndex);
        };

        return {
          onKeyDown: ({ event }) => {
            if (event.key === "ArrowUp") {
              upHandler();
              return true;
            }

            if (event.key === "ArrowDown") {
              downHandler();
              return true;
            }

            if (event.key === "Enter") {
              enterHandler();
              return true;
            }

            return false;
          },
        };
      },
      [props, selectedIndex, selectItem]
    );

    const createClickHandler = useCallback(
      (index: number) => () => selectItem(index),
      [selectItem]
    );

    if (!props.items || !props.items.length) {
      return null;
    }

    return (
      <div className="overflow-y-auto grid grid-cols-8 max-h-[18rem] shadow-lg bg-white rounded-lg p-1 border">
        {props.items.map((item: EmojiItem, index: number) => (
          <Button
            variant="subtle"
            key={item.name}
            onClick={createClickHandler(index)}
            data-emoji-name={item.name}
            className="h-10 w-10 p-2 px-1 hover:bg-muted justify-center"
          >
            {item.fallbackImage ? (
              <img src={item.fallbackImage} className="h-6" alt="emoji" />
            ) : (
              item.emoji
            )}
          </Button>
        ))}
      </div>
    );
  }
);

EmojiList.displayName = "EmojiList";

export default EmojiList;
