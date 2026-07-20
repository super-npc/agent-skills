import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const fonts = { main: "'Noto Sans TC', 'Inter', sans-serif" };

export const Scene158-ExecuteValidate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [130, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const lineSpring = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 14, stiffness: 80 } });
  const execSpring = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 10, stiffness: 100 } });
  const arrowProg = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const valSpring = spring({ frame: Math.max(0, frame - 65), fps, config: { damping: 10, stiffness: 100 } });
  const glowPulse = frame > 70 ? 0.6 + Math.sin(frame * 0.08) * 0.2 : 0.6;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)", display: "flex", flexDirection: "column", alignItems: "center", opacity: masterOpacity, fontFamily: fonts.main }}>
      <div style={{ marginTop: 150, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 75, fontWeight: 700, color: "#FFFFFF", textAlign: "center", lineHeight: 1.4 }}>
          重點在：<span style={{ color: "#10B981" }}>怎麼執行</span>與<span style={{ color: "#4DA3FF" }}>驗證</span>點子
        </div>
        <div style={{ opacity: titleSpring * 0.45, fontSize: 36, color: "rgba(255,255,255,0.4)", marginTop: 15, fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>
          Focus on how to execute and validate the idea
        </div>
        <div style={{ width: 600 * lineSpring, height: 3, background: "linear-gradient(90deg, #10B981, #4DA3FF)", borderRadius: 2, marginTop: 27, opacity: 0.5 }} />
      </div>

      <svg width={1350} height={570} viewBox="0 0 900 380" style={{ marginTop: 45 }}>
        <g opacity={execSpring} transform={`translate(250, 180) scale(${execSpring})`}>
          <rect x={-90} y={-80} width={180} height={160} rx={16} fill="rgba(16,185,129,0.1)" stroke="#10B981" strokeWidth={3} />
          <g transform="translate(0, -15)">
            <path d="M 0 -35 Q -15 -15 -15 15 L 15 15 Q 15 -15 0 -35 Z" fill="#10B981" opacity={0.8} />
            <circle cx={0} cy={-8} r={8} fill="rgba(255,255,255,0.3)" />
            <path d="M -15 10 L -25 25 L -15 20 Z" fill="#10B981" opacity={0.6} />
            <path d="M 15 10 L 25 25 L 15 20 Z" fill="#10B981" opacity={0.6} />
            <path d="M -8 15 Q 0 35 8 15" fill="#F59E0B" opacity={glowPulse} />
          </g>
          <text x={0} y={60} textAnchor="middle" fontSize={24} fontWeight={700} fill="#10B981" fontFamily="'Noto Sans TC', sans-serif">執行</text>
        </g>

        <g opacity={arrowProg}>
          <line x1={370} y1={180} x2={370 + 160 * arrowProg} y2={180} stroke="rgba(255,255,255,0.4)" strokeWidth={3} strokeLinecap="round" strokeDasharray="8 6" />
          {arrowProg > 0.8 && <polygon points="535,172 550,180 535,188" fill="rgba(255,255,255,0.4)" />}
        </g>

        <g opacity={valSpring} transform={`translate(650, 180) scale(${valSpring})`}>
          <rect x={-90} y={-80} width={180} height={160} rx={16} fill="rgba(77,163,255,0.1)" stroke="#4DA3FF" strokeWidth={3} />
          <g transform="translate(0, -15)">
            <circle cx={-5} cy={-5} r={22} fill="none" stroke="#4DA3FF" strokeWidth={3} />
            <line x1={10} y1={10} x2={28} y2={28} stroke="#4DA3FF" strokeWidth={4} strokeLinecap="round" />
            <path d="M -14 -4 L -6 4 L 8 -10" fill="none" stroke="#4DA3FF" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x={0} y={60} textAnchor="middle" fontSize={24} fontWeight={700} fill="#4DA3FF" fontFamily="'Noto Sans TC', sans-serif">驗證</text>
        </g>

        {valSpring > 0.8 && (
          <g opacity={valSpring - 0.8}>
            <path d="M 620 280 Q 450 340 280 280" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeDasharray="6 6" />
            <polygon points="285,274 272,282 288,288" fill="rgba(255,255,255,0.2)" />
            <text x={450} y={330} textAnchor="middle" fontSize={16} fill="rgba(255,255,255,0.25)" fontFamily="'Inter', sans-serif">iterate</text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};