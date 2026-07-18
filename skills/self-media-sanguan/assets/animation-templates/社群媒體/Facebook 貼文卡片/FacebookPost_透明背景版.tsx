import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

const POST-TEXT-LINES = [
  "剛剛發現了一個超厲害的動畫工具！🔥",
  "用 Remotion 可以用 React 寫視頻，太神奇了！",
  "大家有試過嗎？",
  "",
  "#Remotion #React #前端",
];

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export const FacebookPost: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardProgress = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 140 },
    durationInFrames: 20,
  });
  const cardScale = interpolate(cardProgress, [0, 1], [0.9, 1]);
  const cardOpacity = interpolate(cardProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  const headerProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 20, stiffness: 180 },
    durationInFrames: 15,
  });
  const headerY = interpolate(headerProgress, [0, 1], [-28, 0]);
  const headerOpacity = interpolate(headerProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  const lineOpacities = POST-TEXT-LINES.map((_, i) => {
    const start = 20 + i * 5;
    const p = spring({
      frame: frame - start,
      fps,
      config: { damping: 25, stiffness: 160 },
      durationInFrames: 10,
    });
    return interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  });
  const lineTranslations = POST-TEXT-LINES.map((_, i) => {
    const start = 20 + i * 5;
    const p = spring({
      frame: frame - start,
      fps,
      config: { damping: 25, stiffness: 160 },
      durationInFrames: 10,
    });
    return interpolate(p, [0, 1], [8, 0]);
  });

  const imgOpacity = interpolate(frame, [28, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const reactionSlide = spring({
    frame: frame - 50,
    fps,
    config: { damping: 22, stiffness: 160 },
    durationInFrames: 30,
  });
  const reactionY = interpolate(reactionSlide, [0, 1], [20, 0]);
  const reactionOpacity = interpolate(reactionSlide, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const reactionRaw = interpolate(frame, [50, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentReactions = Math.round(reactionRaw * 1200);

  const actionOpacity = interpolate(frame, [65, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
          background: "#ffffff",
          borderRadius: 12,
          width: 860,
          boxSizing: "border-box",
          fontFamily: "sans-serif",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          borderTop: "4px solid #1877f2",
        }}
      >
        <div style={{ padding: "16px 16px 0 16px" }}>
          <div
            style={{
              transform: `translateY(${headerY}px)`,
              opacity: headerOpacity,
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 19,
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              陳
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1877f2",
                    lineHeight: 1.3,
                  }}
                >
                  陳小華
                </span>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#1877f2",
                    border: "1px solid #1877f2",
                    borderRadius: 4,
                    padding: "1px 8px",
                  }}
                >
                  追蹤中 ▾
                </div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#999999",
                  marginTop: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                2小時 · 🌐
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 20, color: "#666666", letterSpacing: 1 }}>•••</span>
              <span style={{ fontSize: 18, color: "#666666", fontWeight: 300 }}>✕</span>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            {POST-TEXT-LINES.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 15,
                  color: "#050505",
                  lineHeight: 1.6,
                  opacity: lineOpacities[i],
                  transform: `translateY(${lineTranslations[i]}px)`,
                  minHeight: line === "" ? 6 : "auto",
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: 390,
            background: "linear-gradient(135deg, #3b82f6 0%, #6d28d9 60%, #8b5cf6 100%)",
            opacity: imgOpacity,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
            }}
          >
            🎬
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#ffffff", fontFamily: "sans-serif" }}>
            Remotion 動畫展示
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", fontFamily: "sans-serif" }}>
            remotion.dev
          </div>
        </div>

        <div
          style={{
            transform: `translateY(${reactionY}px)`,
            opacity: reactionOpacity,
            padding: "10px 16px 6px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              fontSize: 14,
              color: "#666666",
            }}
          >
            <span style={{ fontSize: 17 }}>👍</span>
            <span style={{ fontSize: 17 }}>❤️</span>
            <span style={{ fontSize: 17 }}>😮</span>
            <span style={{ marginLeft: 4 }}>{formatCount(currentReactions)}</span>
          </div>
          <div style={{ fontSize: 13, color: "#666666" }}>234 則留言 · 56 次分享</div>
        </div>

        <div style={{ height: 1, background: "#e4e6eb", margin: "0 16px" }} />

        <div
          style={{
            opacity: actionOpacity,
            display: "flex",
            padding: "4px 8px 10px 8px",
          }}
        >
          {[
            { icon: "👍", label: "按讚" },
            { icon: "💬", label: "留言" },
            { icon: "↗", label: "分享" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "8px 0",
                fontSize: 15,
                fontWeight: 600,
                color: "#65676b",
                cursor: "pointer",
                borderRadius: 6,
              }}
            >
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};