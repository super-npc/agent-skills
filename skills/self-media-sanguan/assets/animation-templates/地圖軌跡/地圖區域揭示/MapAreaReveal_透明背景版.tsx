import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import React from "react";

// 投影函數
const GEO = { lngMin: 119.5, lngMax: 122.5, latMin: 21.7, latMax: 25.5 };
const MAP = { x: 200, y: 60, w: 500, h: 760 };

const project = (lat: number, lng: number) => ({
  x: MAP.x + ((lng - GEO.lngMin) / (GEO.lngMax - GEO.lngMin)) * MAP.w,
  y: MAP.y + ((GEO.latMax - lat) / (GEO.latMax - GEO.latMin)) * MAP.h,
});

// 台灣輪廓
const TAIWAN-OUTLINE: [number, number][] = [
  [25.3, 121.54], [25.13, 121.74], [25.0, 122.0], [24.87, 121.83],
  [24.72, 121.77], [24.6, 121.87], [23.98, 121.61], [23.55, 121.55],
  [23.09, 121.37], [22.75, 121.1], [22.3, 120.9], [21.9, 120.85],
  [22.17, 120.7], [22.38, 120.49], [22.62, 120.26], [23.05, 120.1],
  [23.42, 120.12], [23.71, 120.29], [23.96, 120.43], [24.2, 120.57],
  [24.56, 120.78], [24.85, 120.88], [25.0, 121.35], [25.17, 121.43],
  [25.3, 121.54],
];

const taiwanPath = TAIWAN-OUTLINE.map(([lat, lng], i) => {
  const p = project(lat, lng);
  return `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
}).join(" ") + " Z";

// 5 大區域定義
const REGIONS = [
  {
    id: "north",
    name: "北部",
    color: "#3b82f6",
    glowColor: "#60a5fa",
    startFrame: 0,
    // 中心位置（地理座標）
    centerLat: 25.0,
    centerLng: 121.4,
    // 橢圓覆蓋範圍（SVG 空間）
    rx: 100,
    ry: 70,
    cities: [
      { name: "台北", lat: 25.033, lng: 121.565 },
      { name: "基隆", lat: 25.128, lng: 121.739 },
      { name: "桃園", lat: 24.994, lng: 121.301 },
      { name: "新竹", lat: 24.807, lng: 120.969 },
    ],
  },
  {
    id: "central",
    name: "中部",
    color: "#22c55e",
    glowColor: "#4ade80",
    startFrame: 25,
    centerLat: 24.1,
    centerLng: 120.7,
    rx: 100,
    ry: 90,
    cities: [
      { name: "台中", lat: 24.148, lng: 120.674 },
      { name: "彰化", lat: 24.052, lng: 120.516 },
      { name: "南投", lat: 23.961, lng: 120.972 },
    ],
  },
  {
    id: "south",
    name: "南部",
    color: "#f97316",
    glowColor: "#fb923c",
    startFrame: 50,
    centerLat: 22.85,
    centerLng: 120.35,
    rx: 100,
    ry: 100,
    cities: [
      { name: "台南", lat: 23.0, lng: 120.227 },
      { name: "高雄", lat: 22.627, lng: 120.301 },
      { name: "屏東", lat: 22.671, lng: 120.488 },
    ],
  },
  {
    id: "east",
    name: "東部",
    color: "#a855f7",
    glowColor: "#c084fc",
    startFrame: 75,
    centerLat: 23.9,
    centerLng: 121.6,
    rx: 55,
    ry: 130,
    cities: [
      { name: "花蓮", lat: 23.991, lng: 121.611 },
      { name: "台東", lat: 22.798, lng: 121.1 },
    ],
  },
  {
    id: "offshore",
    name: "外島",
    color: "#ef4444",
    glowColor: "#f87171",
    startFrame: 100,
    centerLat: 23.5,
    centerLng: 119.5,
    rx: 0,
    ry: 0,
    cities: [],
    // 外島用小圓圈象徵，位置在地圖左側
    isOffshore: true,
  },
].map((r) => ({
  ...r,
  center: project(r.centerLat, r.centerLng),
  cities: r.cities.map((c) => ({ ...c, ...project(c.lat, c.lng) })),
}));

// 外島象徵位置（在台灣地圖左側）
const OFFSHORE-ICONS = [
  { name: "澎湖", x: 90, y: 530 },
  { name: "金門", x: 55, y: 460 },
];

export const MapAreaReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        fontFamily: "sans-serif",
      }}
    >
      {/* 標題 */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ color: "#64748b", fontSize: 15, letterSpacing: 4, marginBottom: 6 }}>
          地理區域揭示
        </div>
        <div style={{ color: "#f1f5f9", fontSize: 44, fontWeight: 800, letterSpacing: 6 }}>
          台灣五大區域
        </div>
      </div>

      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <pattern id="marGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0a1828" strokeWidth="1" />
          </pattern>
          {REGIONS.map((r) => (
            <radialGradient key={r.id} id={`rgrad-${r.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={r.color} stopOpacity="0.55" />
              <stop offset="100%" stopColor={r.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* 背景格線 */}
        <rect width="1920" height="1080" fill="url(#marGrid)" />

        {/* 台灣輪廓 */}
        <path
          d={taiwanPath}
          fill="#0f2040"
          stroke="#1e3a5f"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* 區域色塊（依序揭示） */}
        {REGIONS.filter((r) => !r.isOffshore).map((region) => {
          const sp = spring({
            frame: frame - region.startFrame,
            fps,
            config: { damping: 20, stiffness: 140 },
          });
          const areaOpacity = interpolate(sp, [0, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const areaScale = interpolate(sp, [0, 1], [0.3, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <g key={region.id}>
              {/* 漸層橢圓色塊 */}
              <ellipse
                cx={region.center.x}
                cy={region.center.y}
                rx={(region as any).rx * areaScale}
                ry={(region as any).ry * areaScale}
                fill={`url(#rgrad-${region.id})`}
                opacity={areaOpacity}
              />
              {/* 輪廓線 */}
              <ellipse
                cx={region.center.x}
                cy={region.center.y}
                rx={(region as any).rx * areaScale}
                ry={(region as any).ry * areaScale}
                fill="none"
                stroke={region.color}
                strokeWidth="1.5"
                opacity={areaOpacity * 0.6}
                strokeDasharray="6 4"
              />
            </g>
          );
        })}

        {/* 城市標記點（依序彈出） */}
        {REGIONS.filter((r) => !r.isOffshore).map((region) =>
          (region.cities as any[]).map((city, ci) => {
            const cityDelay = region.startFrame + ci * 8;
            const sp = spring({
              frame: frame - cityDelay,
              fps,
              config: { damping: 16, stiffness: 220 },
            });
            const scale = interpolate(sp, [0, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const labelOpacity = interpolate(frame - cityDelay - 5, [0, 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <g key={city.name} transform={`translate(${city.x}, ${city.y})`}>
                <circle
                  r={8 * scale}
                  fill={region.color}
                  stroke="#050d1a"
                  strokeWidth="2"
                  style={{ filter: scale > 0.8 ? `drop-shadow(0 0 6px ${region.glowColor})` : "none" }}
                />
                <text
                  x={city.x > 400 ? -16 : 14}
                  y="5"
                  fill="#f1f5f9"
                  fontSize="17"
                  fontWeight="600"
                  textAnchor={city.x > 400 ? "end" : "start"}
                  opacity={labelOpacity}
                >
                  {city.name}
                </text>
              </g>
            );
          })
        )}

        {/* 外島圖示（左側小圓圈） */}
        {OFFSHORE-ICONS.map((icon, i) => {
          const delay = REGIONS.find((r) => r.isOffshore)!.startFrame + i * 12;
          const sp = spring({
            frame: frame - delay,
            fps,
            config: { damping: 16, stiffness: 220 },
          });
          const scale = interpolate(sp, [0, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const labelOpacity = interpolate(frame - delay - 5, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const offshoreColor = "#ef4444";
          const offshoreGlow = "#f87171";

          return (
            <g key={icon.name} transform={`translate(${icon.x}, ${icon.y})`}>
              {/* 虛線連接到台灣 */}
              <line
                x1={0}
                y1={0}
                x2={MAP.x - icon.x + 20}
                y2={0}
                stroke={offshoreColor}
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity={labelOpacity * 0.4}
              />
              {/* 圓圈 */}
              <circle
                r={18 * scale}
                fill="none"
                stroke={offshoreColor}
                strokeWidth="2"
                opacity={scale}
                style={{ filter: scale > 0.8 ? `drop-shadow(0 0 6px ${offshoreGlow})` : "none" }}
              />
              <circle
                r={6 * scale}
                fill={offshoreColor}
                style={{ filter: scale > 0.8 ? `drop-shadow(0 0 4px ${offshoreGlow})` : "none" }}
              />
              <text
                x={0}
                y={-24}
                textAnchor="middle"
                fill="#f1f5f9"
                fontSize="15"
                fontWeight="600"
                opacity={labelOpacity}
              >
                {icon.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 右側圖例 */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          transform: "translateY(-50%)",
          width: 280,
          background: "rgba(5, 13, 26, 0.92)",
          border: "1px solid #1e3a5f",
          borderRadius: 14,
          padding: "28px 32px",
          opacity: interpolate(frame, [10, 40], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ color: "#64748b", fontSize: 13, letterSpacing: 3, marginBottom: 20 }}>
          區域分類
        </div>
        {REGIONS.map((region) => {
          const sp = spring({
            frame: frame - region.startFrame,
            fps,
            config: { damping: 20, stiffness: 140 },
          });
          const itemOpacity = interpolate(sp, [0, 0.5], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={region.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 18,
                opacity: itemOpacity,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: region.color,
                  boxShadow: `0 0 6px ${region.glowColor}`,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: "#e2e8f0", fontSize: 20, fontWeight: 600 }}>
                {region.name}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};