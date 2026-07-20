import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const BUILD-TRUST-FIRST-DURATION-FRAMES = 210;

const TRUST-BLOCKS = [
  { label: "持續輸出內容", color: "#4DA3FF", delay: 50 },
  { label: "展示作品成果", color: "#A78BFA", delay: 70 },
  { label: "社群互動交流", color: "#F59E0B", delay: 90 },
  { label: "建立品牌口碑", color: "#10B981", delay: 110 },
];

export const Scene190-BuildTrustFirst: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const leftSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 90 } });
  const xSpring = spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 8, stiffness: 120 } });
  const blockSprings = TRUST-BLOCKS.map((b) =>
    spring({ frame: Math.max(0, frame - b.delay), fps, config: { damping: 12, stiffness: 90 } })
  );
  const checkSpring = spring({ frame: Math.max(0, frame - 145), fps, config: { damping: 10, stiffness: 100 } });

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
        做產品拿去賣之前，先<span style={{ color: "#10B981" }}>累積信任感</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 30, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 50 }}>
        Build trust before you build & sell
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
        {/* Left: wrong */}
        <div style={{ opacity: leftSpring, transform: `scale(${leftSpring})`, position: "relative" }}>
          <div style={{ width: 340, height: 220, background: "rgba(239,68,68,0.06)", border: "2px solid rgba(239,68,68,0.3)", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ fontSize: 44 }}>🚀</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "rgba(239,68,68,0.7)" }}>做產品</div>
            <div style={{ fontSize: 24, color: "rgba(239,68,68,0.5)" }}>直接銷售</div>
          </div>
          {xSpring > 0 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: xSpring }}>
              <svg width={340} height={220}>
                <line x1={20} y1={20} x2={320} y2={200} stroke="#EF4444" strokeWidth={8} strokeLinecap="round" opacity={0.5} />
                <line x1={320} y1={20} x2={20} y2={200} stroke="#EF4444" strokeWidth={8} strokeLinecap="round" opacity={0.5} />
              </svg>
            </div>
          )}
        </div>

        {/* Arrow */}
        <div style={{ fontSize: 48, color: "rgba(255,255,255,0.2)", fontFamily: "'Inter', sans-serif" }}>→</div>

        {/* Right: trust blocks */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "stretch" }}>
          {[...TRUST-BLOCKS].reverse().map((b, i) => {
            const ri = TRUST-BLOCKS.length - 1 - i;
            return (
              <div
                key={i}
                style={{
                  opacity: blockSprings[ri],
                  transform: `translateY(${(1 - blockSprings[ri]) * 20}px)`,
                  background: `${b.color}12`,
                  border: `2px solid ${b.color}40`,
                  borderRadius: 10,
                  padding: "12px 36px",
                  fontSize: 22,
                  fontWeight: 600,
                  color: b.color,
                  textAlign: "center",
                }}
              >
                {b.label}
              </div>
            );
          })}
          <div style={{ opacity: checkSpring, transform: `scale(${checkSpring})`, textAlign: "center", fontSize: 26, fontWeight: 700, color: "#10B981", marginTop: 8 }}>
            ✓ 信任建立完成
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};