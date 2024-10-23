import {
  forwardRef,
  HTMLProps,
} from 'react';

import { cn } from 'slate-ui';

export type SurfaceProps = HTMLProps<HTMLDivElement> & {};

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({ children, className, ...props }, ref) => {
    const surfaceClass = cn(className, "bg-white rounded-lg shadow-lg border");

    return (
      <div className={surfaceClass} {...props} ref={ref}>
        {children}
      </div>
    );
  }
);

Surface.displayName = "Surface";
