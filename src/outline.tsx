import {
  MutableRefObject,
  Ref,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useSortable } from '@dnd-kit/sortable';

export interface UseOutlineElementProps {
  portal: HTMLElement | null;
}

export const useOutlineElement = ({ portal }: UseOutlineElementProps) => {
  const outlineRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const [lastOutlinedId, setLastOutlinedId] = useState<string | null>(null);

  const { listeners, attributes } = useSortable({ id: lastOutlinedId || "" });

  useEffect(() => {
    console.log("render");
    if (!portal) return;
    // Create the floating outline element
    const outline = document.createElement("div");
    outline.style.position = "absolute";
    outline.style.pointerEvents = "none";
    outline.style.zIndex = "9999";
    outline.classList.add(
      "ring-4",
      "ring-blue-500",
      "ring-opacity-50",
      "ring-offset-transparent",
      "rounded"
    );
    outline.style.transition = "all 0.1s ease";
    portal.appendChild(outline);

    outlineRef.current = outline;

    // Create the handle element
    const handle = document.createElement("div");
    handle.style.position = "absolute";
    handle.style.top = "0";
    handle.style.left = "0";
    handle.style.width = "36px";
    handle.style.height = "36px";
    handle.style.backgroundColor = "white";
    handle.style.border = "2px solid #333";
    handle.style.borderRadius = "50%";
    handle.style.opacity = "0";
    handle.style.cursor = "move";
    handle.style.pointerEvents = "all";
    handle.style.zIndex = "10000";
    handle.style.transition = "all 0.1s ease";
    portal.appendChild(handle);
    handleRef.current = handle;

    if (listeners) {
      for (const [key, value] of Object.entries(listeners)) {
        // @ts-ignore
        handleRef.current.addEventListener(key, value);
      }
    }

    if (attributes) {
      for (const [key, value] of Object.entries(attributes)) {
        // @ts-ignore
        handleRef.current.setAttribute(key, value);
      }
    }

    return () => {
      // Clean up on unmount
      if (outlineRef.current) {
        portal.removeChild(outlineRef.current);
      }
      if (handleRef.current) {
        portal.removeChild(handleRef.current);
      }
    };
  }, [portal, listeners, attributes]);

  const outlineElement = (
    nodeId: string | null,
    element: HTMLElement | null
  ) => {
    setLastOutlinedId(nodeId);
    const transitionDuration = 100;

    if (outlineRef.current && element) {
      const offset = 4;

      // Get the element's bounding rectangle
      const rect = element.getBoundingClientRect();

      // Style the outline to match the element's position and size
      outlineRef.current.style.top = `${rect.top - offset}px`;
      outlineRef.current.style.left = `${rect.left - offset}px`;
      outlineRef.current.style.width = `${rect.width + offset * 2}px`;
      outlineRef.current.style.height = `${rect.height + offset * 2}px`;
      outlineRef.current.style.transition = `all ${transitionDuration}ms ease`;
      outlineRef.current.style.display = "block";
    } else if (outlineRef.current) {
      outlineRef.current.style.display = "none"; // Hide if no element
    }

    if (handleRef.current && element) {
      const rect = element.getBoundingClientRect();
      handleRef.current.style.top = `${rect.top + rect.height / 2 - 18}px`;
      handleRef.current.style.left = `${rect.left - 36}px`;
      handleRef.current.style.opacity = "1";
      handleRef.current.style.transition = `all ${transitionDuration} ease`;
    } else if (handleRef.current) {
      handleRef.current.style.opacity = "0";
    }
  };

  return outlineElement;
};

export function mergeRefs<T>(
  ...refs: (Ref<T> | undefined)[]
): (instance: T | null) => void {
  return (instance: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(instance);
      } else if ("current" in ref) {
        (ref as MutableRefObject<T | null>).current = instance;
      }
    });
  };
}
