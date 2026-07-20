import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const WORDS = [
  { text: "Think", color: "#0f172a" },
  { text: "Different.", color: "#3b82f6" },
];
const WORD-DELAY = 20;

export const WordFadeTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {WORDS.map((word, i) => {
        const progress = spring({
          frame: frame - i * WORD-DELAY,
          fps,
          config: { damping: 28, stiffness: 60 },
        });
        const opacity = interpolate(progress, [0, 0.3], [0, 1], {
          extrapolateRight: "clamp",
        });
        const y = interpolate(progress, [0, 1], [40, 0]);

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateY(${y}px)`,
              fontSize: 110,
              fontWeight: 800,
              color: word.color,
              fontFamily: "sans-serif",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {word.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};