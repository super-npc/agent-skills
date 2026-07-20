import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const GENERIC-MEANS-LACKING-DURATION-FRAMES = 180;

const ABILITIES = [
  { label: "速度", en: "Speed" },
  { label: "精準度", en: "Accuracy" },
  { label: "深度", en: "Depth" },
  { label: "客製化", en: "Custom" },
  { label: "體驗", en: "UX" },
  { label: "信任", en: "Trust" },
];

const ABILITY-VALUES = [0.55, 0.50, 0.60, 0.45, 0.55, 0.50];

export const Scene220-GenericMeansLacking: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });
  const radarSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 12, stiffness: 70 } });
  const fillProg = interpolate(frame, [35, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelSprings = ABILITIES.map((_, i) =>
    spring({ frame: Math.max(0, frame - 50 - i * 8), fps, config: { damping: 12, stiffness: 80 } })
  );
  const gapSpring = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 10, stiffness: 80 } });

  const R = 130;
  const cx = 525;
  const cy = 200;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * R * value, y: cy + Math.sin(angle) * R * value };
  };

  const outerPoints = ABILITIES.map((_, i) => getPoint(i, 1));
  const outerPath = outerPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
  const midPoints = ABILITIES.map((_, i) => getPoint(i, 0.6));
  const midPath = midPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
  const innerPoints = ABILITIES.map((_, i) => getPoint(i, 0.3));
  const innerPath = innerPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
  const valuePoints = ABILITIES.map((_, i) => getPoint(i, ABILITY-VALUES[i] * fillProg));
  const valuePath = valuePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

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
        通用 = 什麼都<span style={{ color: "#EF4444" }}>缺了一點</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 30, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 45 }}>
        Generic means lacking in everything — can't truly solve problems
      </div>

      <svg width={1575} height={600} viewBox="0 0 1050 400">
        <g opacity={radarSpring}>
          <path d={outerPath} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />
          <path d={midPath} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
          <path d={innerPath} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
          {ABILITIES.map((_, i) => {
            const p = getPoint(i, 1);
            return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />;
          })}
        </g>

        {fillProg > 0 && <path d={valuePath} fill="rgba(245,158,11,0.12)" stroke="#F59E0B" strokeWidth={2.5} />}

        {valuePoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill="#F59E0B" opacity={fillProg > 0.3 ? 1 : 0} />
        ))}

        {ABILITIES.map((_, i) => {
          const vp = getPoint(i, ABILITY-VALUES[i]);
          const op = getPoint(i, 1);
          return <line key={i} x1={vp.x} y1={vp.y} x2={op.x} y2={op.y} stroke="#EF4444" strokeWidth={2} strokeDasharray="4 3" opacity={gapSpring * 0.6} />;
        })}

        {ABILITIES.map((a, i) => {
          const sp = labelSprings[i];
          const p = getPoint(i, 1.25);
          return (
            <g key={i} opacity={sp}>
              <text x={p.x} y={p.y - 2} textAnchor="middle" fontSize={16} fontWeight={700} fill="#F59E0B">{a.label}</text>
              <text x={p.x} y={p.y + 15} textAnchor="middle" fontSize={11} fill="rgba(245,158,11,0.4)" fontFamily="'Inter', sans-serif">{a.en}</text>
            </g>
          );
        })}

        {ABILITIES.map((_, i) => {
          const p = getPoint(i, ABILITY-VALUES[i] + 0.12);
          const pct = Math.round(ABILITY-VALUES[i] * 100);
          return (
            <text key={i} x={p.x} y={p.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#EF4444" opacity={gapSpring * 0.8} fontFamily="'Inter', sans-serif">{pct}%</text>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};