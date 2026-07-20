import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

const TOTAL-VOTES = 4200;
const AWARDS = ["🏆", "🥇", "🌟"];

export const RedditPost: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardProgress = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 140 },
    durationInFrames: 20,
  });
  const cardY = interpolate(cardProgress, [0, 1], [60, 0]);
  const cardOpacity = interpolate(cardProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  const headerOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const arrowProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 18, stiffness: 200 },
    durationInFrames: 15,
  });
  const arrowScale = interpolate(arrowProgress, [0, 1], [0, 1]);
  const arrowOpacity = interpolate(arrowProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  const voteRaw = interpolate(frame, [20, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentVotes = Math.round(voteRaw * TOTAL-VOTES);

  function formatVotes(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return String(n);
  }

  const titleProgress = spring({
    frame: frame - 25,
    fps,
    config: { damping: 22, stiffness: 160 },
    durationInFrames: 20,
  });
  const titleX = interpolate(titleProgress, [0, 1], [-40, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  const awardScales = AWARDS.map((_, i) => {
    const start = 35 + i * 7;
    const p = spring({
      frame: frame - start,
      fps,
      config: { damping: 14, stiffness: 280 },
      durationInFrames: 12,
    });
    return interpolate(p, [0, 1], [0, 1]);
  });
  const awardOpacities = AWARDS.map((_, i) => {
    const start = 35 + i * 7;
    const p = spring({
      frame: frame - start,
      fps,
      config: { damping: 14, stiffness: 280 },
      durationInFrames: 12,
    });
    return interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  });

  const actionOpacity = interpolate(frame, [55, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          transform: `translateY(${cardY}px)`,
          opacity: cardOpacity,
          background: "#1a1a1b",
          borderRadius: 8,
          border: "1px solid #343536",
          width: 900,
          boxSizing: "border-box",
          fontFamily: "sans-serif",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            width: 50,
            background: "#161617",
            borderRadius: "8px 0 0 8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px 0",
            gap: 6,
          }}
        >
          <div
            style={{
              transform: `scale(${arrowScale})`,
              opacity: arrowOpacity,
              fontSize: 20,
              color: "#ff4500",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ▲
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#ff4500",
              lineHeight: 1.2,
              textAlign: "center",
              minWidth: 32,
            }}
          >
            {formatVotes(currentVotes)}
          </div>
          <div
            style={{
              transform: `scale(${arrowScale})`,
              opacity: arrowOpacity,
              fontSize: 20,
              color: "#818384",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ▽
          </div>
        </div>

        <div style={{ flex: 1, padding: "14px 16px 14px 16px" }}>
          <div
            style={{
              opacity: headerOpacity,
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#d7dadc" }}>
              r/webdev
            </span>
            <span style={{ fontSize: 13, color: "#818384" }}>
              · Posted by{" "}
              <span style={{ color: "#d7dadc" }}>u/remotion-fan</span>
              {" "}· 5 小時前
            </span>
            <div
              style={{
                marginLeft: "auto",
                fontSize: 12,
                fontWeight: 700,
                color: "#ff4500",
                border: "1px solid #ff4500",
                borderRadius: 20,
                padding: "3px 14px",
              }}
            >
              🔔 加入
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
            {AWARDS.map((award, i) => (
              <div
                key={i}
                style={{
                  transform: `scale(${awardScales[i]})`,
                  opacity: awardOpacities[i],
                  fontSize: 18,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 4,
                  padding: "2px 8px",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>{award}</span>
                <span style={{ fontSize: 11, color: "#818384" }}>×1</span>
              </div>
            ))}
          </div>

          <div
            style={{
              transform: `translateX(${titleX}px)`,
              opacity: titleOpacity,
              fontSize: 22,
              fontWeight: 700,
              color: "#d7dadc",
              lineHeight: 1.4,
              marginBottom: 14,
            }}
          >
            用 React 寫影片？Remotion 讓這件事成真了
          </div>

          <div
            style={{
              opacity: titleOpacity,
              border: "1px solid #343536",
              borderRadius: 4,
              padding: "10px 14px",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                background: "linear-gradient(135deg, #ff4500, #ff6534)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              🎬
            </div>
            <div>
              <div style={{ fontSize: 14, color: "#d7dadc", fontWeight: 500 }}>
                Remotion — Make videos in React
              </div>
              <div style={{ fontSize: 12, color: "#818384", marginTop: 2 }}>
                remotion.dev
              </div>
            </div>
          </div>

          <div style={{ opacity: actionOpacity, display: "flex", gap: 4, alignItems: "center" }}>
            {[
              { icon: "💬", label: "342 則留言" },
              { icon: "↗", label: "分享" },
              { icon: "🔖", label: "儲存" },
              { icon: "•••", label: "更多" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 10px",
                  borderRadius: 2,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#818384",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 15 }}>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};