import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const FASTER-HIGHER-QUALITY-DURATION-FRAMES = 150;

export const Scene162-FasterHigherQuality: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [130, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const speedSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 10, stiffness: 100 } });
  const rocketY = interpolate(frame, [20, 60], [80, -10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rocketShake = frame > 25 && frame < 65 ? Math.sin(frame * 1.2) * 2 : 0;
  const timerProgress = interpolate(frame, [25, 70], [1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const timerAngle = timerProgress * 360;
  const qualitySpring = spring({ frame: Math.max(0, frame - 50), fps, config: { damping: 10, stiffness: 80 } });
  const barRise = interpolate(frame, [55, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const starSpring1 = spring({ frame: Math.max(0, frame - 85), fps, config: { damping: 12, stiffness: 100 } });
  const starSpring2 = spring({ frame: Math.max(0, frame - 92), fps, config: { damping: 12, stiffness: 100 } });
  const starSpring3 = spring({ frame: Math.max(0, frame - 99), fps, config: { damping: 12, stiffness: 100 } });
  const connSpring = spring({ frame: Math.max(0, frame - 70), fps, config: { damping: 12, stiffness: 80 } });

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
      <div
        style={{
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 20}px)`,
          fontSize: 69,
          fontWeight: 700,
          color: "#FFFFFF",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        <span style={{ color: "#4DA3FF" }}>更快</span>做出來，<span style={{ color: "#F59E0B" }}>品質門檻</span>也跟著提高
      </div>
      <div
        style={{
          opacity: titleSpring * 0.4,
          fontSize: 33,
          color: "rgba(255,255,255,0.4)",
          fontFamily: "'Inter', sans-serif",
          fontStyle: "italic",
          marginBottom: 45,
        }}
      >
        Faster to build, but the quality bar rises too
      </div>

      <svg width={1650} height={630} viewBox="0 0 1100 420">
        {/* Speed side */}
        <g opacity={speedSpring} transform={`translate(335, 200) scale(${speedSpring})`}>
          <circle cx={0} cy={0} r={130} fill="rgba(77,163,255,0.06)" stroke="rgba(77,163,255,0.2)" strokeWidth={2} />
          <circle cx={0} cy={0} r={100} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
          <circle cx={0} cy={0} r={100} fill="none" stroke="#4DA3FF" strokeWidth={8} strokeLinecap="round"
            strokeDasharray={`${timerAngle * Math.PI * 100 / 180} 1000`} transform="rotate(-90)" opacity={0.8}
          />
          <g transform={`translate(${rocketShake}, ${rocketY})`}>
            <path d="M 0 -30 Q -12 -10 -12 18 L 12 18 Q 12 -10 0 -30 Z" fill="#4DA3FF" opacity={0.9} />
            <circle cx={0} cy={-5} r={6} fill="rgba(255,255,255,0.4)" />
            <path d="M -12 12 L -20 24 L -12 20 Z" fill="#4DA3FF" opacity={0.6} />
            <path d="M 12 12 L 20 24 L 12 20 Z" fill="#4DA3FF" opacity={0.6} />
            <path d="M -7 18 Q 0 38 7 18" fill="#F59E0B" opacity={0.6 + Math.sin(frame * 0.5) * 0.3} />
          </g>
          <text x={0} y={160} textAnchor="middle" fontSize={26} fontWeight={700} fill="#4DA3FF">更快</text>
          <text x={0} y={182} textAnchor="middle" fontSize={14} fill="rgba(77,163,255,0.5)" fontFamily="'Inter', sans-serif">Faster</text>
        </g>

        {/* Connector */}
        <g opacity={connSpring}>
          <line x1={495} y1={200} x2={605} y2={200} stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeDasharray="6 6" />
          <text x={550} y={230} textAnchor="middle" fontSize={28} fontWeight={800} fill="rgba(255,255,255,0.3)" fontFamily="'Inter', sans-serif">→</text>
        </g>

        {/* Quality side */}
        <g opacity={qualitySpring} transform={`translate(765, 200) scale(${qualitySpring})`}>
          <circle cx={0} cy={0} r={130} fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.2)" strokeWidth={2} />
          <rect x={-60} y={100 - barRise * 200} width={120} height={barRise * 200} rx={10} fill="url(#qualityGrad)" opacity={0.8} />
          <defs>
            <linearGradient id="qualityGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          <rect x={-60} y={-100} width={120} height={200} rx={10} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
          {[
            { x: -40, y: -120, sp: starSpring1 },
            { x: 0, y: -140, sp: starSpring2 },
            { x: 40, y: -120, sp: starSpring3 },
          ].map((s, i) => (
            <g key={i} opacity={s.sp} transform={`translate(${s.x}, ${s.y}) scale(${s.sp})`}>
              <polygon points="0,-12 3,-4 12,-4 5,2 7,11 0,6 -7,11 -5,2 -12,-4 -3,-4" fill="#F59E0B" />
            </g>
          ))}
          <text x={0} y={160} textAnchor="middle" fontSize={26} fontWeight={700} fill="#F59E0B">品質門檻↑</text>
          <text x={0} y={182} textAnchor="middle" fontSize={14} fill="rgba(245,158,11,0.5)" fontFamily="'Inter', sans-serif">Quality Bar Rises</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};