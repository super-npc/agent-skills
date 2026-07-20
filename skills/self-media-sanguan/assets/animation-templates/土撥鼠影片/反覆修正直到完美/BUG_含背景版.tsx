import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const BUG-FIX-LOOP-209-DURATION-FRAMES = 240;

const ISSUES = [
  { problem: "有 Bug", solution: "請修復", color: "#EF4444", solutionColor: "#10B981" },
  { problem: "太醜", solution: "請調整設計", color: "#EF4444", solutionColor: "#10B981" },
  { problem: "缺字", solution: "補文字", color: "#EF4444", solutionColor: "#10B981" },
  { problem: "寄信失敗", solution: "確認寄信功能", color: "#EF4444", solutionColor: "#10B981" },
];

export const Scene209-BugFixLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const masterOpacity = Math.min(fadeIn, fadeOut);

  const titleSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, stiffness: 90 } });

  const rowSprings = ISSUES.map((_, i) =>
    spring({ frame: Math.max(0, frame - 20 - i * 25), fps, config: { damping: 12, stiffness: 80 } })
  );
  const arrowProgs = ISSUES.map((_, i) =>
    interpolate(frame, [45 + i * 25, 60 + i * 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  const solutionSprings = ISSUES.map((_, i) =>
    spring({ frame: Math.max(0, frame - 55 - i * 25), fps, config: { damping: 12, stiffness: 80 } })
  );

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
        反覆<span style={{ color: "#F59E0B" }}>修正</span>直到完美
      </div>
      <div style={{ opacity: titleSpring * 0.4, fontSize: 36, color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif", fontStyle: "italic", marginBottom: 45 }}>
        Iterate until it's right
      </div>

      <svg width={1950} height={720} viewBox="0 0 1300 480">
        {ISSUES.map((issue, i) => {
          const y = i * 110 + 15;
          const rowSp = rowSprings[i];
          const arrProg = arrowProgs[i];
          const solSp = solutionSprings[i];

          return (
            <g key={i}>
              {/* Problem Card */}
              <g transform={`translate(350, ${y})`} opacity={rowSp}>
                <g transform={`scale(${rowSp})`}>
                  <rect x={-250} y={0} width={500} height={85} rx={16} fill={`${issue.color}08`} stroke={issue.color} strokeWidth={3} />
                  <g transform="translate(-200, 42)">
                    <circle cx={0} cy={0} r={22} fill={`${issue.color}15`} stroke={issue.color} strokeWidth={2.5} />
                    <line x1={-6} y1={-8} x2={6} y2={8} stroke={issue.color} strokeWidth={2.5} strokeLinecap="round" />
                    <line x1={6} y1={-8} x2={-6} y2={8} stroke={issue.color} strokeWidth={2.5} strokeLinecap="round" />
                  </g>
                  <text x={-150} y={36} textAnchor="start" fontSize={24} fontWeight={800} fill={issue.color}>{issue.problem}</text>
                  <text x={-150} y={62} textAnchor="start" fontSize={14} fill={`${issue.color}60`} fontFamily="'Inter', sans-serif">Issue detected</text>
                </g>
              </g>

              {/* Arrow */}
              <g opacity={arrProg}>
                <line x1={620} y1={y + 42} x2={620 + 70 * arrProg} y2={y + 42} stroke="rgba(255,255,255,0.3)" strokeWidth={3} strokeDasharray="8 5" />
                {arrProg > 0.8 && <polygon points={`${693},${y + 36} ${705},${y + 42} ${693},${y + 48}`} fill="rgba(255,255,255,0.4)" />}
              </g>

              {/* Solution Card */}
              <g transform={`translate(950, ${y})`} opacity={solSp}>
                <g transform={`scale(${solSp})`}>
                  <rect x={-250} y={0} width={500} height={85} rx={16} fill={`${issue.solutionColor}08`} stroke={issue.solutionColor} strokeWidth={3} />
                  <g transform="translate(-200, 42)">
                    <circle cx={0} cy={0} r={22} fill={`${issue.solutionColor}15`} stroke={issue.solutionColor} strokeWidth={2.5} />
                    <polyline points="-8,0 -3,6 9,-6" fill="none" stroke={issue.solutionColor} strokeWidth={3} strokeLinecap="round" />
                  </g>
                  <text x={-150} y={36} textAnchor="start" fontSize={24} fontWeight={800} fill={issue.solutionColor}>{issue.solution}</text>
                  <text x={-150} y={62} textAnchor="start" fontSize={14} fill={`${issue.solutionColor}60`} fontFamily="'Inter', sans-serif">Prompt to fix</text>
                </g>
              </g>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};