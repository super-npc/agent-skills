import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const IDEA-CHECK-DURATION-FRAMES = 210;

const CODE-LINES = [
  "$ claude --dangerously-skip-permissions",
  "> 幫我建立 IdeaCheck 產品",
  "> 功能：使用者輸入創業想法",
  "> 搜尋 + AI 分析 → 可行性報告",
  "✓ 前端完成",
  "✓ 後端 API 完成",
  "✓ 部署至 Cloudflare",
];

export const Scene201-IdeaCheck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const terminalSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 90 } });
  const lineSprings = CODE-LINES.map((_, i) =>
    spring({ frame: Math.max(0, frame - 30 - i * 15), fps, config: { damping: 12, stiffness: 90 } })
  );
  const arrowSpring = spring({ frame: Math.max(0, frame - 130), fps, config: { damping: 10, stiffness: 80 } });
  const productSpring = spring({ frame: Math.max(0, frame - 145), fps, config: { damping: 12, stiffness: 90 } });

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
        用 <span style={{ color: "#4DA3FF" }}>Claude Code</span> 做了 <span style={{ color: "#10B981" }}>IdeaCheck</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 26, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 40 }}>
        Built IdeaCheck with Claude Code in 2 days
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        {/* Terminal */}
        <div style={{ opacity: terminalSpring, transform: `scale(${terminalSpring})` }}>
          <div style={{ width: 460, background: "#0D1117", border: "1.5px solid rgba(77,163,255,0.3)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ background: "rgba(77,163,255,0.1)", padding: "10px 16px", display: "flex", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981" }} />
            </div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
              {CODE-LINES.map((line, i) => (
                <div key={i} style={{ opacity: lineSprings[i], fontSize: 15, color: line.startsWith("✓") ? "#10B981" : line.startsWith("$") ? "#F59E0B" : "rgba(255,255,255,0.6)", fontFamily: "monospace" }}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div style={{ opacity: arrowSpring }}>
          <svg width={60} height={50} viewBox="0 0 60 50">
            <line x1={5} y1={25} x2={42} y2={25} stroke="rgba(255,255,255,0.3)" strokeWidth={3} strokeLinecap="round" />
            <polygon points="42,17 55,25 42,33" fill="rgba(255,255,255,0.3)" />
          </svg>
        </div>

        {/* Product card */}
        <div style={{ opacity: productSpring, transform: `scale(${productSpring})` }}>
          <div style={{ width: 300, height: 240, background: "rgba(16,185,129,0.08)", border: "2px solid rgba(16,185,129,0.4)", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ fontSize: 56 }}>💡</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#10B981" }}>IdeaCheck</div>
            <div style={{ fontSize: 16, color: "rgba(16,185,129,0.6)", textAlign: "center", padding: "0 20px" }}>創業想法 → AI 可行性分析</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};