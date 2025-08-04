// components/OxyMoleculeIcon.tsx

import React from "react";

type OxyIconProps = {
  width?: number;
  height?: number;
  className?: string;
};

const OxyIcon: React.FC<OxyIconProps> = ({
  width = 120,
  height = 48,
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 48"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient
          id="oxyGradient"
          x1="0"
          y1="0"
          x2="120"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#0BC5EA" />
          <stop offset="100%" stopColor="#805AD5" />
        </linearGradient>
      </defs>

      {/* Left Oxygen Atom */}
      <circle
        cx="36"
        cy="24"
        r="12"
        stroke="url(#oxyGradient)"
        strokeWidth="4"
        fill="none"
      />

      {/* Right Oxygen Atom */}
      <circle
        cx="84"
        cy="24"
        r="12"
        stroke="url(#oxyGradient)"
        strokeWidth="4"
        fill="none"
      />

      {/* Double Bond */}
      <line
        x1="48"
        y1="18"
        x2="72"
        y2="18"
        stroke="url(#oxyGradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="48"
        y1="30"
        x2="72"
        y2="30"
        stroke="url(#oxyGradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default OxyIcon;
