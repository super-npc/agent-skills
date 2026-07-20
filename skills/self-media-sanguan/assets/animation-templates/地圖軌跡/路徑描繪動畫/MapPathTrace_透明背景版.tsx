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
const MAP = { x: 200, y: 100, w: 500, h: 760 };

const project = (lat: number, lng: number) => ({
  x: MAP.x + ((lng - GEO.lngMin) / (GEO.lngMax - GEO.lngMin)) * MAP.w,
  y: MAP.y + ((GEO.latMax - lat) / (GEO.latMax - GEO.latMin)) * MAP.h,
});

// 台灣輪廓座標
const TAIWAN-OUTLINE: [number, number][] = [
  [25.3, 121.54],
  [25.13, 121.74],
  [25.0, 122.0],
  [24.87, 121.83],
  [24.72, 121.77],
  [24.6, 121.87],
  [23.98, 121.61],
  [23.55, 121.55],
  [23.09, 121.37],
  [22.75, 121.1],
  [22.3, 120.9],
  [21.9, 120.85],
  [22.17, 120.7],
  [22.38, 120.49],
  [22.62, 120.26],
  [23.05, 120.1],
  [23.42, 120.12],
  [23.71, 120.29],
  [23.96, 120.43],
  [24.2, 120.57],
  [24.56, 120.78],
  [24.85, 120.88],
  [25.0, 121.35],
  [25.17, 121.43],
  [25.3, 121.54],
];

const taiwanPath = TAIWAN-OUTLINE.map(([lat, lng], i) => {
  const p = project(lat, lng);
  return `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
}).join(" ") + " Z";

// 西部走廊城市（含地理座標）
const ROUTE-CITIES = [
  { name: "台北", lat: 25.033, lng: 121.565 },
  { name: "桃園", lat: 24.994, lng: 121.301 },
  { name: "新竹", lat: 24.807, lng: 120.969 },
  { name: "台中", lat: 24.148, lng: 120.674 },
  { name: "嘉義", lat: 23.48, lng: 120.449 },
  { name: "台南", lat: 23.0, lng: 120.227 },
  { name: "高雄", lat: 22.627, lng: 120.301 },
].map((c) => ({ ...c, ...project(c.lat, c.lng) }));

// 建立 polyline 點字串
const polylinePoints = ROUTE-CITIES.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");

// 估算路徑總長度（相鄰城市間距離之和）
const TOTAL-PATH-LENGTH = ROUTE-CITIES.reduce((total, c, i) => {
  if (i === 0) return total;
  const prev = ROUTE-CITIES[i - 1];
  const dx = c.x - prev.x;
  const dy = c.y - prev.y;
  return total + Math.sqrt(dx * dx + dy * dy);
}, 0);

// 每個城市在路徑上的累積距離比例
const cityDistances = ROUTE-CITIES.map((c, i) => {
  if (i === 0) return 0;
  let dist = 0;
  for (let j = 1; j <= i; j++) {
    const dx = ROUTE-CITIES[j].x - ROUTE-CITIES[j - 1].x;
    const dy = ROUTE-CITIES[j].y - ROUTE-CITIES[j - 1].y;
    dist += Math.sqrt(dx * dx + dy * dy);
  }
  return dist / TOTAL-PATH-LENGTH;
});

export const MapPathTrace: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 路徑描繪進度（前 110 幀）
  const pathProgress = interpolate(frame, [0, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dashOffset = TOTAL-PATH-LENGTH * (1 - pathProgress);

  // 移動光點位置（沿路徑插值）
  const dotProgress = interpolate(frame, [5, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 找到 dotProgress 在哪段城市間
  let dotX = ROUTE-CITIES[0].x;
  let dotY = ROUTE-CITIES[0].y;
  for (let i = 1; i < ROUTE-CITIES.length; i++) {
    const segStart = cityDistances[i - 1];
    const segEnd = cityDistances[i];
    if (dotProgress <= segEnd) {
      const t = (dotProgress - segStart) / (segEnd - segStart);
      dotX = ROUTE-CITIES[i - 1].x + t * (ROUTE-CITIES[i].x - ROUTE-CITIES[i - 1].x);
      dotY = ROUTE-CITIES[i - 1].y + t * (ROUTE-CITIES[i].y - ROUTE-CITIES[i - 1].y);
      break;
    }
    if (i === ROUTE-CITIES.length - 1) {
      dotX = ROUTE-CITIES[i].x;
      dotY = ROUTE-CITIES[i].y;
    }
  }

  // 城市標記彈入
  const cityProgress = (i: number) =>
    spring({
      frame: frame - i * 15,
      fps,
      config: { damping: 20, stiffness: 180 },
    });

  // 脈衝（終點）
  const pulseScale = interpolate(frame % 30, [0, 15, 30], [1, 1.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulseOpacity = interpolate(frame % 30, [0, 15, 30], [0.8, 0, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showPulse = frame > 120;

  // 右側城市列表：描繪到哪個城市就亮起哪行
  const cityLit = (i: number) => pathProgress >= cityDistances[i] - 0.02;

  return (
    <AbsoluteFill
      style={{
        fontFamily: "sans-serif",
      }}
    >
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <pattern id="ptGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0e1e30" strokeWidth="1" />
          </pattern>
        </defs>

        {/* 背景格線 */}
        <rect width="1920" height="1080" fill="url(#ptGrid)" opacity="0.6" />

        {/* 台灣輪廓 */}
        <path
          d={taiwanPath}
          fill="#0f2040"
          stroke="#1e3a5f"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* 路徑底層（虛線導引） */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke="#1e3a5f"
          strokeWidth="3"
          strokeDasharray="10 6"
        />

        {/* 描繪路徑 */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="4"
          strokeDasharray={`${TOTAL-PATH-LENGTH}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 7px #38bdf8)" }}
        />

        {/* 城市標記圓點 */}
        {ROUTE-CITIES.map((city, i) => {
          const scale = interpolate(cityProgress(i), [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });
          const isFirst = i === 0;
          const isLast = i === ROUTE-CITIES.length - 1;
          const circleColor = isFirst ? "#22c55e" : isLast ? "#f97316" : "#38bdf8";

          return (
            <g key={city.name} transform={`translate(${city.x}, ${city.y})`}>
              {isLast && showPulse && (
                <circle
                  r={14 * pulseScale}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  opacity={pulseOpacity}
                />
              )}
              <circle
                r={isFirst || isLast ? 12 : 8}
                fill={circleColor}
                stroke="#050d1a"
                strokeWidth="3"
                transform={`scale(${scale})`}
                style={{ filter: `drop-shadow(0 0 5px ${circleColor})` }}
              />
            </g>
          );
        })}

        {/* 移動導航光點 */}
        {frame > 5 && (
          <g transform={`translate(${dotX}, ${dotY})`}>
            <circle
              r={12}
              fill="#facc15"
              stroke="#050d1a"
              strokeWidth="3"
              style={{ filter: "drop-shadow(0 0 8px #facc15)" }}
            />
            <circle r={5} fill="#ffffff" />
          </g>
        )}
      </svg>

      {/* 標題 */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#e2e8f0",
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: 4,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        西部走廊路線
      </div>
      <div
        style={{
          position: "absolute",
          top: 108,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#64748b",
          fontSize: 20,
          letterSpacing: 3,
          opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        台北 → 高雄
      </div>

      {/* 右側城市列表 */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          transform: "translateY(-50%)",
          width: 260,
          background: "rgba(5, 13, 26, 0.92)",
          border: "1px solid #1e3a5f",
          borderRadius: 14,
          padding: "24px 28px",
          opacity: interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ color: "#64748b", fontSize: 14, letterSpacing: 3, marginBottom: 18 }}>
          路線站點
        </div>
        {ROUTE-CITIES.map((city, i) => {
          const lit = cityLit(i);
          const isFirst = i === 0;
          const isLast = i === ROUTE-CITIES.length - 1;
          const dotColor = isFirst ? "#22c55e" : isLast ? "#f97316" : "#38bdf8";
          return (
            <div
              key={city.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
                transition: "opacity 0.2s",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: lit ? dotColor : "#1e3a5f",
                  boxShadow: lit ? `0 0 6px ${dotColor}` : "none",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: lit ? "#f1f5f9" : "#334155",
                  fontSize: 20,
                  fontWeight: isFirst || isLast ? 700 : 400,
                }}
              >
                {city.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* 左側資訊面板 */}
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 170,
          width: 320,
          opacity: interpolate(frame, [30, 60], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        {[
          { label: "起點", value: "台北", color: "#22c55e" },
          { label: "終點", value: "高雄", color: "#f97316" },
          { label: "途經站點", value: "5 個", color: "#38bdf8" },
          { label: "預計距離", value: "約 355 公里", color: "#e2e8f0" },
        ].map((item, i) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid #0e1e30",
              opacity: interpolate(frame, [40 + i * 10, 60 + i * 10], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            <span style={{ color: "#64748b", fontSize: 16 }}>{item.label}</span>
            <span style={{ color: item.color, fontSize: 18, fontWeight: 600 }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};