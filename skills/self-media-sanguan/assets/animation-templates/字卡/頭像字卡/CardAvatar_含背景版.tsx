import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const NAME = "Jane Smith";
const TITLE = "Creative Director";
const INITIALS = NAME.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export const CardAvatar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideProgress = spring({ frame, fps, config: { damping: 22, stiffness: 140 } });
  const avatarProgress = spring({ frame: frame - 6, fps, config: { damping: 18, stiffness: 160 } });
  const textProgress = spring({ frame: frame - 16, fps, config: { damping: 25, stiffness: 110 } });

  const x = interpolate(slideProgress, [0, 1], [-700, 0]);
  const avatarScale = interpolate(avatarProgress, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const textOpacity = interpolate(textProgress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #0f0e1a 100%)",
        justifyContent: "flex-end",
        paddingBottom: 80,
      }}
    >
      <div
        style={{
          transform: `translateX(${x}px)`,
          display: "flex",
          alignItems: "center",
          height: 90,
          background: "#1e1b4b",
          paddingRight: 52,
        }}
      >
        {/* 圓形頭像佔位框 */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            border: "3px solid #a78bfa",
            background: "#312e81",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginLeft: 12,
            marginRight: 20,
            transform: `scale(${avatarScale})`,
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#a78bfa",
              fontFamily: "sans-serif",
              lineHeight: 1,
            }}
          >
            {INITIALS}
          </span>
        </div>
        {/* 文字區 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            opacity: textOpacity,
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "sans-serif",
              lineHeight: 1.15,
            }}
          >
            {NAME}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#c4b5fd",
              fontFamily: "sans-serif",
              marginTop: 2,
            }}
          >
            {TITLE}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};