import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const fonts = { main: "'Noto Sans TC', 'Inter', sans-serif" };

export const Scene151-AiReportDoubt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const lineSpring = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 14, stiffness: 80 } });
  const robotSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 90 } });
  const arrowProg = interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const reportSpring = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 10, stiffness: 100 } });
  const doubtSpring = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 8, stiffness: 120 } });
  const doubtWobble = frame > 85 ? Math.sin(frame * 0.1) * 3 : 0;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)", display: "flex", flexDirection: "column", alignItems: "center", opacity: masterOpacity, fontFamily: fonts.main }}>
      <div style={{ marginTop: 150, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 75, fontWeight: 700, color: "#FFFFFF", textAlign: "center", lineHeight: 1.4 }}>
          AI 給的報告<span style={{ color: "#F59E0B" }}>未必</span>是有用資訊
        </div>
        <div style={{ opacity: titleSpring * 0.45, fontSize: 39, color: "rgba(255,255,255,0.4)", marginTop: 18, fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>
          AI-generated reports aren't necessarily useful information
        </div>
        <div style={{ width: 600 * lineSpring, height: 3, background: "linear-gradient(90deg, #F59E0B, #EF4444)", borderRadius: 2, marginTop: 30, opacity: 0.4 }} />
      </div>

      <svg width={1800} height={750} viewBox="0 0 1200 500" style={{ marginTop: 30 }}>
        <g opacity={robotSpring} transform={`translate(275, 260) scale(${robotSpring})`}>
          <rect x={-55} y={-40} width={110} height={100} rx={16} fill="rgba(77,163,255,0.12)" stroke="#4DA3FF" strokeWidth={3} />
          <rect x={-40} y={-95} width={80} height={60} rx={12} fill="rgba(77,163,255,0.1)" stroke="#4DA3FF" strokeWidth={2.5} />
          <circle cx={-15} cy={-70} r={8} fill="#4DA3FF" opacity={0.8} />
          <circle cx={15} cy={-70} r={8} fill="#4DA3FF" opacity={0.8} />
          <circle cx={-15} cy={-70} r={4} fill="#FFFFFF" />
          <circle cx={15} cy={-70} r={4} fill="#FFFFFF" />
          <line x1={0} y1={-95} x2={0} y2={-115} stroke="#4DA3FF" strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={0} cy={-118} r={5} fill="#4DA3FF" opacity={0.6 + Math.sin(frame * 0.15) * 0.3} />
          <line x1={-12} y1={-52} x2={12} y2={-52} stroke="#4DA3FF" strokeWidth={2.5} strokeLinecap="round" />
          <line x1={-55} y1={-10} x2={-75} y2={10} stroke="#4DA3FF" strokeWidth={3} strokeLinecap="round" />
          <line x1={55} y1={-10} x2={75} y2={10} stroke="#4DA3FF" strokeWidth={3} strokeLinecap="round" />
          <text x={0} y={90} textAnchor="middle" fontSize={22} fontWeight={600} fill="#4DA3FF" fontFamily="'Inter', sans-serif" opacity={0.7}>AI</text>
        </g>

        <g opacity={arrowProg}>
          <line x1={415} y1={260} x2={415 + 280 * arrowProg} y2={260} stroke="rgba(255,255,255,0.35)" strokeWidth={3} strokeLinecap="round" strokeDasharray="8 6" />
          {arrowProg > 0.8 && <polygon points="700,252 715,260 700,268" fill="rgba(255,255,255,0.35)" />}
        </g>

        <g opacity={reportSpring} transform={`translate(925, 240) scale(${reportSpring})`}>
          <rect x={-100} y={-130} width={200} height={250} rx={14} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.3)" strokeWidth={2.5} />
          <line x1={-65} y1={-92} x2={65} y2={-92} stroke="rgba(255,255,255,0.25)" strokeWidth={3} strokeLinecap="round" />
          <line x1={-65} y1={-58} x2={45} y2={-58} stroke="rgba(255,255,255,0.2)" strokeWidth={3} strokeLinecap="round" />
          <line x1={-65} y1={-24} x2={55} y2={-24} stroke="rgba(255,255,255,0.2)" strokeWidth={3} strokeLinecap="round" />
          <line x1={-65} y1={10} x2={35} y2={10} stroke="rgba(255,255,255,0.15)" strokeWidth={3} strokeLinecap="round" />
          <rect x={-65} y={35} width={28} height={55} rx={3} fill="rgba(255,255,255,0.15)" />
          <rect x={-28} y={52} width={28} height={38} rx={3} fill="rgba(255,255,255,0.12)" />
          <rect x={9} y={42} width={28} height={48} rx={3} fill="rgba(255,255,255,0.15)" />
          <text x={0} y={155} textAnchor="middle" fontSize={22} fontWeight={600} fill="rgba(255,255,255,0.5)" fontFamily="'Inter', sans-serif">Report</text>
        </g>

        <g opacity={doubtSpring} transform={`translate(${925 + doubtWobble}, 240) scale(${doubtSpring})`}>
          <rect x={-110} y={-140} width={220} height={270} rx={14} fill="rgba(239,68,68,0.12)" />
          <text x={0} y={10} textAnchor="middle" dominantBaseline="central" fontSize={140} fontWeight={900} fill="#EF4444" fontFamily="'Inter', sans-serif" opacity={0.85}>?</text>
          <line x1={-80} y1={-100} x2={80} y2={100} stroke="#EF4444" strokeWidth={5} strokeLinecap="round" opacity={0.6} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};