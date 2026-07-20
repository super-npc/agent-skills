import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const CONSISTENT-OUTPUT-DURATION-FRAMES = 180;

const OUTPUT-NODES = [
  { label: "Week 1", sub: "教學文章", delay: 25 },
  { label: "Week 2", sub: "影片分享", delay: 45 },
  { label: "Week 3", sub: "開源工具", delay: 65 },
  { label: "Week 4", sub: "案例分析", delay: 85 },
  { label: "Week 5", sub: "系列教程", delay: 105 },
];

export const Scene195-ConsistentOutput: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const nodeSprings = OUTPUT-NODES.map((n) =>
    spring({ frame: Math.max(0, frame - n.delay), fps, config: { damping: 12, stiffness: 90 } })
  );
  const audienceProgress = interpolate(frame, [105, 165], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 63, fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        讓大家知道你正在<span style={{ color: "#10B981" }}>持續穩定的輸出</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 28, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 50 }}>
        Show people you're consistently producing output
      </div>

      {/* Timeline */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
        {OUTPUT-NODES.map((node, i) => (
          <div key={i} style={{ opacity: nodeSprings[i], transform: `translateY(${(1 - nodeSprings[i]) * 30}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 80, height: 80 + i * 20, background: `rgba(16,185,129,${0.1 + i * 0.08})`, border: "2px solid rgba(16,185,129,0.4)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 28 }}>📝</div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#10B981" }}>{node.label}</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>{node.sub}</div>
          </div>
        ))}
      </div>

      {/* Audience growth */}
      <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 24, color: "rgba(255,255,255,0.5)" }}>觀眾增長：</div>
        <div style={{ width: 400, height: 12, background: "rgba(255,255,255,0.1)", borderRadius: 6, overflow: "hidden" }}>
          <div style={{ width: `${audienceProgress * 100}%`, height: "100%", background: "linear-gradient(90deg, #4DA3FF, #10B981)", borderRadius: 6 }} />
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#10B981" }}>{Math.round(audienceProgress * 1280)}+</div>
      </div>
    </AbsoluteFill>
  );
};