import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const PROMPT-SPEC-207-DURATION-FRAMES = 240;

const FEATURES = [
  { label: "Landing Page", zh: "前台頁面", color: "#4DA3FF" },
  { label: "Dashboard", zh: "後台介面", color: "#10B981" },
  { label: "Email Login", zh: "信箱登入", color: "#A78BFA" },
  { label: "Lemon Squeezy", zh: "金流串接", color: "#F59E0B" },
];

export const Scene207-PromptSpec: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const termSpring = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 12, stiffness: 80 } });
  const typeProg = interpolate(frame, [25, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arrowProg = interpolate(frame, [85, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const featureSprings = FEATURES.map((_, i) =>
    spring({ frame: Math.max(0, frame - 105 - i * 15), fps, config: { damping: 12, stiffness: 80 } })
  );
  const specSpring = spring({ frame: Math.max(0, frame - 175), fps, config: { damping: 10, stiffness: 80 } });

  const LINES = [
    "做一個點子驗證工具",
    "Landing Page + 後台",
    "Email 登入功能",
    "金流串 Lemon Squeezy",
    "規劃產品設計規格",
  ];

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
        用一段 <span style={{ color: "#A78BFA" }}>Prompt</span> 規劃產品規格
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 36, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 45 }}>
        One prompt to plan the entire product spec
      </div>

      <svg width={1980} height={825} viewBox="0 0 1320 550">
        {/* Terminal */}
        <g transform="translate(340, 35)" opacity={termSpring}>
          <g transform={`scale(${termSpring})`}>
            <rect x={-265} y={0} width={530} height={325} rx={18} fill="rgba(167,139,250,0.04)" stroke="#A78BFA" strokeWidth={3} />
            <rect x={-265} y={0} width={530} height={38} rx={18} fill="rgba(167,139,250,0.08)" />
            <rect x={-265} y={22} width={530} height={16} fill="rgba(167,139,250,0.08)" />
            <circle cx={-240} cy={19} r={6} fill="#EF4444" opacity={0.6} />
            <circle cx={-220} cy={19} r={6} fill="#F59E0B" opacity={0.6} />
            <circle cx={-200} cy={19} r={6} fill="#10B981" opacity={0.6} />
            <text x={0} y={24} textAnchor="middle" fontSize={15} fontWeight={700} fill="#A78BFA" fontFamily="'Inter', sans-serif" opacity={0.6}>Prompt</text>
            {LINES.map((line, i) => {
              const lineStart = i / LINES.length;
              const lineEnd = (i + 1) / LINES.length;
              const lineProg = interpolate(typeProg, [lineStart, lineEnd], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              if (lineProg <= 0) return null;
              return (
                <g key={i} opacity={lineProg}>
                  <text x={-240} y={73 + i * 50} fontSize={19} fontWeight={600} fill={i === 0 ? "#A78BFA" : "rgba(167,139,250,0.7)"} fontFamily="'Noto Sans TC', sans-serif">
                    {i === 0 ? "▸ " : "  "}{line}
                  </text>
                </g>
              );
            })}
            {typeProg < 1 && (
              <rect x={-240 + 19 * 8} y={57 + Math.floor(typeProg * LINES.length) * 50} width={10} height={20} rx={1} fill="#A78BFA" opacity={Math.sin(frame * 0.3) > 0 ? 0.8 : 0} />
            )}
          </g>
        </g>

        {/* Arrow */}
        <g opacity={arrowProg}>
          <line x1={630} y1={200} x2={630 + 75 * arrowProg} y2={200} stroke="rgba(255,255,255,0.3)" strokeWidth={4} strokeDasharray="10 6" />
          {arrowProg > 0.8 && <polygon points="708,193 722,200 708,207" fill="rgba(255,255,255,0.4)" />}
        </g>

        {/* Feature cards 2x2 */}
        <g transform="translate(750, 25)">
          {FEATURES.map((f, i) => {
            const sp = featureSprings[i];
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = col * 250;
            const y = row * 188;
            return (
              <g key={i} opacity={sp} transform={`translate(${x + (1 - sp) * 20}, ${y})`}>
                <rect x={0} y={0} width={225} height={163} rx={18} fill={`${f.color}08`} stroke={f.color} strokeWidth={3} />
                <text x={112} y={106} textAnchor="middle" fontSize={19} fontWeight={800} fill={f.color}>{f.zh}</text>
                <text x={112} y={128} textAnchor="middle" fontSize={14} fill={`${f.color}60`} fontFamily="'Inter', sans-serif">{f.label}</text>
                <g transform="translate(112, 150)">
                  <circle cx={0} cy={0} r={9} fill={`${f.color}20`} />
                  <polyline points="-4,0 -1,3 5,-3" fill="none" stroke={f.color} strokeWidth={2.5} strokeLinecap="round" />
                </g>
              </g>
            );
          })}
        </g>

        {/* Bottom spec doc */}
        <g transform="translate(660, 445)" opacity={specSpring}>
          <g transform={`scale(${specSpring})`}>
            <rect x={-375} y={-20} width={750} height={88} rx={20} fill="rgba(16,185,129,0.05)" stroke="#10B981" strokeWidth={3} />
            <text x={0} y={22} textAnchor="middle" fontSize={25} fontWeight={800} fill="#10B981">產品設計規格文件</text>
            <text x={0} y={50} textAnchor="middle" fontSize={16} fill="rgba(16,185,129,0.5)" fontFamily="'Inter', sans-serif">Product Design Specification</text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};