"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

import { cn } from "@/lib/utils";

export function BlurImage({ className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      {...props}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      className={cn(
        "transition-[opacity,filter] duration-700 ease-out",
        loaded ? "opacity-100 blur-0" : "opacity-0 blur-md",
        className
      )}
    />
  );
}
