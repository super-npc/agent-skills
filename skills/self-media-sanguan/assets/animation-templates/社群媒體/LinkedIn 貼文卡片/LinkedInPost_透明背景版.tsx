import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

const TOTAL-LIKES = 1234;
const POST-LINES = [
  "很高興分享一個好消息！🎉",
  "",
  "我們的產品正式上線了，這是一段關於創業與堅持的故事...",
  "",
  "#創業 #前端開發 #Remotion",
];

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export const LinkedInPost: React.FC = () => {
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
    frame: frame - 12,
    fps,
    config: { damping: 20, stiffness: 180 },
    durationInFrames: 16,
  });
  const headerY = interpolate(headerProgress, [0, 1], [-30, 0]);
  const headerOpacity = interpolate(headerProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  const lineOpacities = POST-LINES.map((_, i) => {
    const start = 22 + i * 6;
    const p = spring({
      frame: frame - start,
      fps,
      config: { damping: 25, stiffness: 150 },
      durationInFrames: 10,
    });
    return interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  });
  const lineTranslations = POST-LINES.map((_, i) => {
    const start = 22 + i * 6;
    const p = spring({
      frame: frame - start,
      fps,
      config: { damping: 25, stiffness: 150 },
      durationInFrames: 10,
    });
    return interpolate(p, [0, 1], [10, 0]);
  });

  const imgOpacity = interpolate(frame, [30, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const reactionRaw = interpolate(frame, [50, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentLikes = Math.round(reactionRaw * TOTAL-LIKES);

  const actionOpacity = interpolate(frame, [65, 80], [0, 1], {
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
          borderRadius: 10,
          width: 860,
          boxSizing: "border-box",
          fontFamily: "sans-serif",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ padding: "20px 20px 0 20px" }}>
          <div
            style={{
              transform: `translateY(${headerY}px)`,
              opacity: headerOpacity,
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0a66c2, #004182)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              王
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#000000",
                    lineHeight: 1.3,
                  }}
                >
                  王小明
                </span>
                <span style={{ fontSize: 13, color: "#666666", fontWeight: 400 }}>
                  • 1st
                </span>
              </div>
              <div style={{ fontSize: 13, color: "#666666", lineHeight: 1.4, marginTop: 2 }}>
                資深前端工程師 · Acme Corp
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
                3 小時 · 🌐
              </div>
            </div>
            <div style={{ fontSize: 20, color: "#666666", letterSpacing: 1 }}>
              •••
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            {POST-LINES.map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: 15,
                  color: "#000000",
                  lineHeight: 1.6,
                  opacity: lineOpacities[i],
                  transform: `translateY(${lineTranslations[i]}px)`,
                  minHeight: line === "" ? 8 : "auto",
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
            height: 380,
            background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 40%, #93c5fd 100%)",
            opacity: imgOpacity,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              background: "rgba(10,102,194,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            🚀
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#1e40af", fontFamily: "sans-serif" }}>
            產品正式上線
          </div>
          <div style={{ fontSize: 14, color: "#3b82f6", fontFamily: "sans-serif" }}>
            acmecorp.example.com
          </div>
        </div>

        <div
          style={{
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 14,
              color: "#666666",
            }}
          >
            <span style={{ fontSize: 16 }}>👍</span>
            <span style={{ fontSize: 16 }}>❤️</span>
            <span style={{ fontSize: 16 }}>💡</span>
            <span style={{ marginLeft: 4 }}>{formatCount(currentLikes)} 人</span>
          </div>
          <div style={{ fontSize: 13, color: "#666666" }}>87 則留言 · 42 次轉發</div>
        </div>

        <div style={{ height: 1, background: "#e0e0e0", margin: "0 20px" }} />

        <div
          style={{
            opacity: actionOpacity,
            display: "flex",
            padding: "4px 12px 12px 12px",
          }}
        >
          {[
            { icon: "👍", label: "按讚" },
            { icon: "💬", label: "留言" },
            { icon: "🔄", label: "分享" },
            { icon: "✉", label: "傳送" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "10px 0",
                fontSize: 14,
                fontWeight: 600,
                color: "#666666",
                cursor: "pointer",
                borderRadius: 6,
              }}
            >
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};