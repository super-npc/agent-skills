import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import React from "react";

const DASH-LENGTH = 2000;

export const HandwritingTitle: React.FC = () => {
  const frame = useCurrentFrame();

  const drawProgress = interpolate(frame, [10, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dashOffset = interpolate(drawProgress, [0, 1], [DASH-LENGTH, 0]);

  const fillOpacity = interpolate(frame, [130, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const underlineWidth = interpolate(frame, [10, 140], [0, 500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#fafaf9",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        viewBox="0 0 900 220"
        width="1350"
        height="330"
        style={{ overflow: "visible" }}
      >
        {/* Filled text - fades in after drawing */}
        <text
          x="450"
          y="155"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="145"
          fontWeight="bold"
          fill="#1c1917"
          fillOpacity={fillOpacity}
        >
          Create
        </text>

        {/* Stroke-animated text - simulates drawing */}
        <text
          x="450"
          y="155"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="145"
          fontWeight="bold"
          fill="none"
          stroke="#1c1917"
          strokeWidth="2.5"
          strokeDasharray={DASH-LENGTH}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          Create
        </text>

        {/* Decorative red underline */}
        <line
          x1="200"
          y1="175"
          x2={200 + underlineWidth}
          y2="175"
          stroke="#ef4444"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </AbsoluteFill>
  );
};