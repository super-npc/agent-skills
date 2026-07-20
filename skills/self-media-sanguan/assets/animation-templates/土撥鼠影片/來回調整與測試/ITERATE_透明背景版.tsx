import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const ITERATE-TWO-DAYS-213-DURATION-FRAMES = 210;

const STEPS = [
  { zh: "開發", en: "Code", color: "#4DA3FF" },
  { zh: "測試", en: "Test", color: "#F59E0B" },
  { zh: "修正", en: "Fix", color: "#EF4444" },
  { zh: "部署", en: "Deploy", color: "#10B981" },
];

export const Scene213-IterateTwoDays: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [190, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });

  const stepSprings = STEPS.map((_, i) =>
    spring({ frame: Math.max(0, frame - 20 - i * 12), fps, config: { damping: 12, stiffness: 80 } })
  );
  const arrowProgs = STEPS.map((_, i) =>
    interpolate(frame, [32 + i * 12, 44 + i * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  const loopProg = interpolate(frame, [80, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cycleSpeed = 5;
  const highlightIdx = frame > 80 ? Math.floor((frame - 80) / cycleSpeed) % STEPS.length : -1;
  const iterCount = frame > 80 ? Math.min(Math.floor((frame - 80) / (cycleSpeed * STEPS.length)) + 1, 15) : 0;

  const badgeSpring = spring({ frame: Math.max(0, frame - 145), fps, config: { damping: 10, stiffness: 90 } });

  const cx = 650;
  const cy = 210;
  const rx = 280;
  const ry = 130;

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
        來回<span style={{ color: "#F59E0B" }}>調整</span>與<span style={{ color: "#4DA3FF" }}>測試</span>
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 36, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 45 }}>
        Iterate, test, fix — repeat until done
      </div>

      <svg width={1950} height={765} viewBox="0 0 1300 510">
        {STEPS.map((step, i) => {
          const sp = stepSprings[i];
          const angles = [-90, 0, 90, 180];
          const angle = (angles[i] * Math.PI) / 180;
          const x = cx + rx * Math.cos(angle);
          const y = cy + ry * Math.sin(angle);
          const isHighlighted = highlightIdx === i;

          return (
            <g key={i}>
              <g transform={`translate(${x}, ${y})`} opacity={sp}>
                <g transform={`scale(${sp})`}>
                  <rect x={-85} y={-50} width={170} height={100} rx={18}
                    fill={isHighlighted ? `${step.color}15` : `${step.color}06`}
                    stroke={step.color} strokeWidth={isHighlighted ? 4 : 2.5} />
                  <text x={0} y={8} textAnchor="middle" fontSize={20} fontWeight={800} fill={step.color}>{step.zh}</text>
                  <text x={0} y={28} textAnchor="middle" fontSize={12} fill={`${step.color}60`} fontFamily="'Inter', sans-serif">{step.en}</text>
                </g>
              </g>

              {i < STEPS.length - 1 && (
                <g opacity={arrowProgs[i]}>
                  {i === 0 && (
                    <path d={`M${cx + 85} ${cy - ry + 15} Q${cx + rx - 30} ${cy - ry + 30} ${cx + rx - 15} ${cy - 50}`}
                      fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={2.5} strokeDasharray="6 4" />
                  )}
                  {i === 1 && (
                    <path d={`M${cx + rx - 15} ${cy + 50} Q${cx + rx - 30} ${cy + ry - 30} ${cx + 85} ${cy + ry - 15}`}
                      fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={2.5} strokeDasharray="6 4" />
                  )}
                  {i === 2 && (
                    <path d={`M${cx - 85} ${cy + ry - 15} Q${cx - rx + 30} ${cy + ry - 30} ${cx - rx + 15} ${cy + 50}`}
                      fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={2.5} strokeDasharray="6 4" />
                  )}
                </g>
              )}
            </g>
          );
        })}

        <g opacity={loopProg}>
          <path d={`M${cx - rx + 15} ${cy - 50} Q${cx - rx + 30} ${cy - ry + 30} ${cx - 85} ${cy - ry + 15}`}
            fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={2.5} strokeDasharray="6 4" />
        </g>

        {loopProg > 0.5 && (
          <g transform={`translate(${cx}, ${cy})`} opacity={loopProg}>
            <g transform={`rotate(${frame * 6})`}>
              <circle cx={0} cy={0} r={35} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={2.5} strokeDasharray="40 30" />
            </g>
            <text x={0} y={-5} textAnchor="middle" fontSize={28} fontWeight={900} fill="#FFFFFF" fontFamily="'Inter', sans-serif">×{iterCount}</text>
            <text x={0} y={18} textAnchor="middle" fontSize={13} fill="rgba(255,255,255,0.35)" fontFamily="'Inter', sans-serif">iterations</text>
          </g>
        )}

        <g transform={`translate(${cx}, 450)`} opacity={badgeSpring}>
          <g transform={`scale(${badgeSpring})`}>
            <rect x={-200} y={-24} width={400} height={60} rx={30} fill="rgba(167,139,250,0.08)" stroke="#A78BFA" strokeWidth={3} />
            <text x={0} y={10} textAnchor="middle" fontSize={26} fontWeight={800} fill="#A78BFA">⚡ 約兩天完成</text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};