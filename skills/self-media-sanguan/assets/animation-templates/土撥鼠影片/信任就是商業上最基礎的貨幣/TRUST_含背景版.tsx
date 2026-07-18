import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const TRUST-IS-CURRENCY-DURATION-FRAMES = 240;

const PATHS = [
  { label: "親朋好友", en: "Friends & Family", action: "因信任而購買", color: "#10B981", angle: -50, dist: 200 },
  { label: "KOL", en: "Influencers", action: "信任產生合作", color: "#F59E0B", angle: 70, dist: 210 },
  { label: "公開平台", en: "Public Platforms", action: "願意付費使用", color: "#A78BFA", angle: 190, dist: 200 },
];

export const Scene189-TrustIsCurrency: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const coinSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 10, stiffness: 70 } });
  const coinGlow = frame > 30 ? 0.15 + Math.sin(frame * 0.06) * 0.1 : 0;
  const pathSprings = PATHS.map((_, i) =>
    spring({ frame: Math.max(0, frame - 70 - i * 25), fps, config: { damping: 12, stiffness: 90 } })
  );
  const lineSprings = PATHS.map((_, i) =>
    spring({ frame: Math.max(0, frame - 60 - i * 25), fps, config: { damping: 10, stiffness: 80 } })
  );

  const toRad = (deg: number) => (deg * Math.PI) / 180;

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 72, fontWeight: 800, color: "#FFFFFF", textAlign: "center", marginBottom: 15 }}>
        <span style={{ color: "#F59E0B" }}>信任</span>就是商業上最基礎的<span style={{ color: "#F59E0B" }}>貨幣</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 30, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 30 }}>
        Trust is the foundational currency of business
      </div>

      <svg width={1350} height={560} viewBox="0 0 900 370">
        <g transform="translate(450, 185)">
          {/* Lines */}
          {PATHS.map((p, i) => {
            const ex = p.dist * Math.cos(toRad(p.angle));
            const ey = p.dist * Math.sin(toRad(p.angle));
            return (
              <line key={i} x1={0} y1={0} x2={ex * lineSprings[i]} y2={ey * lineSprings[i]}
                stroke={`${p.color}30`} strokeWidth={2.5} strokeDasharray="6 6"
              />
            );
          })}

          {/* Center coin */}
          <g opacity={coinSpring} transform={`scale(${coinSpring})`}>
            <circle cx={0} cy={0} r={70} fill="rgba(245,158,11,0.12)" stroke="#F59E0B" strokeWidth={4}
              style={{ filter: `drop-shadow(0 0 ${coinGlow * 40}px rgba(245,158,11,${coinGlow}))` }}
            />
            <circle cx={0} cy={0} r={52} fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.4)" strokeWidth={2} />
            <text x={0} y={-8} textAnchor="middle" fontSize={30} fontWeight={800} fill="#F59E0B">信任</text>
            <text x={0} y={20} textAnchor="middle" fontSize={18} fill="rgba(245,158,11,0.6)" fontFamily="'Inter', sans-serif">Trust</text>
          </g>

          {/* Path nodes */}
          {PATHS.map((p, i) => {
            const ex = p.dist * Math.cos(toRad(p.angle));
            const ey = p.dist * Math.sin(toRad(p.angle));
            const sp = pathSprings[i];
            return (
              <g key={i} opacity={sp} transform={`translate(${ex}, ${ey}) scale(${sp})`}>
                <rect x={-80} y={-45} width={160} height={90} rx={16} fill={`${p.color}0A`} stroke={`${p.color}40`} strokeWidth={2} />
                <text x={0} y={-10} textAnchor="middle" fontSize={22} fontWeight={700} fill={p.color}>{p.label}</text>
                <text x={0} y={15} textAnchor="middle" fontSize={14} fill={`${p.color}60`} fontFamily="'Inter', sans-serif">{p.en}</text>
                <text x={0} y={36} textAnchor="middle" fontSize={16} fill="rgba(255,255,255,0.4)">{p.action}</text>
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};