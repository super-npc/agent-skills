import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Platform = {
  name: string;
  handle: string;
  icon: string;
  background: string;
  shape: "roundedRect" | "circle";
};

const platforms: Platform[] = [
  {
    name: "YouTube",
    handle: "@mychannel",
    icon: "▶",
    background: "#ff0000",
    shape: "roundedRect",
  },
  {
    name: "Instagram",
    handle: "@myinsta",
    icon: "◈",
    background: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)",
    shape: "circle",
  },
  {
    name: "Twitter / X",
    handle: "@mytwitter",
    icon: "✕",
    background: "#000000",
    shape: "circle",
  },
  {
    name: "GitHub",
    handle: "@mygithub",
    icon: "GH",
    background: "#24292e",
    shape: "circle",
  },
];

const STAGGER-FRAMES = 20;
const PLATFORM-START = 30; // 平台進場開始 frame
const FADEOUT-START = 150; // 全體 fade out 開始 frame

export const SocialLinksOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 標題：frame 0-30 從上方淡入
  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 30], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 全體 fade out：frame 150-180
  const globalOpacity = interpolate(frame, [FADEOUT-START, FADEOUT-START + 30], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: globalOpacity,
      }}
    >
      {/* 標題 */}
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          fontSize: 48,
          fontWeight: 800,
          color: "#ffffff",
          fontFamily: "sans-serif",
          letterSpacing: "4px",
          marginBottom: 80,
        }}
      >
        追蹤我們
      </div>

      {/* 平台列表 */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 64,
        }}
      >
        {platforms.map((platform, i) => {
          const startFrame = PLATFORM-START + i * STAGGER-FRAMES;
          const itemSpring = spring({
            frame: frame - startFrame,
            fps,
            config: { damping: 20, stiffness: 140 },
            durationInFrames: 20,
          });
          const itemY = interpolate(itemSpring, [0, 1], [40, 0]);
          const itemOpacity = interpolate(itemSpring, [0, 0.4], [0, 1], {
            extrapolateRight: "clamp",
          });

          const isRoundedRect = platform.shape === "roundedRect";

          return (
            <div
              key={platform.name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                transform: `translateY(${itemY}px)`,
                opacity: itemOpacity,
              }}
            >
              {/* 圖示 */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: isRoundedRect ? 16 : "50%",
                  background: platform.background,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: platform.icon === "GH" ? 20 : 32,
                  color: "#ffffff",
                  fontFamily: "sans-serif",
                  fontWeight: 700,
                  flexShrink: 0,
                  // 為 Instagram 加外框增強辨識度
                  boxShadow:
                    platform.name === "Instagram"
                      ? "0 0 0 2px rgba(255,255,255,0.15)"
                      : "none",
                }}
              >
                {platform.icon}
              </div>

              {/* 平台名稱 */}
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#ffffff",
                  fontFamily: "sans-serif",
                  letterSpacing: "0.5px",
                }}
              >
                {platform.name}
              </div>

              {/* 帳號名稱 */}
              <div
                style={{
                  fontSize: 15,
                  color: "#94a3b8",
                  fontFamily: "sans-serif",
                }}
              >
                {platform.handle}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};