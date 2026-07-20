import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const CLOUDFLARE-API-KEY-212-DURATION-FRAMES = 150;

export const Scene212-CloudflareApiKey: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [130, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const cfSpring = spring({ frame: Math.max(0, frame - 12), fps, config: { damping: 12, stiffness: 80 } });
  const keySpring = spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 12, stiffness: 80 } });
  const arrowProg = interpolate(frame, [45, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ccSpring = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 12, stiffness: 80 } });
  const connectedSpring = spring({ frame: Math.max(0, frame - 90), fps, config: { damping: 10, stiffness: 90 } });
  const keyBlink = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.6, 1]);

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 72, fontWeight: 800, color: "#FFFFFF", textAlign: "center", marginBottom: 12, lineHeight: 1.4 }}>
        把 <span style={{ color: "#F59E0B" }}>API Key</span> 給 <span style={{ color: "#E0875E" }}>Claude Code</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 36, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 45 }}>
        Give Cloudflare API Key to Claude Code
      </div>

      <svg width={1950} height={720} viewBox="0 0 1300 480">
        {/* Cloudflare Card */}
        <g transform="translate(310, 30)" opacity={cfSpring}>
          <g transform={`scale(${cfSpring})`}>
            <rect x={-250} y={0} width={500} height={300} rx={20} fill="rgba(245,158,11,0.04)" stroke="#F59E0B" strokeWidth={3} />
            <text x={0} y={80} textAnchor="middle" fontSize={48} fontWeight={900} fill="#F59E0B" fontFamily="'Inter', sans-serif">☁</text>
            <text x={0} y={130} textAnchor="middle" fontSize={24} fontWeight={900} fill="#F59E0B" fontFamily="'Inter', sans-serif">Cloudflare</text>
            <g opacity={keySpring} transform={`translate(0, ${(1 - keySpring) * 15})`}>
              <rect x={-200} y={190} width={400} height={80} rx={14} fill="rgba(245,158,11,0.06)" stroke="#F59E0B" strokeWidth={2} strokeOpacity={0.5} />
              <g transform="translate(-160, 230)" opacity={keyBlink}>
                <circle cx={0} cy={0} r={14} fill="rgba(245,158,11,0.15)" stroke="#F59E0B" strokeWidth={2} />
                <circle cx={-2} cy={0} r={5} fill="none" stroke="#F59E0B" strokeWidth={2} />
                <line x1={3} y1={0} x2={12} y2={0} stroke="#F59E0B" strokeWidth={2} strokeLinecap="round" />
              </g>
              <text x={-125} y={222} textAnchor="start" fontSize={18} fontWeight={700} fill="#F59E0B">API Key</text>
              <text x={-125} y={248} textAnchor="start" fontSize={14} fontWeight={600} fill="rgba(245,158,11,0.4)" fontFamily="'JetBrains Mono', monospace">cf-sk_••••••••••••</text>
            </g>
          </g>
        </g>

        {/* Arrow with flying key */}
        <g opacity={arrowProg}>
          <line x1={580} y1={180} x2={580 + 100 * arrowProg} y2={180} stroke="rgba(255,255,255,0.3)" strokeWidth={4} strokeDasharray="10 6" />
          {arrowProg > 0.8 && <polygon points="683,172 698,180 683,188" fill="rgba(255,255,255,0.4)" />}
          {arrowProg > 0.2 && arrowProg < 0.9 && (
            <g transform={`translate(${580 + 100 * arrowProg}, 180)`} opacity={0.8}>
              <rect x={-18} y={-10} width={36} height={20} rx={5} fill="rgba(245,158,11,0.2)" stroke="#F59E0B" strokeWidth={1.5} />
              <text x={0} y={5} textAnchor="middle" fontSize={10} fontWeight={700} fill="#F59E0B" fontFamily="'Inter', sans-serif">KEY</text>
            </g>
          )}
        </g>

        {/* Claude Code Card */}
        <g transform="translate(950, 30)" opacity={ccSpring}>
          <g transform={`scale(${ccSpring})`}>
            <rect x={-250} y={0} width={500} height={300} rx={20} fill="rgba(224,135,94,0.04)" stroke="#E0875E" strokeWidth={3} />
            <text x={0} y={80} textAnchor="middle" fontSize={48} fontWeight={900} fill="#E0875E" fontFamily="'Inter', sans-serif">⚡</text>
            <text x={0} y={130} textAnchor="middle" fontSize={24} fontWeight={900} fill="#E0875E" fontFamily="'Inter', sans-serif">Claude Code</text>
            <rect x={-200} y={190} width={400} height={80} rx={14} fill="rgba(224,135,94,0.06)" stroke="#E0875E" strokeWidth={2} strokeOpacity={0.5} />
            <circle cx={-178} cy={208} r={4} fill="#EF4444" opacity={0.5} />
            <circle cx={-164} cy={208} r={4} fill="#F59E0B" opacity={0.5} />
            <circle cx={-150} cy={208} r={4} fill="#10B981" opacity={0.5} />
            <text x={-180} y={242} fontSize={13} fontWeight={600} fill="rgba(224,135,94,0.6)" fontFamily="'JetBrains Mono', monospace">$ export CF-API-KEY=...</text>
            <text x={-180} y={260} fontSize={13} fontWeight={600} fill="#10B981" fontFamily="'JetBrains Mono', monospace">✓ Connected</text>
          </g>
        </g>

        {/* Connected Badge */}
        <g transform="translate(650, 400)" opacity={connectedSpring}>
          <g transform={`scale(${connectedSpring})`}>
            <rect x={-240} y={-20} width={480} height={56} rx={28} fill="rgba(16,185,129,0.08)" stroke="#10B981" strokeWidth={3} />
            <text x={0} y={10} textAnchor="middle" fontSize={22} fontWeight={800} fill="#10B981">Cloudflare ↔ Claude Code 已連接</text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};