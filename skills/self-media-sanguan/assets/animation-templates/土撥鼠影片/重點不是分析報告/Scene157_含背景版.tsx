import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const fonts = { main: "'Noto Sans TC', 'Inter', sans-serif" };

export const Scene157-NotAboutAnalysis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const lineSpring = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 14, stiffness: 80 } });
  const reportSpring = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 10, stiffness: 100 } });
  const xSpring = spring({ frame: Math.max(0, frame - 50), fps, config: { damping: 8, stiffness: 120 } });
  const foundSpring = spring({ frame: Math.max(0, frame - 35), fps, config: { damping: 10, stiffness: 100 } });
  const crumbleProgress = interpolate(frame, [70, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const neqSpring = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 10, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)", display: "flex", flexDirection: "column", alignItems: "center", opacity: masterOpacity, fontFamily: fonts.main }}>
      <div style={{ marginTop: 135, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 72, fontWeight: 700, color: "#FFFFFF", textAlign: "center", lineHeight: 1.4 }}>
          重點<span style={{ color: "#EF4444" }}>不是</span>分析點子是否有價值
        </div>
        <div style={{ opacity: titleSpring * 0.45, fontSize: 36, color: "rgba(255,255,255,0.4)", marginTop: 15, fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>
          The point is NOT analyzing whether an idea has value
        </div>
        <div style={{ width: 600 * lineSpring, height: 3, background: "linear-gradient(90deg, #EF4444, #F59E0B)", borderRadius: 2, marginTop: 27, opacity: 0.4 }} />
      </div>

      <svg width={1500} height={720} viewBox="0 0 1000 480" style={{ marginTop: 30 }}>
        <g opacity={reportSpring} transform={`translate(300, 200) scale(${reportSpring})`}>
          <rect x={-70} y={-100} width={140} height={180} rx={12} fill="rgba(239,68,68,0.08)" stroke="#EF4444" strokeWidth={2.5} opacity={0.6} />
          <line x1={-40} y1={-65} x2={40} y2={-65} stroke="#F87171" strokeWidth={3} strokeLinecap="round" opacity={0.3} />
          <line x1={-40} y1={-35} x2={30} y2={-35} stroke="#F87171" strokeWidth={3} strokeLinecap="round" opacity={0.25} />
          <line x1={-40} y1={-5} x2={35} y2={-5} stroke="#F87171" strokeWidth={3} strokeLinecap="round" opacity={0.25} />
          <line x1={-40} y1={25} x2={20} y2={25} stroke="#F87171" strokeWidth={3} strokeLinecap="round" opacity={0.2} />
          <rect x={-40} y={45} width={20} height={25} rx={3} fill="#F87171" opacity={0.25} />
          <rect x={-12} y={52} width={20} height={18} rx={3} fill="#F87171" opacity={0.2} />
          <rect x={16} y={40} width={20} height={30} rx={3} fill="#F87171" opacity={0.25} />
          <g opacity={xSpring}>
            <line x1={-55} y1={-75} x2={55} y2={65} stroke="#EF4444" strokeWidth={8} strokeLinecap="round" />
            <line x1={55} y1={-75} x2={-55} y2={65} stroke="#EF4444" strokeWidth={8} strokeLinecap="round" />
          </g>
          <text x={0} y={115} textAnchor="middle" fontSize={22} fontWeight={600} fill="rgba(255,255,255,0.4)" fontFamily="'Noto Sans TC', sans-serif">分析報告</text>
        </g>

        <g opacity={neqSpring} transform={`translate(500, 200) scale(${neqSpring})`}>
          <text x={0} y={10} textAnchor="middle" dominantBaseline="central" fontSize={80} fontWeight={900} fill="#F59E0B" fontFamily="'Inter', sans-serif">≠</text>
        </g>

        <g opacity={foundSpring} transform={`translate(700, 200) scale(${foundSpring})`}>
          <rect x={-60} y={-80} width={120} height={80} rx={10} fill="rgba(245,158,11,0.1)" stroke="#F59E0B" strokeWidth={2.5} />
          <text x={0} y={-45} textAnchor="middle" fontSize={20} fontWeight={700} fill="#F59E0B" fontFamily="'Noto Sans TC', sans-serif">價值</text>
          <text x={0} y={-22} textAnchor="middle" fontSize={14} fill="rgba(255,255,255,0.3)" fontFamily="'Inter', sans-serif">Value?</text>
          {[
            { x: -45, y: 15, w: 30, h: 18, rot: crumbleProgress * -15, dy: crumbleProgress * 40 },
            { x: -8, y: 10, w: 35, h: 18, rot: crumbleProgress * 8, dy: crumbleProgress * 55 },
            { x: 30, y: 15, w: 28, h: 18, rot: crumbleProgress * 20, dy: crumbleProgress * 35 },
            { x: -30, y: 35, w: 32, h: 16, rot: crumbleProgress * -12, dy: crumbleProgress * 60 },
            { x: 15, y: 35, w: 34, h: 16, rot: crumbleProgress * 18, dy: crumbleProgress * 50 },
          ].map((b, i) => (
            <rect key={i} x={b.x - b.w / 2} y={b.y + b.dy} width={b.w} height={b.h} rx={3} fill="rgba(107,114,128,0.2)" stroke="#6B7280" strokeWidth={1.5} opacity={1 - crumbleProgress * 0.6} transform={`rotate(${b.rot}, ${b.x}, ${b.y + b.dy + b.h / 2})`} />
          ))}
          <text x={0} y={135} textAnchor="middle" fontSize={22} fontWeight={600} fill="rgba(255,255,255,0.4)" fontFamily="'Noto Sans TC', sans-serif">毫無根據</text>
        </g>

        <text x={500} y={400} textAnchor="middle" fontSize={28} fontWeight={700} fill="#EF4444" fontFamily="'Noto Sans TC', sans-serif" opacity={xSpring * 0.8}>因為毫無根據和說服力</text>
        <text x={500} y={435} textAnchor="middle" fontSize={18} fill="rgba(255,255,255,0.3)" fontFamily="'Inter', sans-serif" fontStyle="italic" opacity={xSpring * 0.5}>Because there is no evidence or persuasion</text>
      </svg>
    </AbsoluteFill>
  );
};