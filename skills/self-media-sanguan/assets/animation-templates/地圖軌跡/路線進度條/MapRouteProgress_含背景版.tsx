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
const MAP = { x: 120, y: 80, w: 480, h: 730 };

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

// 高鐵站點（完整版，含地理座標）
const HSR-STATIONS = [
  { name: "台北", lat: 25.033, lng: 121.565, major: true },
  { name: "板橋", lat: 25.014, lng: 121.464, major: false },
  { name: "桃園", lat: 24.994, lng: 121.301, major: false },
  { name: "新竹", lat: 24.807, lng: 120.969, major: false },
  { name: "苗栗", lat: 24.56, lng: 120.82, major: false },
  { name: "台中", lat: 24.148, lng: 120.674, major: true },
  { name: "彰化", lat: 24.052, lng: 120.516, major: false },
  { name: "雲林", lat: 23.709, lng: 120.431, major: false },
  { name: "嘉義", lat: 23.48, lng: 120.449, major: false },
  { name: "台南", lat: 23.0, lng: 120.227, major: true },
  { name: "高雄", lat: 22.627, lng: 120.301, major: true },
].map((s) => ({ ...s, ...project(s.lat, s.lng) }));

// 高鐵路線 polyline 點
const hsrPoints = HSR-STATIONS.map((s) => `${s.x.toFixed(1)},${s.y.toFixed(1)}`).join(" ");

// 高鐵路徑總長度
const HSR-PATH-LENGTH = HSR-STATIONS.reduce((total, s, i) => {
  if (i === 0) return total;
  const prev = HSR-STATIONS[i - 1];
  const dx = s.x - prev.x;
  const dy = s.y - prev.y;
  return total + Math.sqrt(dx * dx + dy * dy);
}, 0);

// 各站點累積距離比例
const stationRatios = HSR-STATIONS.map((s, i) => {
  if (i === 0) return 0;
  let dist = 0;
  for (let j = 1; j <= i; j++) {
    const dx = HSR-STATIONS[j].x - HSR-STATIONS[j - 1].x;
    const dy = HSR-STATIONS[j].y - HSR-STATIONS[j - 1].y;
    dist += Math.sqrt(dx * dx + dy * dy);
  }
  return dist / HSR-PATH-LENGTH;
});

// 右側進度條的 4 個主要站
const MAJOR-STATIONS = HSR-STATIONS.filter((s) => s.major);

export const MapRouteProgress: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 列車行進進度（20 → 155 幀）
  const trainProgress = interpolate(frame, [20, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 列車當前位置插值
  let trainX = HSR-STATIONS[0].x;
  let trainY = HSR-STATIONS[0].y;
  for (let i = 1; i < HSR-STATIONS.length; i++) {
    const segStart = stationRatios[i - 1];
    const segEnd = stationRatios[i];
    if (trainProgress <= segEnd) {
      const t = (trainProgress - segStart) / Math.max(segEnd - segStart, 0.001);
      trainX = HSR-STATIONS[i - 1].x + t * (HSR-STATIONS[i].x - HSR-STATIONS[i - 1].x);
      trainY = HSR-STATIONS[i - 1].y + t * (HSR-STATIONS[i].y - HSR-STATIONS[i - 1].y);
      break;
    }
    if (i === HSR-STATIONS.length - 1) {
      trainX = HSR-STATIONS[i].x;
      trainY = HSR-STATIONS[i].y;
    }
  }

  // 已完成路線長度（用於 dashoffset）
  const completedLength = trainProgress * HSR-PATH-LENGTH;

  // 閃爍
  const blink = Math.sin(frame * 0.35) * 0.5 + 0.5;

  // 標題淡入
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "#050d1a",
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
          <pattern id="mrpGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0a1828" strokeWidth="1" />
          </pattern>
          <linearGradient id="hsrGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>

        {/* 背景格線 */}
        <rect width="1920" height="1080" fill="url(#mrpGrid)" />

        {/* 台灣輪廓 */}
        <path
          d={taiwanPath}
          fill="#0f2040"
          stroke="#1e3a5f"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* 高鐵路線底層 */}
        <polyline
          points={hsrPoints}
          fill="none"
          stroke="#1e3a5f"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 已行駛路線（橘色） */}
        <polyline
          points={hsrPoints}
          fill="none"
          stroke="url(#hsrGrad)"
          strokeWidth="5"
          strokeDasharray={`${HSR-PATH-LENGTH}`}
          strokeDashoffset={HSR-PATH-LENGTH - completedLength}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 6px rgba(249,115,22,0.7))" }}
        />

        {/* 各站點 */}
        {HSR-STATIONS.map((station, i) => {
          const reached = trainProgress >= stationRatios[i] - 0.01;
          const r = station.major ? 9 : 5;
          return (
            <circle
              key={station.name}
              cx={station.x}
              cy={station.y}
              r={r}
              fill={reached ? (station.major ? "#f97316" : "#fb923c") : "#1e3a5f"}
              stroke={reached ? "#fff" : "#0e1e30"}
              strokeWidth={station.major ? 2.5 : 1.5}
              style={reached && station.major ? { filter: "drop-shadow(0 0 5px #f97316)" } : {}}
            />
          );
        })}

        {/* 列車光點 */}
        {frame > 20 && (
          <g transform={`translate(${trainX}, ${trainY})`}>
            <circle
              r={16 + blink * 8}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              opacity={0.3 + blink * 0.3}
            />
            <circle r={12} fill="none" stroke="#fbbf24" strokeWidth="2" opacity={0.6} />
            <circle
              r={6}
              fill="#fbbf24"
              style={{ filter: "drop-shadow(0 0 8px #fbbf24)" }}
            />
          </g>
        )}
      </svg>

      {/* 標題 */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 660,
          right: 0,
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            color: "#f97316",
            fontSize: 18,
            letterSpacing: 4,
            marginBottom: 6,
          }}
        >
          高速鐵路
        </div>
        <div
          style={{
            color: "#f1f5f9",
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: 4,
          }}
        >
          路線進度
        </div>
      </div>

      {/* 右側進度面板 */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          transform: "translateY(-50%)",
          width: 320,
          background: "rgba(5, 13, 26, 0.92)",
          border: "1px solid #1e3a5f",
          borderRadius: 14,
          padding: "28px 32px",
          opacity: interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ color: "#64748b", fontSize: 13, letterSpacing: 3, marginBottom: 20 }}>
          主要站點
        </div>

        {/* 垂直進度條 */}
        <div style={{ display: "flex", gap: 20 }}>
          {/* 進度條 */}
          <div
            style={{
              width: 6,
              background: "#1e3a5f",
              borderRadius: 3,
              position: "relative",
              alignSelf: "stretch",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${trainProgress * 100}%`,
                background: "linear-gradient(180deg, #f97316 0%, #ea580c 100%)",
                borderRadius: 3,
                boxShadow: "0 0 8px rgba(249,115,22,0.5)",
              }}
            />
          </div>

          {/* 站點列表 */}
          <div style={{ flex: 1 }}>
            {MAJOR-STATIONS.map((station, i) => {
              const stationIdx = HSR-STATIONS.findIndex((s) => s.name === station.name);
              const reached = trainProgress >= stationRatios[stationIdx] - 0.01;
              const stationSp = spring({
                frame: frame - i * 20,
                fps,
                config: { damping: 20, stiffness: 200 },
              });
              return (
                <div
                  key={station.name}
                  style={{
                    marginBottom: i < MAJOR-STATIONS.length - 1 ? 44 : 0,
                    opacity: interpolate(stationSp, [0, 1], [0, 1]),
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: reached ? "#f97316" : "#1e3a5f",
                        border: `2px solid ${reached ? "#f97316" : "#334155"}`,
                        boxShadow: reached ? "0 0 8px #f97316" : "none",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: reached ? "#f1f5f9" : "#334155",
                        fontSize: 22,
                        fontWeight: reached ? 700 : 400,
                      }}
                    >
                      {station.name}
                    </span>
                  </div>
                  {i < MAJOR-STATIONS.length - 1 && (
                    <div
                      style={{
                        color: "#475569",
                        fontSize: 13,
                        marginTop: 4,
                        marginLeft: 28,
                      }}
                    >
                      {i === 0 ? "起點站" : i === 1 ? "中部幹線" : "南部幹線"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 進度數字 */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid #1e3a5f",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#64748b", fontSize: 12, letterSpacing: 2, marginBottom: 4 }}>
              進度
            </div>
            <div style={{ color: "#f97316", fontSize: 26, fontWeight: 700 }}>
              {Math.round(trainProgress * 100)}%
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#64748b", fontSize: 12, letterSpacing: 2, marginBottom: 4 }}>
              已行駛
            </div>
            <div style={{ color: "#f1f5f9", fontSize: 26, fontWeight: 700 }}>
              {Math.round(trainProgress * 345)} km
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};