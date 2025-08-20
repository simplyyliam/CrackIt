import type { HtmlHTMLAttributes } from "react";
import type React from "react";

export const Box: React.FC<HtmlHTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => {
    return (
        <div className={`flex flex-col gap-10 items-center justify-center w-full h-full ${className}`}{...props}>{children}</div>
    )
}