import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const GENERIC-CHATBOT-DURATION-FRAMES = 180;

const INDUSTRIES = [
  { label: "電商", en: "E-commerce", angle: -70, color: "#4DA3FF" },
  { label: "餐飲", en: "Food", angle: -20, color: "#F59E0B" },
  { label: "教育", en: "Education", angle: 30, color: "#A78BFA" },
  { label: "醫療", en: "Medical", angle: 80, color: "#EC4899" },
  { label: "金融", en: "Finance", angle: 130, color: "#10B981" },
  { label: "旅遊", en: "Travel", angle: 180, color: "#F97316" },
  { label: "科技", en: "Tech", angle: 230, color: "#06B6D4" },
];

export const Scene219-GenericChatbot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const botSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 10, stiffness: 80 } });
  const bubble1 = spring({ frame: Math.max(0, frame - 45), fps, config: { damping: 12, stiffness: 80 } });
  const bubble2 = spring({ frame: Math.max(0, frame - 60), fps, config: { damping: 12, stiffness: 80 } });
  const bubble3 = spring({ frame: Math.max(0, frame - 75), fps, config: { damping: 12, stiffness: 80 } });
  const industrySprings = INDUSTRIES.map((_, i) =>
    spring({ frame: Math.max(0, frame - 85 - i * 6), fps, config: { damping: 12, stiffness: 80 } })
  );
  const linePulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.3, 0.6]);
  const blink = frame % 90 > 85 ? 0.2 : 1;

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
      <div style={{ opacity: titleSpring, transform: `translateY(${(1 - titleSpring) * 20}px)`, fontSize: 63, fontWeight: 800, color: "#FFFFFF", textAlign: "center", marginBottom: 9, lineHeight: 1.4 }}>
        做出一個<span style={{ color: "#F59E0B" }}>通用型</span>的客服機器人
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 30, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 45 }}>
        End up building a generic customer service chatbot
      </div>

      <svg width={1575} height={630} viewBox="0 0 1050 420">
        {/* Connection lines */}
        {INDUSTRIES.map((ind, i) => {
          const sp = industrySprings[i];
          const rad = (ind.angle * Math.PI) / 180;
          const dist = 175;
          const x = 525 + Math.cos(rad) * dist;
          const y = 195 + Math.sin(rad) * dist;
          return (
            <line key={`line-${i}`} x1={525} y1={195} x2={x} y2={y}
              stroke={ind.color} strokeWidth={1.5} opacity={sp * linePulse} strokeDasharray="6 4" />
          );
        })}

        {/* Bot */}
        <g transform="translate(525, 195)" opacity={botSpring}>
          <g transform={`scale(${botSpring})`}>
            <rect x={-55} y={-55} width={110} height={110} rx={22} fill="rgba(245,158,11,0.08)" stroke="#F59E0B" strokeWidth={3} />
            <line x1={0} y1={-55} x2={0} y2={-72} stroke="#F59E0B" strokeWidth={3} strokeLinecap="round" />
            <circle cx={0} cy={-78} r={6} fill="#F59E0B" opacity={0.8} />
            <circle cx={-18} cy={-15} r={8} fill="#F59E0B" opacity={blink * 0.7} />
            <circle cx={18} cy={-15} r={8} fill="#F59E0B" opacity={blink * 0.7} />
            <path d="M -15 12 Q 0 25 15 12" fill="none" stroke="#F59E0B" strokeWidth={3} strokeLinecap="round" />
          </g>
          <g transform="translate(65, -60)" opacity={bubble1}>
            <rect x={0} y={0} width={55} height={22} rx={11} fill="rgba(245,158,11,0.15)" stroke="#F59E0B" strokeWidth={1.5} />
            <circle cx={12} cy={11} r={3} fill="#F59E0B" opacity={0.5} />
            <circle cx={24} cy={11} r={3} fill="#F59E0B" opacity={0.5} />
            <circle cx={36} cy={11} r={3} fill="#F59E0B" opacity={0.5} />
          </g>
          <g transform="translate(-120, -45)" opacity={bubble2}>
            <rect x={0} y={0} width={45} height={22} rx={11} fill="rgba(77,163,255,0.15)" stroke="#4DA3FF" strokeWidth={1.5} />
            <rect x={10} y={8} width={25} height={5} rx={2.5} fill="#4DA3FF" opacity={0.4} />
          </g>
          <g transform="translate(70, -25)" opacity={bubble3}>
            <rect x={0} y={0} width={50} height={22} rx={11} fill="rgba(16,185,129,0.15)" stroke="#10B981" strokeWidth={1.5} />
            <rect x={10} y={8} width={30} height={5} rx={2.5} fill="#10B981" opacity={0.4} />
          </g>
        </g>

        {/* Industry icons */}
        {INDUSTRIES.map((ind, i) => {
          const sp = industrySprings[i];
          const rad = (ind.angle * Math.PI) / 180;
          const dist = 175;
          const x = 525 + Math.cos(rad) * dist;
          const y = 195 + Math.sin(rad) * dist;
          return (
            <g key={i} transform={`translate(${x}, ${y})`} opacity={sp}>
              <g transform={`scale(${sp})`}>
                <circle cx={0} cy={0} r={32} fill={`${ind.color}10`} stroke={ind.color} strokeWidth={2} />
                <text x={0} y={4} textAnchor="middle" fontSize={14} fontWeight={700} fill={ind.color}>{ind.label}</text>
              </g>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};