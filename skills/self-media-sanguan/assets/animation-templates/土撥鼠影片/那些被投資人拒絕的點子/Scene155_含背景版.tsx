import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

const fonts = { main: "'Noto Sans TC', 'Inter', sans-serif" };

const COMPANIES = [
  {
    name: "Airbnb",
    initial: "A",
    quote: "「誰會想睡在陌生人家裡？」",
    quoteEn: '"Who would want to sleep in a stranger\'s house?"',
    rejectCount: "被拒絕 7 次以上",
    value: "$80B+",
    color: "#FF5A5F",
    startFrame: 10,
  },
  {
    name: "Uber",
    initial: "U",
    quote: "「沒人會用手機叫車」",
    quoteEn: '"Nobody will use a phone to hail a cab"',
    rejectCount: "計程車行業不可能被顛覆",
    value: "$150B+",
    color: "#1a1a1a",
    startFrame: 120,
  },
  {
    name: "Instagram",
    initial: "I",
    quote: "「只是一個拍照 app，怎麼賺錢？」",
    quoteEn: '"Just a photo app, how will it make money?"',
    rejectCount: "被嘲笑 $1B 收購太貴",
    value: "$1B → 收購",
    color: "#E1306C",
    startFrame: 240,
  },
  {
    name: "Slack",
    initial: "S",
    quote: "「為什麼要做另一個聊天工具？」",
    quoteEn: '"Why build another chat tool? Email is enough"',
    rejectCount: "投資人早期質疑",
    value: "$27.7B → 收購",
    color: "#4A154B",
    startFrame: 360,
  },
];

export const Scene155-RejectedIdeas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [460, 480], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)", opacity: masterOpacity, fontFamily: fonts.main }}>
      {COMPANIES.map((company, idx) => {
        const sf = company.startFrame;
        const localFrame = frame - sf;
        const duration = 120;

        if (localFrame < -5 || localFrame > duration + 10) return null;

        const cardIn = spring({ frame: Math.max(0, localFrame), fps, config: { damping: 14, stiffness: 90 } });
        const cardOut = interpolate(localFrame, [duration - 15, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const cardOpacity = Math.min(cardIn, cardOut);

        const logoSpring = spring({ frame: Math.max(0, localFrame - 5), fps, config: { damping: 10, stiffness: 100 } });
        const quoteSpring = spring({ frame: Math.max(0, localFrame - 15), fps, config: { damping: 12, stiffness: 90 } });
        const valueSpring = spring({ frame: Math.max(0, localFrame - 55), fps, config: { damping: 10, stiffness: 100 } });
        const strikeProgress = interpolate(localFrame, [55, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <AbsoluteFill key={idx} style={{ opacity: cardOpacity, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 2100 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 36, opacity: logoSpring, transform: `scale(${logoSpring})`, marginBottom: 60 }}>
                <div style={{ width: 120, height: 120, borderRadius: 24, background: company.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 0 30px ${company.color}40` }}>
                  <span style={{ fontSize: 60, fontWeight: 900, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}>{company.initial}</span>
                </div>
                <div style={{ fontSize: 72, fontWeight: 800, color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}>{company.name}</div>
              </div>

              <div style={{ opacity: quoteSpring, transform: `translateY(${(1 - quoteSpring) * 15}px)`, position: "relative", marginBottom: 24 }}>
                <div style={{ fontSize: 54, fontWeight: 600, color: "#EF4444", textAlign: "center", lineHeight: 1.5, opacity: 1 - strikeProgress * 0.4 }}>
                  投資人說：{company.quote}
                </div>
                {strikeProgress > 0 && (
                  <div style={{ position: "absolute", top: "50%", left: `${50 - strikeProgress * 50}%`, width: `${strikeProgress * 100}%`, height: 4, background: "#EF4444", opacity: 0.7 }} />
                )}
              </div>

              <div style={{ opacity: quoteSpring * 0.4 * (1 - strikeProgress * 0.5), fontSize: 33, color: "rgba(255,255,255,0.35)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 75 }}>
                {company.quoteEn}
              </div>

              <div style={{ opacity: valueSpring, transform: `scale(${valueSpring})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 39, color: "rgba(255,255,255,0.5)" }}>現在</div>
                <div style={{ fontSize: 108, fontWeight: 900, color: "#10B981", fontFamily: "'Inter', sans-serif", textShadow: "0 0 40px rgba(16,185,129,0.3)" }}>
                  {company.value}
                </div>
              </div>
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};