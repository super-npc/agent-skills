import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const THINK-DISTRIBUTION-221-DURATION-FRAMES = 180;

const PEOPLE = [
  { angle: -90, color: "#EF4444" },
  { angle: -40, color: "#F97316" },
  { angle: 10, color: "#F59E0B" },
  { angle: 60, color: "#EC4899" },
  { angle: 120, color: "#A78BFA" },
  { angle: 170, color: "#EF4444" },
  { angle: 220, color: "#F97316" },
  { angle: 270, color: "#F59E0B" },
];

export const Scene221-ThinkDistribution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const centerSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 80 } });
  const waveSprings = [0, 1, 2, 3].map((i) =>
    spring({ frame: Math.max(0, frame - 40 - i * 12), fps, config: { damping: 14, stiffness: 60 } })
  );
  const peopleSprings = PEOPLE.map((_, i) =>
    spring({ frame: Math.max(0, frame - 70 - i * 6), fps, config: { damping: 12, stiffness: 80 } })
  );
  const connectProg = interpolate(frame, [100, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.9, 1.05]);

  const cx = 525;
  const cy = 195;
  const dist = 160;

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 60, fontWeight: 800, color: "#FFFFFF", textAlign: "center", marginBottom: 9, lineHeight: 1.4 }}>
        怎麼持續<span style={{ color: "#10B981" }}>觸及</span>有痛點的人群
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 30, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 45 }}>
        How to continuously reach people with pain points — a.k.a. Distribution
      </div>

      <svg width={1575} height={600} viewBox="0 0 1050 400">
        {/* Radiating waves */}
        {waveSprings.map((sp, i) => (
          <circle key={i} cx={cx} cy={cy} r={(60 + i * 35) * sp * pulse}
            fill="none" stroke="#10B981" strokeWidth={2} opacity={sp * (0.3 - i * 0.06)} />
        ))}

        {/* Connection lines */}
        {PEOPLE.map((p, i) => {
          const rad = (p.angle * Math.PI) / 180;
          const px = cx + Math.cos(rad) * dist;
          const py = cy + Math.sin(rad) * dist;
          return (
            <line key={`line-${i}`} x1={cx} y1={cy} x2={px} y2={py}
              stroke="#10B981" strokeWidth={1.5} strokeDasharray="6 4" opacity={connectProg * 0.3} />
          );
        })}

        {/* Center */}
        <g transform={`translate(${cx}, ${cy})`} opacity={centerSpring}>
          <g transform={`scale(${centerSpring})`}>
            <circle cx={0} cy={0} r={50} fill="rgba(16,185,129,0.1)" stroke="#10B981" strokeWidth={3} />
            <circle cx={0} cy={-5} r={12} fill="#10B981" opacity={0.7} />
            <path d="M -20 12 Q -20 0 0 0 Q 20 0 20 12" fill="#10B981" opacity={0.5} />
            <path d="M 25 -18 Q 35 -28 25 -38" fill="none" stroke="#10B981" strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />
            <path d="M 32 -12 Q 46 -28 32 -44" fill="none" stroke="#10B981" strokeWidth={2} strokeLinecap="round" opacity={0.4} />
            <path d="M -25 -18 Q -35 -28 -25 -38" fill="none" stroke="#10B981" strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />
            <path d="M -32 -12 Q -46 -28 -32 -44" fill="none" stroke="#10B981" strokeWidth={2} strokeLinecap="round" opacity={0.4} />
          </g>
        </g>

        {/* People with pain points */}
        {PEOPLE.map((p, i) => {
          const sp = peopleSprings[i];
          const rad = (p.angle * Math.PI) / 180;
          const px = cx + Math.cos(rad) * dist;
          const py = cy + Math.sin(rad) * dist;
          return (
            <g key={i} transform={`translate(${px}, ${py})`} opacity={sp}>
              <g transform={`scale(${sp})`}>
                <circle cx={0} cy={0} r={25} fill={`${p.color}10`} stroke={p.color} strokeWidth={2} />
                <circle cx={0} cy={-6} r={7} fill={p.color} opacity={0.6} />
                <path d="M -6 8 Q -6 2 0 2 Q 6 2 6 8" fill={p.color} opacity={0.4} />
                <text x={16} y={-12} fontSize={12} fontWeight={800} fill={p.color} fontFamily="'Inter', sans-serif">!</text>
              </g>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};