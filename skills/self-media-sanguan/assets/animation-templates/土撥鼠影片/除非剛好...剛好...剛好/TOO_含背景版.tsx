import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const TOO-MANY-COINCIDENCES-DURATION-FRAMES = 240;

const COINCIDENCES = [
  { text: "剛好有這個問題的人", prob: "50%", delay: 20 },
  { text: "剛好看到你的內容", prob: "20%", delay: 55 },
  { text: "剛好相信你", prob: "8%", delay: 90 },
  { text: "剛好有購買意願", prob: "3%", delay: 125 },
  { text: "剛好有預算", prob: "1%", delay: 160 },
];

export const Scene186-TooManyCoincidences: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const coinSprings = COINCIDENCES.map((c) =>
    spring({ frame: Math.max(0, frame - c.delay), fps, config: { damping: 12, stiffness: 90 } })
  );
  const totalSpring = spring({ frame: Math.max(0, frame - 190), fps, config: { damping: 12, stiffness: 80 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: masterOpacity,
        fontFamily: "'Noto Sans TC', 'Inter', sans-serif",
      }}
    >
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 72, fontWeight: 800, color: "#FFFFFF", textAlign: "center", marginBottom: 45 }}>
        除非<span style={{ color: "#F59E0B" }}>剛好</span>...
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
        {COINCIDENCES.map((c, i) => (
          <div
            key={i}
            style={{
              opacity: coinSprings[i],
              transform: `translateX(${(1 - coinSprings[i]) * 30}px)`,
              display: "flex",
              alignItems: "center",
              gap: 24,
              background: "rgba(245,158,11,0.06)",
              border: "1.5px solid rgba(245,158,11,0.2)",
              borderRadius: 12,
              padding: "14px 36px",
            }}
          >
            <div style={{ fontSize: 28, color: "#F59E0B", fontWeight: 700 }}>剛好</div>
            <div style={{ fontSize: 26, color: "rgba(255,255,255,0.7)" }}>{c.text}</div>
            <div style={{ fontSize: 22, color: "rgba(245,158,11,0.5)", fontFamily: "'Inter', sans-serif" }}>≈ {c.prob}</div>
          </div>
        ))}
      </div>

      {totalSpring > 0.1 && (
        <div style={{ opacity: totalSpring, transform: `scale(${totalSpring})`, marginTop: 40, background: "rgba(239,68,68,0.1)", border: "2px solid rgba(239,68,68,0.4)", borderRadius: 16, padding: "16px 48px", textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: "#EF4444" }}>機率極低 😅</div>
        </div>
      )}
    </AbsoluteFill>
  );
};