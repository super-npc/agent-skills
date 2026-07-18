import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  interpolate,
  spring,
} from "remotion";

const colors = {
  background: "#0A0E14",
  backgroundGradient: "linear-gradient(135deg, #0A0E14 0%, #131A24 100%)",
  text: "#FFFFFF",
  accent: "#00D4AA",
  accentSecondary: "#4DA3FF",
  warning: "#FFB547",
  danger: "#FF6B6B",
  dimmed: "rgba(255, 255, 255, 0.6)",
  cardBg: "rgba(255, 255, 255, 0.05)",
  border: "rgba(0, 212, 170, 0.3)",
};

const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

const LightBulb: React.FC<{ progress: number; frame: number; size?: number }> = ({
  progress,
  frame,
  size = 150,
}) => {
  const glow = Math.sin(frame * 0.08) * 0.2 + 0.8;
  const drawP = interpolate(progress, [0, 1], [0, 1]);

  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <defs>
        <filter id="bulbGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M30 8C20 8 12 16 12 25C12 32 16 36 20 40L20 44H40L40 40C44 36 48 32 48 25C48 16 40 8 30 8Z"
        stroke={colors.warning}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill={`${colors.warning}15`}
        opacity={drawP}
        filter="url(#bulbGlow)"
      />
      <rect x="22" y="44" width="16" height="4" rx="1" fill={colors.warning} opacity={drawP * 0.6} />
      <rect x="24" y="48" width="12" height="3" rx="1" fill={colors.warning} opacity={drawP * 0.5} />
      <circle cx="30" cy="26" r="8" fill={colors.warning} opacity={drawP * glow * 0.3} filter="url(#bulbGlow)" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const innerR = 28;
        const outerR = 28 + drawP * 6;
        return (
          <line
            key={angle}
            x1={30 + Math.cos(rad) * innerR}
            y1={26 + Math.sin(rad) * innerR}
            x2={30 + Math.cos(rad) * outerR}
            y2={26 + Math.sin(rad) * outerR}
            stroke={colors.warning}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={drawP * glow * 0.5}
          />
        );
      })}
    </svg>
  );
};

const FlowDiagram: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const userSpring = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 12, stiffness: 110 } });
  const arrow1 = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const aiSpring = spring({ frame: Math.max(0, frame - 65), fps, config: { damping: 12, stiffness: 110 } });
  const arrow2 = interpolate(frame, [85, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const resultSpring = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 12, stiffness: 110 } });

  const boxW = 260;
  const boxH = 90;
  const gap = 100;
  const totalW = boxW * 3 + gap * 2;
  const startX = -totalW / 2;

  return (
    <svg width={1650} height={300} viewBox="-550 -100 1100 200">
      <g
        transform={`translate(${startX + boxW / 2}, 0) scale(${interpolate(userSpring, [0, 1], [0.5, 1])})`}
        opacity={interpolate(userSpring, [0, 0.3], [0, 1])}
      >
        <rect x={-boxW / 2} y={-boxH / 2} width={boxW} height={boxH} rx="16" fill={colors.cardBg} stroke={`${colors.dimmed}30`} strokeWidth="1.5" />
        <text x="0" y="-8" textAnchor="middle" fontSize="22" fontWeight="700" fontFamily={fonts.main} fill="#FFFFFF">你的描述</text>
        <text x="0" y="22" textAnchor="middle" fontSize="16" fontWeight="500" fontFamily={fonts.main} fill="#FFFFFFcc">「我想做一個...」</text>
      </g>
      <line x1={startX + boxW + 10} y1="0" x2={startX + boxW + 10 + (gap - 20) * arrow1} y2="0" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" opacity={arrow1 * 0.7} />
      {arrow1 > 0.8 && (
        <polygon points={`${startX + boxW + gap - 8},-6 ${startX + boxW + gap - 8},6 ${startX + boxW + gap},0`} fill={colors.accent} opacity={0.7} />
      )}
      <g
        transform={`translate(${startX + boxW + gap + boxW / 2}, 0) scale(${interpolate(aiSpring, [0, 1], [0.5, 1])})`}
        opacity={interpolate(aiSpring, [0, 0.3], [0, 1])}
      >
        <rect x={-boxW / 2} y={-boxH / 2} width={boxW} height={boxH} rx="16" fill={`${colors.accent}15`} stroke={`${colors.accent}40`} strokeWidth="2" />
        <text x="0" y="-8" textAnchor="middle" fontSize="22" fontWeight="700" fontFamily={fonts.main} fill={colors.accent}>問 AI</text>
        <text x="0" y="22" textAnchor="middle" fontSize="16" fontWeight="500" fontFamily={fonts.main} fill={colors.dimmed}>「這叫什麼遊戲？」</text>
      </g>
      <line x1={startX + boxW * 2 + gap + 10} y1="0" x2={startX + boxW * 2 + gap + 10 + (gap - 20) * arrow2} y2="0" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" opacity={arrow2 * 0.7} />
      {arrow2 > 0.8 && (
        <polygon points={`${startX + boxW * 2 + gap * 2 - 8},-6 ${startX + boxW * 2 + gap * 2 - 8},6 ${startX + boxW * 2 + gap * 2},0`} fill={colors.accent} opacity={0.7} />
      )}
      <g
        transform={`translate(${startX + boxW * 2 + gap * 2 + boxW / 2}, 0) scale(${interpolate(resultSpring, [0, 1], [0.5, 1])})`}
        opacity={interpolate(resultSpring, [0, 0.3], [0, 1])}
      >
        <rect x={-boxW / 2} y={-boxH / 2} width={boxW} height={boxH} rx="16" fill={`${colors.accent}15`} stroke={`${colors.accent}60`} strokeWidth="2" />
        <text x="0" y="-8" textAnchor="middle" fontSize="22" fontWeight="700" fontFamily={fonts.main} fill={colors.accent}>精確名稱</text>
        <text x="0" y="22" textAnchor="middle" fontSize="16" fontWeight="500" fontFamily={fonts.main} fill={colors.dimmed}>節省溝通成本</text>
      </g>
    </svg>
  );
};

export const Scene15-AskAiTip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 12, mass: 0.6, stiffness: 130 } });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.4, 1]);
  const badgeOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bulbDraw = interpolate(frame, [5, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [210, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]);

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${colors.warning}08 0%, transparent 70%)`, transform: "translate(-50%, -50%)", opacity: glowPulse * fadeOut }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 75, opacity: fadeOut }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36, opacity: badgeOpacity, transform: `scale(${badgeScale})` }}>
          <LightBulb progress={bulbDraw} frame={frame} size={135} />
          <div style={{ fontSize: 78, fontWeight: 800, fontFamily: fonts.main, color: colors.warning, letterSpacing: 6, textShadow: `0 0 20px ${colors.warning}30` }}>
            小撇步
          </div>
        </div>
        <FlowDiagram frame={frame} fps={fps} />
        <div style={{
          fontSize: 51, fontWeight: 600, fontFamily: fonts.main, color: colors.dimmed, letterSpacing: 2, textAlign: "center",
          opacity: interpolate(frame, [130, 155], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(spring({ frame: Math.max(0, frame - 130), fps, config: { damping: 14, stiffness: 100 } }), [0, 1], [20, 0])}px)`,
        }}>
          先問名稱，再給指令 →{" "}
          <span style={{ color: colors.accent, fontWeight: 700 }}>省時省力</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};