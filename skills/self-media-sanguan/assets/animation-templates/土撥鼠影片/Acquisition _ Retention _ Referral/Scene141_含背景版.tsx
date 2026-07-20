import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

const MapPinIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <path d={`M ${x} ${y - 16} C ${x - 12} ${y - 16} ${x - 12} ${y - 2} ${x} ${y + 8}`} fill="none" stroke="#EF4444" strokeWidth={2} />
    <path d={`M ${x} ${y - 16} C ${x + 12} ${y - 16} ${x + 12} ${y - 2} ${x} ${y + 8}`} fill="none" stroke="#EF4444" strokeWidth={2} />
    <circle cx={x} cy={y - 8} r={4} fill="#EF4444" opacity={0.6} />
  </g>
);

const NewsIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 14} y={y - 14} width={28} height={28} rx={3} fill="none" stroke="#A78BFA" strokeWidth={2} />
    <line x1={x - 8} y1={y - 6} x2={x + 8} y2={y - 6} stroke="#A78BFA" strokeWidth={2} strokeLinecap="round" />
    <line x1={x - 8} y1={y + 1} x2={x + 4} y2={y + 1} stroke="#A78BFA" strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />
    <line x1={x - 8} y1={y + 7} x2={x + 8} y2={y + 7} stroke="#A78BFA" strokeWidth={1.5} strokeLinecap="round" opacity={0.5} />
  </g>
);

const InfluencerIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 10} y={y - 16} width={20} height={32} rx={4} fill="none" stroke="#EC4899" strokeWidth={2} />
    <circle cx={x} cy={y - 2} r={5} fill="none" stroke="#EC4899" strokeWidth={1.5} />
    <circle cx={x} cy={y - 2} r={2} fill="#EC4899" />
  </g>
);

const BloggerIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 16} y={y - 12} width={32} height={20} rx={2} fill="none" stroke="#10B981" strokeWidth={2} />
    <line x1={x - 20} y1={y + 12} x2={x + 20} y2={y + 12} stroke="#10B981" strokeWidth={2.5} strokeLinecap="round" />
  </g>
);

const StampCardIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 16} y={y - 12} width={32} height={24} rx={3} fill="none" stroke="#10B981" strokeWidth={2} />
    {[0, 1, 2, 3].map((j) => (
      <circle key={j} cx={x - 9 + j * 6} cy={y} r={2.5} fill={j < 3 ? "#10B981" : "none"} stroke="#10B981" strokeWidth={1} />
    ))}
  </g>
);

const SeasonalIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <path d={`M ${x} ${y - 12} L ${x + 4} ${y - 3} L ${x + 12} ${y - 3} L ${x + 6} ${y + 3} L ${x + 8} ${y + 12} L ${x} ${y + 7} L ${x - 8} ${y + 12} L ${x - 6} ${y + 3} L ${x - 12} ${y - 3} L ${x - 4} ${y - 3} Z`} fill="rgba(245,158,11,0.2)" stroke="#F59E0B" strokeWidth={2} strokeLinejoin="round" />
  </g>
);

const GiftIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 14} y={y - 6} width={28} height={20} rx={3} fill="none" stroke="#F59E0B" strokeWidth={2} />
    <rect x={x - 16} y={y - 10} width={32} height={8} rx={2} fill="none" stroke="#F59E0B" strokeWidth={2} />
    <line x1={x} y1={y - 10} x2={x} y2={y + 14} stroke="#F59E0B" strokeWidth={1.5} />
  </g>
);

const GroupIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <circle cx={x - 8} cy={y - 8} r={6} fill="none" stroke="#F59E0B" strokeWidth={1.5} />
    <circle cx={x + 8} cy={y - 8} r={6} fill="none" stroke="#F59E0B" strokeWidth={1.5} />
    <circle cx={x} cy={y + 4} r={6} fill="none" stroke="#F59E0B" strokeWidth={1.5} />
  </g>
);

const PhotoWallIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 14} y={y - 14} width={28} height={28} rx={3} fill="none" stroke="#EC4899" strokeWidth={2} />
    <circle cx={x - 4} cy={y - 4} r={4} fill="none" stroke="#EC4899" strokeWidth={1.5} />
    <path d={`M ${x - 14} ${y + 8} L ${x - 4} ${y} L ${x + 4} ${y + 6} L ${x + 14} ${y - 2}`} fill="none" stroke="#EC4899" strokeWidth={1.5} strokeLinecap="round" />
  </g>
);

const SharePostIcon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x - 14} y={y - 12} width={28} height={24} rx={4} fill="none" stroke="#4DA3FF" strokeWidth={2} />
    <path d={`M ${x + 4} ${y - 4} L ${x + 10} ${y} L ${x + 4} ${y + 4}`} fill="none" stroke="#4DA3FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <line x1={x - 8} y1={y} x2={x + 8} y2={y} stroke="#4DA3FF" strokeWidth={2} strokeLinecap="round" />
  </g>
);

const CARDS = [
  {
    title: "Acquisition",
    subtitle: "怎麼讓人知道",
    color: "#4DA3FF",
    delay: 10,
    icons: [
      { Icon: MapPinIcon, zh: "Google Map" },
      { Icon: NewsIcon, zh: "新聞報導" },
      { Icon: InfluencerIcon, zh: "網紅分享" },
      { Icon: BloggerIcon, zh: "部落客推薦" },
    ],
  },
  {
    title: "Retention",
    subtitle: "怎麼讓客人回來",
    color: "#10B981",
    delay: 80,
    icons: [
      { Icon: StampCardIcon, zh: "集點卡" },
      { Icon: SeasonalIcon, zh: "季節限定" },
      { Icon: GiftIcon, zh: "其他優惠" },
    ],
  },
  {
    title: "Referral",
    subtitle: "怎麼讓客人拉客人",
    color: "#F59E0B",
    delay: 145,
    icons: [
      { Icon: GroupIcon, zh: "多人套餐" },
      { Icon: PhotoWallIcon, zh: "打卡牆" },
      { Icon: SharePostIcon, zh: "發文送小菜" },
    ],
  },
];

export const Scene141-AcqRetRef: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [280, 300], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const CARD-W = 530;
  const CARD-H = 620;
  const GAP = 45;
  const totalW = CARD-W * 3 + GAP * 2;
  const startX = (1920 - totalW) / 2;
  const cardY = (1080 - CARD-H) / 2;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0A0E14 0%, #111825 100%)", opacity: masterOpacity, fontFamily: fonts.main }}>
      {CARDS.map((card, ci) => {
        const cardSpring = spring({ frame: Math.max(0, frame - card.delay), fps, config: { damping: 12, stiffness: 80 } });
        const left = startX + ci * (CARD-W + GAP);

        return (
          <div key={ci} style={{ position: "absolute", left, top: cardY, width: CARD-W, height: CARD-H, opacity: cardSpring, transform: `translateY(${(1 - cardSpring) * 40}px)` }}>
            <div style={{ position: "absolute", width: "100%", height: "100%", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: `1.5px solid ${card.color}33`, boxShadow: `0 8px 32px rgba(0,0,0,0.3)` }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: CARD-W * cardSpring, height: 4, background: card.color, borderRadius: "16px 16px 0 0", opacity: 0.7 }} />
            <div style={{ position: "absolute", left: 28, top: 28, width: 44, height: 44, borderRadius: "50%", background: `${card.color}20`, border: `2px solid ${card.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 33, fontWeight: 700, color: card.color }}>
              {ci + 1}
            </div>
            {(() => {
              const titleSpring = spring({ frame: Math.max(0, frame - card.delay - 5), fps, config: { damping: 14, stiffness: 100 } });
              return <div style={{ position: "absolute", left: 86, top: 24, opacity: titleSpring, fontSize: 54, fontWeight: 700, color: card.color, letterSpacing: 1 }}>{card.title}</div>;
            })()}
            {(() => {
              const subSpring = spring({ frame: Math.max(0, frame - card.delay - 10), fps, config: { damping: 14, stiffness: 100 } });
              return <div style={{ position: "absolute", left: 86, top: 88, opacity: subSpring * 0.5, fontSize: 33, fontWeight: 400, color: "#FFFFFF" }}>{card.subtitle}</div>;
            })()}
            <div style={{ position: "absolute", left: 28, top: 130, width: CARD-W - 56, height: 1, background: `${card.color}20` }} />
            {card.icons.map((item, ii) => {
              const iconSpring = spring({ frame: Math.max(0, frame - card.delay - 15 - ii * 8), fps, config: { damping: 12, stiffness: 100 } });
              const iconY = 150 + ii * 120;
              return (
                <div key={ii} style={{ position: "absolute", left: 0, top: iconY, width: CARD-W, height: 100, opacity: iconSpring, transform: `translateX(${(1 - iconSpring) * 20}px)`, display: "flex", alignItems: "center" }}>
                  <div style={{ marginLeft: 40, width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width={75} height={75} viewBox="-25 -25 50 50">
                      <item.Icon x={0} y={0} />
                    </svg>
                  </div>
                  <div style={{ marginLeft: 16 }}>
                    <div style={{ fontSize: 39, fontWeight: 600, color: "rgba(255,255,255,0.75)", lineHeight: 1.2 }}>{item.zh}</div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};