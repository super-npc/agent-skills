import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const fonts = { main: "'Noto Sans TC', 'Inter', sans-serif" };

const seeded = (seed: number) => { const x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };

export const Scene152-AiWrappersDead: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const lineSpring = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 14, stiffness: 80 } });
  const myProductSpring = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 12, stiffness: 100 } });

  const cloneCount = 11;
  const clonePositions = Array.from({ length: cloneCount }, (_, i) => {
    const angle = (i / cloneCount) * Math.PI * 2;
    const radius = 160 + seeded(i + 10) * 60;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius * 0.6, delay: 55 + i * 3 };
  });

  const collapseProgress = interpolate(frame, [140, 170], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const collapseSpring = spring({ frame: Math.max(0, frame - 140), fps, config: { damping: 10, stiffness: 80 } });
  const subtitleSpring = spring({ frame: Math.max(0, frame - 155), fps, config: { damping: 12, stiffness: 90 } });
  const everyoneSpring = spring({ frame: Math.max(0, frame - 80), fps, config: { damping: 12, stiffness: 90 } });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: masterOpacity, fontFamily: fonts.main }}>
      <div style={{ marginTop: 120, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 72, fontWeight: 700, color: "#FFFFFF", textAlign: "center", lineHeight: 1.4 }}>
          <span style={{ color: "#EF4444" }}>替代品很多</span>，AI 套殼產品為什麼<span style={{ color: "#EF4444" }}>死光</span>？
        </div>
        <div style={{ opacity: titleSpring * 0.45, fontSize: 36, color: "rgba(255,255,255,0.4)", marginTop: 15, fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>
          Everyone has AI — why do most AI wrapper products die?
        </div>
        <div style={{ width: 700 * lineSpring, height: 3, background: "linear-gradient(90deg, #EF4444, #F59E0B)", borderRadius: 2, marginTop: 27, opacity: 0.4 }} />
      </div>

      <svg width={1500} height={870} viewBox="0 0 1000 580" style={{ marginTop: 15 }}>
        <g opacity={myProductSpring} transform={`translate(500, 230) scale(${myProductSpring})`}>
          <rect x={-50} y={-50} width={100} height={100} rx={14} fill="rgba(77,163,255,0.15)" stroke="#4DA3FF" strokeWidth={3} />
          <rect x={-20} y={-25} width={40} height={40} rx={6} fill="rgba(77,163,255,0.3)" stroke="#4DA3FF" strokeWidth={2} />
          <circle cx={-10} cy={-5} r={3} fill="#4DA3FF" />
          <circle cx={10} cy={-5} r={3} fill="#4DA3FF" />
          <line x1={-10} y1={5} x2={10} y2={5} stroke="#4DA3FF" strokeWidth={2} strokeLinecap="round" />
          <text x={0} y={38} textAnchor="middle" fontSize={16} fontWeight={600} fill="#4DA3FF" fontFamily="'Inter', sans-serif">My Product</text>
        </g>

        {clonePositions.map((pos, i) => {
          const cloneSpring = spring({ frame: Math.max(0, frame - pos.delay), fps, config: { damping: 10, stiffness: 100 } });
          const cx = 500 + pos.x, cy = 230 + pos.y;
          const grey = interpolate(collapseProgress, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const boxColor = grey > 0.5 ? "#6B7280" : "#F59E0B";
          const boxFill = grey > 0.5 ? "rgba(107,114,128,0.12)" : "rgba(245,158,11,0.12)";
          return (
            <g key={i} opacity={cloneSpring} transform={`translate(${cx}, ${cy}) scale(${cloneSpring * (1 - collapseProgress * 0.3)})`}>
              <rect x={-35} y={-35} width={70} height={70} rx={10} fill={boxFill} stroke={boxColor} strokeWidth={2} />
              <rect x={-14} y={-18} width={28} height={28} rx={4} fill={`rgba(${grey > 0.5 ? "107,114,128" : "245,158,11"},0.25)`} stroke={boxColor} strokeWidth={1.5} />
              <circle cx={-5} cy={-4} r={2} fill={boxColor} />
              <circle cx={5} cy={-4} r={2} fill={boxColor} />
              {collapseProgress > 0.3 && (
                <g opacity={collapseProgress}>
                  <line x1={-18} y1={-18} x2={18} y2={18} stroke="#EF4444" strokeWidth={4} strokeLinecap="round" />
                  <line x1={18} y1={-18} x2={-18} y2={18} stroke="#EF4444" strokeWidth={4} strokeLinecap="round" />
                </g>
              )}
            </g>
          );
        })}

        <g opacity={everyoneSpring} transform={`translate(500, 440)`}>
          <text x={0} y={0} textAnchor="middle" fontSize={26} fontWeight={600} fill="#F59E0B" fontFamily="'Noto Sans TC', sans-serif" opacity={1 - collapseProgress * 0.7}>我有 AI，大家也都有 AI</text>
          <text x={0} y={32} textAnchor="middle" fontSize={18} fill="rgba(255,255,255,0.3)" fontFamily="'Inter', sans-serif" fontStyle="italic" opacity={1 - collapseProgress * 0.7}>I have AI, everyone else has AI too</text>
        </g>

        {collapseProgress > 0.3 && (
          <g opacity={collapseSpring} transform={`translate(500, 230)`}>
            <line x1={-30} y1={-30} x2={30} y2={30} stroke="#EF4444" strokeWidth={5} strokeLinecap="round" />
            <line x1={30} y1={-30} x2={-30} y2={30} stroke="#EF4444" strokeWidth={5} strokeLinecap="round" />
          </g>
        )}

        <g opacity={subtitleSpring} transform={`translate(500, ${440 + 20 * collapseProgress})`}>
          {collapseProgress > 0.5 && (
            <>
              <text x={0} y={60} textAnchor="middle" fontSize={30} fontWeight={700} fill="#EF4444" fontFamily="'Noto Sans TC', sans-serif" opacity={subtitleSpring}>沒有理由使用我的服務</text>
              <text x={0} y={95} textAnchor="middle" fontSize={20} fill="rgba(255,255,255,0.35)" fontFamily="'Inter', sans-serif" fontStyle="italic" opacity={subtitleSpring}>No reason to use your service</text>
            </>
          )}
        </g>

        {collapseProgress > 0.6 && (
          <>
            {[{ x: 200, y: 250 }, { x: 350, y: 200 }, { x: 650, y: 200 }, { x: 800, y: 250 }, { x: 280, y: 300 }, { x: 720, y: 300 }].map((pos, i) => {
              const tSpring = spring({ frame: Math.max(0, frame - 160 - i * 4), fps, config: { damping: 10, stiffness: 100 } });
              return (
                <g key={`tomb-${i}`} opacity={tSpring * 0.6} transform={`translate(${pos.x}, ${pos.y}) scale(${tSpring})`}>
                  <path d="M -12 10 L -12 -8 Q -12 -20 0 -20 Q 12 -20 12 -8 L 12 10 Z" fill="rgba(107,114,128,0.2)" stroke="#6B7280" strokeWidth={2} />
                  <text x={0} y={2} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6B7280" fontFamily="'Inter', sans-serif">RIP</text>
                </g>
              );
            })}
          </>
        )}
      </svg>
    </AbsoluteFill>
  );
};