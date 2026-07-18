import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const LogoGlowPulse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // frame 0-40：菱形 scale(0) spring 彈入
  const diamondScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 180 },
    durationInFrames: 40,
  });

  // frame 0-40：背景輻射漸層 opacity 0→0.4
  const bgGradientOpacity = interpolate(frame, [0, 40], [0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 35-65：外圍光暈 opacity 0→0.7
  const glowOpacity = interpolate(frame, [35, 65], [0, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 持續脈衝：sin 波動
  const pulse = Math.sin(frame * 0.12) * 0.3 + 0.7;

  // 最終光暈 opacity（結合淡入和脈衝）
  const finalGlowOpacity = glowOpacity * pulse;

  // frame 50-80：「GX」品牌縮寫淡入
  const abbrevOpacity = interpolate(frame, [50, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 75-100：品牌名「GlowX」從下方滑入
  const brandY = interpolate(frame, [75, 100], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandOpacity = interpolate(frame, [75, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // frame 95-120：狀態列淡入
  const statusOpacity = interpolate(frame, [95, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#050505",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 背景輻射漸層 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, #7c3aed22 0%, transparent 60%)",
          opacity: bgGradientOpacity,
          pointerEvents: "none",
        }}
      />

      {/* 外圍光暈（模糊的菱形） */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 160,
          height: 160,
          transform: `translate(-50%, -50%) rotate(45deg) scale(${diamondScale})`,
          background: "linear-gradient(135deg, #7c3aed, #2563eb)",
          filter: "blur(20px)",
          opacity: finalGlowOpacity,
          borderRadius: 8,
        }}
      />

      {/* 主菱形 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 120,
          height: 120,
          transform: `translate(-50%, -50%) rotate(45deg) scale(${diamondScale})`,
          background: "linear-gradient(135deg, #7c3aed, #2563eb)",
          borderRadius: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />

      {/* 菱形內品牌縮寫「GX」（需要反向旋轉） */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${diamondScale})`,
          fontSize: 60,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: "sans-serif",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          opacity: abbrevOpacity,
          userSelect: "none",
        }}
      >
        GX
      </div>

      {/* 品牌名「GlowX」 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 540 + 90,
          transform: `translateX(-50%) translateY(${brandY}px)`,
          fontSize: 52,
          fontWeight: 700,
          color: "#ffffff",
          fontFamily: "sans-serif",
          letterSpacing: "-0.02em",
          opacity: brandOpacity,
          whiteSpace: "nowrap",
        }}
      >
        GlowX
      </div>

      {/* 狀態指示列：綠點 + ONLINE */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 540 + 90 + 64,
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          opacity: statusOpacity,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#22c55e",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#22c55e",
            fontFamily: "sans-serif",
            letterSpacing: "3px",
          }}
        >
          ONLINE
        </span>
      </div>
    </AbsoluteFill>
  );
};