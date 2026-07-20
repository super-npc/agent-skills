import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

const SOURCES = [
  { id: "搜尋引擎", value: 4200, color: "#3b82f6", y: 0.15 },
  { id: "社群媒體", value: 3100, color: "#8b5cf6", y: 0.42 },
  { id: "直接造訪", value: 2300, color: "#10b981", y: 0.65 },
  { id: "其他",    value: 1400, color: "#f59e0b", y: 0.85 },
];

const CATEGORIES = [
  { id: "首頁",   value: 3800, color: "#06b6d4", y: 0.20 },
  { id: "產品頁", value: 4500, color: "#ec4899", y: 0.52 },
  { id: "部落格", value: 2700, color: "#84cc16", y: 0.80 },
];

const FLOWS = [
  { from: "搜尋引擎", to: "首頁",   value: 1800 },
  { from: "搜尋引擎", to: "產品頁", value: 1500 },
  { from: "搜尋引擎", to: "部落格", value: 900 },
  { from: "社群媒體", to: "首頁",   value: 1200 },
  { from: "社群媒體", to: "產品頁", value: 1400 },
  { from: "社群媒體", to: "部落格", value: 500 },
  { from: "直接造訪", to: "首頁",   value: 800 },
  { from: "直接造訪", to: "產品頁", value: 1100 },
  { from: "直接造訪", to: "部落格", value: 400 },
  { from: "其他",    to: "首頁",   value: 0 },
  { from: "其他",    to: "產品頁", value: 500 },
  { from: "其他",    to: "部落格", value: 900 },
];

const W = 1920;
const H = 1080;

const COL-X = { source: 300, category: 960 };
const NODE-W = 180;
const MAX-NODE-H = 200;
const MIN-NODE-H = 30;

const MAX-SOURCE-VALUE = Math.max(...SOURCES.map((s) => s.value));
const MAX-CAT-VALUE = Math.max(...CATEGORIES.map((c) => c.value));

function nodeH(value: number, maxVal: number): number {
  return MIN-NODE-H + ((value / maxVal) * (MAX-NODE-H - MIN-NODE-H));
}

const MAX-FLOW-VALUE = Math.max(...FLOWS.filter((f) => f.value > 0).map((f) => f.value));
const MIN-STROKE = 4;
const MAX-STROKE = 60;

function flowStroke(value: number): number {
  if (value === 0) return 0;
  return MIN-STROKE + ((value / MAX-FLOW-VALUE) * (MAX-STROKE - MIN-STROKE));
}

const SOURCE-NODES = SOURCES.map((s) => ({
  ...s,
  x: COL-X.source,
  cy: s.y * H,
  h: nodeH(s.value, MAX-SOURCE-VALUE),
}));

const CAT-NODES = CATEGORIES.map((c) => ({
  ...c,
  x: COL-X.category,
  cy: c.y * H,
  h: nodeH(c.value, MAX-CAT-VALUE),
}));

const FLOW-PATHS = FLOWS.filter((f) => f.value > 0).map((flow, i) => {
  const src = SOURCE-NODES.find((s) => s.id === flow.from)!;
  const cat = CAT-NODES.find((c) => c.id === flow.to)!;
  const srcColor = src.color;

  const x1 = src.x + NODE-W;
  const y1 = src.cy;
  const x2 = cat.x;
  const y2 = cat.cy;

  const mx = (x1 + x2) / 2;

  const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  const stroke = flowStroke(flow.value);

  return { d, srcColor, stroke, value: flow.value, index: i };
});

export const SankeyDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 30, stiffness: 70 } });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-30, 0]);

  return (
    <AbsoluteFill
      style={{
        fontFamily: "sans-serif",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 700, color: "#ffffff", letterSpacing: "0.05em" }}>
          流量來源分析
        </div>
        <div style={{ marginTop: 8, fontSize: 20, color: "#6b7280", letterSpacing: "0.08em" }}>
          網站流量來源與頁面分佈桑基圖
        </div>
      </div>

      {/* Column labels */}
      {[
        { label: "流量來源", x: COL-X.source + NODE-W / 2 },
        { label: "落地頁面", x: COL-X.category + NODE-W / 2 },
      ].map(({ label, x }) => {
        const labelProgress = spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 30, stiffness: 80 } });
        const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              top: 134,
              left: x - 80,
              width: 160,
              textAlign: "center",
              fontSize: 20,
              fontWeight: 600,
              color: "#6b7280",
              letterSpacing: "0.06em",
              opacity: labelOpacity,
            }}
          >
            {label}
          </div>
        );
      })}

      <svg
        style={{ position: "absolute", left: 0, top: 0, width: W, height: H }}
        viewBox={`0 0 ${W} ${H}`}
      >
        {/* Flow paths */}
        {FLOW-PATHS.map((fp) => {
          const pathStartFrame = 50 + fp.index * 5;
          const pathProgress = spring({
            frame: Math.max(0, frame - pathStartFrame),
            fps,
            config: { damping: 35, stiffness: 55 },
          });
          const pathOpacity = interpolate(pathProgress, [0, 1], [0, 0.5], { extrapolateRight: "clamp" });

          return (
            <path
              key={fp.d}
              d={fp.d}
              fill="none"
              stroke={fp.srcColor}
              strokeWidth={fp.stroke}
              strokeLinecap="round"
              opacity={pathOpacity}
            />
          );
        })}

        {/* Source nodes */}
        {SOURCE-NODES.map((node, i) => {
          const nodeStartFrame = i * 5;
          const nodeProgress = spring({
            frame: Math.max(0, frame - nodeStartFrame),
            fps,
            config: { damping: 20, stiffness: 100 },
          });
          const scale = interpolate(nodeProgress, [0, 1], [0, 1], { extrapolateRight: "clamp" });
          const opacity = interpolate(nodeProgress, [0, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const h = node.h;
          const x = node.x;
          const y = node.cy - (h * scale) / 2;

          return (
            <React.Fragment key={node.id}>
              <rect
                x={x}
                y={y}
                width={NODE-W}
                height={h * scale}
                rx={8}
                fill={node.color}
                opacity={opacity}
                filter={`drop-shadow(0 0 12px ${node.color}88)`}
              />
              <text
                x={x - 16}
                y={node.cy + 7}
                textAnchor="end"
                fill="#e5e7eb"
                fontSize={20}
                fontWeight={600}
                opacity={opacity}
                fontFamily="sans-serif"
              >
                {node.id}
              </text>
              <text
                x={x - 16}
                y={node.cy + 28}
                textAnchor="end"
                fill="#9ca3af"
                fontSize={16}
                opacity={opacity}
                fontFamily="sans-serif"
              >
                {node.value.toLocaleString()}
              </text>
            </React.Fragment>
          );
        })}

        {/* Category nodes */}
        {CAT-NODES.map((node, i) => {
          const nodeStartFrame = 25 + i * 5;
          const nodeProgress = spring({
            frame: Math.max(0, frame - nodeStartFrame),
            fps,
            config: { damping: 20, stiffness: 100 },
          });
          const scale = interpolate(nodeProgress, [0, 1], [0, 1], { extrapolateRight: "clamp" });
          const opacity = interpolate(nodeProgress, [0, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const h = node.h;
          const x = node.x;
          const y = node.cy - (h * scale) / 2;

          return (
            <React.Fragment key={node.id}>
              <rect
                x={x}
                y={y}
                width={NODE-W}
                height={h * scale}
                rx={8}
                fill={node.color}
                opacity={opacity}
                filter={`drop-shadow(0 0 12px ${node.color}88)`}
              />
              <text
                x={x + NODE-W + 16}
                y={node.cy + 7}
                textAnchor="start"
                fill="#e5e7eb"
                fontSize={20}
                fontWeight={600}
                opacity={opacity}
                fontFamily="sans-serif"
              >
                {node.id}
              </text>
              <text
                x={x + NODE-W + 16}
                y={node.cy + 28}
                textAnchor="start"
                fill="#9ca3af"
                fontSize={16}
                opacity={opacity}
                fontFamily="sans-serif"
              >
                {node.value.toLocaleString()}
              </text>
            </React.Fragment>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};