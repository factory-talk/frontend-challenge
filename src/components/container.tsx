'use client';

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { HTMLAttributes, PropsWithChildren } from "react";

export function Container({
  children,
  asChild = false,
  className,
  ...props
}: PropsWithChildren & {
  asChild?: boolean;
} & HTMLAttributes<HTMLElement>) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      {...props}
      className={cn(
        "container relative m-auto",
        "p-2.5 text-sm", // mobile
        "md:p-5 md:text-base", // tablet
        "xl:p-[30px] xl:text-lg", // pc
        className
      )}
    >
      {children}
    </Comp>
  );
}
