import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const START-WITH-SERVICE-DURATION-FRAMES = 180;

const STEPS = [
  { label: "人工提供服務", en: "Manual service", icon: "🔧", color: "#4DA3FF", delay: 25 },
  { label: "累積成功案例", en: "Build case studies", icon: "📋", color: "#A78BFA", delay: 55 },
  { label: "打造作品集", en: "Portfolio ready", icon: "💼", color: "#F59E0B", delay: 85 },
  { label: "走向產品化", en: "Productize", icon: "🚀", color: "#10B981", delay: 115 },
];

export const Scene194-StartWithService: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const stepSprings = STEPS.map((s) =>
    spring({ frame: Math.max(0, frame - s.delay), fps, config: { damping: 12, stiffness: 90 } })
  );
  const arrowSprings = STEPS.slice(0, -1).map((s) =>
    spring({ frame: Math.max(0, frame - s.delay - 10), fps, config: { damping: 10, stiffness: 100 } })
  );

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 66, fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        3. 先從<span style={{ color: "#4DA3FF" }}>服務</span>做起，累積<span style={{ color: "#F59E0B" }}>經驗和作品</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 28, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 60 }}>
        Start with service, build experience & portfolio
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        {STEPS.map((step, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                opacity: stepSprings[i],
                transform: `scale(${stepSprings[i]})`,
                width: 220,
                height: 220,
                borderRadius: 20,
                background: `${step.color}10`,
                border: `2px solid ${step.color}40`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 48 }}>{step.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: step.color, textAlign: "center" }}>{step.label}</div>
              <div style={{ fontSize: 16, color: `${step.color}50`, fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>{step.en}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ opacity: arrowSprings[i], margin: "0 10px" }}>
                <svg width={40} height={30} viewBox="0 0 40 30">
                  <line x1={2} y1={15} x2={28} y2={15} stroke="rgba(255,255,255,0.2)" strokeWidth={2.5} strokeLinecap="round" />
                  <polygon points="28,9 38,15 28,21" fill="rgba(255,255,255,0.2)" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};