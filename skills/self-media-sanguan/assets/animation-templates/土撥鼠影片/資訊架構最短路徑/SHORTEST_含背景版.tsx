import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

const colors = {
  backgroundGradient: "linear-gradient(135deg, #0A0E14 0%, #131A24 100%)",
  accent: "#00D4AA",
  accentSecondary: "#4DA3FF",
};
const fonts = { main: "'Inter', 'Noto Sans TC', sans-serif" };

const NODES = [
  { x: 160, y: 400, label: "User", type: "start" as const },
  { x: 360, y: 180, label: "", type: "normal" as const },
  { x: 360, y: 400, label: "", type: "normal" as const },
  { x: 360, y: 600, label: "", type: "normal" as const },
  { x: 560, y: 100, label: "", type: "normal" as const },
  { x: 560, y: 280, label: "", type: "normal" as const },
  { x: 560, y: 460, label: "", type: "normal" as const },
  { x: 560, y: 640, label: "", type: "normal" as const },
  { x: 760, y: 180, label: "", type: "normal" as const },
  { x: 760, y: 360, label: "", type: "normal" as const },
  { x: 760, y: 540, label: "", type: "normal" as const },
  { x: 960, y: 120, label: "", type: "normal" as const },
  { x: 960, y: 300, label: "", type: "normal" as const },
  { x: 960, y: 480, label: "", type: "normal" as const },
  { x: 960, y: 660, label: "", type: "normal" as const },
  { x: 1160, y: 200, label: "", type: "normal" as const },
  { x: 1160, y: 400, label: "", type: "normal" as const },
  { x: 1160, y: 580, label: "", type: "normal" as const },
  { x: 1400, y: 400, label: "CTA", type: "goal" as const },
];

const COMPLEX-EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3],
  [1, 4], [1, 5], [2, 5], [2, 6], [3, 6], [3, 7],
  [4, 8], [5, 8], [5, 9], [6, 9], [6, 10], [7, 10],
  [8, 11], [8, 12], [9, 12], [9, 13], [10, 13], [10, 14],
  [11, 15], [12, 15], [12, 16], [13, 16], [13, 17], [14, 17],
  [15, 18], [16, 18], [17, 18],
];

const SHORTEST-PATH-INDICES = [0, 2, 5, 9, 12, 16, 18];
const SHORTEST-EDGES: [number, number][] = [[0, 2], [2, 5], [5, 9], [9, 12], [12, 16], [16, 18]];

export const SHORTEST-PATH-DURATION-FRAMES = 210;

export const Scene91-ShortestPath: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const graphSpring = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 14, mass: 0.8, stiffness: 80 } });
  const graphScale = interpolate(graphSpring, [0, 1], [0.6, 1]);
  const graphOpacity = interpolate(graphSpring, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  const getNodeDelay = (index: number) => {
    const layer = index === 0 ? 0 : index <= 3 ? 1 : index <= 7 ? 2 : index <= 10 ? 3 : index <= 14 ? 4 : index <= 17 ? 5 : 6;
    return 8 + layer * 6;
  };

  const complexFade = interpolate(frame, [70, 100], [1, 0.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const nonShortestNodeFade = interpolate(frame, [70, 100], [1, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const getSegmentProgress = (segIndex: number) => {
    const segStart = 75 + segIndex * 8;
    return interpolate(frame, [segStart, segStart + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };

  const glowPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.5, 1.0]);
  const shortestPathOpacity = interpolate(frame, [72, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const textSpring = spring({ frame: Math.max(0, frame - 130), fps, config: { damping: 10, mass: 0.5, stiffness: 120 } });
  const textScale = interpolate(textSpring, [0, 1], [0.4, 1]);
  const textOpacity = interpolate(textSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  const fadeOut = interpolate(frame, [185, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const isShortestNode = (index: number) => SHORTEST-PATH-INDICES.includes(index);
  const isShortestEdge = (from: number, to: number) => SHORTEST-EDGES.some(([a, b]) => a === from && b === to);

  return (
    <AbsoluteFill style={{ background: colors.backgroundGradient }}>
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: fadeOut }}>
        <div style={{ position: "relative", width: 2340, height: 840, transform: `scale(${graphScale})`, marginBottom: 30 }}>
          <svg width="2340" height="840" viewBox="0 0 1560 760" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="s91-pathGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={colors.accentSecondary} />
                <stop offset="100%" stopColor={colors.accent} />
              </linearGradient>
              <filter id="s91-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {COMPLEX-EDGES.map(([from, to], i) => {
              const fromNode = NODES[from];
              const toNode = NODES[to];
              if (isShortestEdge(from, to)) return null;
              const nodeDelay = Math.max(getNodeDelay(from), getNodeDelay(to));
              const edgeAppear = spring({ frame: Math.max(0, frame - nodeDelay - 3), fps, config: { damping: 12, mass: 0.4, stiffness: 100 } });
              return (
                <line key={`edge-${i}`} x1={fromNode.x} y1={fromNode.y} x2={fromNode.x + (toNode.x - fromNode.x) * edgeAppear} y2={fromNode.y + (toNode.y - fromNode.y) * edgeAppear} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="4 4" opacity={graphOpacity * complexFade * edgeAppear} />
              );
            })}

            {NODES.map((node, i) => {
              if (isShortestNode(i)) return null;
              const delay = getNodeDelay(i);
              const nodeSpring = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 10, mass: 0.4, stiffness: 120 } });
              const ns = interpolate(nodeSpring, [0, 1], [0, 1]);
              return (
                <g key={`node-${i}`} opacity={graphOpacity * nonShortestNodeFade * ns} transform={`translate(${node.x}, ${node.y}) scale(${ns}) translate(${-node.x}, ${-node.y})`}>
                  <circle cx={node.x} cy={node.y} r={12} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                </g>
              );
            })}

            {shortestPathOpacity > 0 && SHORTEST-EDGES.map(([from, to], segIndex) => {
              const fromNode = NODES[from];
              const toNode = NODES[to];
              const progress = getSegmentProgress(segIndex);
              if (progress <= 0) return null;
              const endX = fromNode.x + (toNode.x - fromNode.x) * progress;
              const endY = fromNode.y + (toNode.y - fromNode.y) * progress;
              return (
                <g key={`shortest-edge-${segIndex}`} opacity={shortestPathOpacity}>
                  <line x1={fromNode.x} y1={fromNode.y} x2={endX} y2={endY} stroke={colors.accentSecondary} strokeWidth="12" strokeLinecap="round" opacity={0.15 * glowPulse} filter="url(#s91-glow)" />
                  <line x1={fromNode.x} y1={fromNode.y} x2={endX} y2={endY} stroke="url(#s91-pathGrad)" strokeWidth="3.5" strokeLinecap="round" filter="url(#s91-glow)" opacity={glowPulse} />
                </g>
              );
            })}

            {SHORTEST-PATH-INDICES.map((nodeIndex, i) => {
              const node = NODES[nodeIndex];
              const delay = getNodeDelay(nodeIndex);
              const nodeAppearSpring = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 10, mass: 0.4, stiffness: 120 } });
              const highlightDelay = 75 + i * 8;
              const highlightSpring = spring({ frame: Math.max(0, frame - highlightDelay), fps, config: { damping: 10, mass: 0.5, stiffness: 100 } });
              const isStart = node.type === "start";
              const isGoal = node.type === "goal";
              const radius = isStart || isGoal ? 24 : 14;
              const highlightedRadius = isStart || isGoal ? 28 : 18;
              const currentRadius = interpolate(highlightSpring, [0, 1], [radius, highlightedRadius]);
              const nodeColor = interpolate(highlightSpring, [0, 1], [0, 1]);
              const fillColor = nodeColor > 0.5 ? (isGoal ? `${colors.accent}30` : `${colors.accentSecondary}30`) : "rgba(255,255,255,0.06)";
              const strokeColor = nodeColor > 0.5 ? (isGoal ? colors.accent : colors.accentSecondary) : "rgba(255,255,255,0.25)";
              const ns = interpolate(nodeAppearSpring, [0, 1], [0, 1]);
              return (
                <g key={`shortest-node-${nodeIndex}`} opacity={graphOpacity * ns} transform={`translate(${node.x}, ${node.y}) scale(${ns}) translate(${-node.x}, ${-node.y})`}>
                  <circle cx={node.x} cy={node.y} r={currentRadius} fill={fillColor} stroke={strokeColor} strokeWidth={highlightSpring > 0.5 ? 2.5 : 1.5} />
                  {isStart && <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="14" fontFamily={fonts.main} fontWeight="700" fill={nodeColor > 0.5 ? colors.accentSecondary : "rgba(255,255,255,0.5)"}>User</text>}
                  {isGoal && <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="14" fontFamily={fonts.main} fontWeight="700" fill={nodeColor > 0.5 ? colors.accent : "rgba(255,255,255,0.5)"}>CTA</text>}
                </g>
              );
            })}
          </svg>
        </div>

        {textOpacity > 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: textOpacity, transform: `scale(${textScale})` }}>
            <span style={{ fontSize: 84, fontWeight: 800, fontFamily: fonts.main, letterSpacing: 6, background: `linear-gradient(90deg, ${colors.accentSecondary}, ${colors.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              最短路徑
            </span>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};