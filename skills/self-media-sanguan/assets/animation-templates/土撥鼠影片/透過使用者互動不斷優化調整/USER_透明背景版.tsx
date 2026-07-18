import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const USER-ITERATE-DURATION-FRAMES = 180;

export const Scene171-UserIterate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const userSpring = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 12, stiffness: 90 } });
  const prodSpring = spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 12, stiffness: 90 } });
  const arrowTopSpring = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 10, stiffness: 80 } });
  const arrowBotSpring = spring({ frame: Math.max(0, frame - 75), fps, config: { damping: 10, stiffness: 80 } });
  const iterSpring = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 12, stiffness: 80 } });
  const pulse = frame > 90 ? 0.6 + Math.sin(frame * 0.07) * 0.2 : 0.6;

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 66, fontWeight: 700, color: "#FFFFFF", textAlign: "center", marginBottom: 12 }}>
        透過<span style={{ color: "#4DA3FF" }}>使用者互動</span>，不斷<span style={{ color: "#10B981" }}>優化調整</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 30, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 60 }}>
        Iterate through user interaction to keep optimizing
      </div>

      <svg width={1500} height={450} viewBox="0 0 1000 300">
        {/* User node */}
        <g opacity={userSpring} transform={`translate(200, 150) scale(${userSpring})`}>
          <circle cx={0} cy={0} r={80} fill="rgba(77,163,255,0.08)" stroke="#4DA3FF" strokeWidth={3} />
          <text x={0} y={-15} textAnchor="middle" fontSize={40} fill="#4DA3FF">👤</text>
          <text x={0} y={25} textAnchor="middle" fontSize={26} fontWeight={700} fill="#4DA3FF">使用者</text>
          <text x={0} y={52} textAnchor="middle" fontSize={16} fill="rgba(77,163,255,0.5)" fontFamily="'Inter', sans-serif">User</text>
        </g>

        {/* Product node */}
        <g opacity={prodSpring} transform={`translate(800, 150) scale(${prodSpring})`}>
          <circle cx={0} cy={0} r={80} fill="rgba(16,185,129,0.08)" stroke="#10B981" strokeWidth={3} />
          <text x={0} y={-15} textAnchor="middle" fontSize={40} fill="#10B981">📦</text>
          <text x={0} y={25} textAnchor="middle" fontSize={26} fontWeight={700} fill="#10B981">產品</text>
          <text x={0} y={52} textAnchor="middle" fontSize={16} fill="rgba(16,185,129,0.5)" fontFamily="'Inter', sans-serif">Product</text>
        </g>

        {/* Top arrow: User → Product */}
        <g opacity={arrowTopSpring * pulse}>
          <path d="M 285 120 Q 500 60 715 120" fill="none" stroke="#4DA3FF" strokeWidth={3} strokeLinecap="round"
            strokeDasharray={`${arrowTopSpring * 500} 500`}
          />
          {arrowTopSpring > 0.8 && <polygon points="715,112 720,120 710,128" fill="#4DA3FF" />}
          <text x={500} y={75} textAnchor="middle" fontSize={22} fill="rgba(77,163,255,0.7)">回饋與需求</text>
        </g>

        {/* Bottom arrow: Product → User */}
        <g opacity={arrowBotSpring * pulse}>
          <path d="M 715 185 Q 500 245 285 185" fill="none" stroke="#10B981" strokeWidth={3} strokeLinecap="round"
            strokeDasharray={`${arrowBotSpring * 500} 500`}
          />
          {arrowBotSpring > 0.8 && <polygon points="285,177 280,185 290,193" fill="#10B981" />}
          <text x={500} y={240} textAnchor="middle" fontSize={22} fill="rgba(16,185,129,0.7)">改進版本</text>
        </g>

        {/* Iterate label */}
        <g opacity={iterSpring} transform={`translate(500, 150)`}>
          <rect x={-90} y={-24} width={180} height={48} rx={12} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
          <text x={0} y={8} textAnchor="middle" fontSize={24} fontWeight={700} fill="rgba(255,255,255,0.8)">不斷優化</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};