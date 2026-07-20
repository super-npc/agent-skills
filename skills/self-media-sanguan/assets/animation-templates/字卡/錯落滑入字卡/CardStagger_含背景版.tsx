import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

interface StaggerLineProps {
  children: React.ReactNode;
  startFrame: number;
  frame: number;
  fps: number;
  fontSize: number;
  color: string;
}

const StaggerLine: React.FC<StaggerLineProps> = ({ children, startFrame, frame, fps, fontSize, color }) => {
  const progress = spring({ frame: frame - startFrame, fps, config: { damping: 24, stiffness: 130 } });
  const x = interpolate(progress, [0, 1], [-30, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        transform: `translateX(${x}px)`,
        opacity,
        fontSize,
        fontWeight: fontSize >= 36 ? 700 : 400,
        color,
        fontFamily: "sans-serif",
        lineHeight: 1.2,
      }}
    >
      {children}
    </div>
  );
};

export const CardStagger: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideProgress = spring({ frame, fps, config: { damping: 22, stiffness: 140 } });
  const x = interpolate(slideProgress, [0, 1], [-700, 0]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
        justifyContent: "flex-end",
        paddingBottom: 80,
      }}
    >
      <div
        style={{
          transform: `translateX(${x}px)`,
          display: "flex",
          alignItems: "stretch",
          minHeight: 110,
        }}
      >
        {/* 左側橙色強調線 */}
        <div style={{ width: 6, background: "#f97316", flexShrink: 0 }} />
        {/* 深靛藍色色塊 */}
        <div
          style={{
            background: "#1e3a5f",
            paddingLeft: 24,
            paddingRight: 52,
            paddingTop: 14,
            paddingBottom: 14,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <StaggerLine startFrame={15} frame={frame} fps={fps} fontSize={36} color="#ffffff">
            Jane Smith
          </StaggerLine>
          <StaggerLine startFrame={27} frame={frame} fps={fps} fontSize={20} color="#93c5fd">
            Creative Director
          </StaggerLine>
          <StaggerLine startFrame={39} frame={frame} fps={fps} fontSize={16} color="#64748b">
            Remotion Studio · Product Team
          </StaggerLine>
        </div>
      </div>
    </AbsoluteFill>
  );
};