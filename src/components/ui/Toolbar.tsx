import React, { forwardRef, HTMLProps } from "react";

import { cn } from "slate-ui";

import { Surface } from "./Surface";

export type ToolbarWrapperProps = {
  shouldShowContent?: boolean;
  isVertical?: boolean;
} & HTMLProps<HTMLDivElement>;

const ToolbarWrapper = forwardRef<HTMLDivElement, ToolbarWrapperProps>(
  (
    {
      shouldShowContent = true,
      children,
      isVertical = false,
      className,
      ...rest
    },
    ref
  ) => {
    const toolbarClassName = cn(
      "text-primary flex h-full leading-none gap-0.5",
      "p-1 items-center z-10",
      className
    );

    return (
      shouldShowContent && (
        <Surface className={toolbarClassName} {...rest} ref={ref}>
          {children}
        </Surface>
      )
    );
  }
);

ToolbarWrapper.displayName = "Toolbar";

export type ToolbarDividerProps = {
  horizontal?: boolean;
} & HTMLProps<HTMLDivElement>;

const ToolbarDivider = forwardRef<HTMLDivElement, ToolbarDividerProps>(
  ({ horizontal, className, ...rest }, ref) => {
    const dividerClassName = cn(
      "bg-muted",
      horizontal
        ? "w-full min-w-[1.5rem] h-[1px] my-1 first:mt-0 last:mt-0"
        : "h-full min-h-[1.5rem] w-[1px] mx-1 first:ml-0 last:mr-0",
      className
    );

    return <div className={dividerClassName} ref={ref} {...rest} />;
  }
);

ToolbarDivider.displayName = "Toolbar.Divider";

export const Toolbar = {
  Wrapper: ToolbarWrapper,
  Divider: ToolbarDivider,
};
