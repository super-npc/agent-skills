import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const SCATTER-SHOT-DURATION-FRAMES = 210;

const CHANNELS = [
  { text: "隨意寄信", delay: 25 },
  { text: "PO 社團", delay: 40 },
  { text: "PO 平台", delay: 55 },
];

export const Scene187-ScatterShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const leftSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 90 } });
  const chSprings = CHANNELS.map((c) =>
    spring({ frame: Math.max(0, frame - c.delay), fps, config: { damping: 12, stiffness: 90 } })
  );
  const vsSpring = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 10, stiffness: 80 } });
  const rightSpring = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 12, stiffness: 90 } });
  const mismatch1 = spring({ frame: Math.max(0, frame - 130), fps, config: { damping: 12, stiffness: 90 } });
  const mismatch2 = spring({ frame: Math.max(0, frame - 150), fps, config: { damping: 12, stiffness: 90 } });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: masterOpacity,
        fontFamily: "'Noto Sans TC', 'Inter', sans-serif",
      }}
    >
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 66, fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        <span style={{ color: "#EF4444" }}>亂槍打鳥</span>：受眾痛點跟你的不同
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 28, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 50 }}>
        Scattershot approach — audience pain ≠ your solution
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        {/* Left */}
        <div style={{ opacity: leftSpring }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: "rgba(239,68,68,0.8)", marginBottom: 20, textAlign: "center" }}>管道多</div>
          {CHANNELS.map((ch, i) => (
            <div key={i} style={{ opacity: chSprings[i], transform: `translateX(${(1 - chSprings[i]) * -20}px)`, background: "rgba(239,68,68,0.06)", border: "1.5px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 28px", marginBottom: 12, fontSize: 24, color: "rgba(255,255,255,0.6)" }}>
              📢 {ch.text}
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div style={{ opacity: vsSpring, transform: `scale(${vsSpring})` }}>
          <svg width={50} height={50} viewBox="0 0 50 50">
            <line x1={5} y1={25} x2={36} y2={25} stroke="rgba(255,255,255,0.2)" strokeWidth={2.5} strokeLinecap="round" />
            <polygon points="36,18 46,25 36,32" fill="rgba(255,255,255,0.2)" />
          </svg>
        </div>

        {/* Right: mismatch */}
        <div style={{ opacity: rightSpring }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: "rgba(239,68,68,0.8)", marginBottom: 20, textAlign: "center" }}>痛點不符 ✗</div>
          <div style={{ opacity: mismatch1, background: "rgba(239,68,68,0.06)", border: "1.5px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "12px 28px", marginBottom: 12, fontSize: 24, color: "rgba(255,255,255,0.5)" }}>受眾的痛點：A</div>
          <div style={{ opacity: mismatch2, background: "rgba(239,68,68,0.06)", border: "1.5px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "12px 28px", fontSize: 24, color: "rgba(239,68,68,0.6)", display: "flex", gap: 12 }}>
            <span>你的解法：B</span>
            <span style={{ color: "#EF4444" }}>≠</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};