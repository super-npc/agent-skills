import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const colors = {
  background: "#0B0F17",
  text: "#FFFFFF",
  accent: "#4DA3FF",
  dimmed: "rgba(255, 255, 255, 0.6)",
  cardBg: "rgba(255, 255, 255, 0.05)",
  border: "rgba(77, 163, 255, 0.3)",
};

const EX = {
  extrapolateRight: "clamp" as const,
  extrapolateLeft: "clamp" as const,
};

const CheckIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="36" stroke={color} strokeWidth="3" />
    <path d="M24 40l10 12 22-24" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FreeTagIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <rect x="6" y="18" width="68" height="44" rx="10" stroke={color} strokeWidth="3" />
    <text x="40" y="47" textAnchor="middle" fontSize="22" fontWeight="700" fontFamily="Inter, sans-serif" fill={color}>
      FREE
    </text>
  </svg>
);

const HeadsUpIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <path d="M40 8L4 72h72L40 8z" stroke={color} strokeWidth="3" strokeLinejoin="round" />
    <line x1="40" y1="32" x2="40" y2="52" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <circle cx="40" cy="62" r="3" fill={color} />
  </svg>
);

const items = [
  {
    Icon: CheckIcon,
    activeColor: "#27C93F",
    title: "整體效果還是很不錯",
    subtitle: "三個情境都能產出可用的結果",
  },
  {
    Icon: FreeTagIcon,
    activeColor: colors.accent,
    title: "有 Claude Code 會員即可免費使用",
    subtitle: "最高級方案，邊實驗邊開發也沒超過額度",
  },
  {
    Icon: HeadsUpIcon,
    activeColor: "#FFBD2E",
    title: "但使用前你要先知道幾件事",
    subtitle: "有些限制和注意事項…",
  },
];

export const ConclusionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const P1 = 1 * fps;
  const P2 = 8 * fps;
  const P3 = 15 * fps;
  const T = 20;
  const starts = [P1, P2, P3];

  const titleOp = interpolate(frame, [5, 20], [0, 1], EX);

  const PADDING-Y = 200;
  const USABLE = 700;

  const getItemY = (idx: number, total: number) => {
    if (total === 1) return 540;
    if (total === 2) return PADDING-Y + USABLE * (idx === 0 ? 0.35 : 0.65);
    return PADDING-Y + USABLE * (idx === 0 ? 0.2 : idx === 1 ? 0.5 : 0.8);
  };

  const itemYs = items.map((_, i) => {
    if (i === 0) {
      if (frame < P2) return getItemY(0, 1);
      if (frame < P3) return interpolate(frame, [P2, P2 + T], [getItemY(0, 1), getItemY(0, 2)], EX);
      return interpolate(frame, [P3, P3 + T], [getItemY(0, 2), getItemY(0, 3)], EX);
    }
    if (i === 1) {
      if (frame < P3) return getItemY(1, 2);
      return interpolate(frame, [P3, P3 + T], [getItemY(1, 2), getItemY(1, 3)], EX);
    }
    return getItemY(2, 3);
  });

  const titleY = interpolate(frame, [P2, P2 + T, P3, P3 + T], [120, 90, 90, 60], EX);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        fontFamily: "'Noto Sans TC', 'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: titleY,
          width: "100%",
          textAlign: "center",
          opacity: titleOp,
          fontSize: 52,
          fontWeight: 700,
          color: colors.text,
        }}
      >
        實驗結論
      </div>
      {items.map(({ Icon, activeColor, title, subtitle }, i) => {
        const start = starts[i];
        if (frame < start - 5) return null;
        const local = frame - start;
        const rowOp = interpolate(local, [0, 15], [0, 1], EX);
        const iconScale = spring({
          frame: Math.max(0, local),
          fps,
          config: { damping: 12, stiffness: 100 },
        });
        const txtOp = interpolate(local, [10, 25], [0, 1], EX);
        const txtX = interpolate(local, [10, 25], [40, 0], EX);
        let dimOp = 1;
        if (i === 0) dimOp = interpolate(frame, [P2, P2 + T], [1, 0.35], EX);
        if (i === 1) dimOp = interpolate(frame, [P3, P3 + T], [1, 0.35], EX);
        const iconColor = dimOp > 0.9 ? activeColor : colors.dimmed;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              width: "100%",
              top: itemYs[i],
              transform: "translateY(-50%)",
              display: "flex",
              justifyContent: "center",
              opacity: rowOp * dimOp,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 32, width: 760 }}>
              <div
                style={{
                  transform: `scale(${iconScale})`,
                  width: 120,
                  height: 120,
                  borderRadius: 24,
                  backgroundColor: "rgba(77, 163, 255, 0.08)",
                  border: `2px solid ${colors.border}`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={64} color={iconColor} />
              </div>
              <div style={{ opacity: txtOp, transform: `translateX(${txtX}px)` }}>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 600,
                    color: dimOp > 0.9 ? colors.text : colors.dimmed,
                    lineHeight: 1.5,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{ fontSize: 24, fontWeight: 400, color: colors.dimmed, marginTop: 4 }}
                >
                  {subtitle}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};