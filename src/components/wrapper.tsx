import type { HtmlHTMLAttributes } from "react";

export const Container: React.FC<HtmlHTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={`flex flex-col w-[50vw] h-[100vh] p-5 ${className}`} {...props}>
      {children}
    </div>
  );
};
