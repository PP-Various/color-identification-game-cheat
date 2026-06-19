// スタイルの注入
const style = document.createElement('style');
style.textContent = `
  .cig-grid { gap: 0 !important; }
  .cig-cell { border-radius: 0 !important; }
`;
document.head.appendChild(style);

// 現在の設定値を保持する変数
let maxRounds = 20;
let currentRound = 0;

// 設定変更を監視して即時反映
chrome.storage.local.get(['maxRounds'], (result) => {
  if (result.maxRounds) maxRounds = result.maxRounds;
});
chrome.storage.onChanged.addListener((changes) => {
  if (changes.maxRounds) maxRounds = changes.maxRounds.newValue;
});

// ゲーム監視ロジック
const observer = new MutationObserver((mutations) => {
  const root = document.getElementById('cig-root');
  if (!root) return;

  const state = root.getAttribute('data-state');

  // ゲーム開始時にカウンタをリセット
  if (state === 'start') {
    currentRound = 0;
  }

  if (state !== 'play') return;

  // 回数制限判定
  if (currentRound >= maxRounds) {
    console.log(`Color Identification Game Bot: 設定回数 ${maxRounds} 回に達したため終了します`);
    root.setAttribute('data-state', 'end');
    return;
  }

  const grid = document.getElementById('cig-grid');
  if (!grid) return;

  const cells = Array.from(grid.querySelectorAll('.cig-cell'));
  if (cells.length === 0) return;

  const colorMap = {};
  cells.forEach(cell => {
    const color = cell.style.backgroundColor;
    if (color) {
      colorMap[color] = (colorMap[color] || 0) + 1;
    }
  });

  const targetColor = Object.keys(colorMap).find(color => colorMap[color] === 1);

  if (targetColor) {
    const targetCell = cells.find(cell => cell.style.backgroundColor === targetColor);
    if (targetCell) {
      targetCell.click();
      currentRound++;
      console.log(`Color Identification Game Bot: ${currentRound} / ${maxRounds}`);
    }
  }
});

observer.observe(document.body, {
  attributes: true,
  attributeFilter: ['data-state'],
  childList: true,
  subtree: true
});

console.log("Color Identification Game Bot: 監視を開始しました");