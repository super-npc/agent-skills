import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const EXCLUSIVE-APP-DURATION-FRAMES = 210;

const APPS = [
  { title: "健身追蹤", subtitle: "Fitness Tracker", icon: "💪", color: "#10B981", delay: 30 },
  { title: "飲食管理", subtitle: "Diet Manager", icon: "🥗", color: "#4DA3FF", delay: 55 },
  { title: "進度記錄", subtitle: "Progress Log", icon: "📈", color: "#F59E0B", delay: 80 },
];

export const Scene180-ExclusiveApp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const appSprings = APPS.map((a) =>
    spring({ frame: Math.max(0, frame - a.delay), fps, config: { damping: 12, stiffness: 90 } })
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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 72, fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        直接為他們做一個<span style={{ color: "#10B981" }}>專屬 APP</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 33, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 60 }}>
        Build an exclusive app just for their fans
      </div>

      <div style={{ display: "flex", gap: 48 }}>
        {APPS.map((app, i) => (
          <div
            key={i}
            style={{
              opacity: appSprings[i],
              transform: `translateX(${(1 - appSprings[i]) * 80}px) scale(${0.85 + appSprings[i] * 0.15})`,
              width: 300,
              height: 340,
              background: `${app.color}08`,
              border: `2px solid ${app.color}40`,
              borderRadius: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <div style={{ fontSize: 72 }}>{app.icon}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: app.color }}>{app.title}</div>
            <div style={{ fontSize: 20, color: `${app.color}60`, fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>{app.subtitle}</div>
            <div style={{ width: 60, height: 4, background: app.color, borderRadius: 2, opacity: 0.4 }} />
            <div style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>專屬功能</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};