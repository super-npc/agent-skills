import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const DISPLAY-NAME = "工程師 Kai";
const HANDLE = "@kai-engineer";
const QUOTE = "寫程式不是為了讓電腦\n理解，而是為了讓人\n能夠閱讀。";
const LIKES = 2400;
const RETWEETS = 891;
const VIEWS = 48000;

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

const QUOTE-LINES = QUOTE.split("\n");

export const TwitterQuote: React.FC = () => {
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

  // Avatar + name slide from top: frames 10-25
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

  // Quote lines staggered fade in: frames 20-50
  const lineOpacities = QUOTE-LINES.map((_, i) => {
    const start = 20 + i * 10;
    const lineProgress = spring({
      frame: frame - start,
      fps,
      config: { damping: 25, stiffness: 150 },
      durationInFrames: 12,
    });
    return interpolate(lineProgress, [0, 0.5], [0, 1], {
      extrapolateRight: "clamp",
    });
  });

  const lineTranslations = QUOTE-LINES.map((_, i) => {
    const start = 20 + i * 10;
    const lineProgress = spring({
      frame: frame - start,
      fps,
      config: { damping: 25, stiffness: 150 },
      durationInFrames: 12,
    });
    return interpolate(lineProgress, [0, 1], [12, 0]);
  });

  // Stats count up: frames 40-80
  const statsRaw = interpolate(frame, [40, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentLikes = Math.round(statsRaw * LIKES);
  const currentRetweets = Math.round(statsRaw * RETWEETS);
  const currentViews = Math.round(statsRaw * VIEWS);

  // Timestamp fade in: frames 60-75
  const tsOpacity = interpolate(frame, [60, 75], [0, 1], {
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
          background: "#0f0f0f",
          border: "1px solid #2f3336",
          borderRadius: 20,
          padding: "44px 52px",
          width: 860,
          boxSizing: "border-box",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header: avatar + name + handle + checkmark */}
        <div
          style={{
            transform: `translateY(${headerY}px)`,
            opacity: headerOpacity,
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1d9bf0, #0553a1)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            K
          </div>

          {/* Name + handle */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1.2,
                }}
              >
                {DISPLAY-NAME}
              </span>
              {/* Verified badge */}
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#1d9bf0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  color: "#ffffff",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
            </div>
            <div style={{ fontSize: 16, color: "#71767b", marginTop: 1 }}>
              {HANDLE}
            </div>
          </div>

          {/* X logo */}
          <div
            style={{
              fontSize: 26,
              color: "#ffffff",
              fontWeight: 900,
              letterSpacing: -1,
            }}
          >
            𝕏
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "#2f3336",
            marginBottom: 28,
            opacity: headerOpacity,
          }}
        />

        {/* Quote text */}
        <div style={{ marginBottom: 32 }}>
          {QUOTE-LINES.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: 38,
                fontWeight: 600,
                color: "#ffffff",
                lineHeight: 1.55,
                opacity: lineOpacities[i],
                transform: `translateY(${lineTranslations[i]}px)`,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Timestamp */}
        <div
          style={{
            fontSize: 15,
            color: "#71767b",
            marginBottom: 20,
            opacity: tsOpacity,
          }}
        >
          下午 3:42 · 2025年4月9日
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "#2f3336",
            marginBottom: 20,
            opacity: tsOpacity,
          }}
        />

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 36,
            opacity: tsOpacity,
          }}
        >
          {[
            { icon: "↺", value: currentRetweets, label: "轉推" },
            { icon: "♡", value: currentLikes, label: "喜歡" },
            { icon: "👁", value: currentViews, label: "瀏覽" },
          ].map(({ icon, value, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#71767b",
                fontSize: 16,
              }}
            >
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ fontWeight: 700, color: "#e7e9ea" }}>
                {formatCount(value)}
              </span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};