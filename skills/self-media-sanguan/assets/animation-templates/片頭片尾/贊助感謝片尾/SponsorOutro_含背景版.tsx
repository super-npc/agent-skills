import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SponsorOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 「感謝本集贊助商」標題（frame 10-35）
  const headerOpacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 品牌 logo 佔位框（frame 35-60）scale 0.8→1 + opacity 0→1
  const logoSpring = spring({
    frame: frame - 35,
    fps,
    config: { damping: 18, stiffness: 150 },
    durationInFrames: 25,
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.8, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 品牌 slogan（frame 60-85）
  const sloganOpacity = interpolate(frame, [60, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 細橫線 scaleX 0→1（frame 80-100）
  const lineScale = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 贊助優惠文字（frame 100-125）
  const offerOpacity = interpolate(frame, [100, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 「了解更多 →」按鈕（frame 120-140）scale 0→1
  const btnSpring = spring({
    frame: frame - 120,
    fps,
    config: { damping: 16, stiffness: 200 },
    durationInFrames: 20,
  });
  const btnScale = interpolate(btnSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #0c1445 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* 「感謝本集贊助商」標題 */}
      <div
        style={{
          fontSize: 28,
          color: "#94a3b8",
          fontFamily: "sans-serif",
          fontWeight: 400,
          letterSpacing: "6px",
          textTransform: "uppercase",
          opacity: headerOpacity,
          marginBottom: 48,
        }}
      >
        感謝本集贊助商
      </div>

      {/* 品牌 Logo 佔位框 */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          width: 300,
          height: 100,
          border: "2px solid rgba(255,255,255,0.2)",
          borderRadius: 8,
          background: "rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 28,
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 28,
            fontWeight: 700,
            fontFamily: "sans-serif",
            letterSpacing: "4px",
          }}
        >
          BRAND NAME
        </span>
      </div>

      {/* 品牌 Slogan */}
      <div
        style={{
          fontSize: 22,
          color: "#64748b",
          fontFamily: "sans-serif",
          fontStyle: "italic",
          opacity: sloganOpacity,
          marginBottom: 40,
        }}
      >
        Empowering creators worldwide
      </div>

      {/* 細橫線 */}
      <div
        style={{
          width: 500,
          height: 1,
          background: "rgba(255,255,255,0.1)",
          transform: `scaleX(${lineScale})`,
          transformOrigin: "center",
          marginBottom: 36,
        }}
      />

      {/* 贊助優惠文字 */}
      <div
        style={{
          opacity: offerOpacity,
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 40,
        }}
      >
        <span style={{ fontSize: 18, color: "#fbbf24" }}>★</span>
        <span
          style={{
            fontSize: 20,
            color: "#fbbf24",
            fontFamily: "sans-serif",
            fontWeight: 500,
          }}
        >
          輸入優惠碼 REMOTION 享 85 折優惠
        </span>
        <span style={{ fontSize: 18, color: "#fbbf24" }}>★</span>
      </div>

      {/* 「了解更多 →」按鈕 */}
      <div
        style={{
          transform: `scale(${btnScale})`,
          border: "2px solid rgba(255,255,255,0.7)",
          color: "#ffffff",
          fontSize: 18,
          fontFamily: "sans-serif",
          fontWeight: 600,
          borderRadius: 40,
          padding: "12px 32px",
          letterSpacing: "1px",
          background: "transparent",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        了解更多 →
      </div>
    </AbsoluteFill>
  );
};