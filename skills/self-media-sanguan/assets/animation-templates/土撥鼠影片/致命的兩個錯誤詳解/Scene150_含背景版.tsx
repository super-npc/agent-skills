import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const fonts = { main: "'Noto Sans TC', 'Inter', sans-serif" };

export const Scene150-TwoErrorsDetail: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [280, 300], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const e1NumSpring = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 10, stiffness: 110 } });
  const e1TitleSpring = spring({ frame: Math.max(0, frame - 18), fps, config: { damping: 12, stiffness: 90 } });
  const e1IconSpring = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 10, stiffness: 100 } });
  const e1QmarkSpring = spring({ frame: Math.max(0, frame - 50), fps, config: { damping: 8, stiffness: 120 } });
  const e1Fade = interpolate(frame, [145, 160], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const e2NumSpring = spring({ frame: Math.max(0, frame - 155), fps, config: { damping: 10, stiffness: 110 } });
  const e2TitleSpring = spring({ frame: Math.max(0, frame - 163), fps, config: { damping: 12, stiffness: 90 } });
  const e2IconSpring = spring({ frame: Math.max(0, frame - 175), fps, config: { damping: 10, stiffness: 100 } });
  const e2WaveFrame = Math.max(0, frame - 190);

  const qWobble = frame > 55 ? Math.sin(frame * 0.12) * 6 : 0;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)", opacity: masterOpacity }}>
      <AbsoluteFill style={{ opacity: e1Fade, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.main }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 2100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 36, marginBottom: 24 }}>
            <div style={{ opacity: e1NumSpring, transform: `scale(${e1NumSpring})`, width: 96, height: 96, borderRadius: "50%", background: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 51, fontWeight: 800, color: "#FFFFFF", flexShrink: 0 }}>1</div>
            <div style={{ opacity: e1TitleSpring, transform: `translateX(${(1 - e1TitleSpring) * 30}px)`, fontSize: 78, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3 }}>痛點有問題</div>
          </div>
          <div style={{ opacity: e1TitleSpring * 0.5, fontSize: 42, color: "rgba(255,255,255,0.45)", marginBottom: 75, fontFamily: "'Inter', sans-serif" }}>
            The pain point itself is questionable
          </div>
          <div style={{ position: "relative", opacity: e1IconSpring, transform: `scale(${e1IconSpring})` }}>
            <svg width={540} height={480} viewBox="0 0 360 320">
              <rect x={100} y={20} width={160} height={210} rx={12} fill="rgba(239,68,68,0.08)" stroke="#EF4444" strokeWidth={3} />
              <line x1={130} y1={70} x2={230} y2={70} stroke="#F87171" strokeWidth={3} strokeLinecap="round" opacity={0.4} />
              <line x1={130} y1={100} x2={210} y2={100} stroke="#F87171" strokeWidth={3} strokeLinecap="round" opacity={0.3} />
              <line x1={130} y1={130} x2={220} y2={130} stroke="#F87171" strokeWidth={3} strokeLinecap="round" opacity={0.3} />
              <line x1={130} y1={160} x2={190} y2={160} stroke="#F87171" strokeWidth={3} strokeLinecap="round" opacity={0.2} />
              <rect x={130} y={175} width={20} height={30} rx={3} fill="#F87171" opacity={0.3} />
              <rect x={158} y={185} width={20} height={20} rx={3} fill="#F87171" opacity={0.25} />
              <rect x={186} y={170} width={20} height={35} rx={3} fill="#F87171" opacity={0.3} />
              <g opacity={e1QmarkSpring} transform={`translate(${180 + qWobble}, 135) scale(${e1QmarkSpring})`}>
                <circle cx={0} cy={0} r={70} fill="rgba(239,68,68,0.15)" />
                <text x={0} y={12} textAnchor="middle" dominantBaseline="central" fontSize={100} fontWeight={900} fill="#EF4444" fontFamily="'Inter', sans-serif">?</text>
              </g>
              <text x={180} y={265} textAnchor="middle" fontSize={22} fill="rgba(255,255,255,0.4)" fontFamily="'Noto Sans TC', sans-serif">「分析點子產出報告」</text>
            </svg>
          </div>
        </div>
      </AbsoluteFill>

      {frame >= 150 && (
        <AbsoluteFill style={{ opacity: e2NumSpring, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.main }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 2100 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 36, marginBottom: 24 }}>
              <div style={{ opacity: e2NumSpring, transform: `scale(${e2NumSpring})`, width: 96, height: 96, borderRadius: "50%", background: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 51, fontWeight: 800, color: "#FFFFFF", flexShrink: 0 }}>2</div>
              <div style={{ opacity: e2TitleSpring, transform: `translateX(${(1 - e2TitleSpring) * 30}px)`, fontSize: 78, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3 }}>Distribution 不深</div>
            </div>
            <div style={{ opacity: e2TitleSpring * 0.5, fontSize: 42, color: "rgba(255,255,255,0.45)", marginBottom: 75, fontFamily: "'Inter', sans-serif" }}>
              Distribution is too shallow to reach enough people
            </div>
            <div style={{ opacity: e2IconSpring, transform: `scale(${e2IconSpring})` }}>
              <svg width={750} height={420} viewBox="0 0 500 280">
                <g transform="translate(100, 130)" opacity={0.7}>
                  <path d="M -12 -20 L 28 -36 L 28 36 L -12 20 Z" fill="#EF4444" opacity={0.6} />
                  <rect x={-22} y={-14} width={12} height={28} rx={3} fill="#F87171" opacity={0.5} />
                </g>
                {[0, 1, 2, 3].map((j) => {
                  const waveDelay = j * 8;
                  const waveOp = interpolate(e2WaveFrame - waveDelay, [0, 15, 30], [0, 0.5 - j * 0.12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const waveR = 50 + j * 40;
                  return (
                    <path key={j} d={`M ${140 + j * 40} ${130 - waveR * 0.5} Q ${140 + j * 40 + 15} 130 ${140 + j * 40} ${130 + waveR * 0.5}`} fill="none" stroke="#EF4444" strokeWidth={3 - j * 0.5} strokeLinecap="round" opacity={waveOp} strokeDasharray={j > 1 ? "6 8" : "none"} />
                  );
                })}
                {[
                  { x: 250, y: 80, reached: false },
                  { x: 310, y: 140, reached: false },
                  { x: 280, y: 200, reached: false },
                  { x: 360, y: 100, reached: false },
                  { x: 380, y: 180, reached: false },
                  { x: 430, y: 130, reached: false },
                  { x: 440, y: 210, reached: false },
                  { x: 220, y: 140, reached: true },
                ].map((p, i) => {
                  const pSpring = spring({ frame: Math.max(0, frame - 185 - i * 3), fps, config: { damping: 12, stiffness: 100 } });
                  const color = p.reached ? "#EF4444" : "#4B5563";
                  const op = p.reached ? 0.8 : 0.35;
                  return (
                    <g key={i} opacity={pSpring * op} transform={`translate(${p.x}, ${p.y})`}>
                      <circle cx={0} cy={-12} r={8} fill={color} />
                      <path d="M 0 -4 L 0 12" stroke={color} strokeWidth={3} strokeLinecap="round" />
                      <path d="M -8 4 L 0 -1 L 8 4" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                      {!p.reached && (
                        <g opacity={0.5}>
                          <line x1={-5} y1={18} x2={5} y2={28} stroke="#6B7280" strokeWidth={2} strokeLinecap="round" />
                          <line x1={5} y1={18} x2={-5} y2={28} stroke="#6B7280" strokeWidth={2} strokeLinecap="round" />
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};