import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const INSIDE-THE-PROBLEM-DURATION-FRAMES = 210;

export const Scene217-InsideTheProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const circleLeft = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 80 } });
  const personLeft = spring({ frame: Math.max(0, frame - 35), fps, config: { damping: 12, stiffness: 80 } });
  const arrow1 = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrow2 = interpolate(frame, [65, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrow3 = interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const xMark = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 10, stiffness: 90 } });
  const vsProg = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 12, stiffness: 80 } });
  const circleRight = spring({ frame: Math.max(0, frame - 105), fps, config: { damping: 12, stiffness: 80 } });
  const personRight = spring({ frame: Math.max(0, frame - 115), fps, config: { damping: 12, stiffness: 80 } });
  const hitArrow = spring({ frame: Math.max(0, frame - 135), fps, config: { damping: 8, stiffness: 100 } });
  const impactRings = [0, 1, 2].map((i) =>
    spring({ frame: Math.max(0, frame - 145 - i * 8), fps, config: { damping: 10, stiffness: 60 } })
  );
  const checkSpring = spring({ frame: Math.max(0, frame - 155), fps, config: { damping: 10, stiffness: 80 } });
  const pulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.9, 1.1]);

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 63, fontWeight: 800, color: "#FFFFFF", textAlign: "center", marginBottom: 9, lineHeight: 1.4 }}>
        要在<span style={{ color: "#10B981" }}>問題的圈子</span>裡
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 30, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 45 }}>
        Be inside the problem circle — otherwise you can't hit the pain point
      </div>

      <svg width={1575} height={645} viewBox="0 0 1050 430">
        {/* Left: Outside the circle */}
        <g transform="translate(250, 215)">
          <text x={0} y={-190} textAnchor="middle" fontSize={18} fontWeight={700} fill="#EF4444" opacity={circleLeft}>不在圈子裡</text>
          <text x={0} y={-170} textAnchor="middle" fontSize={12} fill="rgba(239,68,68,0.4)" fontFamily="'Inter', sans-serif" opacity={circleLeft}>Outside the circle</text>
          <circle cx={0} cy={0} r={100} fill="rgba(239,68,68,0.03)" stroke="#EF4444" strokeWidth={2.5} strokeDasharray="10 6" opacity={circleLeft * 0.6} />
          <text x={0} y={-5} textAnchor="middle" fontSize={14} fontWeight={600} fill="#EF4444" opacity={circleLeft * 0.35}>問題圈子</text>
          <circle cx={0} cy={20} r={18} fill="none" stroke="#EF4444" strokeWidth={2} opacity={circleLeft * 0.4} />
          <circle cx={0} cy={20} r={8} fill="#EF4444" opacity={circleLeft * 0.3} />
          <g transform="translate(-130, -60)" opacity={personLeft}>
            <circle cx={0} cy={-12} r={12} fill="rgba(239,68,68,0.15)" stroke="#EF4444" strokeWidth={2} />
            <path d="M -10 12 Q -10 0 0 0 Q 10 0 10 12" fill="rgba(239,68,68,0.15)" stroke="#EF4444" strokeWidth={2} />
            <text x={18} y={-8} fontSize={18} fontWeight={800} fill="#EF4444" fontFamily="'Inter', sans-serif">?</text>
          </g>
          {arrow1 > 0 && (
            <g opacity={arrow1 * 0.8}>
              <line x1={-100} y1={-30} x2={-100 + 70 * arrow1} y2={-30 + 30 * arrow1} stroke="#EF4444" strokeWidth={2.5} strokeLinecap="round" />
              {arrow1 > 0.9 && <text x={-25} y={5} fontSize={16} fill="#EF4444" opacity={0.6}>✕</text>}
            </g>
          )}
          {arrow2 > 0 && (
            <g opacity={arrow2 * 0.8}>
              <line x1={-110} y1={-10} x2={-110 + 80 * arrow2} y2={-10 + 60 * arrow2} stroke="#EF4444" strokeWidth={2.5} strokeLinecap="round" />
              {arrow2 > 0.9 && <text x={-22} y={58} fontSize={16} fill="#EF4444" opacity={0.6}>✕</text>}
            </g>
          )}
          {arrow3 > 0 && (
            <g opacity={arrow3 * 0.8}>
              <line x1={-105} y1={-50} x2={-105 + 60 * arrow3} y2={-50 + 110 * arrow3} stroke="#EF4444" strokeWidth={2.5} strokeLinecap="round" />
              {arrow3 > 0.9 && <text x={-40} y={68} fontSize={16} fill="#EF4444" opacity={0.6}>✕</text>}
            </g>
          )}
          {xMark > 0 && (
            <g opacity={xMark * 0.5}>
              <line x1={-80} y1={-80} x2={-80 + 160 * xMark} y2={-80 + 160 * xMark} stroke="#EF4444" strokeWidth={5} strokeLinecap="round" />
              <line x1={80} y1={-80} x2={80 - 160 * xMark} y2={-80 + 160 * xMark} stroke="#EF4444" strokeWidth={5} strokeLinecap="round" />
            </g>
          )}
          <text x={0} y={145} textAnchor="middle" fontSize={16} fontWeight={700} fill="#EF4444" opacity={circleLeft}>很難精準打擊痛點</text>
          <text x={0} y={165} textAnchor="middle" fontSize={12} fill="rgba(239,68,68,0.4)" fontFamily="'Inter', sans-serif" opacity={circleLeft}>Hard to hit the pain point</text>
        </g>

        {/* VS */}
        <g transform="translate(525, 215)" opacity={vsProg}>
          <rect x={-25} y={-25} width={50} height={50} rx={25} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
          <text x={0} y={8} textAnchor="middle" fontSize={20} fontWeight={900} fill="rgba(255,255,255,0.4)" fontFamily="'Inter', sans-serif">VS</text>
        </g>

        {/* Right: Inside the circle */}
        <g transform="translate(800, 215)">
          <text x={0} y={-190} textAnchor="middle" fontSize={18} fontWeight={700} fill="#10B981" opacity={circleRight}>在圈子裡</text>
          <text x={0} y={-170} textAnchor="middle" fontSize={12} fill="rgba(16,185,129,0.4)" fontFamily="'Inter', sans-serif" opacity={circleRight}>Inside the circle</text>
          <circle cx={0} cy={0} r={100} fill="rgba(16,185,129,0.04)" stroke="#10B981" strokeWidth={3} opacity={circleRight * 0.7} />
          <text x={0} y={-75} textAnchor="middle" fontSize={14} fontWeight={600} fill="#10B981" opacity={circleRight * 0.5}>問題圈子</text>
          <g transform="translate(-30, -25)" opacity={personRight}>
            <circle cx={0} cy={-12} r={12} fill="rgba(16,185,129,0.2)" stroke="#10B981" strokeWidth={2.5} />
            <path d="M -10 12 Q -10 0 0 0 Q 10 0 10 12" fill="rgba(16,185,129,0.2)" stroke="#10B981" strokeWidth={2.5} />
          </g>
          <g transform="translate(30, 25)">
            <circle cx={0} cy={0} r={28} fill="none" stroke="#10B981" strokeWidth={2} opacity={circleRight * 0.4} />
            <circle cx={0} cy={0} r={18} fill="none" stroke="#10B981" strokeWidth={2} opacity={circleRight * 0.5} />
            <circle cx={0} cy={0} r={8} fill="#10B981" opacity={circleRight * 0.6} />
            {hitArrow > 0 && (
              <g>
                <line x1={-45 + 45 * hitArrow} y1={-30 + 30 * hitArrow} x2={0} y2={0} stroke="#FFD700" strokeWidth={3} strokeLinecap="round" opacity={hitArrow} />
                <polygon points="-3,-5 5,0 -3,5" fill="#FFD700" opacity={hitArrow} transform="rotate(-35)" />
              </g>
            )}
            {impactRings.map((sp, i) => (
              <circle key={i} cx={0} cy={0} r={(15 + i * 18) * sp * pulse} fill="none" stroke="#FFD700" strokeWidth={2} opacity={sp * (0.4 - i * 0.1)} />
            ))}
          </g>
          <g transform="translate(85, -50)" opacity={checkSpring}>
            <circle cx={0} cy={0} r={18} fill="rgba(16,185,129,0.15)" stroke="#10B981" strokeWidth={2.5} />
            <polyline points="-7,0 -2,6 8,-5" fill="none" stroke="#10B981" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x={0} y={145} textAnchor="middle" fontSize={16} fontWeight={700} fill="#10B981" opacity={circleRight}>精準打擊痛點</text>
          <text x={0} y={165} textAnchor="middle" fontSize={12} fill="rgba(16,185,129,0.4)" fontFamily="'Inter', sans-serif" opacity={circleRight}>Hit the pain point precisely</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};