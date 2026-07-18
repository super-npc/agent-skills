import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

const PATH-POINTS: [number, number][] = [
  [0, 100], [45, 90], [90, 108], [135, 85], [175, 95],
  [215, 78], [255, 92], [290, 88], [320, 110], [345, 140],
  [368, 185], [390, 235], [408, 285], [425, 320], [442, 348],
  [460, 362], [520, 362], [600, 362], [700, 362], [790, 362],
];

function getVisiblePoints(frame: number): [number, number][] {
  if (frame < 15) return [];
  const progress = Math.min(1, (frame - 15) / 50);
  const numPoints = progress * (PATH-POINTS.length - 1);
  const fullPoints = Math.floor(numPoints);
  const frac = numPoints - fullPoints;
  const visible: [number, number][] = PATH-POINTS.slice(0, fullPoints + 1);
  if (frac > 0 && fullPoints < PATH-POINTS.length - 1) {
    const p0 = PATH-POINTS[fullPoints];
    const p1 = PATH-POINTS[fullPoints + 1];
    visible[visible.length - 1] = [p0[0] + (p1[0] - p0[0]) * frac, p0[1] + (p1[1] - p0[1]) * frac];
  }
  return visible;
}

function pointsToPolyline(pts: [number, number][]): string {
  return pts.map(([x, y]) => `${x},${y}`).join(" ");
}

function pointsToAreaPath(pts: [number, number][], bottomY: number): string {
  if (pts.length < 2) return "";
  const start = pts[0];
  const end = pts[pts.length - 1];
  const lineSegment = pts.map(([x, y]) => `${x},${y}`).join(" L ");
  return `M ${start[0]},${bottomY} L ${lineSegment} L ${end[0]},${bottomY} Z`;
}

function getCrashProgress(frame: number): number {
  return interpolate(frame, [42, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

function lerpColor(c1: [number, number, number], c2: [number, number, number], t: number): string {
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
  return `rgb(${r},${g},${b})`;
}

export const Scene127-ZeroRevenue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [120, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = frame < 120 ? fadeIn : fadeOut;

  const axesSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, mass: 0.6, stiffness: 200 } });
  const axesOpacity = interpolate(axesSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const axesScale = interpolate(axesSpring, [0, 1], [0.95, 1]);

  const visiblePoints = getVisiblePoints(frame);
  const polylinePoints = pointsToPolyline(visiblePoints);
  const areaPath = pointsToAreaPath(visiblePoints, 362);
  const crashProgress = getCrashProgress(frame);
  const lineColor = lerpColor([0, 212, 170], [255, 107, 107], crashProgress);

  const signupSpring = spring({ frame: Math.max(0, frame - 50), fps, config: { damping: 12, mass: 0.5, stiffness: 200 } });
  const signupOpacity = interpolate(signupSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const signupY = interpolate(signupSpring, [0, 1], [20, 0]);

  const zeroPaySpring = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 6, mass: 0.7, stiffness: 180 } });
  const zeroPayScale = interpolate(zeroPaySpring, [0, 1], [0.3, 1]);
  const zeroPayOpacity = interpolate(zeroPaySpring, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });

  const glowPulse = frame >= 75 && frame <= 120
    ? interpolate(Math.sin(((frame - 75) / 20) * Math.PI * 2), [-1, 1], [0.3, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  const chartLeft = (1920 - 860) / 2;
  const chartTop = (1080 - 480) / 2 - 40;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0A0E14 0%, #131A24 100%)", opacity: masterOpacity, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 50% at 50% 70%, rgba(255, 107, 107, 0.12) 0%, transparent 70%)", opacity: glowPulse, pointerEvents: "none" }} />

      <div style={{ position: "absolute", left: chartLeft, top: chartTop, width: 860, display: "flex", flexDirection: "column", alignItems: "center", opacity: axesOpacity, transform: `scale(${axesScale})`, transformOrigin: "center center" }}>
        <div style={{ alignSelf: "flex-start", marginLeft: 30, marginBottom: 12, opacity: signupOpacity, transform: `translateY(${signupY}px)`, fontFamily: fonts.main, fontSize: 42, fontWeight: 700, color: "#4DA3FF", letterSpacing: "0.02em", textShadow: "0 0 20px rgba(77, 163, 255, 0.5)" }}>
          10 人註冊
        </div>

        <svg width="800" height="400" viewBox="0 0 800 400" fill="none">
          {[80, 160, 240, 320].map((y) => (
            <line key={`hgrid-${y}`} x1="30" y1={y} x2="790" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 6" />
          ))}
          {[130, 230, 330, 430, 530, 660].map((x) => (
            <line key={`vgrid-${x}`} x1={x} y1="20" x2={x} y2="370" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 7" />
          ))}
          <line x1="30" y1="20" x2="30" y2="370" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="30" y1="370" x2="795" y2="370" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
          <polyline points="788,364 797,370 788,376" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <text x="14" y="375" fill="rgba(255,255,255,0.25)" fontSize="14" fontFamily="monospace" textAnchor="middle">0</text>
          {visiblePoints.length >= 2 && crashProgress > 0 && (
            <path d={areaPath} fill="rgba(255, 107, 107, 0.08)" opacity={crashProgress} />
          )}
          {visiblePoints.length >= 2 && (
            <polyline points={polylinePoints} stroke={lineColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ filter: `drop-shadow(0 0 6px ${lineColor})` }} />
          )}
          {visiblePoints.length >= 1 && (
            <circle cx={visiblePoints[visiblePoints.length - 1][0]} cy={visiblePoints[visiblePoints.length - 1][1]} r="5" fill={lineColor} style={{ filter: `drop-shadow(0 0 8px ${lineColor})` }} />
          )}
          {frame >= 62 && (
            <text x="500" y="356" fill="rgba(255, 107, 107, 0.55)" fontSize="13" fontFamily="monospace" letterSpacing="3" opacity={interpolate(frame, [62, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
              ─── FLATLINE ───
            </text>
          )}
        </svg>

        <div style={{ marginTop: 32, opacity: zeroPayOpacity, transform: `scale(${zeroPayScale})`, transformOrigin: "center top", fontFamily: fonts.main, fontSize: 96, fontWeight: 900, color: "#FF6B6B", letterSpacing: "-0.02em", textAlign: "center", textShadow: "0 0 40px rgba(255, 107, 107, 0.7), 0 4px 24px rgba(255, 107, 107, 0.4)", lineHeight: 1 }}>
          0 人付費
        </div>
      </div>
    </AbsoluteFill>
  );
};