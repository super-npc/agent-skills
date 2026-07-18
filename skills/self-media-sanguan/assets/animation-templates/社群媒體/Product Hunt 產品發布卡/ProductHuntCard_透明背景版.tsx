import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const PRODUCT-NAME = "AwesomeTool";
const TAGLINE = "讓工作效率提升 10 倍的 AI 工具";
const DESCRIPTION =
  "這是一款革命性的工具，幫助創作者和開發者更快地完成工作。整合 AI 技術，自動化繁瑣任務，讓你專注於真正重要的事。";
const TAGS = ["#生產力", "#AI", "#設計工具"];
const VOTES-TARGET = 856;
const COMMENTS = 124;
const RANK = "#1 今日產品";
const PH-ORANGE = "#ff6154";

export const ProductHuntCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card: scale 0.9→1 + fade, frames 0-20
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

  // Logo: scale pop 0→1.1→1, frames 10-28
  const logoProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });
  const logoScale = interpolate(logoProgress, [0, 0.7, 1], [0, 1.15, 1], {
    extrapolateRight: "clamp",
  });

  // Product name + tagline: slide from right, frames 18-35
  const nameProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 22, stiffness: 160 },
    durationInFrames: 17,
  });
  const nameX = interpolate(nameProgress, [0, 1], [50, 0]);
  const nameOpacity = interpolate(nameProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Tags: pop in stagger, frames 30-55
  const tagScales = TAGS.map((_, i) => {
    const p = spring({
      frame: frame - (30 + i * 8),
      fps,
      config: { damping: 16, stiffness: 220 },
      durationInFrames: 10,
    });
    return interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  });

  // Description: fade in, frames 40-60
  const descOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Vote count: count up 0→856, frames 55-90
  const votesRaw = interpolate(frame, [55, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentVotes = Math.round(votesRaw * VOTES-TARGET);

  // CTA button: scale in + glow, frames 70-85
  const ctaProgress = spring({
    frame: frame - 70,
    fps,
    config: { damping: 16, stiffness: 200 },
    durationInFrames: 15,
  });
  const ctaScale = interpolate(ctaProgress, [0, 0.7, 1], [0, 1.08, 1], {
    extrapolateRight: "clamp",
  });
  const ctaOpacity = interpolate(ctaProgress, [0, 0.3], [0, 1], {
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
          background: "#ffffff",
          borderRadius: 16,
          padding: "36px 40px",
          width: 840,
          boxSizing: "border-box",
          fontFamily: "sans-serif",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Top section: logo + name/tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 24,
            marginBottom: 20,
          }}
        >
          {/* Product logo */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              width: 80,
              height: 80,
              borderRadius: 18,
              background: "linear-gradient(135deg, #ff6154, #ff9f43)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 38,
              boxShadow: "0 8px 24px rgba(255,97,84,0.4)",
            }}
          >
            🚀
          </div>

          {/* Name + tagline */}
          <div
            style={{
              transform: `translateX(${nameX}px)`,
              opacity: nameOpacity,
              flex: 1,
              paddingTop: 4,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#1a1a2e",
                lineHeight: 1.2,
                marginBottom: 6,
              }}
            >
              {PRODUCT-NAME}
            </div>
            <div style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.4 }}>
              {TAGLINE}
            </div>
          </div>
        </div>

        {/* Tags row */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {TAGS.map((tag, i) => (
            <div
              key={tag}
              style={{
                transform: `scale(${tagScales[i]})`,
                border: `1.5px solid ${PH-ORANGE}`,
                borderRadius: 20,
                padding: "4px 14px",
                fontSize: 14,
                color: PH-ORANGE,
                fontWeight: 600,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 16,
            color: "#374151",
            lineHeight: 1.7,
            marginBottom: 28,
            opacity: descOpacity,
          }}
        >
          {DESCRIPTION}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "#f3f4f6",
            marginBottom: 24,
            opacity: votesRaw,
          }}
        />

        {/* Stats row + CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Stats */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              opacity: votesRaw > 0 ? 1 : 0,
            }}
          >
            {/* Vote count */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: PH-ORANGE,
                  fontWeight: 700,
                  marginBottom: 2,
                }}
              >
                ▲
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: PH-ORANGE,
                  lineHeight: 1,
                }}
              >
                {currentVotes}
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                票
              </div>
            </div>

            {/* Comments */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#6b7280",
                fontSize: 16,
              }}
            >
              <span style={{ fontSize: 20 }}>💬</span>
              <span style={{ fontWeight: 600 }}>{COMMENTS} 則留言</span>
            </div>

            {/* Rank */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#6b7280",
                fontSize: 16,
              }}
            >
              <span style={{ fontSize: 20 }}>🥇</span>
              <span style={{ fontWeight: 600 }}>{RANK}</span>
            </div>
          </div>

          {/* CTA button */}
          <div
            style={{
              transform: `scale(${ctaScale})`,
              opacity: ctaOpacity,
              background: `linear-gradient(135deg, ${PH-ORANGE}, #ff9f43)`,
              borderRadius: 10,
              padding: "12px 28px",
              fontSize: 16,
              fontWeight: 700,
              color: "#ffffff",
              cursor: "pointer",
              boxShadow: `0 6px 20px rgba(255,97,84,0.4)`,
            }}
          >
            前往產品頁
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid #f3f4f6",
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: ctaOpacity,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: PH-ORANGE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#ffffff",
              fontWeight: 900,
            }}
          >
            P
          </div>
          <span style={{ fontSize: 14, color: "#9ca3af" }}>
            Product Hunt · 今日精選
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};