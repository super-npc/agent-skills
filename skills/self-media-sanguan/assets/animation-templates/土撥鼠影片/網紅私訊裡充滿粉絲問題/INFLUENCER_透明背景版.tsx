import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const INFLUENCER-DMS-DURATION-FRAMES = 180;

const DM-MESSAGES = [
  { text: "請問哪個產品好？", x: -200, y: -80, delay: 30 },
  { text: "有推薦嗎？", x: 120, y: -100, delay: 45 },
  { text: "怎麼用比較好？", x: -180, y: 20, delay: 60 },
  { text: "這個有效嗎？", x: 140, y: 0, delay: 75 },
  { text: "哪裡可以買？", x: -150, y: 110, delay: 90 },
  { text: "有優惠碼嗎？", x: 100, y: 100, delay: 105 },
];

export const Scene179-InfluencerDMs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const phoneSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 90 } });
  const dmSprings = DM-MESSAGES.map((dm) =>
    spring({ frame: Math.max(0, frame - dm.delay), fps, config: { damping: 12, stiffness: 100 } })
  );
  const insightSpring = spring({ frame: Math.max(0, frame - 130), fps, config: { damping: 12, stiffness: 80 } });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: masterOpacity,
        fontFamily: "'Noto Sans TC', 'Inter', sans-serif",
      }}
    >
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 57, fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: 12 }}>
        網紅私訊裡<span style={{ color: "#F59E0B" }}>充滿粉絲的問題</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 28, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 30 }}>
        Influencer DMs are filled with fan questions
      </div>

      {/* Phone + DMs */}
      <div style={{ position: "relative", width: 600, height: 380 }}>
        {/* Phone center */}
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) scale(${phoneSpring})`, opacity: phoneSpring }}>
          <div style={{ width: 80, height: 140, background: "rgba(245,158,11,0.15)", border: "3px solid #F59E0B", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 36 }}>📱</div>
          </div>
        </div>

        {/* DM bubbles */}
        {DM-MESSAGES.map((dm, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(50% + ${dm.x}px)`,
              top: `calc(50% + ${dm.y}px)`,
              transform: `translate(-50%, -50%) scale(${dmSprings[i]})`,
              opacity: dmSprings[i],
              background: "rgba(77,163,255,0.12)",
              border: "1.5px solid rgba(77,163,255,0.3)",
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 18,
              color: "rgba(255,255,255,0.7)",
              whiteSpace: "nowrap",
            }}
          >
            {dm.text}
          </div>
        ))}
      </div>

      {/* Insight */}
      <div style={{ opacity: insightSpring, transform: `translateY(${(1 - insightSpring) * 15}px)`, fontSize: 33, color: "#F59E0B", fontWeight: 700, textAlign: "center" }}>
        → 能精準掌握粉絲需要什麼
      </div>
    </AbsoluteFill>
  );
};