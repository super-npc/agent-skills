import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const DISPLAY-NAME = "Remotion 創作者";
const HANDLE = "@remotion-creator";
const DESCRIPTION = "這支影片展示了 Remotion 動畫的可能性 🎬 #remotion #創作者 #動畫";
const MUSIC-TEXT = "原創音樂 - 創作者名稱";

const LIKES-TARGET = 23400;
const COMMENTS-TARGET = 1200;
const SHARES-TARGET = 892;

function formatCount(n: number): string {
  if (n >= 10000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export const TiktokCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card scale + fade: frames 0-18
  const cardProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 130 },
    durationInFrames: 18,
  });
  const cardScale = interpolate(cardProgress, [0, 1], [0.92, 1]);
  const cardOpacity = interpolate(cardProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Thumbnail fade: frames 8-22
  const thumbOpacity = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Avatar + name slide from top-right: frames 18-32
  const headerProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 22, stiffness: 160 },
    durationInFrames: 14,
  });
  const headerX = interpolate(headerProgress, [0, 1], [30, 0]);
  const headerY = interpolate(headerProgress, [0, 1], [-20, 0]);
  const headerOpacity = interpolate(headerProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Follow button pop: frames 28-40
  const followProgress = spring({
    frame: frame - 28,
    fps,
    config: { damping: 14, stiffness: 240 },
    durationInFrames: 12,
  });
  const followScale = interpolate(followProgress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Description line-by-line fade: frames 35-60
  const descLines = DESCRIPTION.split(" ");
  const descLine1 = descLines.slice(0, 5).join(" ");
  const descLine2 = descLines.slice(5).join(" ");

  const descOpacity1 = interpolate(frame, [35, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const descOpacity2 = interpolate(frame, [46, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const descY1 = interpolate(frame, [35, 48], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const descY2 = interpolate(frame, [46, 60], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stats count up staggered: frames 55-90
  const likesRaw = interpolate(frame, [55, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const commentsRaw = interpolate(frame, [62, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sharesRaw = interpolate(frame, [68, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const currentLikes = Math.round(likesRaw * LIKES-TARGET);
  const currentComments = Math.round(commentsRaw * COMMENTS-TARGET);
  const currentShares = Math.round(sharesRaw * SHARES-TARGET);

  // Music ticker: scrolls left after frame 60
  const tickerX = interpolate(frame, [60, 120], [0, -200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const musicOpacity = interpolate(frame, [55, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const statsOpacity = interpolate(frame, [55, 68], [0, 1], {
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
      {/* Card */}
      <div
        style={{
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
          background: "#161823",
          borderRadius: 16,
          width: 780,
          height: 580,
          boxSizing: "border-box",
          fontFamily: "sans-serif",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          boxShadow: "0 28px 72px rgba(0,0,0,0.8)",
        }}
      >
        {/* Left: video thumbnail (9:16 proportion, ~300px wide) */}
        <div
          style={{
            width: 300,
            height: 580,
            flexShrink: 0,
            background: "linear-gradient(180deg, #1a0533 0%, #2d1b69 30%, #11998e 70%, #38ef7d 100%)",
            opacity: thumbOpacity,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Subtle grid overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 32px)",
            }}
          />
          {/* Play icon overlay */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "20px solid transparent",
                borderBottom: "20px solid transparent",
                borderLeft: "34px solid rgba(255,255,255,0.7)",
                marginLeft: 8,
              }}
            />
          </div>
          {/* TikTok-style bottom gradient */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 120,
              background: "linear-gradient(0deg, rgba(22,24,35,0.8) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* Right: info panel */}
        <div
          style={{
            flex: 1,
            padding: "24px 20px 20px",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* Avatar + name row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              transform: `translate(${headerX}px, ${headerY}px)`,
              opacity: headerOpacity,
              marginBottom: 16,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ff0050, #ff4081, #7c4dff)",
                border: "2px solid #fe2c55",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              R
            </div>

            {/* Name + handle */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {DISPLAY-NAME}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#8a8b91",
                  marginTop: 1,
                }}
              >
                {HANDLE}
              </div>
            </div>

            {/* Follow button */}
            <div
              style={{
                transform: `scale(${followScale})`,
                border: "1.5px solid #fe2c55",
                borderRadius: 6,
                padding: "5px 14px",
                fontSize: 13,
                fontWeight: 700,
                color: "#fe2c55",
                flexShrink: 0,
                cursor: "pointer",
              }}
            >
              追蹤
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16, flex: 1 }}>
            <div
              style={{
                fontSize: 14,
                color: "#d1d1d1",
                lineHeight: 1.6,
                transform: `translateY(${descY1}px)`,
                opacity: descOpacity1,
                marginBottom: 2,
              }}
            >
              {descLine1}
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#d1d1d1",
                lineHeight: 1.6,
                transform: `translateY(${descY2}px)`,
                opacity: descOpacity2,
              }}
            >
              {descLine2}
            </div>
          </div>

          {/* Music ticker */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 20,
              opacity: musicOpacity,
              overflow: "hidden",
            }}
          >
            <span style={{ fontSize: 14, flexShrink: 0 }}>♫</span>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <span
                style={{
                  fontSize: 13,
                  color: "#aaaaaa",
                  display: "inline-block",
                  transform: `translateX(${tickerX}px)`,
                  whiteSpace: "nowrap",
                }}
              >
                {MUSIC-TEXT} · {MUSIC-TEXT}
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity: statsOpacity,
            }}
          >
            {[
              { icon: "♥", value: formatCount(currentLikes) },
              { icon: "💬", value: formatCount(currentComments) },
              { icon: "↗", value: formatCount(currentShares) },
              { icon: "🔖", value: "" },
            ].map(({ icon, value }, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 22, color: "#ffffff" }}>{icon}</span>
                {value ? (
                  <span
                    style={{
                      fontSize: 12,
                      color: "#8a8b91",
                      fontWeight: 600,
                    }}
                  >
                    {value}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};