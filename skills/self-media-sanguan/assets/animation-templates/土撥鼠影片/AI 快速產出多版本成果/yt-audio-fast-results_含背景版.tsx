// Phase 1：時鐘顯示
// 修改顯示文字
<span>{"< 5 "}</span><span>min</span>

// Phase 2：版本卡片
const CARD-COUNT = 12;      // 卡片總數
const COLS = 4;              // 每列幾張
const CARD-SIZE = 105;       // 卡片大小（px）
const CARD-START-FRAME = 60; // 開始彈出的幀
const CARD-INTERVAL = 5;     // 每張間隔幾幀

// Phase 3：AI 臉孔文字
<span>AI 不會生氣</span>    // 修改此文字

// Phase 4：選中的版本
const SELECTED-INDEX = 6;   // 從 0 開始計，第 7 張