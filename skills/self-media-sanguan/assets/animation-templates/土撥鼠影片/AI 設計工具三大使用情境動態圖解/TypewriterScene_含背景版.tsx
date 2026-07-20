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

const LayoutIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <rect x="4" y="8" width="72" height="60" rx="6" stroke={color} strokeWidth="3" />
    <line x1="4" y1="20" x2="76" y2="20" stroke={color} strokeWidth="2" />
    <circle cx="14" cy="14" r="2.5" fill={color} />
    <circle cx="22" cy="14" r="2.5" fill={color} />
    <circle cx="30" cy="14" r="2.5" fill={color} />
    <rect x="10" y="26" width="26" height="14" rx="2" fill={color} opacity="0.8" />
    <rect x="10" y="44" width="26" height="18" rx="2" fill={color} opacity="0.3" />
    <rect x="42" y="26" width="28" height="36" rx="2" stroke={color} strokeWidth="2" strokeDasharray="4 3" opacity="0.5" />
    <path d="M62 12l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill={color} opacity="0.9" />
  </svg>
);

const RestyleIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <rect x="16" y="6" width="40" height="52" rx="4" stroke={color} strokeWidth="3" />
    <line x1="24" y1="18" x2="48" y2="18" stroke={color} strokeWidth="2" opacity="0.5" />
    <line x1="24" y1="26" x2="44" y2="26" stroke={color} strokeWidth="2" opacity="0.5" />
    <line x1="24" y1="34" x2="40" y2="34" stroke={color} strokeWidth="2" opacity="0.5" />
    <rect x="50" y="40" width="20" height="12" rx="3" fill={color} opacity="0.7" />
    <line x1="60" y1="52" x2="60" y2="62" stroke={color} strokeWidth="3" />
    <rect x="54" y="62" width="12" height="14" rx="3" fill={color} opacity="0.9" />
    <circle cx="12" cy="68" r="6" fill={color} opacity="0.3" />
    <circle cx="26" cy="72" r="4" fill={color} opacity="0.6" />
  </svg>
);

const ImageToUiIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <rect x="4" y="12" width="34" height="28" rx="4" stroke={color} strokeWidth="3" />
    <path d="M8 36l8-10 6 6 4-4 8 8H8z" fill={color} opacity="0.3" />
    <circle cx="14" cy="20" r="3" fill={color} opacity="0.5" />
    <path d="M44 26h10" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <path d="M51 21l5 5-5 5" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="42" y="42" width="34" height="30" rx="4" stroke={color} strokeWidth="3" />
    <rect x="46" y="48" width="12" height="4" rx="1" fill={color} opacity="0.7" />
    <rect x="46" y="55" width="26" height="3" rx="1" fill={color} opacity="0.3" />
    <rect x="46" y="61" width="20" height="3" rx="1" fill={color} opacity="0.3" />
    <rect x="46" y="67" width="10" height="3" rx="1" fill={color} opacity="0.5" />
  </svg>
);

const allIcons = [LayoutIcon, RestyleIcon, ImageToUiIcon];

const items = [
  {
    Icon: LayoutIcon,
    lines: ["只有首頁＋元件", "靠 AI 生出其他頁面", "直接生成前端畫面"],
  },
  {
    Icon: RestyleIcon,
    lines: ["拿到完整設計", "用 AI 快速改成想要的風格"],
  },
  {
    Icon: ImageToUiIcon,
    lines: ["沒有 Figma 原稿", "丟參考圖，復刻可操作畫面"],
  },
];

export const TypewriterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const P1 = 2 * fps;
  const P2 = 12 * fps;
  const P3 = 17 * fps;
  const T = 20;

  const ROW-W = 180 * 3 + 120 * 2;
  const ROW-X = (1920 - ROW-W) / 2;
  const P1-CX = [ROW-X + 90, ROW-X + 390, ROW-X + 690];
  const P1-CY = 540;

  const enterOp = interpolate(frame, [5, 20], [0, 1], EX);
  const enterScale = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 9, stiffness: 90 },
  });
  const sideOp = interpolate(frame, [P1, P1 + T], [1, 0], EX);

  const ITEM-CX = 700;
  const PADDING-Y = 140;
  const USABLE = 800;

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

  const icon1CX = interpolate(frame, [P1, P1 + T], [P1-CX[0], ITEM-CX], EX);
  const icon1CY = itemYs[0];
  const icon1Card = interpolate(frame, [P1, P1 + T], [180, 160], EX);
  const icon1Dim = interpolate(frame, [P2, P2 + T], [1, 0.35], EX);

  const t0Left = icon1CX + icon1Card / 2 + 32;
  const t0Local = frame - P1;
  const t0Op = interpolate(t0Local, [10, 25], [0, 1], EX);
  const t0Slide = interpolate(t0Local, [10, 25], [40, 0], EX);
  const t0Dim = interpolate(frame, [P2, P2 + T], [1, 0.35], EX);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        fontFamily: "'Noto Sans TC', 'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      {sideOp > 0 &&
        [1, 2].map((i) => {
          const SideIcon = allIcons[i];
          return (
            <div
              key={`side-${i}`}
              style={{
                position: "absolute",
                left: P1-CX[i],
                top: P1-CY,
                transform: `translate(-50%, -50%) scale(${enterScale})`,
                opacity: enterOp * sideOp,
              }}
            >
              <div
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: 28,
                  backgroundColor: "rgba(77, 163, 255, 0.08)",
                  border: `2px solid ${colors.border}`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SideIcon size={100} color={colors.accent} />
              </div>
            </div>
          );
        })}
      <div
        style={{
          position: "absolute",
          left: icon1CX,
          top: icon1CY,
          transform: `translate(-50%, -50%) scale(${enterScale})`,
          opacity: enterOp * icon1Dim,
        }}
      >
        <div
          style={{
            width: Math.round(icon1Card),
            height: Math.round(icon1Card),
            borderRadius: 28,
            backgroundColor: "rgba(77, 163, 255, 0.08)",
            border: `2px solid ${colors.border}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LayoutIcon size={100} color={colors.accent} />
        </div>
      </div>
      {t0Op > 0 && (
        <div
          style={{
            position: "absolute",
            left: t0Left,
            top: itemYs[0],
            transform: `translateY(-50%) translateX(${t0Slide}px)`,
            opacity: t0Op * t0Dim,
          }}
        >
          {items[0].lines.map((line, j) => (
            <div
              key={j}
              style={{
                fontSize: 36,
                fontWeight: 500,
                color: j === 0 ? colors.text : colors.dimmed,
                lineHeight: 1.7,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}
      {[1, 2].map((idx) => {
        const start = idx === 1 ? P2 : P3;
        if (frame < start - 5) return null;
        const local = frame - start;
        const rowOp = interpolate(local, [0, 15], [0, 1], EX);
        const iconSc = spring({
          frame: Math.max(0, local),
          fps,
          config: { damping: 12, stiffness: 100 },
        });
        const txtOp = interpolate(local, [10, 25], [0, 1], EX);
        const txtSlide = interpolate(local, [10, 25], [40, 0], EX);
        let dim = 1;
        if (idx === 1) dim = interpolate(frame, [P3, P3 + T], [1, 0.35], EX);
        const { Icon, lines } = items[idx];
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: ITEM-CX - 80,
              top: itemYs[idx],
              transform: "translateY(-50%)",
              opacity: rowOp * dim,
              display: "flex",
              alignItems: "center",
              gap: 32,
            }}
          >
            <div
              style={{
                transform: `scale(${iconSc})`,
                width: 160,
                height: 160,
                borderRadius: 28,
                backgroundColor: "rgba(77, 163, 255, 0.08)",
                border: `2px solid ${colors.border}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={100} color={colors.accent} />
            </div>
            <div style={{ opacity: txtOp, transform: `translateX(${txtSlide}px)` }}>
              {lines.map((line, j) => (
                <div
                  key={j}
                  style={{
                    fontSize: 36,
                    fontWeight: 500,
                    color: j === 0 ? colors.text : colors.dimmed,
                    lineHeight: 1.7,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};