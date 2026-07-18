import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const EQUITY-DESIGN-DURATION-FRAMES = 180;

export const Scene184-EquityDesign: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const pieSpring = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 12, stiffness: 70 } });
  const kolSpring = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 12, stiffness: 90 } });
  const loopSpring = spring({ frame: Math.max(0, frame - 110), fps, config: { damping: 10, stiffness: 80 } });
  const loopRot = frame > 110 ? interpolate(frame - 110, [0, 120], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  const pieProgress = pieSpring;
  const r = 100;
  const circumference = 2 * Math.PI * r;
  const kolSlice = circumference * 0.2 * pieProgress;
  const youSlice = circumference * 0.8 * pieProgress;

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 63, fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        透過<span style={{ color: "#F59E0B" }}>股權設計</span>，讓 KOL 持續推廣
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 30, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 50 }}>
        Equity design keeps KOL motivated to promote
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
        {/* Pie chart */}
        <div style={{ opacity: pieSpring }}>
          <svg width={280} height={280} viewBox="0 0 280 280">
            <g transform="translate(140, 140) rotate(-90)">
              {/* You slice (80%) */}
              <circle cx={0} cy={0} r={r} fill="none" stroke="#4DA3FF" strokeWidth={40}
                strokeDasharray={`${youSlice} ${circumference}`}
                strokeDashoffset={-kolSlice}
              />
              {/* KOL slice (20%) */}
              <circle cx={0} cy={0} r={r} fill="none" stroke="#F59E0B" strokeWidth={40}
                strokeDasharray={`${kolSlice} ${circumference}`}
              />
            </g>
            <text x={140} y={125} textAnchor="middle" fontSize={22} fontWeight={700} fill="#4DA3FF">你 80%</text>
            <text x={140} y={155} textAnchor="middle" fontSize={22} fontWeight={700} fill="#F59E0B">KOL 20%</text>
          </svg>
        </div>

        {/* KOL + loop */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ opacity: kolSpring, transform: `scale(${kolSpring})` }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: "rgba(245,158,11,0.12)", border: "2.5px solid #F59E0B", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 36 }}>⭐</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#F59E0B" }}>KOL</div>
            </div>
          </div>
          <div style={{ opacity: loopSpring, transform: `scale(${loopSpring}) rotate(${loopRot}deg)` }}>
            <svg width={80} height={80} viewBox="0 0 80 80">
              <path d="M 40 10 A 30 30 0 1 1 10 40" fill="none" stroke="#10B981" strokeWidth={4} strokeLinecap="round" />
              <polygon points="10,32 10,48 22,40" fill="#10B981" />
            </svg>
          </div>
          <div style={{ opacity: loopSpring, fontSize: 24, fontWeight: 700, color: "#10B981" }}>持續推廣</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};