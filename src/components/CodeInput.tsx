import type { HtmlHTMLAttributes } from "react";
import type React from "react";

export const CodeInput: React.FC<HtmlHTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => {
    return (
        <div className={`flex items-center justify-center w-25 h-25 border rounded-xl ${className}`}{...props}>{children}</div>
    )
}