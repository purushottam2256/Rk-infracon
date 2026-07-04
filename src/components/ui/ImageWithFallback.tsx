"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: string;
  skeletonClassName?: string;
}

export default function ImageWithFallback({
  src,
  fallbackSrc = "/logo.png",
  alt,
  className,
  skeletonClassName,
  ...rest
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <div 
          className={`absolute inset-0 bg-cream-dark animate-pulse flex items-center justify-center ${skeletonClassName || ""}`}
        >
           <div className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
        </div>
      )}
      <Image
        {...rest}
        src={imgSrc || fallbackSrc}
        alt={alt || "Image"}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallbackSrc);
          setIsLoading(false);
        }}
      />
    </>
  );
}
