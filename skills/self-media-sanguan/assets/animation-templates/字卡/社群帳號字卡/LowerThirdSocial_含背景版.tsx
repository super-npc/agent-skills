import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const PLATFORMS = [
  { label: "𝕏", handle: "@johndoe", bg: "#000000" },
  { label: "in", handle: "john-doe", bg: "#0a66c2" },
  { label: "▶", handle: "JohnDoeTV", bg: "#cc0000" },
];

export const LowerThirdSocial: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nameProgress = spring({ frame, fps, config: { damping: 22, stiffness: 120 } });
  const p0 = spring({ frame: frame - 10, fps, config: { damping: 15, stiffness: 200 } });
  const p1 = spring({ frame: frame - 18, fps, config: { damping: 15, stiffness: 200 } });
  const p2 = spring({ frame: frame - 26, fps, config: { damping: 15, stiffness: 200 } });

  const nameOpacity = interpolate(nameProgress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const nameX = interpolate(nameProgress, [0, 1], [-80, 0]);

  const progresses = [p0, p1, p2];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        paddingBottom: 80,
        paddingLeft: 90,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{
            opacity: nameOpacity,
            transform: `translateX(${nameX}px)`,
            fontSize: 38,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "sans-serif",
          }}
        >
          John Doe
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {PLATFORMS.map((p, i) => {
            const opacity = interpolate(progresses[i], [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
            const scale = interpolate(progresses[i], [0, 1], [0.5, 1]);
            return (
              <div
                key={i}
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: p.bg,
                  borderRadius: 6,
                  paddingLeft: 12,
                  paddingRight: 14,
                  paddingTop: 7,
                  paddingBottom: 7,
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 900, color: "#ffffff", fontFamily: "sans-serif" }}>{p.label}</span>
                <span style={{ fontSize: 15, color: "#ffffff", fontFamily: "sans-serif" }}>{p.handle}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};