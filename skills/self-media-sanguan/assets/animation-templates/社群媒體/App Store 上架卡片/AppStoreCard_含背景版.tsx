import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const APP-NAME = "SuperApp";
const DEVELOPER = "Dev Studio Inc.";
const RATING = "4.8";
const RATING-COUNT = "12.3k 評分";
const CATEGORY-RANK = "#1 生產力";
const DESCRIPTION =
  "SuperApp 是最強大的生產力工具，幫您整合所有工作流程。支援 iOS 17+ 及 iPadOS。";
const VERSION = "3.2.1";
const SIZE = "142 MB";

const RATING-BARS = [
  { stars: 5, fill: 0.78 },
  { stars: 4, fill: 0.12 },
  { stars: 3, fill: 0.05 },
  { stars: 2, fill: 0.03 },
  { stars: 1, fill: 0.02 },
];

const SCREENSHOT-GRADIENTS = [
  "linear-gradient(160deg, #5e35b1, #7e57c2, #26c6da)",
  "linear-gradient(160deg, #1565c0, #42a5f5, #80cbc4)",
  "linear-gradient(160deg, #2e7d32, #66bb6a, #fff176)",
];

export const AppStoreCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card: slide up + fade, frames 0-20
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

  // App icon: scale bounce, frames 10-28
  const iconProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });
  const iconScale = interpolate(iconProgress, [0, 0.7, 1], [0, 1.12, 1], {
    extrapolateRight: "clamp",
  });

  // Name + rating: slide from top, frames 18-32
  const nameProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 22, stiffness: 160 },
    durationInFrames: 14,
  });
  const nameY = interpolate(nameProgress, [0, 1], [-20, 0]);
  const nameOpacity = interpolate(nameProgress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // GET button: scale pop, frames 28-40
  const btnProgress = spring({
    frame: frame - 28,
    fps,
    config: { damping: 16, stiffness: 220 },
    durationInFrames: 12,
  });
  const btnScale = interpolate(btnProgress, [0, 0.7, 1], [0, 1.1, 1], {
    extrapolateRight: "clamp",
  });
  const btnOpacity = interpolate(btnProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Screenshots: slide in from right one by one, frames 35-70
  const screenshotTranslates = SCREENSHOT-GRADIENTS.map((_, i) => {
    const p = spring({
      frame: frame - (35 + i * 12),
      fps,
      config: { damping: 22, stiffness: 150 },
      durationInFrames: 16,
    });
    const x = interpolate(p, [0, 1], [120, 0]);
    const opacity = interpolate(p, [0, 0.4], [0, 1], {
      extrapolateRight: "clamp",
    });
    return { x, opacity };
  });

  // Description: fade in, frames 55-72
  const descOpacity = interpolate(frame, [55, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rating bars: fill left to right, frames 65-95
  const barFill = interpolate(frame, [65, 95], [0, 1], {
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
          transform: `translateY(${cardY}px)`,
          opacity: cardOpacity,
          background: "#1c1c1e",
          borderRadius: 16,
          padding: "32px 36px",
          width: 880,
          boxSizing: "border-box",
          fontFamily: "sans-serif",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
        }}
      >
        {/* Top section: icon + info + GET button */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 20,
            marginBottom: 16,
          }}
        >
          {/* App icon */}
          <div
            style={{
              transform: `scale(${iconScale})`,
              width: 100,
              height: 100,
              borderRadius: 22,
              background: "linear-gradient(135deg, #7b2ff7, #00d4ff)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              boxShadow: "0 8px 24px rgba(123,47,247,0.4)",
            }}
          >
            ✦
          </div>

          {/* Name + developer + rating */}
          <div
            style={{
              flex: 1,
              transform: `translateY(${nameY}px)`,
              opacity: nameOpacity,
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#f2f2f7",
                marginBottom: 4,
              }}
            >
              {APP-NAME}
            </div>
            <div
              style={{ fontSize: 15, color: "#8e8e93", marginBottom: 8 }}
            >
              {DEVELOPER}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ fontSize: 16, color: "#ff9f0a" }}>
                    ★
                  </span>
                ))}
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#f2f2f7" }}>
                {RATING}
              </span>
              <span style={{ fontSize: 13, color: "#8e8e93" }}>
                ({RATING-COUNT})
              </span>
            </div>
          </div>

          {/* GET button + Category */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 10,
              paddingTop: 6,
            }}
          >
            <div
              style={{
                transform: `scale(${btnScale})`,
                opacity: btnOpacity,
                background: "#0a84ff",
                borderRadius: 20,
                padding: "8px 24px",
                fontSize: 17,
                fontWeight: 700,
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              取得
            </div>
            <div
              style={{
                background: "#2c2c2e",
                borderRadius: 8,
                padding: "4px 10px",
                fontSize: 12,
                color: "#8e8e93",
                fontWeight: 600,
                opacity: btnOpacity,
              }}
            >
              {CATEGORY-RANK}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "#2c2c2e",
            marginBottom: 20,
          }}
        />

        {/* Screenshots row */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            overflow: "hidden",
          }}
        >
          {SCREENSHOT-GRADIENTS.map((gradient, i) => (
            <div
              key={i}
              style={{
                transform: `translateX(${screenshotTranslates[i].x}px)`,
                opacity: screenshotTranslates[i].opacity,
                width: 190,
                height: 340,
                borderRadius: 14,
                background: gradient,
                flexShrink: 0,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-start",
                padding: "16px",
                boxSizing: "border-box",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  left: 14,
                  right: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    height: 8,
                    background: "rgba(255,255,255,0.3)",
                    borderRadius: 4,
                    width: "70%",
                  }}
                />
                <div
                  style={{
                    height: 6,
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: 4,
                    width: "90%",
                  }}
                />
                <div
                  style={{
                    height: 6,
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: 4,
                    width: "55%",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 14,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 600,
                }}
              >
                截圖 {i + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 15,
            color: "#ebebf5",
            lineHeight: 1.6,
            marginBottom: 20,
            opacity: descOpacity,
          }}
        >
          {DESCRIPTION}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "#2c2c2e",
            marginBottom: 16,
            opacity: barFill > 0 ? 1 : 0,
          }}
        />

        {/* Rating bars */}
        <div
          style={{
            display: "flex",
            gap: 32,
            marginBottom: 20,
            opacity: barFill > 0 ? 1 : 0,
          }}
        >
          {/* Big rating display */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 80,
            }}
          >
            <div
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: "#f2f2f7",
                lineHeight: 1,
              }}
            >
              {RATING}
            </div>
            <div style={{ fontSize: 12, color: "#8e8e93", marginTop: 4 }}>
              滿分 5 分
            </div>
          </div>

          {/* Bar chart */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              justifyContent: "center",
            }}
          >
            {RATING-BARS.map(({ stars, fill }) => (
              <div
                key={stars}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: "#8e8e93",
                    width: 8,
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {stars}
                </span>
                <span style={{ fontSize: 11, color: "#ff9f0a" }}>★</span>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: "#2c2c2e",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${fill * barFill * 100}%`,
                      height: "100%",
                      background: "#8e8e93",
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Version info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            opacity: barFill,
            paddingTop: 8,
            borderTop: "1px solid #2c2c2e",
          }}
        >
          <span style={{ fontSize: 13, color: "#8e8e93" }}>
            版本 {VERSION} · 更新於昨天
          </span>
          <span style={{ fontSize: 13, color: "#8e8e93" }}>
            大小：{SIZE}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};