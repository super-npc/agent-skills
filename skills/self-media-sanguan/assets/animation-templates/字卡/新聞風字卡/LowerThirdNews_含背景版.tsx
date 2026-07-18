import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import React from "react";

const TICKER = "今日頭條：全球科技大會盛大開幕 · 人工智慧新突破獲得廣泛關注 · 創新獎項頒獎典禮圓滿落幕 · 科技新創獲得億元融資 · 更多精彩新聞敬請關注";
const TICKER-SPEED = 2.5;

export const LowerThirdNews: React.FC = () => {
  const frame = useCurrentFrame();

  const bannerOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const tickerX = -frame * TICKER-SPEED;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        justifyContent: "flex-end",
      }}
    >
      <div style={{ opacity: bannerOpacity, width: "100%" }}>
        <div
          style={{
            background: "#1d4ed8",
            display: "flex",
            alignItems: "center",
            gap: 16,
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <div
            style={{
              background: "#ef4444",
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 3,
              paddingBottom: 3,
              fontSize: 15,
              fontWeight: 800,
              color: "#ffffff",
              fontFamily: "sans-serif",
              letterSpacing: "0.08em",
              flexShrink: 0,
            }}
          >
            LIVE
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#ffffff", fontFamily: "sans-serif" }}>
            張偉明
          </div>
          <div style={{ width: 2, height: 28, background: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
          <div style={{ fontSize: 18, color: "#bfdbfe", fontFamily: "sans-serif" }}>
            現場記者
          </div>
        </div>
        <div
          style={{
            background: "#172554",
            height: 38,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              transform: `translateX(${tickerX}px)`,
              whiteSpace: "nowrap",
              fontSize: 16,
              color: "#e2e8f0",
              fontFamily: "sans-serif",
              paddingLeft: 1920,
            }}
          >
            {TICKER} · {TICKER}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};