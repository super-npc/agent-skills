import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const fonts = { main: "'Noto Sans TC', 'Inter', sans-serif" };

export const Scene154-IdeaFeasibility: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [130, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const lineSpring = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 14, stiffness: 80 } });
  const bulbSpring = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 10, stiffness: 100 } });
  const qSpring = spring({ frame: Math.max(0, frame - 45), fps, config: { damping: 8, stiffness: 120 } });
  const qWobble = frame > 50 ? Math.sin(frame * 0.1) * 4 : 0;
  const obs1 = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 10, stiffness: 100 } });
  const obs2 = spring({ frame: Math.max(0, frame - 65), fps, config: { damping: 10, stiffness: 100 } });
  const obs3 = spring({ frame: Math.max(0, frame - 75), fps, config: { damping: 10, stiffness: 100 } });
  const hardPulse = frame > 45 ? 0.6 + Math.sin(frame * 0.08) * 0.15 : 0.6;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)", display: "flex", flexDirection: "column", alignItems: "center", opacity: masterOpacity, fontFamily: fonts.main }}>
      <div style={{ marginTop: 150, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 75, fontWeight: 700, color: "#FFFFFF", textAlign: "center", lineHeight: 1.4 }}>
          點子是否可行，<span style={{ color: "#F59E0B" }}>很困難</span>
        </div>
        <div style={{ opacity: titleSpring * 0.45, fontSize: 36, color: "rgba(255,255,255,0.4)", marginTop: 15, fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>
          Validating whether an idea is feasible is actually very hard
        </div>
        <div style={{ width: 550 * lineSpring, height: 3, background: "linear-gradient(90deg, #F59E0B, #EF4444)", borderRadius: 2, marginTop: 27, opacity: 0.4 }} />
      </div>

      <svg width={1200} height={630} viewBox="0 0 800 420" style={{ marginTop: 45 }}>
        <g opacity={bulbSpring} transform={`translate(400, 180) scale(${bulbSpring})`}>
          <ellipse cx={0} cy={-20} rx={55} ry={60} fill="rgba(245,158,11,0.12)" stroke="#F59E0B" strokeWidth={3} />
          <path d="M -12 -20 Q -6 -40 0 -20 Q 6 -40 12 -20" fill="none" stroke="#F59E0B" strokeWidth={2.5} opacity={hardPulse} />
          <rect x={-20} y={38} width={40} height={18} rx={4} fill="rgba(245,158,11,0.3)" stroke="#F59E0B" strokeWidth={2} />
          <circle cx={0} cy={-20} r={70} fill="rgba(245,158,11,0.04)" />
        </g>

        <g opacity={qSpring} transform={`translate(${400 + qWobble}, 155) scale(${qSpring})`}>
          <text x={0} y={0} textAnchor="middle" dominantBaseline="central" fontSize={80} fontWeight={900} fill="#EF4444" fontFamily="'Inter', sans-serif" opacity={0.85}>?</text>
        </g>

        <g opacity={obs1} transform={`translate(180, 200) scale(${obs1})`}>
          <rect x={-40} y={-30} width={80} height={60} rx={8} fill="rgba(239,68,68,0.1)" stroke="#EF4444" strokeWidth={2.5} />
          <line x1={-20} y1={-10} x2={20} y2={10} stroke="#EF4444" strokeWidth={3} strokeLinecap="round" opacity={0.6} />
          <line x1={20} y1={-10} x2={-20} y2={10} stroke="#EF4444" strokeWidth={3} strokeLinecap="round" opacity={0.6} />
        </g>

        <g opacity={obs2} transform={`translate(620, 200) scale(${obs2})`}>
          <rect x={-40} y={-30} width={80} height={60} rx={8} fill="rgba(239,68,68,0.1)" stroke="#EF4444" strokeWidth={2.5} />
          <line x1={-20} y1={-10} x2={20} y2={10} stroke="#EF4444" strokeWidth={3} strokeLinecap="round" opacity={0.6} />
          <line x1={20} y1={-10} x2={-20} y2={10} stroke="#EF4444" strokeWidth={3} strokeLinecap="round" opacity={0.6} />
        </g>

        <g opacity={obs3} transform={`translate(400, 330) scale(${obs3})`}>
          <rect x={-50} y={-25} width={100} height={50} rx={8} fill="rgba(239,68,68,0.1)" stroke="#EF4444" strokeWidth={2.5} />
          <line x1={-25} y1={-8} x2={25} y2={8} stroke="#EF4444" strokeWidth={3} strokeLinecap="round" opacity={0.6} />
          <line x1={25} y1={-8} x2={-25} y2={8} stroke="#EF4444" strokeWidth={3} strokeLinecap="round" opacity={0.6} />
        </g>

        <text x={400} y={400} textAnchor="middle" fontSize={24} fontWeight={700} fill="#F59E0B" fontFamily="'Noto Sans TC', sans-serif" opacity={obs3 * hardPulse}>
          困難重重
        </text>
      </svg>
    </AbsoluteFill>
  );
};