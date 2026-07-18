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

export const CardTypewriter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideProgress = spring({ frame, fps, config: { damping: 22, stiffness: 140 } });
  const x = interpolate(slideProgress, [0, 1], [-700, 0]);

  // 打字機效果：色塊到位後（約 frame 12）才開始打字
  const typeStart = 12;
  const nameChars = Math.floor(Math.max(0, frame - typeStart) / 2);
  const displayedName = NAME.slice(0, nameChars);

  // 姓名打完後（NAME.length * 2 frames）再延遲 20 frames 開始打頭銜
  const titleStart = typeStart + NAME.length * 2 + 20;
  const titleChars = Math.floor(Math.max(0, frame - titleStart) / 2);
  const displayedTitle = TITLE.slice(0, titleChars);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #164e63 0%, #0c1a20 100%)",
        justifyContent: "flex-end",
        paddingBottom: 80,
      }}
    >
      <div style={{ transform: `translateX(${x}px)`, display: "flex", alignItems: "stretch", height: 90 }}>
        <div style={{ width: 6, background: "#ffffff", flexShrink: 0 }} />
        <div
          style={{
            background: "#0e7490",
            paddingLeft: 24,
            paddingRight: 52,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "monospace",
              lineHeight: 1.15,
              minWidth: 360,
            }}
          >
            {displayedName}
            {nameChars < NAME.length && (
              <span style={{ borderRight: "3px solid #ffffff", marginLeft: 2 }}>&nbsp;</span>
            )}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#a5f3fc",
              fontFamily: "monospace",
              marginTop: 2,
              minHeight: 24,
            }}
          >
            {displayedTitle}
            {displayedName === NAME && titleChars < TITLE.length && (
              <span style={{ borderRight: "3px solid #a5f3fc", marginLeft: 2 }}>&nbsp;</span>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};