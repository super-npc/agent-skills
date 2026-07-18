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

const cards = [
  {
    number: "①",
    text: "Pencil 到底能不能\n加快我的開發速度？",
  },
  {
    number: "②",
    text: "實際用起來\n有哪些限制跟踩雷？",
  },
];

export const TwoFocusScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        fontFamily: "'Noto Sans TC', 'Inter', sans-serif",
      }}
    >
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 60,
          padding: 80,
        }}
      >
        {cards.map((card, index) => {
          const cardStart = index * 10 * fps;
          const localFrame = frame - cardStart;

          const opacity = interpolate(localFrame, [0, 20], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });

          const scale = spring({
            frame: Math.max(0, localFrame),
            fps,
            config: { damping: 14, stiffness: 120 },
          });

          return (
            <div
              key={index}
              style={{
                width: 480,
                height: 480,
                backgroundColor: colors.cardBg,
                border: `2px solid ${colors.border}`,
                borderRadius: 28,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 32,
                opacity,
                transform: `scale(${scale})`,
              }}
            >
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 700,
                  color: colors.accent,
                }}
              >
                {card.number}
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 600,
                  color: colors.text,
                  textAlign: "center",
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                  padding: "0 40px",
                }}
              >
                {card.text}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};