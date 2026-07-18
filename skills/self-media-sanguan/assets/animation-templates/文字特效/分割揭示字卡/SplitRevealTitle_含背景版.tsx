import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const FONT-SIZE = 140;

export const SplitRevealTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineProgress = spring({
    frame,
    fps,
    config: { damping: 30, stiffness: 200 },
  });
  const revealProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const lineWidth = interpolate(lineProgress, [0, 1], [0, 700]);
  const topY = interpolate(revealProgress, [0, 1], [0, -FONT-SIZE * 0.55]);
  const bottomY = interpolate(revealProgress, [0, 1], [0, FONT-SIZE * 0.55]);

  return (
    <AbsoluteFill
      style={{ background: "#111827", justifyContent: "center", alignItems: "center" }}
    >
      {/* Center divider line */}
      <div
        style={{
          position: "absolute",
          height: 4,
          width: lineWidth,
          background: "#f59e0b",
          borderRadius: 2,
        }}
      />

      {/* Top half */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: "50%",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            transform: `translateY(${topY}px)`,
            fontSize: FONT-SIZE,
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "sans-serif",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          SPLIT
        </div>
      </div>

      {/* Bottom half */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            transform: `translateY(${bottomY}px)`,
            fontSize: FONT-SIZE,
            fontWeight: 900,
            color: "#f59e0b",
            fontFamily: "sans-serif",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          REVEAL
        </div>
      </div>
    </AbsoluteFill>
  );
};