import React, { useState, useEffect, useRef } from "react";
import { Image as ImageIcon } from "lucide-react";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  fallbackSrc,
  alt,
  className = "",
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Synchronize internal state whenever the parent src prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Check if image is already cached/complete synchronously
  const handleRef = (el: HTMLImageElement | null) => {
    imgRef.current = el;
    if (el && el.complete && el.naturalWidth > 0 && !isLoaded) {
      setIsLoaded(true);
    }
  };

  const isLikelyImageUrl = (url?: string): boolean => {
    if (!url) return false;
    return (
      url.startsWith("/") ||
      url.startsWith("./") ||
      /\.(jpe?g|png|webp|svg|gif|avif)($|\?)/i.test(url) ||
      url.includes("images.unsplash.com") ||
      url.includes("/images/")
    );
  };

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc && isLikelyImageUrl(fallbackSrc)) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div
        className={`bg-[#fdf3f5] flex flex-col items-center justify-center text-[#9c6a76] p-4 border border-[#f5d9df] ${className}`}
      >
        <ImageIcon className="w-8 h-8 text-[#e0a8b5] mb-1" />
        <span className="text-xs text-[#7d5661] font-medium text-center line-clamp-1">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#fbf3f5] ${className}`}>
      {/* Subtle skeleton shimmer until loaded */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbf3f5] via-[#f7e4e9] to-[#fbf3f5] animate-pulse pointer-events-none" />
      )}
      <img
        ref={handleRef}
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-80"
        }`}
        {...props}
      />
    </div>
  );
};
