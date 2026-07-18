import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const LogoStampReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // frame 0-15：印章從上方快速落下（y: -500 → 0）
  const stampY = interpolate(frame, [0, 15], [-500, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 14-18：衝擊 scale 1.0→1.03→1.0
  const impactScale = interpolate(
    frame,
    [14, 16, 18],
    [1.0, 1.03, 1.0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // frame 12-22：白色光暈 opacity 0→0.6→0
  const glowOpacity = interpolate(
    frame,
    [12, 17, 22],
    [0, 0.6, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // frame 20-45：品牌縮寫「BR」淡入
  const initialsOpacity = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 30-55：弧形文字「BRAND STUDIO」淡入
  const arcTextOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 45-65：「SINCE 2024」淡入
  const sinceOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 75-100：品牌全名淡入
  const brandNameOpacity = interpolate(frame, [75, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandNameY = interpolate(frame, [75, 100], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 90-115：副標語淡入
  const taglineOpacity = interpolate(frame, [90, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 48,
      }}
    >
      {/* 印章容器（含衝擊 scale + 落下位移） */}
      <div
        style={{
          transform: `translateY(${stampY}px) scale(${impactScale})`,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 白色光暈（稍大的同形 div，絕對定位） */}
        <div
          style={{
            position: "absolute",
            width: 284,
            height: 284,
            borderRadius: 20,
            background: "#ffffff",
            opacity: glowOpacity,
            top: -12,
            left: -12,
          }}
        />

        {/* 印章本體 */}
        <div
          style={{
            width: 260,
            height: 260,
            borderRadius: 12,
            background: "#dc2626",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            border: "4px solid rgba(255,255,255,0.25)",
            gap: 4,
          }}
        >
          {/* 弧形文字「BRAND STUDIO」—— SVG textPath */}
          <svg
            width="260"
            height="100"
            viewBox="0 0 260 100"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: arcTextOpacity,
            }}
          >
            <defs>
              <path
                id="arcTop"
                d="M 30,90 A 100,100 0 0,1 230,90"
              />
            </defs>
            <text
              fill="white"
              fontSize="18"
              fontWeight="700"
              fontFamily="sans-serif"
              letterSpacing="6"
            >
              <textPath href="#arcTop" startOffset="50%" textAnchor="middle">
                BRAND STUDIO
              </textPath>
            </text>
          </svg>

          {/* 品牌縮寫「BR」 */}
          <div
            style={{
              fontSize: 100,
              fontWeight: 900,
              color: "#ffffff",
              fontFamily: "sans-serif",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              opacity: initialsOpacity,
              marginTop: 24,
            }}
          >
            BR
          </div>

          {/* 下方「SINCE 2024」 */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
              fontFamily: "sans-serif",
              letterSpacing: "6px",
              opacity: sinceOpacity,
              marginTop: 4,
            }}
          >
            SINCE 2024
          </div>

          {/* 印章邊框裝飾線 */}
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              right: 8,
              bottom: 8,
              borderRadius: 6,
              border: "2px solid rgba(255,255,255,0.3)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* 印章下方品牌全名與副標語 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          transform: `translateY(${brandNameY}px)`,
          opacity: brandNameOpacity,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "sans-serif",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Brand Studio Inc.
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: "#6b7280",
            fontFamily: "sans-serif",
            letterSpacing: "0.1em",
            opacity: taglineOpacity,
          }}
        >
          Identity · Strategy · Craft
        </div>
      </div>
    </AbsoluteFill>
  );
};