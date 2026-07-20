import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const USERNAME = "remotion-dev";
const LIKES-TARGET = 1243;
const CAPTION =
  "這是一段示範的 Instagram 貼文內容，展示如何用 Remotion 製作社群媒體動畫。✨ #remotion #動態設計";
const COMMENT-COUNT = 48;

export const IgPostCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card scale + fade in: frames 0-20
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

  // Top bar slide from top: frames 10-25
  const headerProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 20, stiffness: 180 },
    durationInFrames: 15,
  });
  const headerY = interpolate(headerProgress, [0, 1], [-30, 0]);
  const headerOpacity = interpolate(headerProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Image fade in: frames 15-30
  const imageOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Action icons pop in staggered: frames 30-50
  const iconScales = [0, 1, 2, 3].map((i) => {
    const p = spring({
      frame: frame - (30 + i * 5),
      fps,
      config: { damping: 16, stiffness: 200 },
      durationInFrames: 12,
    });
    return interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  });

  // Likes count up: frames 40-75
  const likesRaw = interpolate(frame, [40, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentLikes = Math.round(likesRaw * LIKES-TARGET);

  // Caption fade in: frames 50-70
  const captionOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Comments/timestamp fade in: frames 65-80
  const footerOpacity = interpolate(frame, [65, 80], [0, 1], {
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
      {/* Card */}
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
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Top bar: avatar + username + follow + menu */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 20px",
            gap: 12,
            transform: `translateY(${headerY}px)`,
            opacity: headerOpacity,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              border: "2px solid transparent",
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

          {/* Username */}
          <div style={{ flex: 1 }}>
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#0f0f0f",
                lineHeight: 1,
              }}
            >
              {USERNAME}
            </span>
          </div>

          {/* Follow button */}
          <div
            style={{
              border: "1.5px solid #0095f6",
              borderRadius: 8,
              padding: "6px 16px",
              fontSize: 14,
              fontWeight: 600,
              color: "#0095f6",
              cursor: "pointer",
            }}
          >
            追蹤
          </div>

          {/* Menu */}
          <div
            style={{
              fontSize: 20,
              color: "#262626",
              fontWeight: 700,
              marginLeft: 8,
              letterSpacing: 1,
            }}
          >
            •••
          </div>
        </div>

        {/* Image placeholder */}
        <div
          style={{
            width: 860,
            height: 480,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 80%, #f5576c 100%)",
            opacity: imageOpacity,
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
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 40px)",
            }}
          />
          <div
            style={{
              fontSize: 48,
              color: "rgba(255,255,255,0.6)",
              fontWeight: 300,
              letterSpacing: 4,
              position: "relative",
              zIndex: 1,
            }}
          >
            Remotion
          </div>
        </div>

        {/* Action row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
          }}
        >
          {/* Left icons: heart, comment, share */}
          {[
            { icon: "♡", idx: 0 },
            { icon: "💬", idx: 1 },
            { icon: "↗", idx: 2 },
          ].map(({ icon, idx }) => (
            <div
              key={icon}
              style={{
                transform: `scale(${iconScales[idx]})`,
                fontSize: 26,
                marginRight: 16,
                cursor: "pointer",
                color: "#262626",
              }}
            >
              {icon}
            </div>
          ))}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Bookmark */}
          <div
            style={{
              transform: `scale(${iconScales[3]})`,
              fontSize: 26,
              color: "#262626",
              cursor: "pointer",
            }}
          >
            🔖
          </div>
        </div>

        {/* Likes count */}
        <div
          style={{
            padding: "0 16px 8px",
            fontSize: 15,
            color: "#262626",
          }}
        >
          <span style={{ fontWeight: 700 }}>
            {currentLikes.toLocaleString()} 人
          </span>
          按讚
        </div>

        {/* Caption */}
        <div
          style={{
            padding: "0 16px 8px",
            fontSize: 15,
            color: "#262626",
            lineHeight: 1.5,
            opacity: captionOpacity,
          }}
        >
          <span style={{ fontWeight: 700, marginRight: 6 }}>{USERNAME}</span>
          {CAPTION}
        </div>

        {/* Comments */}
        <div
          style={{
            padding: "0 16px 6px",
            fontSize: 15,
            color: "#8e8e8e",
            opacity: footerOpacity,
          }}
        >
          查看全部 {COMMENT-COUNT} 則留言
        </div>

        {/* Timestamp */}
        <div
          style={{
            padding: "0 16px 16px",
            fontSize: 12,
            color: "#c7c7c7",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            opacity: footerOpacity,
          }}
        >
          3小時前
        </div>
      </div>
    </AbsoluteFill>
  );
};