import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const Scene145-DistributionFirst: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const CY = 400;
  const LEFT-X = 620;
  const RIGHT-X = 1300;
  const BOX-W = 200;
  const BOX-H = 200;
  const BOX-R = 28;

  const buildSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 12, stiffness: 80 } });
  const arrowSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 14, stiffness: 70 } });
  const distSpring = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 12, stiffness: 80 } });

  const starAppear = spring({ frame: Math.max(0, frame - 50), fps, config: { damping: 10, stiffness: 100 } });
  const GREY-PRODUCTS = 18;
  const greyDelay = (i: number) => 62 + i * 1.5;
  const starDim = interpolate(frame, [70, 95], [1, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const swapProgress = interpolate(frame, [100, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const swapEased = swapProgress < 0.5 ? 2 * swapProgress * swapProgress : 1 - Math.pow(-2 * swapProgress + 2, 2) / 2;

  const buildBoxX = LEFT-X + (RIGHT-X - LEFT-X) * swapEased;
  const distBoxX = RIGHT-X - (RIGHT-X - LEFT-X) * swapEased;
  const swapArcBuild = Math.sin(swapEased * Math.PI) * -60;
  const swapArcDist = Math.sin(swapEased * Math.PI) * 60;

  const bulbSpring = spring({ frame: Math.max(0, frame - 125), fps, config: { damping: 10, stiffness: 90 } });
  const starRevive = interpolate(frame, [130, 150], [0.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const xMarkOp = interpolate(frame, [88, 98], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const xMarkFade = interpolate(frame, [100, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const checkOp = interpolate(frame, [128, 140], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const greyFade = interpolate(frame, [98, 112], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bulbPulse = frame > 130 ? 1 + Math.sin(frame * 0.12) * 0.08 : 1;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)", opacity: masterOpacity }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <filter id="s145glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="s145starGlow">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <g opacity={buildSpring} transform={`translate(${buildBoxX + swapArcBuild * 0},${CY + swapArcBuild}) scale(${buildSpring})`} style={{ transformOrigin: `${buildBoxX}px ${CY}px` }}>
          <rect x={-BOX-W / 2} y={-BOX-H / 2} width={BOX-W} height={BOX-H} rx={BOX-R} fill="rgba(77,163,255,0.12)" stroke="#4DA3FF" strokeWidth={3} />
          <line x1={-20} y1={35} x2={20} y2={-25} stroke="#4DA3FF" strokeWidth={6} strokeLinecap="round" />
          <rect x={8} y={-42} width={32} height={18} rx={4} fill="#4DA3FF" transform="rotate(-35 24 -33)" />
          <text x={0} y={BOX-H / 2 + 38} textAnchor="middle" fontSize={42} fontWeight={700} fill="#4DA3FF" fontFamily="'Inter', sans-serif" opacity={0.9}>Build</text>
        </g>

        <g opacity={distSpring} transform={`translate(${distBoxX},${CY + swapArcDist}) scale(${distSpring})`} style={{ transformOrigin: `${distBoxX}px ${CY}px` }}>
          <rect x={-BOX-W / 2} y={-BOX-H / 2} width={BOX-W} height={BOX-H} rx={BOX-R} fill="rgba(16,185,129,0.12)" stroke="#10B981" strokeWidth={3} />
          <path d="M -15 -25 L 35 -45 L 35 45 L -15 25 Z" fill="#10B981" opacity={0.85} />
          <rect x={-25} y={-18} width={12} height={36} rx={4} fill="#34D399" />
          {[0, 1, 2].map((j) => (
            <path key={j} d={`M ${42 + j * 14} ${-20 - j * 8} Q ${50 + j * 14} 0 ${42 + j * 14} ${20 + j * 8}`} fill="none" stroke="#34D399" strokeWidth={2.5} opacity={0.4 + j * 0.1} strokeLinecap="round" />
          ))}
          <text x={0} y={BOX-H / 2 + 38} textAnchor="middle" fontSize={42} fontWeight={700} fill="#10B981" fontFamily="'Inter', sans-serif" opacity={0.9}>Distribution</text>
        </g>

        <g opacity={arrowSpring}>
          <g transform={`translate(960, ${CY})`}>
            <line x1={-80} y1={0} x2={60} y2={0} stroke="rgba(255,255,255,0.5)" strokeWidth={3} strokeLinecap="round" />
            <polygon points="65,-8 80,0 65,8" fill="rgba(255,255,255,0.5)" />
          </g>
        </g>

        <g opacity={starAppear * (frame < 130 ? starDim : starRevive)}>
          <g transform={`translate(960, ${CY + 220})`}>
            <circle cx={0} cy={0} r={55} fill="none" stroke="#FBBF24" strokeWidth={2} opacity={0.3 * (frame < 130 ? starDim : starRevive)} filter="url(#s145starGlow)" />
            <polygon points={[0,1,2,3,4,5,6,7,8,9].map((j) => { const angle=(j*36-90)*Math.PI/180; const r=j%2===0?40:18; return `${Math.cos(angle)*r},${Math.sin(angle)*r}`; }).join(" ")} fill="#FBBF24" stroke="#FDE68A" strokeWidth={2} filter="url(#s145glow)" />
            <circle cx={0} cy={0} r={10} fill="#FEF3C7" opacity={0.7} />
          </g>
        </g>

        <g opacity={greyFade}>
          {Array.from({ length: GREY-PRODUCTS }, (_, i) => {
            const gFrame = Math.max(0, frame - greyDelay(i));
            if (gFrame <= 0) return null;
            const gSpring = spring({ frame: gFrame, fps, config: { damping: 8, stiffness: 120, mass: 0.5 } });
            const seed1 = Math.sin(i * 73.1 + 17) * 43758.5453;
            const seed2 = Math.sin(i * 127.3 + 53) * 43758.5453;
            const rx = (seed1 - Math.floor(seed1) - 0.5) * 280;
            const ry = (seed2 - Math.floor(seed2) - 0.5) * 160;
            const gx = 960 + rx, gy = CY + 220 + ry;
            const gs = 28 + (i % 5) * 5;
            const rot = ((i * 37) % 30) - 15;
            return (
              <g key={`grey-${i}`} opacity={gSpring * 0.7} transform={`translate(${gx},${gy}) scale(${gSpring}) rotate(${rot})`}>
                <rect x={-gs / 2} y={-gs / 2} width={gs} height={gs} rx={gs * 0.22} fill="#374151" stroke="#4B5563" strokeWidth={1.5} />
              </g>
            );
          })}
        </g>

        <g opacity={xMarkOp * xMarkFade} transform={`translate(960, ${CY - 80})`}>
          <circle cx={0} cy={0} r={32} fill="rgba(239,68,68,0.15)" stroke="#EF4444" strokeWidth={3} />
          <line x1={-14} y1={-14} x2={14} y2={14} stroke="#EF4444" strokeWidth={4} strokeLinecap="round" />
          <line x1={14} y1={-14} x2={-14} y2={14} stroke="#EF4444" strokeWidth={4} strokeLinecap="round" />
        </g>

        <g opacity={checkOp} transform={`translate(960, ${CY - 80})`}>
          <circle cx={0} cy={0} r={32} fill="rgba(16,185,129,0.15)" stroke="#10B981" strokeWidth={3} />
          <path d="M -14 2 L -4 12 L 16 -10" fill="none" stroke="#10B981" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <g opacity={bulbSpring} transform={`translate(960, 140) scale(${bulbSpring * bulbPulse})`}>
          <circle cx={0} cy={0} r={60} fill="#FBBF24" opacity={0.08} filter="url(#s145starGlow)" />
          <path d="M 0 -35 C -22 -35 -30 -15 -30 0 C -30 14 -18 24 -14 30 L 14 30 C 18 24 30 14 30 0 C 30 -15 22 -35 0 -35 Z" fill="#FBBF24" stroke="#FDE68A" strokeWidth={2} />
          <path d="M -6 10 Q 0 -5 6 10" fill="none" stroke="#FEF3C7" strokeWidth={2.5} />
          <rect x={-12} y={30} width={24} height={6} rx={2} fill="#D97706" />
          <rect x={-10} y={36} width={20} height={5} rx={2} fill="#B45309" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = deg * Math.PI / 180;
            const rayPulse = 1 + Math.sin(frame * 0.1 + deg) * 0.2;
            return <line key={deg} x1={Math.cos(rad) * 48} y1={Math.sin(rad) * 48} x2={Math.cos(rad) * (58 + 6 * rayPulse)} y2={Math.sin(rad) * (58 + 6 * rayPulse)} stroke="#FBBF24" strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};