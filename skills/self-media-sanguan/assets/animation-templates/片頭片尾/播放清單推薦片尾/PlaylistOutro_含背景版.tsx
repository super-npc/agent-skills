import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type VideoCard = {
  title: string;
  channel: string;
  views: string;
  duration: string;
};

const VIDEO-CARDS: VideoCard[] = [
  {
    title: "Remotion 動畫入門完整教學",
    channel: "Remotion 中文社群",
    views: "12,400 次觀看",
    duration: "18:32",
  },
  {
    title: "Spring 彈性動畫深度解析",
    channel: "Remotion 中文社群",
    views: "8,710 次觀看",
    duration: "12:05",
  },
  {
    title: "用 Remotion 製作動態標題",
    channel: "Remotion 中文社群",
    views: "5,280 次觀看",
    duration: "9:47",
  },
  {
    title: "Lambda 雲端渲染實戰指南",
    channel: "Remotion 中文社群",
    views: "3,950 次觀看",
    duration: "22:18",
  },
];

const CARD-WIDTH = 400;
const CARD-THUMB-HEIGHT = 225;
const CARD-INFO-HEIGHT = 80;
const CARD-GAP = 28;
const CARD-STARTS = [35, 50, 65, 80];

export const PlaylistOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 頂部標題 fade in + translateY（frame 10-35）
  const titleOpacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [10, 35], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 播放全部按鈕（frame 25-45）
  const playAllOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 底部進度條（frame 0-180 線性）
  const progressWidth = interpolate(frame, [0, 180], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const totalWidth =
    VIDEO-CARDS.length * CARD-WIDTH + (VIDEO-CARDS.length - 1) * CARD-GAP;

  return (
    <AbsoluteFill
      style={{
        background: "#0f0f0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 標題列 */}
      <div
        style={{
          width: totalWidth,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
        }}
      >
        {/* 左側標題 */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "sans-serif",
          }}
        >
          你可能也喜歡
        </div>

        {/* 右側播放全部 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: playAllOpacity,
          }}
        >
          {/* 播放圖示 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "#3b82f6",
              fontFamily: "sans-serif",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: 16 }}>▶</span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                marginLeft: 2,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 12,
                    height: 2,
                    background: "#3b82f6",
                    borderRadius: 1,
                  }}
                />
              ))}
            </div>
            <span style={{ marginLeft: 6 }}>播放全部</span>
          </div>
        </div>
      </div>

      {/* 影片卡片列 */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: CARD-GAP,
          alignItems: "flex-start",
        }}
      >
        {VIDEO-CARDS.map((card, i) => {
          const startFrame = CARD-STARTS[i];
          const cardSpring = spring({
            frame: frame - startFrame,
            fps,
            config: { damping: 20, stiffness: 130 },
            durationInFrames: 25,
          });
          const cardY = interpolate(cardSpring, [0, 1], [60, 0]);
          const cardOpacity = interpolate(cardSpring, [0, 0.4], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                width: CARD-WIDTH,
                display: "flex",
                flexDirection: "column",
                transform: `translateY(${cardY}px)`,
                opacity: cardOpacity,
              }}
            >
              {/* 縮圖區 */}
              <div
                style={{
                  width: CARD-WIDTH,
                  height: CARD-THUMB-HEIGHT,
                  background: "#1a1a1a",
                  borderRadius: 8,
                  position: "relative",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {/* 縮圖中央播放按鈕 */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 22,
                      color: "#ffffff",
                      marginLeft: 4,
                      fontFamily: "sans-serif",
                    }}
                  >
                    ▶
                  </span>
                </div>

                {/* 右下角時長 */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    background: "rgba(0,0,0,0.8)",
                    color: "#ffffff",
                    fontSize: 13,
                    fontFamily: "sans-serif",
                    fontWeight: 600,
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  {card.duration}
                </div>
              </div>

              {/* 資訊區 */}
              <div
                style={{
                  height: CARD-INFO-HEIGHT,
                  padding: "12px 4px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {/* 標題 */}
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#ffffff",
                    fontFamily: "sans-serif",
                    lineHeight: 1.3,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {card.title}
                </div>

                {/* 頻道名稱 */}
                <div
                  style={{
                    fontSize: 14,
                    color: "#aaaaaa",
                    fontFamily: "sans-serif",
                  }}
                >
                  {card.channel}
                </div>

                {/* 觀看次數 */}
                <div
                  style={{
                    fontSize: 14,
                    color: "#aaaaaa",
                    fontFamily: "sans-serif",
                  }}
                >
                  {card.views}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部進度條 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 3,
          background: "#1a1a1a",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressWidth}%`,
            background: "#3b82f6",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};