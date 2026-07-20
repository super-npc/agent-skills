import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import React from "react";

// Pre-calculated glitch schedule (no Math.random() at render time)
const GLITCH-FRAMES = [8, 9, 18, 19, 32, 33, 48, 49, 55, 68, 69, 82, 83, 95];
const GLITCH-CLIPS: [number, number][] = [
  [10, 35], [55, 75], [25, 50], [10, 30], [60, 85],
  [15, 40], [45, 70], [30, 55], [70, 90], [5, 25],
  [50, 75], [20, 45], [65, 88], [10, 40],
];
const GLITCH-OFFSETS = [8, -6, 10, -8, 7, -9, 6, -7, 9, -5, 8, -6, 10, -8];

export const GlitchTextTitle: React.FC = () => {
  const frame = useCurrentFrame();

  const glitchIdx = GLITCH-FRAMES.indexOf(frame);
  const isGlitching = glitchIdx !== -1;

  const mainOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  const clip = isGlitching ? GLITCH-CLIPS[glitchIdx] : [0, 100];
  const offset = isGlitching ? GLITCH-OFFSETS[glitchIdx] : 0;

  const baseText: React.CSSProperties = {
    fontSize: 120,
    fontWeight: 900,
    fontFamily: "sans-serif",
    letterSpacing: "-0.02em",
    position: "absolute",
    whiteSpace: "nowrap",
  };

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", opacity: mainOpacity }}>
        {/* Red channel */}
        {isGlitching && (
          <div
            style={{
              ...baseText,
              color: "#ff0033",
              opacity: 0.8,
              transform: `translateX(${-Math.abs(offset)}px)`,
              clipPath: `inset(${clip[0]}% 0 ${100 - clip[1]}% 0)`,
              top: 0,
              left: 0,
            }}
          >
            GLITCH TEXT
          </div>
        )}

        {/* Blue channel */}
        {isGlitching && (
          <div
            style={{
              ...baseText,
              color: "#0033ff",
              opacity: 0.8,
              transform: `translateX(${Math.abs(offset)}px)`,
              clipPath: `inset(${100 - clip[1]}% 0 ${clip[0]}% 0)`,
              top: 0,
              left: 0,
            }}
          >
            GLITCH TEXT
          </div>
        )}

        {/* Main white text */}
        <div style={{ ...baseText, color: "#ffffff", position: "relative" }}>
          GLITCH TEXT
        </div>
      </div>
    </AbsoluteFill>
  );
};