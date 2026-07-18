import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const NEAR-SELF-FRIENDS-DURATION-FRAMES = 150;

const NEAR-PEOPLE = [
  { label: "自己", en: "Self", angle: 0, dist: 0, delay: 20, isCenter: true },
  { label: "家人", en: "Family", angle: -70, dist: 150, delay: 35 },
  { label: "好友", en: "Close Friends", angle: 0, dist: 155, delay: 48 },
  { label: "同事", en: "Colleagues", angle: 70, dist: 150, delay: 61 },
  { label: "同學", en: "Classmates", angle: 140, dist: 155, delay: 74 },
  { label: "鄰居", en: "Neighbors", angle: 210, dist: 150, delay: 87 },
];

export const Scene185-NearSelfFriends: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [130, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const nodeSprings = NEAR-PEOPLE.map((p) =>
    spring({ frame: Math.max(0, frame - p.delay), fps, config: { damping: 12, stiffness: 90 } })
  );

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: masterOpacity,
        fontFamily: "'Noto Sans TC', 'Inter', sans-serif",
      }}
    >
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 78, fontWeight: 800, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        <span style={{ color: "#10B981" }}>近</span>：從自己和親友
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 30, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 30 }}>
        Near: Start from yourself and close ones
      </div>

      <svg width={1050} height={480} viewBox="0 0 700 320">
        <g transform="translate(350, 160)">
          {/* Lines to near people */}
          {NEAR-PEOPLE.filter(p => !p.isCenter).map((p, i) => {
            const ex = p.dist * Math.cos(toRad(p.angle));
            const ey = p.dist * Math.sin(toRad(p.angle));
            return (
              <line key={i} x1={0} y1={0} x2={ex * nodeSprings[i + 1]} y2={ey * nodeSprings[i + 1]}
                stroke="rgba(16,185,129,0.3)" strokeWidth={2}
              />
            );
          })}

          {/* Center: Self */}
          <g opacity={nodeSprings[0]} transform={`scale(${nodeSprings[0]})`}>
            <circle cx={0} cy={0} r={42} fill="rgba(16,185,129,0.2)" stroke="#10B981" strokeWidth={3} />
            <text x={0} y={8} textAnchor="middle" fontSize={24} fontWeight={800} fill="#10B981">自己</text>
          </g>

          {/* Near people */}
          {NEAR-PEOPLE.filter(p => !p.isCenter).map((p, i) => {
            const ex = p.dist * Math.cos(toRad(p.angle));
            const ey = p.dist * Math.sin(toRad(p.angle));
            const sp = nodeSprings[i + 1];
            return (
              <g key={i} opacity={sp} transform={`translate(${ex}, ${ey}) scale(${sp})`}>
                <circle cx={0} cy={0} r={30} fill="rgba(16,185,129,0.08)" stroke="#10B981" strokeWidth={2} opacity={0.7} />
                <text x={0} y={7} textAnchor="middle" fontSize={16} fontWeight={600} fill="#10B981">{p.label}</text>
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};