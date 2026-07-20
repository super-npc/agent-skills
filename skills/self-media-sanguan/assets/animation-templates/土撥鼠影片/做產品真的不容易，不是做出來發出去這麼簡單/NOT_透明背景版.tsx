import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const NOT-THAT-SIMPLE-DURATION-FRAMES = 240;

const HIDDEN-COMPLEXITY = [
  "Distribution 策略",
  "信任感建立",
  "痛點精準打擊",
  "持續迭代改進",
  "客戶留存機制",
  "商業模式設計",
];

export const Scene199-NotThatSimple: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const leftSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 90 } });
  const xSpring = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 8, stiffness: 120 } });
  const icebergSpring = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 10, stiffness: 70 } });
  const revealProgress = interpolate(frame, [100, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hiddenSprings = HIDDEN-COMPLEXITY.map((_, i) =>
    spring({ frame: Math.max(0, frame - 110 - i * 15), fps, config: { damping: 12, stiffness: 90 } })
  );

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 57, fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        做產品真的不容易，不是<span style={{ color: "#EF4444" }}>做出來、發出去</span>這麼簡單
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 26, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 40 }}>
        Building a product is NOT as simple as build & ship
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        {/* Left: naive view */}
        <div style={{ opacity: leftSpring, position: "relative" }}>
          <div style={{ width: 280, height: 200, background: "rgba(239,68,68,0.05)", border: "2px solid rgba(239,68,68,0.25)", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ fontSize: 24, color: "rgba(255,255,255,0.5)" }}>做出來 → 發出去</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "rgba(239,68,68,0.6)" }}>就完了？</div>
          </div>
          {xSpring > 0.1 && (
            <div style={{ position: "absolute", inset: 0, opacity: xSpring * 0.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={280} height={200}>
                <line x1={15} y1={15} x2={265} y2={185} stroke="#EF4444" strokeWidth={7} strokeLinecap="round" />
                <line x1={265} y1={15} x2={15} y2={185} stroke="#EF4444" strokeWidth={7} strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Iceberg */}
        <div style={{ opacity: icebergSpring }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Above water */}
            <div style={{ width: 320, height: 70, background: "rgba(77,163,255,0.15)", border: "2px solid rgba(77,163,255,0.4)", borderRadius: "12px 12px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#4DA3FF" }}>做出來 + 發布</div>
            </div>
            {/* Water line */}
            <div style={{ width: 320, height: 3, background: "rgba(77,163,255,0.4)" }} />
            {/* Below water */}
            <div style={{ width: 320, background: "rgba(77,163,255,0.05)", border: "2px solid rgba(77,163,255,0.2)", borderTop: "none", borderRadius: "0 0 12px 12px", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8, overflow: "hidden", height: `${revealProgress * 220}px` }}>
              {HIDDEN-COMPLEXITY.map((item, i) => (
                <div key={i} style={{ opacity: hiddenSprings[i], fontSize: 18, color: "rgba(77,163,255,0.7)", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4DA3FF", flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};