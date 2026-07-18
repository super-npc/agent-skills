import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const FAR-TO-NEAR-DURATION-FRAMES = 120;

export const Scene174-FarToNear: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const ring1 = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 10, stiffness: 70 } });
  const ring2 = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 10, stiffness: 70 } });
  const ring3 = spring({ frame: Math.max(0, frame - 35), fps, config: { damping: 10, stiffness: 70 } });
  const ring4 = spring({ frame: Math.max(0, frame - 45), fps, config: { damping: 10, stiffness: 70 } });
  const center = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 12, stiffness: 90 } });
  const arrowProg = interpolate(frame, [20, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 84, fontWeight: 800, color: "#FFFFFF", textAlign: "center", marginBottom: 45 }}>
        從<span style={{ color: "#4DA3FF" }}>遠</span>到<span style={{ color: "#10B981" }}>近</span>可以分成
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 33, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 38, marginTop: -30 }}>
        Can be broken down from far to near
      </div>

      <svg width={1200} height={570} viewBox="0 0 800 380">
        <g transform="translate(400, 190)">
          <circle cx={0} cy={0} r={170 * ring1} fill="none" stroke="#4DA3FF" strokeWidth={2} opacity={ring1 * 0.2} strokeDasharray="8 6" />
          <circle cx={0} cy={0} r={130 * ring2} fill="none" stroke="#4DA3FF" strokeWidth={2.5} opacity={ring2 * 0.35} />
          <circle cx={0} cy={0} r={90 * ring3} fill="none" stroke="#10B981" strokeWidth={3} opacity={ring3 * 0.5} />
          <circle cx={0} cy={0} r={50 * ring4} fill="rgba(16,185,129,0.1)" stroke="#10B981" strokeWidth={3.5} opacity={ring4 * 0.7} />
          <circle cx={0} cy={0} r={12 * center} fill="#10B981" opacity={center * 0.9} />
          <text x={170} y={-5} textAnchor="middle" fontSize={16} fontWeight={600} fill="#4DA3FF" opacity={ring1 * 0.5}>遠</text>
          <text x={-55} y={5} textAnchor="middle" fontSize={16} fontWeight={600} fill="#10B981" opacity={ring4 * 0.8}>近</text>
          <g opacity={arrowProg}>
            <line x1={155} y1={50} x2={155 - 90 * arrowProg} y2={50} stroke="rgba(255,255,255,0.3)" strokeWidth={2} strokeLinecap="round" />
            {arrowProg > 0.8 && <polygon points="68,44 60,50 68,56" fill="rgba(255,255,255,0.3)" />}
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};