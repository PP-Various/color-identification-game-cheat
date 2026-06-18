// --- 1. CSS上書き用スタイルを注入 ---
const style = document.createElement('style');
style.textContent = `
  .cig-grid { 
    gap: 0 !important; 
  }
  .cig-cell { 
    border-radius: 0 !important; 
  }
`;
document.head.appendChild(style);

console.log("Color Game Bot: スタイルを適用しました");

// --- 2. ゲーム自動攻略ロジック ---

// ページ全体を監視して、ゲームの状態変化を検知する
const observer = new MutationObserver((mutations) => {
    // ゲームのルート要素を取得
    const root = document.getElementById('cig-root');
    if (!root) return;

    // ゲーム中（play状態）かどうかを確認
    if (root.getAttribute('data-state') !== 'play') return;

    // グリッド要素を取得
    const grid = document.getElementById('cig-grid');
    if (!grid) return;

    // 全てのセルを取得
    const cells = Array.from(grid.querySelectorAll('.cig-cell'));
    if (cells.length === 0) return;

    // 各セルの背景色を取得して、色の出現回数をカウントする
    const colorMap = {};
    cells.forEach(cell => {
        const color = cell.style.backgroundColor;
        if (color) {
            colorMap[color] = (colorMap[color] || 0) + 1;
        }
    });

    // 出現回数が1回の色（＝正解の色のRGB値）を特定する
    const targetColor = Object.keys(colorMap).find(color => colorMap[color] === 1);

    // 正解の色が見つかった場合、その色のセルをクリックする
    if (targetColor) {
        const targetCell = cells.find(cell => cell.style.backgroundColor === targetColor);
        if (targetCell) {
            // 画面更新に合わせてクリックを実行
            targetCell.click();
        }
    }
});

// body要素以下の変更を監視開始
observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['data-state'],
    childList: true,
    subtree: true
});

console.log("Color Game Bot: 監視を開始しました");