import React from "react";

/**
 * Hand-drawn & Flat Vector Illustration Stickers for Japanese lifestyle magazine aesthetic.
 * Replaces plain emojis with delicate, styled SVG illustrations.
 */

export const SparkleDoodle: React.FC<{
  className?: string;
  color?: string;
  speed?: "normal" | "fast" | "slow";
}> = ({
  className = "w-4 h-4",
  color = "#f472b6",
  speed = "normal",
}) => {
  const speedClass =
    speed === "fast"
      ? "animate-twinkle-fast"
      : speed === "slow"
      ? "animate-twinkle-slow"
      : "animate-twinkle";

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${speedClass} shrink-0`}
    >
      <path
        d="M12 2C12.5 7 14 8.5 19 9C14 9.5 12.5 11 12 16C11.5 11 10 9.5 5 9C10 8.5 11.5 7 12 2Z"
        fill={color}
      />
      <circle cx="18" cy="17" r="2" fill={color} opacity="0.8" />
      <circle cx="6" cy="18" r="1.5" fill={color} opacity="0.7" />
    </svg>
  );
};

/**
  * Non-colorful translucent frosted white bubble
  */
export const FloatingBubble: React.FC<{
  size?: number;
  className?: string;
  delay?: string;
}> = ({ size = 28, className = "", delay = "0s" }) => (
  <div
    style={{
      width: size,
      height: size,
      animationDelay: delay,
    }}
    className={`rounded-full bg-white/45 backdrop-blur-xs border border-white/90 shadow-[0_2px_10px_rgba(255,255,255,0.9)] pointer-events-none animate-float-slow ${className}`}
  >
    <div className="w-1.5 h-1.5 rounded-full bg-white m-1 opacity-90" />
  </div>
);

/**
 * Hand-drawn Camera Sticker
 */
export const CameraSticker: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center p-1 rounded-2xl bg-[#fdf2f4] border border-[#f5d9df] shadow-2xs rotate-[-3deg] hover:rotate-0 transition-transform ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path
        d="M4 8C4 6.89543 4.89543 6 6 6H8L9.5 4H14.5L16 6H18C19.1046 6 20 6.89543 20 8V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V8Z"
        fill="#fba5be"
        stroke="#8b3e55"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.5" fill="#ffffff" stroke="#8b3e55" strokeWidth="1.6" />
      <circle cx="12" cy="13" r="1.8" fill="#e7668b" />
      <circle cx="16.5" cy="8.5" r="1" fill="#8b3e55" />
    </svg>
  </div>
);

/**
 * Hand-drawn Coffee Cup Sticker
 */
export const CoffeeCupSticker: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center p-1 rounded-2xl bg-[#fff4f6] border border-[#f7dae0] shadow-2xs rotate-[4deg] hover:rotate-0 transition-transform ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path
        d="M5 9H17V15C17 17.2091 15.2091 19 13 19H9C6.79086 19 5 17.2091 5 15V9Z"
        fill="#e698ab"
        stroke="#753545"
        strokeWidth="1.6"
      />
      <path
        d="M17 11H18.5C19.8807 11 21 12.1193 21 13.5C21 14.8807 19.8807 16 18.5 16H17"
        stroke="#753545"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M8 5C8 6 9 7 9 7" stroke="#c06c82" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11 4C11 5.5 12 6.5 12 6.5" stroke="#c06c82" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M14 5C14 6 15 7 15 7" stroke="#c06c82" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  </div>
);

/**
 * Hand-drawn Travel Luggage Suitcase Sticker
 */
export const LuggageSticker: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center p-1 rounded-2xl bg-[#fdf2f4] border border-[#f5d9df] shadow-2xs rotate-[-2deg] hover:rotate-0 transition-transform ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect x="5" y="8" width="14" height="12" rx="3" fill="#f4a7bb" stroke="#6b2f40" strokeWidth="1.6" />
      <path d="M9 8V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V8" stroke="#6b2f40" strokeWidth="1.6" />
      <line x1="12" y1="8" x2="12" y2="20" stroke="#6b2f40" strokeWidth="1.4" strokeDasharray="2 2" />
      <circle cx="8" cy="20.5" r="1.2" fill="#6b2f40" />
      <circle cx="16" cy="20.5" r="1.2" fill="#6b2f40" />
    </svg>
  </div>
);

/**
 * Hand-drawn Train / Subway Sticker
 */
export const TrainSticker: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center p-1 rounded-2xl bg-[#f6f2f8] border border-[#e8dcee] shadow-2xs rotate-[2deg] hover:rotate-0 transition-transform ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect x="4" y="5" width="16" height="14" rx="3" fill="#c39ad9" stroke="#4c2c5e" strokeWidth="1.6" />
      <rect x="6.5" y="8" width="4.5" height="4" rx="1" fill="#ffffff" stroke="#4c2c5e" strokeWidth="1.2" />
      <rect x="13" y="8" width="4.5" height="4" rx="1" fill="#ffffff" stroke="#4c2c5e" strokeWidth="1.2" />
      <circle cx="7.5" cy="15.5" r="1.2" fill="#facc15" />
      <circle cx="16.5" cy="15.5" r="1.2" fill="#facc15" />
      <line x1="7" y1="21" x2="17" y2="21" stroke="#4c2c5e" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  </div>
);

/**
 * Hand-drawn Japanese Torii / Shrine Sticker
 */
export const ShrineSticker: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center p-1 rounded-2xl bg-[#fdf2f4] border border-[#f5d9df] shadow-2xs rotate-[-3deg] hover:rotate-0 transition-transform ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M4 6C8 5.5 16 5.5 20 6" stroke="#993838" strokeWidth="2" strokeLinecap="round" />
      <line x1="5.5" y1="8.5" x2="18.5" y2="8.5" stroke="#993838" strokeWidth="1.6" />
      <line x1="8" y1="8.5" x2="8" y2="20" stroke="#993838" strokeWidth="1.8" />
      <line x1="16" y1="8.5" x2="16" y2="20" stroke="#993838" strokeWidth="1.8" />
      <circle cx="12" cy="13" r="2" fill="#e07272" />
    </svg>
  </div>
);

/**
 * Hand-drawn Ginkgo Leaf Sticker
 */
export const GinkgoLeafSticker: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <div className={`inline-flex items-center justify-center p-1 rounded-xl bg-[#fff9ee] border border-[#fae5b8] shadow-2xs rotate-[6deg] hover:rotate-0 transition-transform ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path
        d="M12 19C12 15 13 11 18 8C16 6 13 5 12 7C11 5 8 6 6 8C11 11 12 15 12 19Z"
        fill="#f59e0b"
        stroke="#9a6507"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

/**
 * Hand-drawn Running Sneaker Sticker
 */
export const RunningShoeSticker: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center p-1 rounded-2xl bg-[#fdf2f4] border border-[#f5d9df] shadow-2xs rotate-[-4deg] hover:rotate-0 transition-transform ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path
        d="M3 15C3 15 6 15 8 13L13 11C15 10 17 11 19 12L21 14C21 16 19.5 17 17.5 17H4C3.44772 17 3 16.5523 3 16V15Z"
        fill="#f472b6"
        stroke="#831843"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8 13L10 16" stroke="#831843" strokeWidth="1.3" />
      <path d="M11 12L13 15" stroke="#831843" strokeWidth="1.3" />
      <circle cx="19" cy="8" r="1.5" fill="#fbcfe8" />
    </svg>
  </div>
);

/**
 * Hand-drawn Shopping Bag Sticker
 */
export const ShoppingBagSticker: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center p-1 rounded-2xl bg-[#fdf2f4] border border-[#f5d9df] shadow-2xs rotate-[3deg] hover:rotate-0 transition-transform ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path
        d="M6 8H18L19 20H5L6 8Z"
        fill="#fba5bd"
        stroke="#882e46"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 10V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V10"
        stroke="#882e46"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

/**
 * Hand-drawn Theater Mask & Curtain Sticker (for SHOCK 舞台劇)
 */
export const TheaterMaskSticker: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center p-1 rounded-2xl bg-[#fcf2f4] border border-[#f7d7de] shadow-2xs rotate-[3deg] hover:rotate-0 transition-transform ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      {/* Theater masks */}
      <circle cx="9" cy="13" r="6" fill="#fecdd3" stroke="#9f1239" strokeWidth="1.5" />
      {/* Eye cutouts */}
      <ellipse cx="7.2" cy="11.5" rx="1.2" ry="1" fill="#9f1239" />
      <ellipse cx="10.8" cy="11.5" rx="1.2" ry="1" fill="#9f1239" />
      {/* Smile */}
      <path d="M7 14.5C7.8 16 10.2 16 11 14.5" stroke="#9f1239" strokeWidth="1.3" strokeLinecap="round" />
      {/* Crown/Star */}
      <path d="M15 6L16.2 8.5L19 8.9L17 10.8L17.5 13.5L15 12.2L12.5 13.5L13 10.8L11 8.9L13.8 8.5L15 6Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
    </svg>
  </div>
);

/**
 * Hand-drawn Map Pin Needle Sticker
 */
export const MapPinSticker: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center p-1 rounded-2xl bg-[#fff2f4] border border-[#fcd5dc] shadow-2xs rotate-[-3deg] hover:rotate-0 transition-transform ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path
        d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z"
        fill="#fb7185"
        stroke="#881337"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.8" fill="#ffffff" stroke="#881337" strokeWidth="1.3" />
      <circle cx="12" cy="9" r="1.2" fill="#e11d48" />
    </svg>
  </div>
);

/**
 * Hand-drawn Compass Sticker
 */
export const CompassSticker: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center p-1 rounded-2xl bg-[#fdf4f6] border border-[#f9d7df] shadow-2xs rotate-[4deg] hover:rotate-0 transition-transform ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <circle cx="12" cy="12" r="9" fill="#ffffff" stroke="#992545" strokeWidth="1.6" />
      <polygon points="12,5 14.5,12 12,11 9.5,12" fill="#e11d48" stroke="#992545" strokeWidth="1" />
      <polygon points="12,19 14.5,12 12,13 9.5,12" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
      <circle cx="12" cy="12" r="1.5" fill="#ffffff" stroke="#992545" strokeWidth="1" />
    </svg>
  </div>
);

/**
 * Hand-drawn Noodle / Udon Bowl Sticker (for 花山烏龍麵 & 利久牛舌)
 */
export const UdonBowlSticker: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <div className={`inline-flex items-center justify-center p-1 rounded-2xl bg-[#fff7f2] border border-[#fad9c8] shadow-2xs rotate-[-2deg] hover:rotate-0 transition-transform ${className}`}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      {/* Bowl */}
      <path
        d="M4 11C4 16 7.5 19 12 19C16.5 19 20 16 20 11H4Z"
        fill="#fca5a5"
        stroke="#991b1b"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 19H15" stroke="#991b1b" strokeWidth="1.6" strokeLinecap="round" />
      {/* Steam */}
      <path d="M8 8C8 6 9 5 9 4" stroke="#f87171" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 8C12 6 13 5 13 4" stroke="#f87171" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 8C16 6 17 5 17 4" stroke="#f87171" strokeWidth="1.4" strokeLinecap="round" />
      {/* Chopsticks */}
      <line x1="3" y1="9" x2="21" y2="10" stroke="#78350f" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  </div>
);
