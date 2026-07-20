import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const PROMPT-DEV-208-DURATION-FRAMES = 180;

export const Scene208-PromptDev: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const specSpring = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 12, stiffness: 80 } });
  const arrowProg = interpolate(frame, [50, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const codeSpring = spring({ frame: Math.max(0, frame - 70), fps, config: { damping: 12, stiffness: 80 } });
  const codeTypeProg = interpolate(frame, [80, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const buildSpring = spring({ frame: Math.max(0, frame - 135), fps, config: { damping: 10, stiffness: 90 } });

  const SPEC-ITEMS = [
    { label: "Auth", zh: "登入模組" },
    { label: "API", zh: "API 路由" },
    { label: "DB", zh: "資料庫" },
    { label: "UI", zh: "前端介面" },
  ];

  const CODE-LINES = [
    { text: "// auth.ts", color: "#6B7280" },
    { text: "export async function login(", color: "#4DA3FF" },
    { text: "  email: string,", color: "#A78BFA" },
    { text: "  password: string", color: "#A78BFA" },
    { text: ") { ... }", color: "#4DA3FF" },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: masterOpacity,
        fontFamily: "'Noto Sans TC', 'Inter', sans-serif",
      }}
    >
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 72, fontWeight: 800, color: "#FFFFFF", textAlign: "center", marginBottom: 12, lineHeight: 1.4 }}>
        根據<span style={{ color: "#4DA3FF" }}>技術規格</span>做開發
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 36, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 45 }}>
        Prompt: develop based on technical spec
      </div>

      <svg width={1950} height={780} viewBox="0 0 1300 520">
        {/* Left: Spec Document */}
        <g transform="translate(300, 30)" opacity={specSpring}>
          <g transform={`scale(${specSpring})`}>
            <rect x={-230} y={0} width={460} height={340} rx={18} fill="rgba(16,185,129,0.04)" stroke="#10B981" strokeWidth={3} />
            <rect x={-230} y={0} width={460} height={42} rx={18} fill="rgba(16,185,129,0.08)" />
            <rect x={-230} y={24} width={460} height={18} fill="rgba(16,185,129,0.08)" />
            <text x={0} y={26} textAnchor="middle" fontSize={16} fontWeight={700} fill="#10B981" fontFamily="'Inter', sans-serif" opacity={0.7}>Technical Spec</text>
            {SPEC-ITEMS.map((item, i) => {
              const itemProg = spring({ frame: Math.max(0, frame - 25 - i * 10), fps, config: { damping: 12, stiffness: 80 } });
              return (
                <g key={i} opacity={itemProg} transform={`translate(0, ${65 + i * 68})`}>
                  <rect x={-200} y={0} width={400} height={54} rx={12} fill="rgba(16,185,129,0.06)" stroke="#10B981" strokeWidth={2} strokeOpacity={0.4} />
                  <circle cx={-165} cy={27} r={16} fill="rgba(16,185,129,0.15)" stroke="#10B981" strokeWidth={2} />
                  <text x={-165} y={32} textAnchor="middle" fontSize={14} fontWeight={800} fill="#10B981" fontFamily="'Inter', sans-serif">{i + 1}</text>
                  <text x={-130} y={22} textAnchor="start" fontSize={18} fontWeight={700} fill="#10B981">{item.zh}</text>
                  <text x={-130} y={42} textAnchor="start" fontSize={13} fill="rgba(16,185,129,0.5)" fontFamily="'Inter', sans-serif">{item.label}</text>
                  <g transform="translate(170, 27)">
                    <circle cx={0} cy={0} r={10} fill="rgba(16,185,129,0.15)" />
                    <polyline points="-4,0 -1,3 5,-3" fill="none" stroke="#10B981" strokeWidth={2.5} strokeLinecap="round" />
                  </g>
                </g>
              );
            })}
          </g>
        </g>

        {/* Arrow */}
        <g opacity={arrowProg}>
          <line x1={555} y1={200} x2={555 + 90 * arrowProg} y2={200} stroke="rgba(255,255,255,0.3)" strokeWidth={4} strokeDasharray="10 6" />
          {arrowProg > 0.8 && <polygon points="648,192 664,200 648,208" fill="rgba(255,255,255,0.4)" />}
          <text x={600} y={185} textAnchor="middle" fontSize={13} fill="rgba(255,255,255,0.25)" fontFamily="'Inter', sans-serif" opacity={arrowProg}>Prompt</text>
        </g>

        {/* Right: Code Editor */}
        <g transform="translate(960, 30)" opacity={codeSpring}>
          <g transform={`scale(${codeSpring})`}>
            <rect x={-230} y={0} width={460} height={340} rx={18} fill="rgba(77,163,255,0.04)" stroke="#4DA3FF" strokeWidth={3} />
            <rect x={-230} y={0} width={460} height={42} rx={18} fill="rgba(77,163,255,0.08)" />
            <rect x={-230} y={24} width={460} height={18} fill="rgba(77,163,255,0.08)" />
            <circle cx={-205} cy={21} r={6} fill="#EF4444" opacity={0.6} />
            <circle cx={-185} cy={21} r={6} fill="#F59E0B" opacity={0.6} />
            <circle cx={-165} cy={21} r={6} fill="#10B981" opacity={0.6} />
            <text x={0} y={26} textAnchor="middle" fontSize={16} fontWeight={700} fill="#4DA3FF" fontFamily="'Inter', sans-serif" opacity={0.7}>Code Editor</text>
            {CODE-LINES.map((line, i) => {
              const lineStart = i / CODE-LINES.length;
              const lineEnd = (i + 1) / CODE-LINES.length;
              const lineProg = interpolate(codeTypeProg, [lineStart, lineEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              if (lineProg <= 0) return null;
              return (
                <g key={i} opacity={lineProg}>
                  <text x={-205} y={80 + i * 38} fontSize={13} fill="rgba(255,255,255,0.15)" fontFamily="'JetBrains Mono', monospace">{i + 1}</text>
                  <text x={-180} y={80 + i * 38} fontSize={16} fontWeight={600} fill={line.color} fontFamily="'JetBrains Mono', monospace">{line.text}</text>
                </g>
              );
            })}
            {codeTypeProg < 1 && (
              <rect x={-180} y={64 + Math.floor(codeTypeProg * CODE-LINES.length) * 38} width={10} height={20} rx={1} fill="#4DA3FF" opacity={Math.sin(frame * 0.3) > 0 ? 0.8 : 0} />
            )}
          </g>
        </g>

        {/* Bottom: Build badge */}
        <g transform="translate(650, 440)" opacity={buildSpring}>
          <g transform={`scale(${buildSpring})`}>
            <rect x={-220} y={-20} width={440} height={56} rx={28} fill="rgba(167,139,250,0.08)" stroke="#A78BFA" strokeWidth={3} />
            <text x={0} y={12} textAnchor="middle" fontSize={22} fontWeight={800} fill="#A78BFA">根據規格開發中...</text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};