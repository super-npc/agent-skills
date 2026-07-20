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
  accentSecondary: "#4DA3FF",
  warning: "#FFB547",
};

const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

const SITES = [
  { label: "Landing Page", accent: "#8B5CF6" },
  { label: "Dashboard", accent: "#3B82F6" },
  { label: "E-commerce", accent: "#10B981" },
  { label: "Blog", accent: "#F59E0B" },
];

const SiteThumbnail: React.FC<{ accent: string; label: string; frame: number }> = ({ accent, label, frame }) => {
  const glowPulse = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.3, 0.6]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 21 }}>
      <svg width="330" height="240" viewBox="0 0 220 160">
        <defs>
          <linearGradient id={`siteGrad-${accent}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0D1117" />
            <stop offset="100%" stopColor="#161B22" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="220" height="160" rx="10" fill={`url(#siteGrad-${accent})`} stroke={`${accent}40`} strokeWidth="1.5" />
        <rect x="0" y="0" width="220" height="18" rx="10" fill="rgba(255,255,255,0.04)" />
        <circle cx="12" cy="9" r="3" fill="#FF5F57" opacity={0.6} />
        <circle cx="22" cy="9" r="3" fill="#FFBD2E" opacity={0.6} />
        <circle cx="32" cy="9" r="3" fill="#28CA41" opacity={0.6} />
        <rect x="0" y="18" width="220" height="45" fill={`${accent}20`} />
        <rect x="60" y="30" width="100" height="8" rx="3" fill={`${accent}60`} />
        <rect x="75" y="44" width="70" height="5" rx="2" fill="rgba(255,255,255,0.15)" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={12 + i * 68} y="72" width="60" height="45" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <circle cx={42 + i * 68} cy="87" r="6" fill={accent} opacity={glowPulse} />
            <rect x={22 + i * 68} y="100" width="40" height="4" rx="2" fill="rgba(255,255,255,0.08)" />
            <rect x={27 + i * 68} y="108" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.04)" />
          </g>
        ))}
        <rect x="70" y="148" width="80" height="3" rx="1.5" fill="rgba(255,255,255,0.05)" />
      </svg>
      <span style={{ fontSize: 27, fontWeight: 600, fontFamily: fonts.main, color: accent }}>{label}</span>
    </div>
  );
};

export const Scene56-ShadcnResults: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 10, mass: 0.5, stiffness: 120 } });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0.3, 1]);
  const badgeOpacity = interpolate(badgeSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const siteSprings = SITES.map((_, i) => spring({ frame: Math.max(0, frame - (45 + i * 20)), fps, config: { damping: 10, mass: 0.5, stiffness: 120 } }));
  const checkSpring = spring({ frame: Math.max(0, frame - 140), fps, config: { damping: 8, mass: 0.4, stiffness: 150 } });
  const checkScale = interpolate(checkSpring, [0, 1], [0.3, 1]);
  const checkOpacity = interpolate(checkSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [210, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.03, 0.08]);

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <div style={{ position: "absolute", top: "45%", left: "50%", width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(circle, ${colors.accentSecondary}0a 0%, transparent 60%)`, transform: "translate(-50%, -50%)", opacity: glowPulse * fadeOut }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 67, opacity: fadeOut }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: badgeOpacity, transform: `scale(${badgeScale})` }}>
          <div style={{ padding: "18px 48px", borderRadius: 16, background: `${colors.accentSecondary}12`, border: `2px solid ${colors.accentSecondary}40`, fontSize: 54, fontWeight: 700, fontFamily: fonts.main, color: colors.accentSecondary, letterSpacing: 2 }}>
            shadcn-ui skill
          </div>
        </div>
        <div style={{ display: "flex", gap: 42 }}>
          {SITES.map((site, i) => {
            const tScale = interpolate(siteSprings[i], [0, 1], [0.4, 1]);
            const tOp = interpolate(siteSprings[i], [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
            const hover = Math.sin(frame * 0.04 + i * 1.5) * 4;
            return (
              <div key={site.label} style={{ opacity: tOp, transform: `scale(${tScale}) translateY(${hover}px)` }}>
                <SiteThumbnail accent={site.accent} label={site.label} frame={frame} />
              </div>
            );
          })}
        </div>
        {checkOpacity > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: checkOpacity, transform: `scale(${checkScale})` }}>
            <svg width="60" height="60" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill={`${colors.accent}20`} stroke={colors.accent} strokeWidth="2.5" />
              <path d="M12 20 L17 25 L28 14" fill="none" stroke={colors.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 45, fontWeight: 600, fontFamily: fonts.main, color: "rgba(255,255,255,0.75)" }}>完成度高，可直接使用</span>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};