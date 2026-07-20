import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
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

const CodeIcon: React.FC<{ progress: number; size?: number }> = ({ progress, size = 80 }) => {
  const pathLen = 200;
  const dashOffset = pathLen * (1 - progress);
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <polyline points="20,12 8,30 20,48" stroke={colors.accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={pathLen} strokeDashoffset={dashOffset} />
      <polyline points="40,12 52,30 40,48" stroke={colors.accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={pathLen} strokeDashoffset={dashOffset} />
      <line x1="34" y1="10" x2="26" y2="50" stroke={colors.accentSecondary} strokeWidth="3" strokeLinecap="round" strokeDasharray={pathLen} strokeDashoffset={dashOffset} />
    </svg>
  );
};

const NoGuiIcon: React.FC<{ progress: number; crossProgress: number; size?: number }> = ({ progress, crossProgress, size = 80 }) => {
  const pathLen = 400;
  const dashOffset = pathLen * (1 - progress);
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <rect x="6" y="8" width="48" height="38" rx="6" stroke={colors.dimmed} strokeWidth="2.5" strokeDasharray={pathLen} strokeDashoffset={dashOffset} fill="none" opacity={0.5} />
      <line x1="6" y1="18" x2="54" y2="18" stroke={colors.dimmed} strokeWidth="1.5" opacity={progress * 0.3} />
      <circle cx="14" cy="13" r="2" fill={colors.danger} opacity={progress * 0.6} />
      <circle cx="22" cy="13" r="2" fill={colors.warning} opacity={progress * 0.6} />
      <circle cx="30" cy="13" r="2" fill={colors.accent} opacity={progress * 0.6} />
      {crossProgress > 0 && (
        <>
          <line x1="12" y1="12" x2={12 + 36 * crossProgress} y2={12 + 36 * crossProgress} stroke={colors.danger} strokeWidth="4" strokeLinecap="round" opacity={0.8} />
          <line x1="48" y1="12" x2={48 - 36 * crossProgress} y2={12 + 36 * crossProgress} stroke={colors.danger} strokeWidth="4" strokeLinecap="round" opacity={0.8} />
        </>
      )}
    </svg>
  );
};

const McpPlugIcon: React.FC<{ progress: number; connected: boolean; size?: number }> = ({ progress, connected, size = 80 }) => {
  const pathLen = 300;
  const dashOffset = pathLen * (1 - progress);
  const plugOffset = connected ? 0 : 12;
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <g transform={`translate(${-plugOffset}, 0)`}>
        <rect x="6" y="20" width="20" height="20" rx="4" stroke={colors.accentSecondary} strokeWidth="2.5" fill="none" strokeDasharray={pathLen} strokeDashoffset={dashOffset} />
        <line x1="26" y1="26" x2="30" y2="26" stroke={colors.accentSecondary} strokeWidth="3" strokeLinecap="round" opacity={progress} />
        <line x1="26" y1="34" x2="30" y2="34" stroke={colors.accentSecondary} strokeWidth="3" strokeLinecap="round" opacity={progress} />
      </g>
      <g transform={`translate(${plugOffset}, 0)`}>
        <rect x="34" y="20" width="20" height="20" rx="4" stroke={colors.accent} strokeWidth="2.5" fill="none" strokeDasharray={pathLen} strokeDashoffset={dashOffset} />
        <circle cx="40" cy="26" r="2" fill={colors.accent} opacity={progress * 0.7} />
        <circle cx="40" cy="34" r="2" fill={colors.accent} opacity={progress * 0.7} />
      </g>
      {connected && progress > 0.8 && <circle cx="30" cy="30" r="4" fill={colors.warning} opacity={0.7} />}
      <text x="30" y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace" fill={colors.accent} opacity={progress}>MCP</text>
    </svg>
  );
};

const CriteriaCard: React.FC<{ number: number; text: string; highlight: string; icon: React.ReactNode; progress: number; y: number }> = ({ number, text, highlight, icon, progress, y }) => {
  const scale = interpolate(progress, [0, 0.5, 1], [0.8, 1.02, 1]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const slideX = interpolate(progress, [0, 1], [-60, 0]);
  return (
    <div style={{ position: "absolute", left: "50%", top: y, transform: `translate(-50%, -50%) translateX(${slideX}px) scale(${scale})`, opacity, display: "flex", alignItems: "center", gap: 54, width: 1650 }}>
      <div style={{ width: 96, height: 96, borderRadius: "50%", background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentSecondary})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 800, fontFamily: fonts.main, color: "#000", flexShrink: 0 }}>{number}</div>
      <div style={{ flex: 1, background: colors.cardBg, border: `1.5px solid ${colors.border}`, borderRadius: 16, padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 36 }}>
        <div style={{ fontSize: 51, fontWeight: 600, fontFamily: fonts.main, color: colors.text, lineHeight: 1.5, letterSpacing: 1 }}>
          {text}<span style={{ color: colors.accent, fontWeight: 700 }}>{highlight}</span>
        </div>
        <div style={{ flexShrink: 0 }}>{icon}</div>
      </div>
    </div>
  );
};

export const Scene04-EngineCriteria: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, mass: 0.8, stiffness: 100 } });
  const titleY = interpolate(titleSpring, [0, 1], [50, 0]);
  const titleOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cond1Spring = spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 12, mass: 0.8, stiffness: 90 } });
  const codeIconDraw = interpolate(frame, [50, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const noGuiDraw = interpolate(frame, [60, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const crossDraw = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cond2Spring = spring({ frame: Math.max(0, frame - 120), fps, config: { damping: 12, mass: 0.8, stiffness: 90 } });
  const mcpDraw = interpolate(frame, [130, 170], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mcpConnected = frame > 170;

  const fadeOut = interpolate(frame, [210, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        <div style={{ position: "absolute", top: 100, left: 0, right: 0, textAlign: "center", fontSize: 84, fontWeight: 700, color: colors.text, fontFamily: fonts.main, letterSpacing: 4, transform: `translateY(${titleY}px)`, opacity: titleOpacity }}>
          挑選引擎的
          <span style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentSecondary})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>兩個條件</span>
        </div>
        <CriteriaCard number={1} text="完全透過程式碼生成，" highlight="不需要操作 GUI" y={380} progress={cond1Spring} icon={<div style={{ display: "flex", alignItems: "center", gap: 12 }}><CodeIcon progress={codeIconDraw} size={105} /><NoGuiIcon progress={noGuiDraw} crossProgress={crossDraw} size={105} /></div>} />
        <CriteriaCard number={2} text="GUI 介面有 " highlight="MCP 可以串接更好" y={600} progress={cond2Spring} icon={<McpPlugIcon progress={mcpDraw} connected={mcpConnected} size={120} />} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};