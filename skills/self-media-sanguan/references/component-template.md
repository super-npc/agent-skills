# ReelsProductCard.tsx 完整模板

这是 `self-media-sanguan` 技能的默认主组件。复制到目标项目的 `src/ReelsProductCard.tsx` 后，按项目需求修改 `USER_NAME`、关键词列表和字幕路径。

```tsx
import React, { useMemo } from "react";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/google-fonts/NotoSansSC";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import subtitles from "./ReelsProductCard/subtitles.json";

const { fontFamily: notoFontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["chinese-simplified"],
  ignoreTooManyRequestsWarning: true,
});

// ── 类型 & 时长 ───────────────────────────────────
type Subtitle = { start: number; end: number; text: string };
const SUBS: Subtitle[] = subtitles;
const FPS = 30;

// 从字幕末尾计算音频时长，也可直接读取音频时长
const LAST_END = SUBS.length > 0 ? SUBS[SUBS.length - 1].end : 1;
export const DURATION_SECONDS = LAST_END;
export const CONTENT_DURATION_FRAMES = Math.ceil(DURATION_SECONDS * FPS);
export const INTRO_DURATION_FRAMES = 120; // 4s
export const OUTRO_DURATION_FRAMES = 180; // 6s
export const DURATION_IN_FRAMES =
  INTRO_DURATION_FRAMES + CONTENT_DURATION_FRAMES + OUTRO_DURATION_FRAMES;

// 关键词高亮：按主题替换
const KEYWORDS = ["分手", "退婚", "彩礼", "隐瞒", "欺骗", "绿茶", "渣男"];
const KEYWORDS_RE = new RegExp(
  `(${KEYWORDS.slice()
    .sort((a, b) => b.length - a.length)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})`,
  "g",
);

// ── 用户信息（已内置）──────────────────────────────
const USER_NAME = "凡间清醒";
const USER_AVATAR = staticFile("avatar.png");

// ── 子组件 ────────────────────────────────────────

const HighlightText: React.FC<{
  text: string;
  frame: number;
  animate?: boolean;
}> = ({ text, frame, animate = false }) => {
  if (!KEYWORDS_RE.test(text)) return <>{text}</>;
  const parts = text.split(KEYWORDS_RE);
  const t = frame * 0.25;

  return (
    <>
      {parts.map((part, i) => {
        if (!KEYWORDS.includes(part)) {
          return <React.Fragment key={i}>{part}</React.Fragment>;
        }
        if (!animate) {
          return (
            <span
              key={i}
              style={{ display: "inline-block", color: "#fbbf24", fontWeight: 800 }}
            >
              {part}
            </span>
          );
        }
        const phase = i * 1.8 + part.length * 0.5;
        const bounce =
          Math.sin(t * 3.2 + phase) * 0.06 +
          Math.sin(t * 5.1 + phase * 1.3) * 0.04 +
          Math.cos(t * 2.4 + phase * 0.7) * 0.03;
        const s = 1.08 + bounce;
        const glowIntensity = 0.5 + 0.35 * Math.sin(t * 4.5 + phase * 0.9);
        const glowBlur = 16 + 10 * Math.sin(t * 3.8 + phase * 1.1);
        const hueShift = Math.sin(t * 2.0 + phase) > 0.3 ? "#facc15" : "#f59e0b";

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: hueShift,
              fontWeight: 900,
              scale: String(s),
              textShadow: `0 0 ${glowBlur}px rgba(250,204,21,${glowIntensity.toFixed(2)})`,
            }}
          >
            {part}
          </span>
        );
      })}
    </>
  );
};

const SubtitleLine: React.FC<{
  text: string;
  fontSize: number;
  opacity: number;
  color: string;
  weight: number;
  animateKeywords?: boolean;
}> = ({ text, fontSize, opacity, color, weight, animateKeywords }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontSize,
        fontWeight: weight,
        color,
        lineHeight: 1.35,
        letterSpacing: 0.8,
        opacity,
        textAlign: "center",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        padding: "8px 0",
      }}
    >
      <HighlightText text={text} frame={frame} animate={animateKeywords} />
    </div>
  );
};

const SubtitleArea: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentTime = frame / FPS;

  const activeIdx = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < SUBS.length; i++) {
      if (currentTime >= SUBS[i].start) idx = i;
      else break;
    }
    return idx;
  }, [currentTime]);

  const active = SUBS[activeIdx];
  const inRange = currentTime >= active.start && currentTime <= active.end;
  const historySubs = useMemo(() => {
    const result: Subtitle[] = [];
    for (let i = activeIdx - 1; i >= 0 && result.length < 2; i--) {
      result.unshift(SUBS[i]);
    }
    return result;
  }, [activeIdx]);
  const previewSubs = useMemo(
    () => SUBS.slice(activeIdx + 1, activeIdx + 3),
    [activeIdx],
  );

  const startFrame = active.start * FPS;
  const endFrame = active.end * FPS;
  const enter = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 22, stiffness: 180 },
  });
  const enterOpacity = interpolate(enter, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const enterY = interpolate(enter, [0, 1], [18, 0], { extrapolateRight: "clamp" });
  const exit = spring({
    frame: frame - (endFrame - 8),
    fps,
    config: { damping: 16, stiffness: 200 },
  });
  const exitOpacity = interpolate(exit, [0, 1], [1, 0], { extrapolateRight: "clamp" });
  const isExiting = frame >= endFrame - 8;
  const activeOpacity = isExiting ? exitOpacity : enterOpacity;

  const charLen = active.text.length;
  const activeFontSize =
    charLen > 35 ? 52 : charLen > 24 ? 66 : charLen > 12 ? 88 : 114;
  const sideFontSize = activeFontSize * 0.38;
  const zoneWidth = width * 0.72;
  const zoneHeight = height * 0.72;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: zoneWidth,
          height: zoneHeight,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "40px 56px",
          gap: 10,
        }}
      >
        <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: 6 }}>
          {historySubs.map((sub, i) => (
            <SubtitleLine
              key={`h-${activeIdx}-${i}`}
              text={sub.text}
              fontSize={sideFontSize}
              opacity={0.3}
              color="#9ca3af"
              weight={400}
            />
          ))}
        </div>

        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{ width: 80, height: 4, borderRadius: 2, background: "#facc15", opacity: activeOpacity }}
          />
          <div style={{ transform: `translateY(${enterY}px)`, opacity: activeOpacity }}>
            {inRange && (
              <SubtitleLine
                text={active.text}
                fontSize={activeFontSize}
                opacity={1}
                color="#f1f5f9"
                weight={800}
                animateKeywords
              />
            )}
          </div>
          <div
            style={{ width: 80, height: 4, borderRadius: 2, background: "#facc15", opacity: activeOpacity }}
          />
        </div>

        <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: 6 }}>
          {previewSubs.map((sub, i) => (
            <SubtitleLine
              key={`p-${activeIdx}-${i}`}
              text={sub.text}
              fontSize={sideFontSize}
              opacity={0.25}
              color="#6b7280"
              weight={400}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const AudioWaveSVG: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const BAR_COUNT = 64;
  const h = 130;
  const barW = Math.max(3, (width - 4) / BAR_COUNT - 2);

  return (
    <svg width={width} height={h} style={{ position: "absolute", bottom: 20, left: 0, opacity: 0.88 }}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
          <stop offset="35%" stopColor="#22d3ee" stopOpacity="0.85" />
          <stop offset="65%" stopColor="#facc15" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
        </linearGradient>
        <filter id="barGlow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        const t = frame * 0.85;
        const phi = i * 0.37;
        const h1 = Math.sin(t * 0.18 + phi) * Math.cos(t * 0.12 + phi * 1.3);
        const h2 = Math.sin(t * 0.26 + phi * 0.7) * 0.7;
        const h3 = Math.cos(t * 0.34 + phi * 1.9) * 0.5;
        const raw = (h1 + h2 + h3) / 2.2 + 0.5;
        const clamped = Math.max(0.08, Math.min(0.95, raw));
        const barH = clamped * h;
        const x = (i * (width - 4)) / BAR_COUNT + 2;
        return (
          <g key={i}>
            <rect x={x} y={h - barH} width={barW} height={barH} rx={barW / 2} fill="url(#barGrad)" filter="url(#barGlow)" />
          </g>
        );
      })}
    </svg>
  );
};

const OpeningTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = spring({ frame, fps, config: { damping: 8, stiffness: 180, mass: 0.6 } });
  const x = interpolate(slide, [0, 1], [-900, 0]);
  const textProgress = spring({ frame: frame - 10, fps, config: { damping: 25, stiffness: 110 } });
  const textScale = interpolate(textProgress, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });
  const textOpacity = interpolate(textProgress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", justifyContent: "flex-start", paddingLeft: 80 }}>
      <div style={{ width: 6, borderRadius: 3, background: "#facc15", flexShrink: 0, alignSelf: "stretch", marginRight: 28, transform: `scaleX(${slide})`, transformOrigin: "left center" }} />
      <div style={{ transform: `translateX(${x}px)`, display: "flex", flexDirection: "column", gap: 14, scale: String(textScale), transformOrigin: "left center", opacity: textOpacity }}>
        <div style={{ fontSize: 72, fontWeight: 900, color: "#ffffff", lineHeight: 1.15, letterSpacing: 2 }}>吃瓜热闻</div>
        <div style={{ fontSize: 30, fontWeight: 400, color: "#facc15", letterSpacing: 6 }}>HOT MELON NEWS</div>
      </div>
    </div>
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = Math.min(frame / CONTENT_DURATION_FRAMES, 1);
  const pct = Math.round(progress * 100);
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "rgba(255,255,255,0.08)" }}>
      <div style={{ height: "100%", width: `${progress * 100}%`, background: "linear-gradient(90deg, #facc15 0%, #f59e0b 70%, #ef4444 100%)", boxShadow: "0 0 10px rgba(250,204,21,0.5)" }} />
      <div style={{ position: "absolute", bottom: -2, left: `${progress * 100}%`, width: 12, height: 12, borderRadius: "50%", background: "#facc15", transform: "translate(-50%, -50%)", opacity: progress > 0.01 ? 1 : 0 }} />
      <div style={{ position: "absolute", right: 16, bottom: 10, fontSize: 13, color: "rgba(250,204,21,0.7)", fontFamily: notoFontFamily, fontWeight: 600 }}>{pct}%</div>
    </div>
  );
};

const BottomBar: React.FC = () => {
  return (
    <div style={{ position: "absolute", top: 124, left: 24, display: "flex", alignItems: "center", gap: 18, opacity: 0.88 }}>
      <div style={{ width: 88, height: 88, borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(250,204,21,0.5)", flexShrink: 0 }}>
        <Img src={USER_AVATAR} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ fontSize: 42, fontWeight: 700, color: "#ffffff", lineHeight: 1.2, fontFamily: notoFontFamily }}>{USER_NAME}</div>
    </div>
  );
};

const BackgroundGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const breathe = 0.55 + 0.18 * Math.sin(frame * 0.015);
  const breathe2 = 0.45 + 0.15 * Math.sin(frame * 0.018 + 1.8);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(250,204,21,0.12) 0%, rgba(249,115,22,0.04) 45%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "8%", left: "50%", width: 700, height: 480, borderRadius: "50%", background: `radial-gradient(ellipse at center, rgba(250,204,21,${breathe.toFixed(2)}) 0%, rgba(245,158,11,0.15) 40%, transparent 72%)`, filter: "blur(32px)", transform: "translate(-50%, -50%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", left: "55%", width: 500, height: 340, borderRadius: "50%", background: `radial-gradient(ellipse at center, rgba(249,115,22,${breathe2.toFixed(2)}) 0%, rgba(239,68,68,0.08) 45%, transparent 70%)`, filter: "blur(24px)", transform: "translate(-50%, 30%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "35%", right: "12%", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle at center, rgba(163,230,53,0.05) 0%, transparent 70%)`, filter: "blur(16px)", pointerEvents: "none" }} />
    </>
  );
};

const PARTICLE_COUNT = 40;
const PARTICLE_COLORS = ["#facc15", "#f59e0b", "#f97316", "#fb923c", "#ef4444"];
const ParticleAmbience: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const seed = i * 137.508;
    const baseX = 400 + 560 * Math.sin(seed * 0.017);
    const baseY = 300 + 400 * Math.cos(seed * 0.023);
    const radiusX = 180 + 220 * ((i * 73) % 100) / 100;
    const radiusY = 120 + 180 * ((i * 47) % 100) / 100;
    const speed = 0.004 + 0.012 * ((i * 59) % 100) / 100;
    const phase = (i * 31) % 360;
    const x = baseX + radiusX * Math.cos(phase + frame * speed);
    const y = baseY + radiusY * Math.sin(phase + frame * speed * 1.3);
    const size = 4 + (i % 4) * 3;
    const opacityBase = 0.25 + 0.35 * Math.sin(frame * 0.015 + i * 0.7);
    const opacity = Math.max(0.08, opacityBase);
    return (
      <div
        key={i}
        style={{
          position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%",
          background: PARTICLE_COLORS[i % PARTICLE_COLORS.length], opacity,
          boxShadow: `0 0 ${size * 4}px ${PARTICLE_COLORS[i % PARTICLE_COLORS.length]}`, pointerEvents: "none",
        }}
      />
    );
  });
  return <>{particles}</>;
};

const IntroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const avatarOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const nameOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const nameY = interpolate(frame, [40, 70], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineScale = interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [90, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0a0a0a", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <div style={{ opacity: avatarOpacity, width: 140, height: 140, borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(250,204,21,0.4)", boxShadow: "0 0 40px rgba(250,204,21,0.15)", marginBottom: 36 }}>
        <Img src={USER_AVATAR} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ opacity: nameOpacity, transform: `translateY(${nameY}px)`, fontSize: 72, color: "#ffffff", fontFamily: notoFontFamily, fontWeight: 700, lineHeight: 1.1, textAlign: "center" }}>{USER_NAME}</div>
      <div style={{ width: 80, height: 2, background: "#facc15", marginTop: 28, marginBottom: 28, transform: `scaleX(${lineScale})`, transformOrigin: "center" }} />
      <div style={{ opacity: taglineOpacity, fontSize: 26, color: "#9ca3af", fontFamily: notoFontFamily, fontWeight: 400, letterSpacing: "0.08em", textAlign: "center" }}>用清醒三观看世界</div>
    </AbsoluteFill>
  );
};

const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const channelSpring = spring({ frame: frame - 10, fps, config: { damping: 22, stiffness: 120 }, durationInFrames: 30 });
  const channelY = interpolate(channelSpring, [0, 1], [60, 0]);
  const channelOpacity = interpolate(channelSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const subSpring = spring({ frame: frame - 40, fps, config: { damping: 16, stiffness: 180 }, durationInFrames: 30 });
  const subScale = interpolate(subSpring, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bellProgress = interpolate(frame, [70, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bellRotate = interpolate(Math.sin(bellProgress * Math.PI * 3), [-1, 1], [-20, 20]);
  const bellOpacity = interpolate(frame, [65, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const likeSpring = spring({ frame: frame - 100, fps, config: { damping: 16, stiffness: 180 }, durationInFrames: 30 });
  const likeScale = interpolate(likeSpring, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hintOpacity = interpolate(frame, [130, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `translateY(${channelY}px)`, opacity: channelOpacity, width: 120, height: 120, borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(250,204,21,0.5)", boxShadow: "0 0 36px rgba(250,204,21,0.18)", marginBottom: 36 }}>
        <Img src={USER_AVATAR} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ transform: `translateY(${channelY}px)`, opacity: channelOpacity, fontSize: 68, fontWeight: 800, color: "#ffffff", fontFamily: notoFontFamily, letterSpacing: "2px", marginBottom: 48 }}>{USER_NAME}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 44 }}>
        <div style={{ transform: `scale(${subScale})`, background: "#ff0000", color: "#ffffff", fontFamily: notoFontFamily, fontWeight: 700, fontSize: 26, borderRadius: 6, padding: "14px 36px", letterSpacing: "2px" }}>订阅</div>
        <div style={{ opacity: bellOpacity, transform: `rotate(${bellRotate}deg)`, fontSize: 48 }}>🔔</div>
        <div style={{ transform: `scale(${likeScale})`, fontSize: 52 }}>👍</div>
      </div>
      <div style={{ opacity: hintOpacity, fontSize: 22, color: "#9ca3af", fontFamily: notoFontFamily, letterSpacing: "1px" }}>记得开启通知，不错过任何新视频</div>
    </AbsoluteFill>
  );
};

export const ReelsProductCardComponent: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ width, height, backgroundColor: "#09090b", fontFamily: notoFontFamily, overflow: "hidden" }}>
      <BackgroundGlow />
      <ParticleAmbience />
      <Sequence name="Intro" durationInFrames={INTRO_DURATION_FRAMES} from={0}>
        <IntroCard />
      </Sequence>
      <Sequence name="Content" durationInFrames={CONTENT_DURATION_FRAMES} from={INTRO_DURATION_FRAMES}>
        <Audio src={staticFile("audio.mp3")} />
        <Sequence name="Opening Title" from={60} durationInFrames={60}>
          <OpeningTitle />
        </Sequence>
        <SubtitleArea />
        <AudioWaveSVG />
        <BottomBar />
        <ProgressBar />
      </Sequence>
      <Sequence name="Outro" durationInFrames={OUTRO_DURATION_FRAMES} from={INTRO_DURATION_FRAMES + CONTENT_DURATION_FRAMES}>
        <OutroCard />
      </Sequence>
    </AbsoluteFill>
  );
};

export default ReelsProductCardComponent;
```

## 自定义点

1. **关键词**：修改 `KEYWORDS` 数组匹配当前主题。
2. **片头标语**：修改 `IntroCard` 最后的标语文字。
3. **片尾 CTA**：修改 `OutroCard` 中的按钮文字和提示语。
4. **颜色主题**：调整 `BackgroundGlow`、`ParticleAmbience`、`ProgressBar` 中的颜色。
5. **时长**：默认片头 4s、片尾 6s，修改 `INTRO_DURATION_FRAMES` / `OUTRO_DURATION_FRAMES`。
