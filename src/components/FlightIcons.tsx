import React from "react";

interface FlightIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Outbound Plane Icon: Always flies toward the top-right (↗)
 * Heading: Ascending from Taipei (bottom-left) to Tokyo (top-right)
 */
export const OutboundPlaneIcon: React.FC<FlightIconProps> = ({
  className = "w-4 h-4",
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Standard Lucide plane pointing top-right (↗) */}
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
);

/**
 * Return / Inbound Plane Icon: Always flies toward the bottom-right (↘)
 * Heading: Descending into Taiwan, diving toward the bottom-right (↘)
 * Implemented via SVG-native transform="rotate(90 12 12)" so it is 100% immune to CSS transform quirks.
 */
export const InboundPlaneIcon: React.FC<FlightIconProps> = ({
  className = "w-4 h-4",
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <g transform="rotate(90 12 12)">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </g>
  </svg>
);
