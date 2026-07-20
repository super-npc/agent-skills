import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const FAR-STRANGERS-DURATION-FRAMES = 150;

const STRANGER-DOTS = [
  { x: 180, y: 120, delay: 20 }, { x: 320, y: 80, delay: 28 }, { x: 500, y: 60, delay: 36 },
  { x: 620, y: 100, delay: 44 }, { x: 200, y: 220, delay: 52 }, { x: 420, y: 180, delay: 60 },
  { x: 580, y: 200, delay: 68 }, { x: 150, y: 310, delay: 76 }, { x: 350, y: 290, delay: 84 },
  { x: 550, y: 300, delay: 92 }, { x: 670, y: 250, delay: 100 },
];

export const Scene175-FarStrangers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [130, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const globeSpring = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 10, stiffness: 70 } });

  const dotSprings = STRANGER-DOTS.map((d) =>
    spring({ frame: Math.max(0, frame - d.delay), fps, config: { damping: 12, stiffness: 90 } })
  );

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
        <span style={{ color: "#4DA3FF" }}>遠</span>：痛點來源於網路上的<span style={{ color: "#EF4444" }}>陌生人</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 33, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 45 }}>
        Far: Pain points from strangers on the internet
      </div>

      <svg width={1050} height={420} viewBox="0 0 700 280">
        {/* Globe */}
        <g opacity={globeSpring} transform={`translate(350, 140) scale(${globeSpring * 0.8})`}>
          <circle cx={0} cy={0} r={100} fill="rgba(77,163,255,0.04)" stroke="rgba(77,163,255,0.2)" strokeWidth={2} strokeDasharray="8 6" />
          <circle cx={0} cy={0} r={70} fill="rgba(77,163,255,0.03)" stroke="rgba(77,163,255,0.12)" strokeWidth={1.5} strokeDasharray="6 8" />
          <ellipse cx={0} cy={0} rx={100} ry={30} fill="none" stroke="rgba(77,163,255,0.1)" strokeWidth={1.5} />
          <line x1={0} y1={-100} x2={0} y2={100} stroke="rgba(77,163,255,0.1)" strokeWidth={1.5} />
        </g>

        {/* Stranger dots scattered around */}
        {STRANGER-DOTS.map((d, i) => (
          <g key={i} opacity={dotSprings[i]} transform={`translate(${d.x - 350}, ${d.y - 140}) scale(${dotSprings[i]})`}>
            <circle cx={0} cy={0} r={8} fill="#EF4444" opacity={0.5} />
            <circle cx={0} cy={0} r={16} fill="none" stroke="#EF4444" strokeWidth={1} opacity={0.2} />
          </g>
        ))}

        {/* Center label */}
        <g opacity={globeSpring}>
          <text x={350} y={145} textAnchor="middle" fontSize={20} fontWeight={600} fill="rgba(77,163,255,0.5)" fontFamily="'Inter', sans-serif">Internet</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};