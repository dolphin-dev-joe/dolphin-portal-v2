import { cn } from "@heroui/react";
import React from "react";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span" | "small" | "label";
  size?: "xs" | "sm" | "base" | "lg";
  weight?: "normal" | "medium" | "semibold" | "bold";
  muted?: boolean;
  align?: "left" | "center" | "right";
}

const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

const weightClasses = {
  normal: "font-normal",
  medium: "font-medium",
  bold: "font-bold",
  semibold: "font-semibold",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      as = "p",
      size = "base",
      weight = "normal",
      muted = false,
      align = "left",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    // `as` can be p/span/small/label; their prop and ref types don't
    // intersect, so render through a generic element type.
    const Component = as as React.ElementType;
    return (
      <Component
        ref={ref}
        className={cn(
          sizeClasses[size],
          weightClasses[weight],
          alignClasses[align],
          muted && "text-muted-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Text.displayName = "Text";
