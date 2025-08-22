import { forwardRef, type HtmlHTMLAttributes } from "react";

export const Box = forwardRef<HTMLDivElement, HtmlHTMLAttributes<HTMLDivElement>>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col gap-10 items-center justify-center w-full h-full ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Box.displayName = "Box";
