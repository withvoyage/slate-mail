import React, {
  CSSProperties,
  HTMLProps,
} from 'react';

import { cn } from 'slate-ui';

import {
  UniqueIdentifier,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useIsEditing } from './App';

export function Draggable(
  props: HTMLProps<HTMLDivElement> & { id: UniqueIdentifier }
) {
  const editing = useIsEditing();
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: props.id,
    disabled: !editing,
  });

  return (
    <div ref={setNodeRef} {...props} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
}

export function Droppable(
  props: HTMLProps<HTMLDivElement> & { id: UniqueIdentifier }
) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <div ref={setNodeRef} className={cn("flex-1", props.className)} {...props}>
      {props.children}
    </div>
  );
}

export function SortableItem(
  props: HTMLProps<HTMLDivElement> & { id: UniqueIdentifier }
) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    ...props.style,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      {...props}
    >
      {props.children}
    </div>
  );
}
