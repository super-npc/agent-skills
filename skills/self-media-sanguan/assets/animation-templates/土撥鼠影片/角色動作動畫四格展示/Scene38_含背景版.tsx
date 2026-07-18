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
  accent: "#00D4AA",
  warning: "#FFB547",
};

const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

const ACTIONS = [
  { label: "走路", delay: 30 },
  { label: "跑步", delay: 75 },
  { label: "跳躍", delay: 120 },
  { label: "攻擊", delay: 160 },
];

const ACTION-COLORS = ["#4DA3FF", "#FFB547", "#2ECC71", "#E74C3C"];

export const Scene38-CharAnimations: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [210, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]);

  const drawStickFigure = (actionIndex: number, animFrame: number) => {
    const t = animFrame * 0.12;
    let headY = -22, bodyEndY = 8, lLegX = -10, lLegY = 20, rLegX = 10, rLegY = 20, lArmX = -14, lArmY = 4, rArmX = 14, rArmY = 4;

    if (actionIndex === 0) {
      const swing = Math.sin(t) * 8;
      lLegX = -6 + swing; rLegX = 6 - swing; lArmX = -10 - swing * 0.6; rArmX = 10 + swing * 0.6;
    } else if (actionIndex === 1) {
      const swing = Math.sin(t * 1.5) * 12;
      lLegX = -8 + swing; rLegX = 8 - swing; lArmX = -12 - swing * 0.8; rArmX = 12 + swing * 0.8; lArmY = 0; rArmY = 0;
    } else if (actionIndex === 2) {
      const jump = Math.abs(Math.sin(t * 0.8)) * 16;
      headY = -22 - jump; bodyEndY = 8 - jump; lLegX = -8; lLegY = 18 - jump; rLegX = 8; rLegY = 18 - jump; lArmX = -16; lArmY = -4 - jump; rArmX = 16; rArmY = -4 - jump;
    } else {
      const thrust = Math.sin(t * 1.2);
      rArmX = 14 + Math.max(0, thrust) * 22; rArmY = -2; lArmX = -10; lArmY = 6;
    }

    const col = ACTION-COLORS[actionIndex];
    return (
      <svg width="150" height="150" viewBox="-50 -50 100 100">
        <circle cx="0" cy={headY} r="10" fill="none" stroke={col} strokeWidth="3" />
        <line x1="0" y1={headY + 10} x2="0" y2={bodyEndY} stroke={col} strokeWidth="3" strokeLinecap="round" />
        <line x1="0" y1={bodyEndY} x2={lLegX} y2={lLegY} stroke={col} strokeWidth="3" strokeLinecap="round" />
        <line x1="0" y1={bodyEndY} x2={rLegX} y2={rLegY} stroke={col} strokeWidth="3" strokeLinecap="round" />
        <line x1="0" y1={headY + 14} x2={lArmX} y2={lArmY} stroke={col} strokeWidth="3" strokeLinecap="round" />
        <line x1="0" y1={headY + 14} x2={rArmX} y2={rArmY} stroke={col} strokeWidth="3" strokeLinecap="round" />
        {actionIndex === 3 && Math.sin(frame * 0.12 * 1.2) > 0 && (
          <line x1={rArmX} y1={rArmY} x2={rArmX + 16} y2={rArmY - 8} stroke={colors.warning} strokeWidth="3" strokeLinecap="round" />
        )}
      </svg>
    );
  };

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div style={{ position: "absolute", top: "45%", left: "50%", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${colors.accent}0a 0%, transparent 60%)`, transform: "translate(-50%, -50%)", opacity: glowPulse * fadeOut }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 75, opacity: fadeOut }}>
        <div style={{ display: "flex", gap: 54 }}>
          {ACTIONS.map((action, i) => {
            const aSpring = spring({ frame: Math.max(0, frame - action.delay), fps, config: { damping: 10, mass: 0.6, stiffness: 110 } });
            const aScale = interpolate(aSpring, [0, 1], [0.3, 1]);
            const aOp = interpolate(aSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
            const col = ACTION-COLORS[i];
            return (
              <div key={action.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, opacity: aOp, transform: `scale(${aScale})` }}>
                <div style={{ width: 200, height: 200, borderRadius: 24, background: `${col}10`, border: `3px solid ${col}35`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <div style={{ transform: "scale(1.5)" }}>{drawStickFigure(i, frame)}</div>
                </div>
                <span style={{ fontSize: 45, fontWeight: 700, fontFamily: fonts.main, color: col }}>{action.label}</span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};