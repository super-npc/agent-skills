import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const TRUST-TRANSFER-DURATION-FRAMES = 180;

const NODES = [
  { label: "粉絲", en: "Fans", icon: "👥", color: "#4DA3FF", delay: 20 },
  { label: "信任", en: "Trust", icon: "💙", color: "#A78BFA", delay: 50 },
  { label: "KOL", en: "Influencer", icon: "⭐", color: "#F59E0B", delay: 80 },
  { label: "轉移", en: "Transfer", icon: "→", color: "#10B981", delay: 110 },
  { label: "你的產品", en: "Product", icon: "📦", color: "#10B981", delay: 130 },
];

export const Scene181-TrustTransfer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const nodeSprings = NODES.map((n) =>
    spring({ frame: Math.max(0, frame - n.delay), fps, config: { damping: 12, stiffness: 90 } })
  );
  const arrowSprings = NODES.slice(0, -1).map((n) =>
    spring({ frame: Math.max(0, frame - n.delay - 10), fps, config: { damping: 10, stiffness: 100 } })
  );

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
        粉絲對 KOL 的<span style={{ color: "#F59E0B" }}>信任</span>，轉移到你的<span style={{ color: "#10B981" }}>產品</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 30, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 60 }}>
        Trust in KOL transfers to your product
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        {NODES.map((node, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                opacity: nodeSprings[i],
                transform: `scale(${nodeSprings[i]})`,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: `${node.color}10`,
                border: `2.5px solid ${node.color}50`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 36 }}>{node.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: node.color }}>{node.label}</div>
              <div style={{ fontSize: 14, color: `${node.color}50`, fontFamily: "'Inter', sans-serif" }}>{node.en}</div>
            </div>
            {i < NODES.length - 1 && (
              <div style={{ opacity: arrowSprings[i], margin: "0 8px" }}>
                <svg width={40} height={30} viewBox="0 0 40 30">
                  <line x1={2} y1={15} x2={28} y2={15} stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeLinecap="round" />
                  <polygon points="28,9 38,15 28,21" fill="rgba(255,255,255,0.2)" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};