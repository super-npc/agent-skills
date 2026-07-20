import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const WORDS = ["Make", "Your", "Videos", "Alive."];
const COLORS = ["#ffffff", "#ffffff", "#ffffff", "#38bdf8"];
const WORD-DELAY = 15;

export const KineticBounceTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {WORDS.map((word, i) => {
          const delay = i * WORD-DELAY;
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 5, stiffness: 150, mass: 0.6 },
          });
          const y = interpolate(progress, [0, 1], [-400, 0]);
          const opacity = interpolate(progress, [0, 0.2], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                transform: `translateY(${y}px)`,
                opacity,
                fontSize: 96,
                fontWeight: 900,
                color: COLORS[i],
                fontFamily: "sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {word}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};