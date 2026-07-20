import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const MID-ASK-EXPERTS-DURATION-FRAMES = 150;

const EXPERTS = [
  { angle: -50, dist: 160, label: "業界前輩" },
  { angle: 10, dist: 175, label: "產品經理" },
  { angle: 70, dist: 160, label: "資深用戶" },
  { angle: 130, dist: 175, label: "領域專家" },
  { angle: 190, dist: 160, label: "社群 KOL" },
];

export const Scene178-MidAskExperts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [130, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const centerSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 90 } });
  const expertSprings = EXPERTS.map((_, i) =>
    spring({ frame: Math.max(0, frame - 35 - i * 12), fps, config: { damping: 12, stiffness: 90 } })
  );
  const lineSprings = EXPERTS.map((_, i) =>
    spring({ frame: Math.max(0, frame - 30 - i * 12), fps, config: { damping: 10, stiffness: 80 } })
  );

  const toRad = (deg: number) => (deg * Math.PI) / 180;

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 78, fontWeight: 800, color: "#FFFFFF", textAlign: "center", marginBottom: 12 }}>
        <span style={{ color: "#F59E0B" }}>中</span>：問懂痛點的人
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 33, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 30 }}>
        Mid: Ask people who understand the pain
      </div>

      <svg width={1125} height={540} viewBox="0 0 750 360">
        <g transform="translate(375, 180)">
          {/* Lines from center to experts */}
          {EXPERTS.map((e, i) => {
            const ex = e.dist * Math.cos(toRad(e.angle));
            const ey = e.dist * Math.sin(toRad(e.angle));
            return (
              <line key={i} x1={0} y1={0} x2={ex * lineSprings[i]} y2={ey * lineSprings[i]}
                stroke="rgba(245,158,11,0.3)" strokeWidth={1.5} strokeDasharray="4 4"
              />
            );
          })}

          {/* Center node */}
          <g opacity={centerSpring} transform={`scale(${centerSpring})`}>
            <circle cx={0} cy={0} r={35} fill="rgba(77,163,255,0.15)" stroke="#4DA3FF" strokeWidth={2.5} />
            <text x={0} y={7} textAnchor="middle" fontSize={22} fontWeight={700} fill="#4DA3FF">你</text>
          </g>

          {/* Expert nodes */}
          {EXPERTS.map((e, i) => {
            const ex = e.dist * Math.cos(toRad(e.angle));
            const ey = e.dist * Math.sin(toRad(e.angle));
            return (
              <g key={i} opacity={expertSprings[i]} transform={`translate(${ex}, ${ey}) scale(${expertSprings[i]})`}>
                <circle cx={0} cy={0} r={28} fill="rgba(245,158,11,0.1)" stroke="#F59E0B" strokeWidth={2} />
                <text x={0} y={7} textAnchor="middle" fontSize={14} fontWeight={600} fill="#F59E0B">{e.label}</text>
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};