import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

const SceneALeft: React.FC = () => (
  <div
    style={{
      width: 960,
      height: 1080,
      background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1920,
        height: 1080,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: "sans-serif",
          letterSpacing: 8,
          textShadow: "0 4px 32px rgba(59,130,246,0.5)",
        }}
      >
        Scene A
      </div>
    </div>
  </div>
);

const SceneARight: React.FC = () => (
  <div
    style={{
      width: 960,
      height: 1080,
      background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: -960,
        width: 1920,
        height: 1080,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: "sans-serif",
          letterSpacing: 8,
          textShadow: "0 4px 32px rgba(59,130,246,0.5)",
        }}
      >
        Scene A
      </div>
    </div>
  </div>
);

const SceneB: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "linear-gradient(135deg, #1a0533 0%, #0f0a1a 100%)",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        fontSize: 96,
        fontWeight: 700,
        color: "#ffffff",
        fontFamily: "sans-serif",
        letterSpacing: 8,
        textShadow: "0 4px 32px rgba(168,85,247,0.5)",
      }}
    >
      Scene B
    </div>
  </AbsoluteFill>
);

export const SplitDoorsTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  const leftTranslateX = progress * -960;
  const rightTranslateX = progress * 960;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <SceneB />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translateX(${leftTranslateX}px)`,
          overflow: "hidden",
        }}
      >
        <SceneALeft />
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 960,
          transform: `translateX(${rightTranslateX}px)`,
          overflow: "hidden",
        }}
      >
        <SceneARight />
      </div>
    </AbsoluteFill>
  );
};