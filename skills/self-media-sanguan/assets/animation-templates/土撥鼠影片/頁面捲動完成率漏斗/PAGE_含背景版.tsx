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
  accentSecondary: "#4DA3FF",
  warning: "#FFB547",
};
const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

function useCounter(frame: number, startFrame: number, endFrame: number, targetValue: number): number {
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = 1 - Math.pow(1 - progress, 3);
  return Math.round(eased * targetValue);
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export const PAGE-SCROLL-METRICS-DURATION-FRAMES = 210;

export const Scene88-PageScrollMetrics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const browserSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 12, mass: 0.6, stiffness: 100 } });
  const browserScale = interpolate(browserSpring, [0, 1], [0.5, 1]);
  const browserOpacity = interpolate(browserSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  const topFunnelSpring = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 10, mass: 0.5, stiffness: 120 } });
  const topFunnelOpacity = interpolate(topFunnelSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const topFunnelScale = interpolate(topFunnelSpring, [0, 1], [0.6, 1]);
  const topCount = useCounter(frame, 30, 75, 1000);

  const bottomFunnelSpring = spring({ frame: Math.max(0, frame - 75), fps, config: { damping: 10, mass: 0.5, stiffness: 120 } });
  const bottomFunnelOpacity = interpolate(bottomFunnelSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const bottomFunnelScale = interpolate(bottomFunnelSpring, [0, 1], [0.6, 1]);
  const bottomCount = useCounter(frame, 80, 130, 320);

  const scrollProgress = interpolate(frame, [80, 145], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const percentSpring = spring({ frame: Math.max(0, frame - 120), fps, config: { damping: 8, mass: 0.4, stiffness: 140 } });
  const percentScale = interpolate(percentSpring, [0, 1], [0.3, 1]);
  const percentOpacity = interpolate(percentSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  const fadeOut = interpolate(frame, [185, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 120,
          opacity: fadeOut,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          <div style={{ opacity: topFunnelOpacity, transform: `scale(${topFunnelScale})`, transformOrigin: "center bottom", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <div style={{ fontSize: 39, fontFamily: fonts.main, fontWeight: 700, color: colors.accentSecondary, letterSpacing: 2 }}>點進頁面的人</div>
            <div style={{ display: "flex", flexDirection: "row", gap: 9, flexWrap: "wrap", maxWidth: 510, justifyContent: "center" }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <svg key={i} width="42" height="48" viewBox="0 0 28 32">
                  <circle cx="14" cy="9" r="7" fill={colors.accentSecondary} opacity={0.9} />
                  <path d="M4 28 C4 20 24 20 24 28" fill={colors.accentSecondary} opacity={0.9} />
                </svg>
              ))}
            </div>
            <div style={{ fontSize: 96, fontWeight: 900, fontFamily: fonts.main, color: colors.accentSecondary, letterSpacing: -2, lineHeight: 1 }}>{formatNumber(topCount)}</div>
          </div>

          <svg width="540" height="420" viewBox="0 0 360 280" style={{ opacity: topFunnelOpacity, marginTop: -15 }}>
            <defs>
              <linearGradient id="funnelTopGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.accentSecondary} stopOpacity={0.5} />
                <stop offset="100%" stopColor={colors.warning} stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <path d="M30 20 L330 20 L230 140 L130 140 Z" fill="url(#funnelTopGrad)" stroke={colors.accentSecondary} strokeWidth="2" strokeOpacity={0.8} />
            <path d="M130 140 L230 140 L200 200 L160 200 Z" fill="url(#funnelTopGrad)" stroke={colors.warning} strokeWidth="2" strokeOpacity={0.8} opacity={bottomFunnelOpacity} />
            <path d="M160 200 L200 200 L200 260 L160 260 Z" fill={colors.warning} fillOpacity={0.3} stroke={colors.warning} strokeWidth="2" opacity={bottomFunnelOpacity} />
            <path d="M180 264 L170 278 L190 278 Z" fill={colors.warning} opacity={bottomFunnelOpacity} />
          </svg>

          <div style={{ opacity: bottomFunnelOpacity, transform: `scale(${bottomFunnelScale})`, transformOrigin: "center top", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, marginTop: -30 }}>
            <div style={{ display: "flex", flexDirection: "row", gap: 12, justifyContent: "center" }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <svg key={i} width="42" height="48" viewBox="0 0 28 32">
                  <circle cx="14" cy="9" r="7" fill={colors.warning} opacity={0.9} />
                  <path d="M4 28 C4 20 24 20 24 28" fill={colors.warning} opacity={0.9} />
                </svg>
              ))}
            </div>
            <div style={{ fontSize: 96, fontWeight: 900, fontFamily: fonts.main, color: colors.warning, letterSpacing: -2, lineHeight: 1 }}>{formatNumber(bottomCount)}</div>
            <div style={{ fontSize: 39, fontFamily: fonts.main, fontWeight: 700, color: colors.warning, letterSpacing: 2 }}>滑到底部的人</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48, opacity: browserOpacity, transform: `scale(${browserScale})` }}>
          <svg width="570" height="750" viewBox="0 0 380 500">
            <rect x="0" y="0" width="380" height="500" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            <rect x="0" y="0" width="380" height="48" rx="12" fill="rgba(255,255,255,0.07)" />
            <circle cx="20" cy="24" r="7" fill="#FF6B6B" opacity={0.8} />
            <circle cx="40" cy="24" r="7" fill="#FFB547" opacity={0.8} />
            <circle cx="60" cy="24" r="7" fill="#00D4AA" opacity={0.8} />
            <rect x="10" y="58" width="360" height="432" rx="4" fill="rgba(0,0,0,0.2)" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <rect key={i} x="20" y={175 + i * 22} width={i % 3 === 2 ? 240 : 340} height="8" rx="2" fill="rgba(255,255,255,0.08)" />
            ))}
            <rect x="362" y="60" width="8" height="430" rx="4" fill="rgba(255,255,255,0.05)" />
            <rect x="363" y={60 + scrollProgress * 340} width="6" height="80" rx="3" fill={colors.accentSecondary} opacity={frame >= 80 ? 0.7 : 0} />
          </svg>

          {percentOpacity > 0 && (
            <div style={{ opacity: percentOpacity, transform: `scale(${percentScale})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ padding: "24px 60px", borderRadius: 16, background: `linear-gradient(135deg, ${colors.warning}22, ${colors.warning}11)`, border: `2px solid ${colors.warning}60`, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 108, fontWeight: 900, fontFamily: fonts.main, color: colors.warning, lineHeight: 1, letterSpacing: -2 }}>32%</div>
                <div style={{ fontSize: 30, fontFamily: fonts.main, fontWeight: 600, color: `${colors.warning}CC`, letterSpacing: 1 }}>Scroll Completion Rate</div>
              </div>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};